import os
import json
import time
import math
import torch
from torch.utils.data import DataLoader, random_split
from tokenizer import MiniTokenizer
from model import MiniLLM
from dataset import ChatDataset

def train_model():
    print("=" * 60)
    print("CRISP-DM Phase 4: Modeling - MiniLLM Training Pipeline")
    print("=" * 60)

    # 1. Device selection
    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"[*] Training Device: {device.upper()}")

    # 2. Tokenizer initialization
    tokenizer = MiniTokenizer()
    checkpoint_dir = os.path.join(os.path.dirname(__file__), "checkpoints")
    os.makedirs(checkpoint_dir, exist_ok=True)
    
    vocab_path = os.path.join(checkpoint_dir, "vocab.json")
    tokenizer.save_vocab(vocab_path)
    print(f"[+] Tokenizer Vocab Size: {tokenizer.vocab_size} tokens -> Saved to {vocab_path}")

    # 3. Dataset preparation
    max_seq_len = 128
    dataset = ChatDataset(tokenizer=tokenizer, max_seq_len=max_seq_len, repeat_factor=30)
    total_samples = len(dataset)
    val_size = int(total_samples * 0.15)
    train_size = total_samples - val_size

    train_data, val_data = random_split(
        dataset, 
        [train_size, val_size], 
        generator=torch.Generator().manual_seed(42)
    )

    batch_size = 16
    train_loader = DataLoader(train_data, batch_size=batch_size, shuffle=True)
    val_loader = DataLoader(val_data, batch_size=batch_size, shuffle=False)
    print(f"[+] Dataset Created: {total_samples} total sequences (Train: {train_size}, Val: {val_size})")

    # 4. Model instantiation
    model = MiniLLM(
        vocab_size=tokenizer.vocab_size,
        d_model=128,
        n_layers=4,
        n_heads=4,
        hidden_dim=384,
        max_seq_len=max_seq_len,
        dropout=0.1
    ).to(device)

    total_params = model.count_parameters()
    print(f"[+] Model Initialized: {total_params:,} trainable parameters (~{total_params/1e6:.2f}M params)")

    # 5. Optimizer & Scheduler
    epochs = 25
    learning_rate = 3e-3
    optimizer = torch.optim.AdamW(model.parameters(), lr=learning_rate, weight_decay=0.01, betas=(0.9, 0.95))
    scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=epochs, eta_min=1e-4)

    # 6. Training Loop
    history = {
        "epochs": [],
        "train_loss": [],
        "val_loss": [],
        "train_perplexity": [],
        "val_perplexity": [],
        "learning_rate": []
    }

    start_train_time = time.time()
    print("\n--- Starting Model Training ---")

    for epoch in range(1, epochs + 1):
        model.train()
        total_train_loss = 0.0
        train_tokens = 0
        epoch_start = time.time()

        for batch_inputs, batch_targets in train_loader:
            batch_inputs = batch_inputs.to(device)
            batch_targets = batch_targets.to(device)

            optimizer.zero_grad()
            _, loss, _ = model(batch_inputs, targets=batch_targets)
            loss.backward()
            torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
            optimizer.step()

            total_train_loss += loss.item() * batch_inputs.size(0)
            train_tokens += (batch_targets != -1).sum().item()

        avg_train_loss = total_train_loss / train_size
        train_ppl = math.exp(min(avg_train_loss, 20.0))

        # Validation Step
        model.eval()
        total_val_loss = 0.0
        with torch.no_grad():
            for batch_inputs, batch_targets in val_loader:
                batch_inputs = batch_inputs.to(device)
                batch_targets = batch_targets.to(device)
                _, val_loss, _ = model(batch_inputs, targets=batch_targets)
                total_val_loss += val_loss.item() * batch_inputs.size(0)

        avg_val_loss = total_val_loss / val_size
        val_ppl = math.exp(min(avg_val_loss, 20.0))
        cur_lr = scheduler.get_last_lr()[0]
        scheduler.step()

        epoch_duration = time.time() - epoch_start
        tok_per_sec = train_tokens / max(epoch_duration, 1e-4)

        history["epochs"].append(epoch)
        history["train_loss"].append(round(avg_train_loss, 4))
        history["val_loss"].append(round(avg_val_loss, 4))
        history["train_perplexity"].append(round(train_ppl, 2))
        history["val_perplexity"].append(round(val_ppl, 2))
        history["learning_rate"].append(cur_lr)

        if epoch % 5 == 0 or epoch == 1 or epoch == epochs:
            print(f"Epoch [{epoch:02d}/{epochs:02d}] | Train Loss: {avg_train_loss:.4f} (PPL: {train_ppl:.2f}) | Val Loss: {avg_val_loss:.4f} (PPL: {val_ppl:.2f}) | Speed: {tok_per_sec:.0f} tok/s")

    total_training_duration = time.time() - start_train_time
    print(f"\n[OK] Training completed in {total_training_duration:.2f} seconds.")

    # 7. Save Model Checkpoint
    checkpoint_path = os.path.join(checkpoint_dir, "mini_llm.pt")
    torch.save({
        "model_state_dict": model.state_dict(),
        "config": model.config,
        "vocab_size": tokenizer.vocab_size,
        "final_train_loss": history["train_loss"][-1],
        "final_val_loss": history["val_loss"][-1],
        "final_perplexity": history["val_perplexity"][-1],
    }, checkpoint_path)
    print(f"[+] Model checkpoint saved to: {checkpoint_path}")

    # 8. Save History & Telemetry
    history_path = os.path.join(checkpoint_dir, "training_history.json")
    with open(history_path, "w", encoding="utf-8") as f:
        json.dump(history, f, indent=2)
    print(f"[+] Training curves saved to: {history_path}")

    telemetry = {
        "model_architecture": "Decoder-Only Autoregressive Transformer",
        "parameters": total_params,
        "layers": 4,
        "heads": 4,
        "d_model": 128,
        "hidden_dim": 384,
        "max_seq_len": max_seq_len,
        "vocab_size": tokenizer.vocab_size,
        "training_time_seconds": round(total_training_duration, 2),
        "final_train_loss": history["train_loss"][-1],
        "final_val_loss": history["val_loss"][-1],
        "final_perplexity": history["val_perplexity"][-1],
        "device": device,
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
    }
    telemetry_path = os.path.join(checkpoint_dir, "telemetry.json")
    with open(telemetry_path, "w", encoding="utf-8") as f:
        json.dump(telemetry, f, indent=2)
    print(f"[+] Telemetry metrics saved to: {telemetry_path}")

    return model, tokenizer, history

if __name__ == "__main__":
    train_model()
