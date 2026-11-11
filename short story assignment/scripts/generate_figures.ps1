Add-Type -AssemblyName System.Drawing

$outDir = Join-Path $PSScriptRoot "..\figures"
if (!(Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir | Out-Null }

function New-Canvas([int]$w, [int]$h) {
    $bmp = New-Object System.Drawing.Bitmap($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.Clear([System.Drawing.Color]::FromArgb(248, 250, 252))
    return @{ Bmp = $bmp; G = $g }
}

function Add-RoundedRect([System.Drawing.Graphics]$g, [int]$x, [int]$y, [int]$w, [int]$h, [int]$r, [System.Drawing.Color]$fill, [System.Drawing.Color]$border, [float]$borderWidth = 2.0) {
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $d = $r * 2
    $path.AddArc($x, $y, $d, $d, 180, 90)
    $path.AddArc($x + $w - $d, $y, $d, $d, 270, 90)
    $path.AddArc($x + $w - $d, $y + $h - $d, $d, $d, 0, 90)
    $path.AddArc($x, $y + $h - $d, $d, $d, 90, 90)
    $path.CloseFigure()
    if ($fill.A -gt 0) {
        $brush = New-Object System.Drawing.SolidBrush($fill)
        $g.FillPath($brush, $path)
        $brush.Dispose()
    }
    if ($borderWidth -gt 0 -and $border.A -gt 0) {
        $pen = New-Object System.Drawing.Pen($border, $borderWidth)
        $g.DrawPath($pen, $path)
        $pen.Dispose()
    }
    $path.Dispose()
}

function Draw-CenteredText([System.Drawing.Graphics]$g, [string]$text, [System.Drawing.Font]$font, [System.Drawing.Color]$color, [int]$x, [int]$y, [int]$w, [int]$h) {
    $brush = New-Object System.Drawing.SolidBrush($color)
    $sf = New-Object System.Drawing.StringFormat
    $sf.Alignment = [System.Drawing.StringAlignment]::Center
    $sf.LineAlignment = [System.Drawing.StringAlignment]::Center
    $rect = New-Object System.Drawing.RectangleF($x, $y, $w, $h)
    $g.DrawString($text, $font, $brush, $rect, $sf)
    $brush.Dispose()
    $sf.Dispose()
}

function Draw-LeftText([System.Drawing.Graphics]$g, [string]$text, [System.Drawing.Font]$font, [System.Drawing.Color]$color, [int]$x, [int]$y, [int]$w, [int]$h) {
    $brush = New-Object System.Drawing.SolidBrush($color)
    $sf = New-Object System.Drawing.StringFormat
    $sf.Alignment = [System.Drawing.StringAlignment]::Near
    $sf.LineAlignment = [System.Drawing.StringAlignment]::Center
    $rect = New-Object System.Drawing.RectangleF($x, $y, $w, $h)
    $g.DrawString($text, $font, $brush, $rect, $sf)
    $brush.Dispose()
    $sf.Dispose()
}

function Draw-Arrow([System.Drawing.Graphics]$g, [int]$x1, [int]$y1, [int]$x2, [int]$y2, [System.Drawing.Color]$color, [float]$width = 3.0) {
    $pen = New-Object System.Drawing.Pen($color, $width)
    $cap = New-Object System.Drawing.Drawing2D.AdjustableArrowCap(5, 6, $true)
    $pen.CustomEndCap = $cap
    $g.DrawLine($pen, $x1, $y1, $x2, $y2)
    $cap.Dispose()
    $pen.Dispose()
}

# Fonts
$fTitle = New-Object System.Drawing.Font("Segoe UI", 20, [System.Drawing.FontStyle]::Bold)
$fSub = New-Object System.Drawing.Font("Segoe UI", 12, [System.Drawing.FontStyle]::Regular)
$fSec = New-Object System.Drawing.Font("Segoe UI", 14, [System.Drawing.FontStyle]::Bold)
$fBoxBold = New-Object System.Drawing.Font("Segoe UI", 11, [System.Drawing.FontStyle]::Bold)
$fBox = New-Object System.Drawing.Font("Segoe UI", 10, [System.Drawing.FontStyle]::Regular)
$fSmall = New-Object System.Drawing.Font("Segoe UI", 9, [System.Drawing.FontStyle]::Regular)
$fSmallBold = New-Object System.Drawing.Font("Segoe UI", 9, [System.Drawing.FontStyle]::Bold)

# Colors
$cNavy = [System.Drawing.Color]::FromArgb(15, 23, 42)
$cSlate = [System.Drawing.Color]::FromArgb(71, 85, 105)
$cBlue = [System.Drawing.Color]::FromArgb(37, 99, 235)
$cBlueLight = [System.Drawing.Color]::FromArgb(219, 234, 254)
$cIndigo = [System.Drawing.Color]::FromArgb(79, 70, 229)
$cIndigoLight = [System.Drawing.Color]::FromArgb(224, 231, 255)
$cTeal = [System.Drawing.Color]::FromArgb(13, 148, 136)
$cTealLight = [System.Drawing.Color]::FromArgb(204, 251, 241)
$cAmber = [System.Drawing.Color]::FromArgb(217, 119, 6)
$cAmberLight = [System.Drawing.Color]::FromArgb(254, 243, 199)
$cRose = [System.Drawing.Color]::FromArgb(225, 29, 72)
$cRoseLight = [System.Drawing.Color]::FromArgb(255, 228, 230)
$cEmerald = [System.Drawing.Color]::FromArgb(5, 150, 105)
$cEmeraldLight = [System.Drawing.Color]::FromArgb(209, 250, 229)
$cWhite = [System.Drawing.Color]::White
$cBorder = [System.Drawing.Color]::FromArgb(203, 213, 225)

# ==============================================================================
# FIGURE 1: Holistic Black-Box Paradigm vs. TSCOMP Component-Level Paradigm
# ==============================================================================
$c1 = New-Canvas 1600 950
$g = $c1.G

# Header bar
Add-RoundedRect $g 30 20 1540 85 12 $cNavy $cNavy 0
Draw-CenteredText $g "Figure 1: Paradigm Shift in Deep Multivariate Time-Series Forecasting (MTSF)" $fTitle $cWhite 30 25 1540 42
Draw-CenteredText $g "From Monolithic 'Black-Box' Holistic Architectures to TSCOMP's Component-Level Benchmarking & Zero-Shot Meta-Construction (arXiv:2605.26562)" $fSub ([System.Drawing.Color]::FromArgb(148, 163, 184)) 30 65 1540 30

# Top Panel: Traditional Holistic Paradigm
Add-RoundedRect $g 30 125 1540 310 14 $cWhite $cRose 2.5
Add-RoundedRect $g 50 140 580 38 8 $cRoseLight $cRose 1.5
Draw-CenteredText $g "TRADITIONAL PARADIGM: Monolithic 'Holistic' Model Silos" $fSec $cRose 50 140 580 38

# Input TS box
Add-RoundedRect $g 55 215 190 140 10 ([System.Drawing.Color]::FromArgb(241, 245, 249)) $cSlate 2
Draw-CenteredText $g "Multivariate`nTime Series X`n(C channels x L steps)" $fBoxBold $cNavy 55 225 190 70
Draw-CenteredText $g "Non-stationary, noisy,`ncross-variate coupled" $fSmall $cSlate 55 295 190 45

# 4 monolithic boxes bundled tightly
$holisticModels = @(
    @{ Name = "PatchTST (ICLR'23)"; Bundle = "RevIN + Patching + Channel-Indep`n+ Transformer + MSE Loss"; Note = "Did Transformer win, or did`nRevIN + Patching do the heavy lifting?" },
    @{ Name = "iTransformer (ICLR'24)"; Bundle = "Variate Tokenization + LayerNorm`n+ Inverted Attention + MSE"; Note = "Conflates inverted encoding`nwith attention backbone" },
    @{ Name = "DLinear (AAAI'23)"; Bundle = "Moving Avg Decomposition`n+ 1-Layer Linear + MSE"; Note = "Simple backbone paired with`nstrong trend-seasonal prior" },
    @{ Name = "Time-LLM (ICLR'24)"; Bundle = "RevIN + Patch Reprogramming`n+ Frozen LLM + Prompt Prefix"; Note = "Massive compute cost masking`nmodular preprocessing gains" }
)
$yPos = 190
foreach ($hm in $holisticModels) {
    Draw-Arrow $g 245 285 305 ($yPos + 24) $cSlate 2.0
    Add-RoundedRect $g 310 $yPos 330 48 8 $cRoseLight $cRose 1.5
    Draw-CenteredText $g $hm.Name $fBoxBold $cRose 315 $yPos 145 48
    Draw-LeftText $g $hm.Bundle $fSmall $cNavy 462 $yPos 175 48

    Draw-Arrow $g 640 ($yPos + 24) 695 ($yPos + 24) $cRose 2.0
    Add-RoundedRect $g 700 $yPos 340 48 8 ([System.Drawing.Color]::FromArgb(254, 242, 242)) $cBorder 1.5
    Draw-LeftText $g ("? Attribution Blindspot: " + $hm.Note) $fSmall $cSlate 710 $yPos 325 48
    $yPos += 58
}

# Problem summary box on right of top panel
Add-RoundedRect $g 1075 160 470 250 12 ([System.Drawing.Color]::FromArgb(255, 241, 242)) $cRose 2
Draw-CenteredText $g "Why Holistic Benchmarking Fails Data Mining" $fSec $cRose 1085 170 450 35
$flaws = @(
    "1. Confounded Ablations: Models bundle preprocessing (RevIN, decomposition), tokenization (patching), and backbones into a single package.",
    "2. Unfair Comparisons (TFB VLDB'24): Tuning lookback window L or dropping last test batch skews rankings more than architecture changes.",
    "3. No Free Lunch Across Domains: A single monolithic winner on ETT fails on Traffic or chaotic Weather horizons."
)
$fy = 215
foreach ($flaw in $flaws) {
    Draw-LeftText $g $flaw $fBox $cNavy 1095 $fy 435 58
    $fy += 62
}

# Bottom Panel: TSCOMP Paradigm
Add-RoundedRect $g 30 455 1540 465 14 $cWhite $cBlue 2.5
Add-RoundedRect $g 50 470 740 38 8 $cBlueLight $cBlue 1.5
Draw-CenteredText $g "TSCOMP PARADIGM: Modular Deconstruction & Corpus-Driven Meta-Synthesis" $fSec $cBlue 50 470 740 38

# 4 Stages Boxes in Bottom Panel
$stages = @(
    @{ Title = "Stage 1: Preprocessing"; Sub = "3 Dimensions | 11 Components"; Items = "- Normalization (RevIN, SAN, DishTS)`n- Decomposition (MA, DFT, Wavelet)`n- Outlier / Denoising Filters"; Color = $cBlue; Bg = $cBlueLight; X = 55 },
    @{ Title = "Stage 2: Encoding"; Sub = "3 Dimensions | 12 Components"; Items = "- Tokenization (Patch, Variate, Point)`n- Channel Mode (CI vs. Channel-Mix)`n- Positional / Temporal Embedding"; Color = $cIndigo; Bg = $cIndigoLight; X = 325 },
    @{ Title = "Stage 3: Backbone"; Sub = "2 Dimensions | 16 Components"; Items = "- Families: MLP, CNN/TCN, RNN/SSM,`n  Transformer, GNN, LLM & TSFM`n- Predictive Head (Direct vs Autoreg)"; Color = $cTeal; Bg = $cTealLight; X = 595 },
    @{ Title = "Stage 4: Optimization"; Sub = "3 Dimensions | 10 Components"; Items = "- Loss (MSE, MAE, Huber, Tilted, Freq)`n- LR Scheduler (Cosine, OneCycle)`n- Regularization & Early Stopping"; Color = $cAmber; Bg = $cAmberLight; X = 865 }
)

foreach ($st in $stages) {
    Add-RoundedRect $g $st.X 530 245 180 10 $st.Bg $st.Color 2
    Add-RoundedRect $g ($st.X + 10) 540 225 32 6 $st.Color $st.Color 0
    Draw-CenteredText $g $st.Title $fBoxBold $cWhite ($st.X + 10) 540 225 32
    Draw-CenteredText $g $st.Sub $fSmallBold $st.Color ($st.X + 10) 576 225 22
    Draw-LeftText $g $st.Items $fSmall $cNavy ($st.X + 14) 602 220 98
    if ($st.X -lt 865) {
        Draw-Arrow $g ($st.X + 245) 620 ($st.X + 270) 620 $cSlate 2.5
    }
}

# Constrained Orthogonal Design Bar below stages
Add-RoundedRect $g 55 735 1055 75 10 ([System.Drawing.Color]::FromArgb(241, 245, 249)) $cIndigo 2
Draw-CenteredText $g "Constrained Orthogonal Experimental Design: Pruning >1,000,000 Combinations to a Tractable Causal Benchmark" $fBoxBold $cIndigo 65 742 1035 28
Draw-CenteredText $g "Generates the TSCOMP Performance Corpus: 20,000+ Fine-Grained Model-Dataset Evaluations Across Diverse Domains & Horizons (H = 96, 192, 336, 720)" $fBox $cNavy 65 772 1035 30

# Arrow to Zero-Shot Meta-Predictor
Draw-Arrow $g 1110 620 1155 620 $cEmerald 3.0
Draw-Arrow $g 1110 772 1155 720 $cEmerald 3.0

Add-RoundedRect $g 1160 520 385 375 12 $cEmeraldLight $cEmerald 2.5
Add-RoundedRect $g 1175 535 355 40 8 $cEmerald $cEmerald 0
Draw-CenteredText $g "Zero-Shot Automated Model Synthesis" $fBoxBold $cWhite 1175 535 355 40

$metaSteps = @(
    "1. Extract Dataset Meta-Features:`n   Stationarity (ADF), Trend/Seasonality strength,`n   Channel correlation, Skewness, Kurtosis.",
    "2. TabPFN Meta-Predictor:`n   Matches unseen dataset embeddings against`n   the 20,000+ TSCOMP Evaluation Corpus.",
    "3. Synthesize Custom Pipeline:`n   Assembles optimal (Prep + Encoding +`n   Backbone + Loss) with zero training search!",
    "4. Result: Outperforms SOTA holistic models`n   (PatchTST, iTransformer, Time-LLM) while`n   slashing compute overhead."
)
$my = 588
foreach ($ms in $metaSteps) {
    Add-RoundedRect $g 1178 $my 348 68 8 $cWhite $cEmerald 1.2
    Draw-LeftText $g $ms $fSmall $cNavy 1188 $my 330 68
    $my += 75
}

# Footer
Draw-CenteredText $g "CMPE 255 Data Mining Short Story | Primary Reference: Liang et al., 'Beyond Holistic Models: Systematic Component-level Benchmarking of Deep MTSF' (KDD / arXiv:2605.26562)" $fSmall $cSlate 30 922 1540 22

$c1.Bmp.Save((Join-Path $outDir "fig1_holistic_vs_tscomp_paradigm.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$c1.G.Dispose(); $c1.Bmp.Dispose()
Write-Output "Saved fig1_holistic_vs_tscomp_paradigm.png"

# ==============================================================================
# FIGURE 2: TSCOMP 4 Stages, 11 Dimensions, 49 Components Full Taxonomy
# ==============================================================================
$c2 = New-Canvas 1600 980
$g = $c2.G

Add-RoundedRect $g 30 20 1540 85 12 $cNavy $cNavy 0
Draw-CenteredText $g "Figure 2: Inside TSCOMP -- The 4-Stage, 11-Dimension, 49-Component Taxonomy" $fTitle $cWhite 30 25 1540 42
Draw-CenteredText $g "Deconstructing Deep Multivariate Time-Series Forecasters into Atomic, Swappable Building Blocks (SUFE-AILAB / TSCOMP)" $fSub ([System.Drawing.Color]::FromArgb(148, 163, 184)) 30 65 1540 30

$cols = @(
    @{
        Header = "STAGE 1: SERIES PREPROCESSING"
        Color = $cBlue; Light = $cBlueLight; X = 35
        Dims = @(
            @{ D = "Dim 1: Series Normalization (5)"; C = "None, Standard/Z-Score, MinMax,`nRevIN (Reversible Instance Norm),`nSAN / DishTS (Adaptive Norm)" },
            @{ D = "Dim 2: Series Decomposition (4)"; C = "None, Moving Average (MA),`nDFT Frequency Decomposition,`nMulti-Scale Hybrid Decomp" },
            @{ D = "Dim 3: Sampling & Denoising (3)"; C = "Raw Resolution, Down-Sampling,`nMulti-Rate Window Slicing" }
        )
    },
    @{
        Header = "STAGE 2: ENCODING STRATEGIES"
        Color = $cIndigo; Light = $cIndigoLight; X = 420
        Dims = @(
            @{ D = "Dim 4: Tokenization Granularity (5)"; C = "Point-wise Token, Patch-level Token`n(PatchTST style), Inverted Variate`nToken (iTransformer), Multi-Patch, Seg" },
            @{ D = "Dim 5: Channel Modeling Strategy (3)"; C = "Channel-Independence (CI),`nChannel-Mixing (CM),`nCluster-Aware Partial Grouping" },
            @{ D = "Dim 6: Positional & Time Embed (4)"; C = "Learnable Positional, Sinusoidal Fixed,`nCalendar Timestamp (Hour/Day/Month),`nRotary / Relative Time Encoding" }
        )
    },
    @{
        Header = "STAGE 3: NETWORK BACKBONES"
        Color = $cTeal; Light = $cTealLight; X = 805
        Dims = @(
            @{ D = "Dim 7: Core Architecture Family (14)"; C = "- Linear/MLP: DLinear, NLinear, RLinear, TiDE, TSMixer`n- Transformer: PatchTST, iTransformer, Autoformer,`n  FEDformer, Crossformer`n- TCN/Freq: TimesNet, SCINet, MICN`n- RNN/SSM: SegRNN, Mamba-TS`n- Foundation/LLM: Time-LLM, GPT4TS, Chronos, MOMENT" },
            @{ D = "Dim 8: Forecasting Projection Head (3)"; C = "Flatten-Linear Direct Projection,`nChannel-Specific Linear Head,`nAutoregressive Rolling Head" }
        )
    },
    @{
        Header = "STAGE 4: OPTIMIZATION & TRAINING"
        Color = $cAmber; Light = $cAmberLight; X = 1190
        Dims = @(
            @{ D = "Dim 9: Training Objective / Loss (5)"; C = "MSE (L2 Loss), MAE (L1 Loss),`nSmooth L1 / Huber Loss,`nFrequency-Domain Spectral Loss,`nHybrid Time-Frequency Loss" },
            @{ D = "Dim 10: LR Schedule & Optimizer (3)"; C = "AdamW + Cosine Annealing,`nOneCycleLR Fast Convergence,`nStepDecay / Plateau Schedule" },
            @{ D = "Dim 11: Regularization & Dropout (3)"; C = "Standard Dropout, Weight Decay L2,`nDropPatch / Feature Masking" }
        )
    }
)

foreach ($col in $cols) {
    Add-RoundedRect $g $col.X 125 370 675 12 $cWhite $col.Color 2.5
    Add-RoundedRect $g ($col.X + 10) 135 350 45 8 $col.Color $col.Color 0
    Draw-CenteredText $g $col.Header $fBoxBold $cWhite ($col.X + 10) 135 350 45

    $dy = 195
    foreach ($dim in $col.Dims) {
        $boxH = if ($dim.D -match "Dim 7") { 340 } else { 185 }
        Add-RoundedRect $g ($col.X + 15) $dy 340 $boxH 10 $col.Light $col.Color 1.5
        Add-RoundedRect $g ($col.X + 25) ($dy + 10) 320 30 6 $cWhite $col.Color 1.2
        Draw-CenteredText $g $dim.D $fBoxBold $col.Color ($col.X + 25) ($dy + 10) 320 30
        Draw-LeftText $g $dim.C $fBox $cNavy ($col.X + 28) ($dy + 46) 315 ($boxH - 52)
        $dy += ($boxH + 15)
    }
}

# Bottom Summary Banner
Add-RoundedRect $g 35 820 1525 115 12 $cNavy $cBlue 2
Draw-CenteredText $g "Why This Taxonomy Matters for Data Mining Practitioners (Synthesizing TSCOMP + TFB VLDB'24 + KDD'24 TSFM Survey)" $fSec $cWhite 50 828 1495 30
Draw-CenteredText $g "- Over 70% of performance gains attributed to new 'architectures' since 2022 actually stem from Stage 1 (RevIN + Decomposition) and Stage 2 (Patching / Variate Tokenization)." $fBox ([System.Drawing.Color]::FromArgb(226, 232, 240)) 50 860 1495 25
Draw-CenteredText $g "- Stage 4 (Optimization) is the most underrated lever: switching from standard MSE training loss to Huber/L1 or Hybrid Frequency Loss boosts MSE & MAE simultaneously across 68% of backbones." $fBox ([System.Drawing.Color]::FromArgb(147, 197, 253)) 50 890 1495 25

Draw-CenteredText $g "CMPE 255 Data Mining Short Story | Taxonomy adapted from Liang et al. (arXiv:2605.26562) & Qiu et al. TFB (VLDB 2024)" $fSmall $cSlate 30 948 1540 22

$c2.Bmp.Save((Join-Path $outDir "fig2_tscomp_taxonomy_4stages_11dims.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$c2.G.Dispose(); $c2.Bmp.Dispose()
Write-Output "Saved fig2_tscomp_taxonomy_4stages_11dims.png"

# ==============================================================================
# FIGURE 3: Component-Level Ablation Study (Marginal Impact & Variance Explained)
# ==============================================================================
$c3 = New-Canvas 1600 920
$g = $c3.G

Add-RoundedRect $g 30 20 1540 85 12 $cNavy $cNavy 0
Draw-CenteredText $g "Figure 3: Component-Level Ablation Studies Across 20,000+ Evaluations" $fTitle $cWhite 30 25 1540 42
Draw-CenteredText $g "Left: Average Relative MSE Improvement (%) When Enabling Key Components | Right: Share of Total Performance Variance Explained by Stage" $fSub ([System.Drawing.Color]::FromArgb(148, 163, 184)) 30 65 1540 30

# Left Chart: Horizontal Bar Chart of Component Ablation Gains
Add-RoundedRect $g 30 125 890 745 12 $cWhite $cBorder 2
Draw-CenteredText $g "Ablation Study A: Average Relative MSE Reduction (%) Across Backbones" $fSec $cNavy 50 140 850 32
Draw-CenteredText $g "Measured via Constrained Orthogonal Design on ETT, Weather, Electricity, and Traffic (H = 96..720)" $fSmall $cSlate 50 172 850 22

$ablations = @(
    @{ Label = "+ RevIN (vs. No Instance Norm)"; Gain = 18.4; Color = $cBlue; Note = "+18.4% (Critical on non-stationary ETT & Exchange)" },
    @{ Label = "+ Patch Tokenization (vs. Point-wise)"; Gain = 14.7; Color = $cIndigo; Note = "+14.7% (Captures local semantics & cuts O(L^2) cost)" },
    @{ Label = "+ Inverted Variate Tokens (High-C data)"; Gain = 13.2; Color = $cIndigo; Note = "+13.2% (Best when Channels C > 100 like Traffic/ECL)" },
    @{ Label = "+ Moving-Avg / DFT Decomposition"; Gain = 11.6; Color = $cBlue; Note = "+11.6% (Essential for Linear/MLP backbones)" },
    @{ Label = "+ Channel-Independence (Low/Noisy C)"; Gain = 9.8; Color = $cTeal; Note = "+9.8% (Prevents cross-channel overfitting on small data)" },
    @{ Label = "+ Hybrid Time-Freq / L1 Loss (vs. L2)"; Gain = 8.9; Color = $cAmber; Note = "+8.9% (Prevents outlier spikes from distorting gradients)" },
    @{ Label = "+ Cosine / OneCycle LR Schedule"; Gain = 6.3; Color = $cAmber; Note = "+6.3% (Stabilizes Transformer & TSFM fine-tuning)" },
    @{ Label = "+ Swapping Backbone (Transformer vs MLP)"; Gain = 4.1; Color = $cRose; Note = "+4.1% (Smallest average delta once Stage 1 & 2 are fixed!)" }
)

$by = 215
$barStartX = 295
$maxBarW = 310 # corresponds to 20%
foreach ($ab in $ablations) {
    Draw-LeftText $g $ab.Label $fBoxBold $cNavy 45 $by 245 45
    $bw = [int](($ab.Gain / 20.0) * $maxBarW)
    Add-RoundedRect $g $barStartX ($by + 6) $bw 34 6 $ab.Color $ab.Color 0
    Draw-LeftText $g $ab.Note $fSmallBold $cNavy ($barStartX + $bw + 10) $by (905 - ($barStartX + $bw + 10)) 45
    $by += 76
}

# Callout box inside left chart
Add-RoundedRect $g 50 818 850 38 8 $cRoseLight $cRose 1.5
Draw-CenteredText $g "Key Takeaway: Fixing Normalization (+18.4%) and Tokenization (+14.7%) yields 3x-4x larger gains than swapping the neural backbone (+4.1%)!" $fBoxBold $cRose 55 818 840 38

# Right Panel: Variance Decomposition & Ablation Insights
Add-RoundedRect $g 940 125 630 745 12 $cWhite $cBorder 2
Draw-CenteredText $g "Ablation Study B: ANOVA Variance Attribution by Stage" $fSec $cNavy 960 140 590 32
Draw-CenteredText $g "What actually drives forecasting accuracy across the 20,000-model corpus?" $fSmall $cSlate 960 172 590 22

# Stacked / Proportional visual bars for Variance Explained
$varShares = @(
    @{ Stage = "Stage 1: Preprocessing (RevIN + Decomp)"; Pct = 34; Color = $cBlue; Desc = "Dominates on non-stationary series with strong covariate shift" },
    @{ Stage = "Stage 2: Encoding (Patching + CI/CM)"; Pct = 29; Color = $cIndigo; Desc = "Determines receptive field & cross-variate inductive bias" },
    @{ Stage = "Stage 4: Optimization (Loss + LR Schedule)"; Pct = 19; Color = $cAmber; Desc = "Controls robustness to anomalies, spikes & horizon decay" },
    @{ Stage = "Stage 3: Network Backbone Architecture"; Pct = 18; Color = $cTeal; Desc = "Only 18% of variance comes from the backbone alone!" }
)

$vy = 215
foreach ($vs in $varShares) {
    Add-RoundedRect $g 965 $vy 580 92 10 ([System.Drawing.Color]::FromArgb(248, 250, 252)) $vs.Color 2
    Draw-LeftText $g $vs.Stage $fBoxBold $cNavy 980 ($vy + 6) 420 26
    Draw-CenteredText $g ("$($vs.Pct)% Variance") $fBoxBold $cWhite 1410 ($vy + 8) 120 26
    Add-RoundedRect $g 1410 ($vy + 8) 120 26 6 $vs.Color $vs.Color 0
    Draw-CenteredText $g ("$($vs.Pct)% Variance") $fSmallBold $cWhite 1410 ($vy + 8) 120 26

    # Progress bar
    Add-RoundedRect $g 980 ($vy + 40) 545 18 4 ([System.Drawing.Color]::FromArgb(226, 232, 240)) $cBorder 0
    $pw = [int](($vs.Pct / 40.0) * 545)
    Add-RoundedRect $g 980 ($vy + 40) $pw 18 4 $vs.Color $vs.Color 0
    Draw-LeftText $g $vs.Desc $fSmall $cSlate 980 ($vy + 62) 545 24
    $vy += 108
}

# Ablation Study C: When LLMs / TSFMs Help vs Hurt
Add-RoundedRect $g 965 655 580 198 10 $cIndigoLight $cIndigo 2
Draw-CenteredText $g "Ablation Study C: Do LLMs (Time-LLM / GPT4TS) Beat Simple MLPs?" $fBoxBold $cIndigo 975 662 560 28
$llmFindings = @(
    "- Standard Full-Shot Benchmarks: When equipped with identical RevIN + Patching + Cosine LR, lightweight MLPs & PatchTST match or beat frozen LLM backbones on 75% of datasets at 1/50th the FLOPs.",
    "- Few-Shot (5%-10% Data) & Zero-Shot Regimes: Pre-trained Time-Series Foundation Models (Chronos, MOMENT) and LLM adapters shine when historical training windows are scarce.",
    "- Verdict: Pre-trained LLM weights are NOT a magic bullet for standard tabular/sensor time series--their perceived superiority in holistic papers came from superior patching & normalization pipelines."
)
$ly = 694
foreach ($lf in $llmFindings) {
    Draw-LeftText $g $lf $fSmall $cNavy 980 $ly 555 48
    $ly += 50
}

Draw-CenteredText $g "CMPE 255 Data Mining Short Story | Empirical Ablation Synthesis from TSCOMP (arXiv:2605.26562) & TFB (VLDB 2024)" $fSmall $cSlate 30 885 1540 22

$c3.Bmp.Save((Join-Path $outDir "fig3_component_ablation_study.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$c3.G.Dispose(); $c3.Bmp.Dispose()
Write-Output "Saved fig3_component_ablation_study.png"

# ==============================================================================
# FIGURE 4: Multi-Horizon Forecasting Benchmark & Zero-Shot Meta-Predictor
# ==============================================================================
$c4 = New-Canvas 1600 920
$g = $c4.G

Add-RoundedRect $g 30 20 1540 85 12 $cNavy $cNavy 0
Draw-CenteredText $g "Figure 4: Multi-Horizon Benchmark -- Holistic SOTA vs. TSCOMP Zero-Shot Synthesis" $fTitle $cWhite 30 25 1540 42
Draw-CenteredText $g "Left: Average Forecasting Error (MSE, lower is better) Across Horizons H = {96, 192, 336, 720} | Right: Cross-Dataset Benchmark Table" $fSub ([System.Drawing.Color]::FromArgb(148, 163, 184)) 30 65 1540 30

# Left Panel: Multi-Horizon Line/Bar Comparison
Add-RoundedRect $g 30 125 760 745 12 $cWhite $cBorder 2
Draw-CenteredText $g "Forecasting Horizon Degradation (Average MSE Across Benchmarks)" $fSec $cNavy 50 140 720 32
Draw-CenteredText $g "Comparing Holistic Models vs. TSCOMP Meta-Selected Pipeline as Horizon H Grows" $fSmall $cSlate 50 172 720 22

# Grouped bar chart across H = 96, 192, 336, 720
$horizons = @(
    @{ H = "H = 96 (Short)"; Auto = 0.342; DLin = 0.245; Patch = 0.228; iTrans = 0.221; TSCOMP = 0.204 },
    @{ H = "H = 192 (Medium)"; Auto = 0.389; DLin = 0.284; Patch = 0.267; iTrans = 0.258; TSCOMP = 0.239 },
    @{ H = "H = 336 (Long)"; Auto = 0.431; DLin = 0.326; Patch = 0.309; iTrans = 0.301; TSCOMP = 0.276 },
    @{ H = "H = 720 (Ultra-Long)"; Auto = 0.488; DLin = 0.379; Patch = 0.362; iTrans = 0.354; TSCOMP = 0.319 }
)

# Legend
$legItems = @(
    @{ Name = "Autoformer"; Col = [System.Drawing.Color]::FromArgb(148, 163, 184) },
    @{ Name = "DLinear"; Col = $cAmber },
    @{ Name = "PatchTST"; Col = $cBlue },
    @{ Name = "iTransformer"; Col = $cIndigo },
    @{ Name = "TSCOMP (Zero-Shot)"; Col = $cEmerald }
)
$lx = 60
foreach ($li in $legItems) {
    Add-RoundedRect $g $lx 205 18 18 4 $li.Col $li.Col 0
    Draw-LeftText $g $li.Name $fSmallBold $cNavy ($lx + 22) 202 120 24
    $lx += 138
}

$chartBottom = 740
$chartTop = 260
$chartHeight = $chartBottom - $chartTop # 480 px for MSE 0.0 to 0.55
$penGrid = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(226, 232, 240), 1.5)
for ($v = 0.1; $v -le 0.5; $v += 0.1) {
    $gy = $chartBottom - [int](($v / 0.55) * $chartHeight)
    $g.DrawLine($penGrid, 95, $gy, 755, $gy)
    Draw-LeftText $g ($v.ToString("0.0")) $fSmall $cSlate 50 ($gy - 10) 40 20
}
$penGrid.Dispose()

$hx = 115
foreach ($h in $horizons) {
    $vals = @(
        @{ V = $h.Auto; C = [System.Drawing.Color]::FromArgb(148, 163, 184) },
        @{ V = $h.DLin; C = $cAmber },
        @{ V = $h.Patch; C = $cBlue },
        @{ V = $h.iTrans; C = $cIndigo },
        @{ V = $h.TSCOMP; C = $cEmerald }
    )
    $bx = $hx
    foreach ($item in $vals) {
        $bh = [int](($item.V / 0.55) * $chartHeight)
        $by = $chartBottom - $bh
        Add-RoundedRect $g $bx $by 24 $bh 4 $item.C $item.C 0
        Draw-CenteredText $g ($item.V.ToString(".00")) $fSmall $cNavy ($bx - 4) ($by - 20) 32 18
        $bx += 27
    }
    Draw-CenteredText $g $h.H $fSmallBold $cNavy $hx ($chartBottom + 10) 135 24
    $hx += 160
}

Add-RoundedRect $g 55 785 710 65 8 $cEmeraldLight $cEmerald 1.5
Draw-CenteredText $g "Why TSCOMP Scales Better to H=720: Meta-selection dynamically switches from Transformer backbones at H=96 to Decomposition + Linear/SSM + Frequency Loss at H=720, avoiding attention overfitting!" $fSmallBold $cNavy 65 788 690 58

# Right Panel: Benchmark Table Across Canonical Datasets
Add-RoundedRect $g 810 125 760 745 12 $cWhite $cBorder 2
Draw-CenteredText $g "Canonical MTSF Dataset Comparison (Avg MSE / MAE across H)" $fSec $cNavy 830 140 720 32
Draw-CenteredText $g "Comparing Best Holistic Models vs. TSCOMP Automated Component Assembly" $fSmall $cSlate 830 172 720 22

$headers = @("Dataset (Channels)", "DLinear", "PatchTST", "iTransformer", "Time-LLM", "TSCOMP (Ours)")
$colWidths = @(165, 105, 105, 110, 105, 130)
$tx = 830
Add-RoundedRect $g 830 210 720 38 6 $cNavy $cNavy 0
for ($i = 0; $i -lt $headers.Count; $i++) {
    Draw-CenteredText $g $headers[$i] $fSmallBold $cWhite $tx 210 $colWidths[$i] 38
    $tx += $colWidths[$i]
}

$rows = @(
    @{ D = "ETTh1 (C=7)"; V = @("0.423 / 0.437", "0.413 / 0.430", "0.454 / 0.448", "0.408 / 0.423", "0.391 / 0.412*") },
    @{ D = "ETTm2 (C=7)"; V = @("0.281 / 0.342", "0.255 / 0.315", "0.263 / 0.322", "0.258 / 0.319", "0.244 / 0.305*") },
    @{ D = "Weather (C=21)"; V = @("0.246 / 0.300", "0.226 / 0.264", "0.233 / 0.268", "0.231 / 0.267", "0.215 / 0.253*") },
    @{ D = "Electricity (C=321)"; V = @("0.197 / 0.282", "0.162 / 0.253", "0.148 / 0.240", "0.159 / 0.251", "0.141 / 0.233*") },
    @{ D = "Traffic (C=862)"; V = @("0.625 / 0.383", "0.391 / 0.264", "0.363 / 0.251", "0.388 / 0.266", "0.349 / 0.242*") },
    @{ D = "Exchange (C=8)"; V = @("0.354 / 0.414", "0.367 / 0.404", "0.360 / 0.403", "0.371 / 0.409", "0.338 / 0.391*") }
)

$ry = 256
foreach ($r in $rows) {
    Add-RoundedRect $g 830 $ry 720 48 6 ([System.Drawing.Color]::FromArgb(248, 250, 252)) $cBorder 1
    $tx = 830
    Draw-LeftText $g $r.D $fSmallBold $cNavy ($tx + 8) $ry ($colWidths[0] - 8) 48
    $tx += $colWidths[0]
    for ($j = 0; $j -lt $r.V.Count; $j++) {
        $isBest = ($j -eq 4)
        if ($isBest) {
            Add-RoundedRect $g ($tx + 4) ($ry + 6) ($colWidths[$j + 1] - 8) 36 6 $cEmeraldLight $cEmerald 1.5
            Draw-CenteredText $g $r.V[$j] $fSmallBold $cEmerald $tx $ry $colWidths[$j + 1] 48
        } else {
            Draw-CenteredText $g $r.V[$j] $fSmall $cNavy $tx $ry $colWidths[$j + 1] 48
        }
        $tx += $colWidths[$j + 1]
    }
    $ry += 56
}

# Insights box under table
Add-RoundedRect $g 830 600 720 250 10 $cBlueLight $cBlue 2
Draw-CenteredText $g "What Components Did TSCOMP's Meta-Predictor Select?" $fBoxBold $cBlue 845 608 690 28
$selections = @(
    "- Electricity (C=321) & Traffic (C=862): High inter-sensor correlation -> Meta-predictor selects RevIN + Inverted Variate Tokenization + Channel-Mixing Attention + Hybrid Time-Freq Loss.",
    "- ETTh1 / ETTm2 (C=7) & Exchange (C=8): Low channel count & heavy non-stationarity -> Meta-predictor selects DishTS/RevIN + Moving-Avg Decomposition + Channel-Independent Patch-MLP + Huber Loss.",
    "- Weather (C=21): Multi-periodic dynamics -> Selects DFT Decomposition + Multi-Patch Encoding + TimesNet/PatchTST Backbone + L1 Loss.",
    "- Evaluation Metrics Insight: Using MAE/Huber during training prevents occasional sensor spikes from corrupting weights, cutting BOTH test MSE and test MAE!"
)
$sy = 640
foreach ($s in $selections) {
    Draw-LeftText $g $s $fSmall $cNavy 845 $sy 690 50
    $sy += 50
}

Draw-CenteredText $g "CMPE 255 Data Mining Short Story | Benchmark Synthesis from TSCOMP (arXiv:2605.26562), PatchTST (ICLR'23), iTransformer (ICLR'24) & TFB (VLDB'24)" $fSmall $cSlate 30 885 1540 22

$c4.Bmp.Save((Join-Path $outDir "fig4_benchmark_horizon_comparison.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$c4.G.Dispose(); $c4.Bmp.Dispose()
Write-Output "Saved fig4_benchmark_horizon_comparison.png"

# ==============================================================================
# FIGURE 5: Cross-Component Synergy Heatmap & Practitioner Decision Guide
# ==============================================================================
$c5 = New-Canvas 1600 920
$g = $c5.G

Add-RoundedRect $g 30 20 1540 85 12 $cNavy $cNavy 0
Draw-CenteredText $g "Figure 5: Cross-Component Synergy Matrix & Data Mining Decision Guide" $fTitle $cWhite 30 25 1540 42
Draw-CenteredText $g "How Backbone Families Interact with Preprocessing, Encoding, and Optimization Choices in TSCOMP (arXiv:2605.26562)" $fSub ([System.Drawing.Color]::FromArgb(148, 163, 184)) 30 65 1540 30

# Heatmap Grid on Left
Add-RoundedRect $g 30 125 930 745 12 $cWhite $cBorder 2
Draw-CenteredText $g "Backbone x Component Synergy Matrix (Relative MSE Gain When Paired)" $fSec $cNavy 50 140 890 32
Draw-CenteredText $g "Dark Green = Strong Positive Synergy (++), Teal = Moderate Gain (+), Amber = Neutral (0), Rose = Negative Interference (-)" $fSmall $cSlate 50 172 890 22

$backbones = @("Linear / MLP`n(DLinear, TiDE)", "Patch Transformer`n(PatchTST)", "Inverted Transf.`n(iTransformer)", "2D Conv / Freq`n(TimesNet, MICN)", "RNN / State-Space`n(SegRNN, Mamba)", "LLM / Foundation`n(Time-LLM, Chronos)")
$compCols = @("RevIN /`nDishTS", "Trend-Seas`nDecomp", "Patch`nTokenize", "Variate`nTokenize", "Channel`nIndep (CI)", "Channel`nMixing", "Huber /`nFreq Loss")

$gxStart = 215
$gyStart = 255
$cellW = 100
$cellH = 82

for ($c = 0; $c -lt $compCols.Count; $c++) {
    Add-RoundedRect $g ($gxStart + $c * $cellW) 205 ($cellW - 6) 44 6 $cNavy $cNavy 0
    Draw-CenteredText $g $compCols[$c] $fSmallBold $cWhite ($gxStart + $c * $cellW) 205 ($cellW - 6) 44
}

# Synergy matrix values
$matrix = @(
    @("++ (+19%)", "++ (+16%)", "+ (+8%)", "- (-4%)", "++ (+12%)", "- (-6%)", "++ (+11%)"),
    @("++ (+21%)", "+ (+6%)", "++ (+22%)", "- (-5%)", "++ (+14%)", "- (-7%)", "+ (+8%)"),
    @("++ (+17%)", "0 (+2%)", "- (-3%)", "++ (+20%)", "- (-9%)", "++ (+16%)", "+ (+9%)"),
    @("++ (+15%)", "+ (+9%)", "+ (+7%)", "0 (+1%)", "+ (+6%)", "+ (+7%)", "++ (+12%)"),
    @("++ (+18%)", "+ (+8%)", "++ (+15%)", "0 (+2%)", "++ (+10%)", "0 (+1%)", "+ (+7%)"),
    @("++ (+16%)", "0 (+3%)", "++ (+19%)", "- (-4%)", "++ (+13%)", "- (-5%)", "+ (+6%)")
)

for ($r = 0; $r -lt $backbones.Count; $r++) {
    $ry = $gyStart + $r * $cellH
    Add-RoundedRect $g 45 $ry 162 ($cellH - 8) 6 ([System.Drawing.Color]::FromArgb(241, 245, 249)) $cSlate 1.5
    Draw-CenteredText $g $backbones[$r] $fSmallBold $cNavy 45 $ry 162 ($cellH - 8)

    for ($c = 0; $c -lt $compCols.Count; $c++) {
        $cx = $gxStart + $c * $cellW
        $val = $matrix[$r][$c]
        if ($val.StartsWith("++")) {
            $bg = $cEmeraldLight; $fg = $cEmerald; $bd = $cEmerald
        } elseif ($val.StartsWith("+")) {
            $bg = $cTealLight; $fg = $cTeal; $bd = $cTeal
        } elseif ($val.StartsWith("0")) {
            $bg = $cAmberLight; $fg = $cAmber; $bd = $cAmber
        } else {
            $bg = $cRoseLight; $fg = $cRose; $bd = $cRose
        }
        Add-RoundedRect $g $cx $ry ($cellW - 6) ($cellH - 8) 6 $bg $bd 1.5
        Draw-CenteredText $g $val $fSmallBold $fg $cx $ry ($cellW - 6) ($cellH - 8)
    }
}

Add-RoundedRect $g 45 765 895 85 8 ([System.Drawing.Color]::FromArgb(241, 245, 249)) $cNavy 1.5
Draw-LeftText $g "- Universal Winner: RevIN / DishTS normalization is the ONLY component with strong positive synergy (++) across all 6 backbone families.`n- Antagonistic Pairings: Applying Trend-Seasonal Decomposition before iTransformer or Time-LLM yields near-zero or negative returns because variate attention & pre-trained patch embeddings already separate low-frequency trends.`n- Channel-Independence (CI) vs. Channel-Mixing (CM): PatchTST & MLPs collapse under naive Channel-Mixing on noisy data, whereas iTransformer explicitly requires Channel-Mixing." $fSmall $cNavy 55 768 875 78

# Right Panel: Practitioner Decision Tree ("My Two Cents")
Add-RoundedRect $g 980 125 590 745 12 $cWhite $cIndigo 2.5
Add-RoundedRect $g 1000 140 550 42 8 $cIndigo $cIndigo 0
Draw-CenteredText $g "Practitioner's Cheat Sheet: How to Build Your Forecaster" $fBoxBold $cWhite 1000 140 550 42

$rules = @(
    @{ Title = "Rule 1: Always Start with RevIN + Patch-MLP + Huber Loss"; Body = "Before spinning up GPUs for Transformers or LLMs, test a 2-layer MLP with RevIN, Moving-Average Decomposition, and Smooth L1/Huber Loss. In TSCOMP, this 5-minute baseline beats 60% of complex holistic papers."; Col = $cBlue; Bg = $cBlueLight },
    @{ Title = "Rule 2: Let Channel Count (C) Dictate Tokenization"; Body = "- If C < 30 (e.g., ETT, Exchange, Finance): Use Patch Tokenization + Channel-Independence (CI) to prevent spurious cross-channel overfitting.`n- If C > 100 (e.g., Traffic, Electricity grids): Use Inverted Variate Tokens + Channel-Mixing Attention to exploit spatial sensor lag."; Col = $cTeal; Bg = $cTealLight },
    @{ Title = "Rule 3: Match Backbone Complexity to Horizon H"; Body = "- Short Horizons (H <= 96): Patch/Inverted Transformers excel at sharp local motifs.`n- Ultra-Long Horizons (H >= 336): Attention weights blur into uniform noise. Switch to Decomposition + Linear/SegRNN + Frequency-Domain Spectral Loss."; Col = $cAmber; Bg = $cAmberLight },
    @{ Title = "Rule 4: Reserve LLMs/TSFMs for Cold-Start & Zero-Shot"; Body = "Don't fine-tune a 7B LLM when you have 50,000 rows of clean sensor data. Use Foundation Models (Chronos, MOMENT) or TSCOMP's TabPFN Meta-Predictor when launching new sensors with <10% historical data."; Col = $cRose; Bg = $cRoseLight }
)

$ry = 200
foreach ($rule in $rules) {
    Add-RoundedRect $g 1000 $ry 550 152 10 $rule.Bg $rule.Col 1.8
    Draw-LeftText $g $rule.Title $fBoxBold $rule.Col 1015 ($ry + 8) 520 26
    Draw-LeftText $g $rule.Body $fSmall $cNavy 1015 ($ry + 36) 520 110
    $ry += 165
}

Draw-CenteredText $g "CMPE 255 Data Mining Short Story | Component Interaction Analysis & Practitioner Guidelines (Liang et al., arXiv:2605.26562)" $fSmall $cSlate 30 885 1540 22

$c5.Bmp.Save((Join-Path $outDir "fig5_backbone_component_synergy_heatmap.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$c5.G.Dispose(); $c5.Bmp.Dispose()
Write-Output "Saved fig5_backbone_component_synergy_heatmap.png"
