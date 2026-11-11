Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$slidesDir = Join-Path $PSScriptRoot "..\slides"
$imgDir = Join-Path $slidesDir "slide_images"
$figDir = Join-Path $PSScriptRoot "..\figures"
if (!(Test-Path $slidesDir)) { New-Item -ItemType Directory -Path $slidesDir | Out-Null }
if (!(Test-Path $imgDir)) { New-Item -ItemType Directory -Path $imgDir | Out-Null }

function New-SlideCanvas() {
    $bmp = New-Object System.Drawing.Bitmap(1920, 1080)
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

function Draw-Text([System.Drawing.Graphics]$g, [string]$text, [System.Drawing.Font]$font, [System.Drawing.Color]$color, [int]$x, [int]$y, [int]$w, [int]$h, [string]$align = "Left", [string]$valign = "Top") {
    $brush = New-Object System.Drawing.SolidBrush($color)
    $sf = New-Object System.Drawing.StringFormat
    $sf.Alignment = switch ($align) { "Center" { [System.Drawing.StringAlignment]::Center } "Right" { [System.Drawing.StringAlignment]::Far } default { [System.Drawing.StringAlignment]::Near } }
    $sf.LineAlignment = switch ($valign) { "Center" { [System.Drawing.StringAlignment]::Center } "Bottom" { [System.Drawing.StringAlignment]::Far } default { [System.Drawing.StringAlignment]::Near } }
    $rect = New-Object System.Drawing.RectangleF($x, $y, $w, $h)
    $g.DrawString($text, $font, $brush, $rect, $sf)
    $brush.Dispose()
    $sf.Dispose()
}

$fHero = New-Object System.Drawing.Font("Segoe UI", 36, [System.Drawing.FontStyle]::Bold)
$fSlideTitle = New-Object System.Drawing.Font("Segoe UI", 26, [System.Drawing.FontStyle]::Bold)
$fSlideSub = New-Object System.Drawing.Font("Segoe UI", 15, [System.Drawing.FontStyle]::Regular)
$fCardTitle = New-Object System.Drawing.Font("Segoe UI", 18, [System.Drawing.FontStyle]::Bold)
$fBody = New-Object System.Drawing.Font("Segoe UI", 14, [System.Drawing.FontStyle]::Regular)
$fBodyBold = New-Object System.Drawing.Font("Segoe UI", 14, [System.Drawing.FontStyle]::Bold)
$fFooter = New-Object System.Drawing.Font("Segoe UI", 11, [System.Drawing.FontStyle]::Regular)

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

function Draw-StandardChrome([System.Drawing.Graphics]$g, [int]$num, [int]$total, [string]$title, [string]$subtitle, [string]$badge) {
    Add-RoundedRect $g 40 30 1840 115 14 $cNavy $cNavy 0
    Add-RoundedRect $g 65 50 210 34 8 $cBlue $cBlue 0
    Draw-Text $g $badge $fFooter $cWhite 65 50 210 34 "Center" "Center"
    Draw-Text $g $title $fSlideTitle $cWhite 295 38 1550 48 "Left" "Center"
    Draw-Text $g $subtitle $fSlideSub ([System.Drawing.Color]::FromArgb(148, 163, 184)) 295 88 1550 38 "Left" "Center"

    # Footer
    Add-RoundedRect $g 40 1015 1840 42 8 ([System.Drawing.Color]::FromArgb(226, 232, 240)) $cBorder 1
    Draw-Text $g "CMPE 255 Data Mining Short Story | Beyond Holistic Models: Component-Level Benchmarking of Deep MTSF (arXiv:2605.26562)" $fFooter $cSlate 60 1015 1500 42 "Left" "Center"
    Draw-Text $g ("Slide $num / $total") $fBodyBold $cNavy 1650 1015 210 42 "Right" "Center"
}

function Draw-TwoCardSlide([int]$num, [string]$badge, [string]$title, [string]$subtitle, [hashtable]$leftCard, [hashtable]$rightCard, [string]$bottomTakeaway) {
    $sc = New-SlideCanvas
    $g = $sc.G
    Draw-StandardChrome $g $num 14 $title $subtitle $badge

    # Left Card
    Add-RoundedRect $g 40 165 900 725 14 $cWhite $leftCard.Color 2.5
    Add-RoundedRect $g 60 185 860 52 10 $leftCard.Bg $leftCard.Color 1.5
    Draw-Text $g $leftCard.Title $fCardTitle $leftCard.Color 75 185 830 52 "Left" "Center"
    $ly = 258
    foreach ($pt in $leftCard.Points) {
        Add-RoundedRect $g 65 $ly 850 112 10 ([System.Drawing.Color]::FromArgb(248, 250, 252)) $cBorder 1.2
        Draw-Text $g $pt.H $fBodyBold $cNavy 82 ($ly + 10) 815 28 "Left" "Center"
        Draw-Text $g $pt.B $fBody $cSlate 82 ($ly + 42) 815 62 "Left" "Top"
        $ly += 126
    }

    # Right Card
    Add-RoundedRect $g 980 165 900 725 14 $cWhite $rightCard.Color 2.5
    Add-RoundedRect $g 1000 185 860 52 10 $rightCard.Bg $rightCard.Color 1.5
    Draw-Text $g $rightCard.Title $fCardTitle $rightCard.Color 1015 185 830 52 "Left" "Center"
    $ry = 258
    foreach ($pt in $rightCard.Points) {
        Add-RoundedRect $g 1005 $ry 850 112 10 ([System.Drawing.Color]::FromArgb(248, 250, 252)) $cBorder 1.2
        Draw-Text $g $pt.H $fBodyBold $cNavy 1022 ($ry + 10) 815 28 "Left" "Center"
        Draw-Text $g $pt.B $fBody $cSlate 1022 ($ry + 42) 815 62 "Left" "Top"
        $ry += 126
    }

    # Bottom Takeaway Banner
    Add-RoundedRect $g 40 910 1840 85 12 $cNavy $cBlue 2
    Draw-Text $g ("Key Takeaway: " + $bottomTakeaway) $fBodyBold $cWhite 65 910 1790 85 "Left" "Center"

    $outPath = Join-Path $imgDir ("slide_{0:D2}.png" -f $num)
    $sc.Bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $sc.G.Dispose(); $sc.Bmp.Dispose()
}

function Draw-FigureSlide([int]$num, [string]$badge, [string]$title, [string]$subtitle, [string]$figFile, [array]$sideBullets, [string]$sideHeader) {
    $sc = New-SlideCanvas
    $g = $sc.G
    Draw-StandardChrome $g $num 14 $title $subtitle $badge

    # Left Figure Box (1240 px wide)
    Add-RoundedRect $g 40 165 1250 830 14 $cWhite $cBorder 2
    $figPath = Join-Path $figDir $figFile
    if (Test-Path $figPath) {
        $img = [System.Drawing.Image]::FromFile($figPath)
        $g.DrawImage($img, 55, 180, 1220, 800)
        $img.Dispose()
    }

    # Right Commentary Panel (570 px wide)
    Add-RoundedRect $g 1310 165 570 830 14 $cWhite $cBlue 2.5
    Add-RoundedRect $g 1330 185 530 50 10 $cBlue $cBlue 0
    Draw-Text $g $sideHeader $fCardTitle $cWhite 1330 185 530 50 "Center" "Center"

    $sy = 255
    foreach ($sb in $sideBullets) {
        Add-RoundedRect $g 1330 $sy 530 165 10 ([System.Drawing.Color]::FromArgb(248, 250, 252)) $cBlue 1.5
        Draw-Text $g $sb.H $fBodyBold $cBlue 1348 ($sy + 12) 495 30 "Left" "Center"
        Draw-Text $g $sb.B $fBody $cNavy 1348 ($sy + 48) 495 108 "Left" "Top"
        $sy += 182
    }

    $outPath = Join-Path $imgDir ("slide_{0:D2}.png" -f $num)
    $sc.Bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $sc.G.Dispose(); $sc.Bmp.Dispose()
}

# ==============================================================================
# SLIDE 1: Title Slide
# ==============================================================================
$s1 = New-SlideCanvas
$g = $s1.G
Add-RoundedRect $g 40 40 1840 1000 20 $cNavy $cBlue 3
Add-RoundedRect $g 100 100 480 44 10 $cBlue $cBlue 0
Draw-Text $g "CMPE 255: DATA MINING -- SHORT STORY" $fBodyBold $cWhite 100 100 480 44 "Center" "Center"

Draw-Text $g "Beyond Holistic Models: Systematic`nComponent-Level Benchmarking of Deep`nMultivariate Time-Series Forecasting" $fHero $cWhite 100 180 1700 190 "Left" "Top"
Draw-Text $g "Deconstructing Monolithic Forecasters into 4 Stages, 11 Dimensions & 49 Atomic Components Across 20,000+ Evaluations" $fCardTitle ([System.Drawing.Color]::FromArgb(147, 197, 253)) 100 390 1680 45 "Left" "Center"

# 3 Literature Pillars on Title Slide
$pillars = @(
    @{ Badge = "PRIMARY PAPER (KDD / arXiv:2605.26562)"; Title = "TSCOMP Framework (Liang et al., SUFE-AILAB)"; Desc = "Deconstructs deep MTSF into 4 stages, 11 dimensions, and 49 components via constrained orthogonal design (20,000+ runs) & TabPFN zero-shot synthesis."; Col = $cBlue; X = 100 },
    @{ Badge = "COMPANION SURVEY #1 (VLDB 2024)"; Title = "TFB: Fair Time-Series Benchmarking (Qiu et al.)"; Desc = "Exposes evaluation flaws across 10 domains (drop-last bug, lookback window bias) and unifies statistical, ML, and deep learning pipelines."; Col = $cTeal; X = 680 },
    @{ Badge = "COMPANION SURVEY #2 (KDD 2024 & ICLR)"; Title = "Foundation Models & Tokenization Wars"; Desc = "Synthesizes DLinear (AAAI'23), PatchTST (ICLR'23), iTransformer (ICLR'24), Time-LLM (ICLR'24), and TSFM Survey (Liang et al., arXiv:2403.14735)."; Col = $cIndigo; X = 1260 }
)
foreach ($p in $pillars) {
    Add-RoundedRect $g $p.X 480 540 270 14 ([System.Drawing.Color]::FromArgb(30, 41, 59)) $p.Col 2.5
    Add-RoundedRect $g ($p.X + 20) 500 500 36 8 $p.Col $p.Col 0
    Draw-Text $g $p.Badge $fFooter $cWhite ($p.X + 20) 500 500 36 "Center" "Center"
    Draw-Text $g $p.Title $fCardTitle $cWhite ($p.X + 25) 548 490 62 "Left" "Top"
    Draw-Text $g $p.Desc $fBody ([System.Drawing.Color]::FromArgb(203, 213, 225)) ($p.X + 25) 615 490 125 "Left" "Top"
}

Add-RoundedRect $g 100 800 1700 175 14 ([System.Drawing.Color]::FromArgb(30, 41, 59)) $cEmerald 2
Draw-Text $g "Core Thesis & 'My Two Cents' Preview" $fCardTitle ([System.Drawing.Color]::FromArgb(110, 231, 183)) 130 815 1640 36 "Left" "Center"
Draw-Text $g "For 5 years, time-series research has fought a 'Backbone War' (Transformers vs. MLPs vs. State-Space vs. LLMs). TSCOMP proves that over 70% of empirical gains actually come from Stage 1 (Normalization & Decomposition) and Stage 2 (Patch vs. Variate Tokenization), while the neural backbone accounts for only 18% of performance variance! Treating models as modular LEGO pipelines enables zero-shot model construction that beats monolithic SOTA at a fraction of the compute." $fBody $cWhite 130 858 1640 105 "Left" "Top"

$s1.Bmp.Save((Join-Path $imgDir "slide_01.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$s1.G.Dispose(); $s1.Bmp.Dispose()

# ==============================================================================
# SLIDE 2: The Crisis in Deep Time-Series Forecasting (Motivation)
# ==============================================================================
Draw-TwoCardSlide 2 "MOTIVATION & GIST" "The 'Holistic Black-Box' Crisis in Time-Series Data Mining" "Why hundreds of published forecasting architectures produce conflicting claims" @{
    Title = "1. The Architecture Wars (2020 - 2026)"
    Color = $cRose; Bg = $cRoseLight
    Points = @(
        @{ H = "Wave 1: Complex Sparse Attention (Informer, Autoformer, FEDformer)"; B = "Claimed custom O(L log L) attention mechanisms were essential for long-term forecasting." },
        @{ H = "Wave 2: The Linear Wake-Up Call (DLinear / NLinear, AAAI 2023)"; B = "Zeng et al. showed a 1-layer Linear model with Moving-Average Decomposition beat every complex Transformer!" },
        @{ H = "Wave 3: Patching & Inverted Attention (PatchTST & iTransformer)"; B = "Transformers struck back--not by changing self-attention math, but by changing how series are normalized and tokenized." },
        @{ H = "Wave 4: Billion-Parameter LLMs (Time-LLM, GPT4TS, Chronos)"; B = "Reprogrammed frozen LLMs for time series, raising the question: do LLM weights help, or is it just the patching wrapper?" }
    )
} @{
    Title = "2. Three Fundamental Blindspots Uncovered by TSCOMP & TFB"
    Color = $cBlue; Bg = $cBlueLight
    Points = @(
        @{ H = "Blindspot A: Confounded Bundling ('The Package Deal Fallacy')"; B = "When PatchTST beats Autoformer, is it the Transformer backbone, RevIN normalization, Patch tokenization, or Channel-Independence?" },
        @{ H = "Blindspot B: Protocol Inconsistencies (TFB Survey, VLDB 2024)"; B = "Qiu et al. showed tuning lookback window L or using 'drop_last=True' during testing changes MSE more than swapping models." },
        @{ H = "Blindspot C: Neglected Optimization & Loss Dynamics"; B = "Almost all papers fix L2 (MSE) training loss, ignoring how outlier spikes in traffic/sensor data corrupt gradient updates." },
        @{ H = "The TSCOMP Solution (Liang et al., KDD / arXiv:2605.26562)"; B = "Unbundle every model into 4 stages, 11 dimensions, and 49 atomic components under one unified experimental protocol." }
    )
} "Holistic benchmarking compares entire cars when we actually need a wind-tunnel test for tires, engines, transmissions, and fuel!"

# ==============================================================================
# SLIDE 3: Visual Paradigm Shift (Embeds Figure 1)
# ==============================================================================
Draw-FigureSlide 3 "SYSTEM ARCHITECTURE" "Paradigm Shift: Monolithic Silos vs. TSCOMP Pipeline" "Visualizing how TSCOMP deconstructs holistic models into an orthogonal design space" "fig1_holistic_vs_tscomp_paradigm.png" @(
    @{ H = "Deconstructing the Black Box"; B = "Every holistic forecaster (PatchTST, iTransformer, DLinear, Time-LLM) is really a 4-stage pipeline: Preprocessing -> Encoding -> Backbone -> Optimization." },
    @{ H = "Combinatorial Explosion (>10^6)"; B = "Multiplying all 49 component choices across 11 dimensions yields over 1,000,000 possible architectures--impossible to brute-force." },
    @{ H = "Constrained Orthogonal Design"; B = "TSCOMP prunes invalid pairings and uses orthogonal sampling to build a rigorous 20,000+ evaluation corpus across diverse domains." },
    @{ H = "Zero-Shot Meta-Predictor"; B = "Using TabPFN on dataset meta-features, TSCOMP predicts the best component recipe for any unseen dataset without training search!" }
) "Architecture Walk-Through"

# ==============================================================================
# SLIDE 4: Full Taxonomy (Embeds Figure 2)
# ==============================================================================
Draw-FigureSlide 4 "TAXONOMY OVERVIEW" "The TSCOMP Taxonomy: 4 Stages, 11 Dimensions, 49 Components" "A unified vocabulary for Multivariate Time-Series Forecasting (MTSF) data mining" "fig2_tscomp_taxonomy_4stages_11dims.png" @(
    @{ H = "Stage 1: Preprocessing (Dims 1-3)"; B = "Tackles non-stationarity and covariate shift via instance normalization (RevIN, DishTS), trend-seasonal decomposition (MA, DFT), and sampling." },
    @{ H = "Stage 2: Encoding (Dims 4-6)"; B = "Controls how raw timestamps become tokens (Point vs. Patch vs. Variate) and whether channels share weights (CI) or mix (CM)." },
    @{ H = "Stage 3: Backbones (Dims 7-8)"; B = "Spans 14 backbone families: Linear/MLP, TCN/2D-Freq (TimesNet), Transformers, RNN/Mamba SSMs, and Foundation Models (LLM/TSFM)." },
    @{ H = "Stage 4: Optimization (Dims 9-11)"; B = "Governs training loss (MSE, MAE, Huber, Spectral Frequency Loss), learning-rate schedules (Cosine, OneCycle), and regularization." }
) "4-Stage Breakdown"

# ==============================================================================
# SLIDE 5: Deep Dive into Stage 1 & Stage 2 (Preprocessing & Encoding)
# ==============================================================================
Draw-TwoCardSlide 5 "STAGES 1 & 2 DEEP DIVE" "Where the Real Gains Live: Preprocessing & Tokenization" "Why Stage 1 (34% variance) and Stage 2 (29% variance) dominate forecasting accuracy" @{
    Title = "Stage 1: Taming Non-Stationarity & Distribution Shift"
    Color = $cBlue; Bg = $cBlueLight
    Points = @(
        @{ H = "Reversible Instance Normalization (RevIN, ICLR'22)"; B = "Strips each window's mean/variance before the model and restores them at the output. Single highest-impact module (+18.4% MSE gain)." },
        @{ H = "Adaptive Norm (SAN / DishTS)"; B = "Learns non-stationary distribution shifts between lookback window L and target horizon H--crucial for volatile financial/exchange series." },
        @{ H = "Moving Average (MA) vs. DFT Frequency Decomposition"; B = "Explicitly separates slow macroscopic trend from periodic seasonality. Indispensable when using lightweight Linear or MLP backbones." },
        @{ H = "When Decomposition Hurts (Negative Interference)"; B = "Pairing MA decomposition with iTransformer or pre-trained LLMs is redundant and slightly degrades cross-variate phase alignment." }
    )
} @{
    Title = "Stage 2: The Tokenization & Channel Strategy Trade-Off"
    Color = $cIndigo; Bg = $cIndigoLight
    Points = @(
        @{ H = "Point-Wise Tokens (Legacy Transformers)"; B = "Treating single timestamps as tokens fails: single points lack semantic meaning and create quadratic O(L^2) attention bottlenecks." },
        @{ H = "Patch Tokenization (PatchTST Style)"; B = "Groups P=16 adjacent steps into one token. Captures local shape motifs (slopes, peaks) and slashes sequence length by 16x." },
        @{ H = "Inverted Variate Tokenization (iTransformer Style)"; B = "Embeds the entire lookback series of each sensor into 1 token; self-attention now computes spatial sensor-to-sensor correlations!" },
        @{ H = "Channel-Independence (CI) vs. Channel-Mixing (CM)"; B = "CI prevents overfitting when channels C < 30 or noise is high; CM wins when C > 100 (e.g., 862 freeway sensors in Traffic)." }
    )
} "63% of total performance variance is already locked in by the time data leaves Stage 1 and Stage 2--before the backbone even runs!"

# ==============================================================================
# SLIDE 6: Deep Dive into Stage 3 & Stage 4 (Backbones & Optimization)
# ==============================================================================
Draw-TwoCardSlide 6 "STAGES 3 & 4 DEEP DIVE" "Backbone Families & The Underrated Power of Optimization" "Comparing MLPs, Transformers, SSMs, and LLMs alongside Loss & Schedule mechanics" @{
    Title = "Stage 3: 6 Neural Backbone Families Benchmarked Fairly"
    Color = $cTeal; Bg = $cTealLight
    Points = @(
        @{ H = "1. Linear & MLP (DLinear, RLinear, TiDE, TSMixer)"; B = "Ultra-fast, convex-like convergence. Excels at long horizons (H=336, 720) where complex attention overfits to high-frequency noise." },
        @{ H = "2. Transformers & 3. 2D-Conv/Freq (TimesNet, MICN)"; B = "Excel at short-to-medium horizons (H=96, 192) and high-channel spatial routing when paired with Patch or Variate tokenization." },
        @{ H = "4. Recurrent & State-Space Models (SegRNN, Mamba-TS)"; B = "Linear O(L) complexity with strong sequential inductive bias; competitive middle ground between MLPs and Transformers." },
        @{ H = "5. Frozen LLMs (Time-LLM, GPT4TS) & 6. TSFMs (Chronos, MOMENT)"; B = "High compute cost. Only beat well-tuned MLPs/Transformers in zero-shot or extreme few-shot (5%-10% data) cold-start scenarios." }
    )
} @{
    Title = "Stage 4: Why Optimization Accounts for 19% of Variance"
    Color = $cAmber; Bg = $cAmberLight
    Points = @(
        @{ H = "The MSE Training Loss Trap"; B = "Almost all papers evaluate on MSE & MAE, so they train exclusively with MSE (L2). But squared errors explode on sensor spikes/outliers!" },
        @{ H = "Smooth L1 (Huber) & MAE Training Objectives"; B = "Switching training loss from L2 to Huber/Smooth-L1 or L1 improves BOTH test MAE and test MSE across 68% of tested pipelines." },
        @{ H = "Frequency-Domain Spectral Loss (FreDF / Tilted Loss)"; B = "Penalizing error in Fourier amplitude/phase space eliminates the 'flat-line mean prediction' pathology on periodic series." },
        @{ H = "OneCycleLR & Cosine Annealing Schedules"; B = "Transformer and Foundation Model backbones are highly sensitive to warmup/decay schedules (+6.3% MSE swing from schedule alone)." }
    )
} "Training a simple Patch-MLP with RevIN and Smooth-L1/Frequency Loss regularly beats a default-trained Transformer!"

# ==============================================================================
# SLIDE 7: Component-Level Ablation Study (Embeds Figure 3)
# ==============================================================================
Draw-FigureSlide 7 "ABLATION STUDIES" "Empirical Ablation Results Across 20,000+ Evaluations" "Quantifying marginal MSE improvements and ANOVA variance attribution across stages" "fig3_component_ablation_study.png" @(
    @{ H = "Finding 1: Normalization is King (+18.4%)"; B = "Adding RevIN or DishTS yields an average 18.4% MSE reduction--more than 4x larger than the average gain from changing the backbone (+4.1%)." },
    @{ H = "Finding 2: Tokenization Beats Depth (+14.7%)"; B = "Switching from point-wise tokens to Patch (+14.7%) or Variate (+13.2%) tokens is what actually made modern Time-Series Transformers work." },
    @{ H = "Finding 3: ANOVA Variance Breakdown"; B = "Stage 1 (34%) + Stage 2 (29%) + Stage 4 (19%) = 82% of total accuracy variance. The neural backbone (Stage 3) explains just 18%!" },
    @{ H = "Finding 4: The LLM Reality Check"; B = "When MLPs are given the exact same RevIN + Patching + Cosine LR pipeline as GPT4TS/Time-LLM, the LLM advantage vanishes on full data." }
) "Key Ablation Insights"

# ==============================================================================
# SLIDE 8: Evaluation Metrics & Protocol Pitfalls (Synthesizing TFB VLDB'24)
# ==============================================================================
Draw-TwoCardSlide 8 "METRICS & BENCHMARKING" "Evaluation Metrics & Fair Benchmarking Protocols" "Synthesizing TSCOMP (KDD) with Companion Survey TFB (Qiu et al., VLDB 2024)" @{
    Title = "Core Quantitative Metrics Used Across the Corpus"
    Color = $cIndigo; Bg = $cIndigoLight
    Points = @(
        @{ H = "MSE (Mean Squared Error) & RMSE"; B = "Heavily penalizes large deviations due to quadratic squaring. Sensitive to sudden regime shifts, sensor glitches, and extreme peaks." },
        @{ H = "MAE (Mean Absolute Error) & sMAPE"; B = "Measures average L1 magnitude of forecast error. More robust to isolated anomalies and easier to interpret in business/sensor units." },
        @{ H = " Spectral / Frequency Distance & Ramp Score"; B = "Evaluates whether a model captures sharp peaks and phase alignment rather than lazily predicting a smooth moving average." },
        @{ H = "Rank Distribution & Pairwise Win-Rate (%)"; B = "Because raw MSE varies by scale across datasets, TSCOMP aggregates normalized relative improvement and Nemenyi critical-difference ranks." }
    )
} @{
    Title = "Protocol Pitfalls Exposed by TFB (VLDB'24) & Fixed in TSCOMP"
    Color = $cEmerald; Bg = $cEmeraldLight
    Points = @(
        @{ H = "Pitfall 1: The 'drop_last=True' Evaluation Bug"; B = "Several famous repos dropped incomplete final test batches, accidentally skipping the hardest tail timestamps and inflating reported SOTA." },
        @{ H = "Pitfall 2: Lookback Window L Starvation (L=96 vs L=336/512)"; B = "Older papers forced Transformers to use L=96 while newer models used L=336 or 512. TSCOMP standardizes lookback horizons fairly." },
        @{ H = "Pitfall 3: Cherry-Picking ETT Subsets"; B = "Evaluating only on 7-channel transformer temperature data (ETTh1/m1) hides catastrophic failures on 862-channel Traffic data." },
        @{ H = "Pitfall 4: Ignoring Compute Efficiency (FLOPs, VRAM, Wall-Time)"; B = "A 0.5% MSE gain that requires 100x more GPU hours (e.g., 7B LLM adapters) is impractical for real-time edge stream mining." }
    )
} "Fair data mining requires locking the evaluation harness: identical lookback L, zero test-batch dropping, and multi-metric reporting."

# ==============================================================================
# SLIDE 9: Multi-Horizon Benchmark Results (Embeds Figure 4)
# ==============================================================================
Draw-FigureSlide 9 "BENCHMARK RESULTS" "Multi-Horizon Benchmark: Holistic SOTA vs. TSCOMP" "Evaluating forecasting accuracy across horizons H = {96, 192, 336, 720} and 6 canonical datasets" "fig4_benchmark_horizon_comparison.png" @(
    @{ H = "Consistent SOTA Across All Datasets"; B = "TSCOMP's corpus-selected pipelines achieve the lowest MSE and MAE on ETTh1, ETTm2, Weather, Electricity, Traffic, and Exchange." },
    @{ H = "Superior Horizon Scaling (H = 720)"; B = "As horizon stretches from 96 to 720 steps, holistic Transformers degrade rapidly due to attention entropy, while TSCOMP adapts its backbone." },
    @{ H = "Context-Dependent Component Selection"; B = "On high-dimensional Traffic (C=862), TSCOMP picks Variate Tokenization + Channel-Mixing; on noisy ETTh1 (C=7), it picks CI + Patch-MLP." },
    @{ H = "Zero-Shot Speed Advantage"; B = "Instead of running 50 manual hyperparameter trials per dataset, TabPFN meta-prediction constructs the winning pipeline in under 1 second." }
) "Benchmark Takeaways"

# ==============================================================================
# SLIDE 10: Cross-Component Synergy & Practitioner Guide (Embeds Figure 5)
# ==============================================================================
Draw-FigureSlide 10 "COMPONENT SYNERGY" "Cross-Component Synergy Matrix & Decision Rules" "Understanding positive synergies (++) and negative interference (-) between modules" "fig5_backbone_component_synergy_heatmap.png" @(
    @{ H = "Universal Booster: RevIN / DishTS"; B = "Instance normalization is the only component that delivers double-digit positive synergy (+15% to +21%) across every single backbone family." },
    @{ H = "Strongest Pairing #1: Patch + CI + Transformer"; B = "Patch tokenization (+22%) and Channel-Independence (+14%) unlock Transformer performance on low-to-medium channel datasets." },
    @{ H = "Strongest Pairing #2: Decomp + MLP + Huber"; B = "Linear/MLP backbones gain +16% from Trend-Seasonal Decomposition and +11% from Huber/Frequency loss, rivaling deep models." },
    @{ H = "Toxic Pairings to Avoid (-9%)"; B = "Never pair Inverted Variate Tokenization with Channel-Independence (-9%): variate tokens exist specifically to mix cross-channel information!" }
) "Synergy & Antagonism"

# ==============================================================================
# SLIDE 11: Automated Zero-Shot Model Construction via TabPFN
# ==============================================================================
Draw-TwoCardSlide 11 "AUTO-ML & META-LEARNING" "From Benchmark to Automated Zero-Shot Model Synthesis" "How TSCOMP turns 20,000+ historical evaluations into an instant architecture generator" @{
    Title = "Step-by-Step Zero-Shot Pipeline Construction"
    Color = $cEmerald; Bg = $cEmeraldLight
    Points = @(
        @{ H = "Step 1: Unseen Dataset Profiling (Meta-Feature Extraction)"; B = "Given a new dataset X, compute lightweight statistical & spectral descriptors: ADF stationarity, trend/seasonality ratio, spectral entropy, channel correlation matrix, kurtosis, and C/L ratio." },
        @{ H = "Step 2: Encoding Component Configurations"; B = "Each of the 49 components across 11 dimensions is represented as a structured categorical vector alongside the target horizon H." },
        @{ H = "Step 3: TabPFN Prior-Data Fitted Network Meta-Predictor"; B = "Trained on the 20,000+ TSCOMP performance corpus, TabPFN predicts the expected MSE/MAE rank of candidate pipelines in a single forward pass." },
        @{ H = "Step 4: Instant Assembly & Training"; B = "Instantiates the top-ranked (Preprocessing + Encoding + Backbone + Loss) configuration directly in PyTorch without grid-search." }
    )
} @{
    Title = "Why Meta-Constructed Models Beat Hand-Crafted Architectures"
    Color = $cIndigo; Bg = $cIndigoLight
    Points = @(
        @{ H = "Eliminates Human inductive Bias"; B = "Researchers tend to force their favorite backbone onto every dataset; the meta-predictor objectively switches between MLP, SSM, and Attention." },
        @{ H = "Horizon-Aware Adaptation"; B = "For the exact same dataset, TSCOMP selects different components for H=96 (local patch attention) vs H=720 (trend decomposition + linear projection)." },
        @{ H = "100x Lower Engineering & Compute Cost"; B = "Bypasses neural architecture search (NAS) and expensive LLM fine-tuning while achieving higher accuracy than any single monolithic baseline." },
        @{ H = "Open-Source Reproducibility (SUFE-AILAB/TSCOMP)"; B = "Provides a standardized plug-and-play codebase where new components can be tested against all 49 existing modules fairly." }
    )
} "TSCOMP transforms time-series forecasting from an artisanal guessing game into data-driven systems engineering."

# ==============================================================================
# SLIDE 12: Synthesizing Companion Survey Papers (Holistic Literature View)
# ==============================================================================
Draw-TwoCardSlide 12 "SURVEY SYNTHESIS" "Connecting the Dots Across Recent Time-Series Surveys" "Integrating TSCOMP (KDD) with TFB (VLDB'24), TSFM Survey (KDD'24), and Deep MTSF Surveys" @{
    Title = "How 4 Major Survey & Benchmark Papers Complement Each Other"
    Color = $cBlue; Bg = $cBlueLight
    Points = @(
        @{ H = "1. TSCOMP (Liang et al., KDD / arXiv:2605.26562)"; B = "Focus: Intra-model component deconstruction (4 stages, 11 dimensions, 49 modules) + orthogonal ablation + zero-shot meta-synthesis." },
        @{ H = "2. TFB Benchmark (Qiu et al., VLDB 2024 / arXiv:2403.20150)"; B = "Focus: Inter-model fairness across 10 domains, statistical vs ML vs DL comparisons, and eliminating evaluation bugs (drop-last, lookback tuning)." },
        @{ H = "3. Foundation Models for Time Series Survey (Liang et al., KDD 2024)"; B = "Focus: Taxonomy of pre-trained TSFMs (Chronos, MOMENT, Lag-Llama, Time-LLM)--explaining when pre-training helps (cold-start/zero-shot)." },
        @{ H = "4. Deep Time-Series Forecasting Surveys (ACM CSUR / IEEE TKDE)"; B = "Focus: Historical evolution from ARIMA/State-Space to RNNs, TCNs, GNNs, and Transformers across spatiotemporal applications." }
    )
} @{
    Title = "Unified Consensus Emerging Across All 2024-2026 Surveys"
    Color = $cTeal; Bg = $cTealLight
    Points = @(
        @{ H = "Consensus 1: 'Architecture Fetishism' is Over"; B = "Across all recent benchmarks, no single neural backbone dominates universally. Data characteristics dictate the winning inductive bias." },
        @{ H = "Consensus 2: Non-Stationarity is the #1 Enemy"; B = "Real-world sensor, financial, and energy streams violate i.i.d. assumptions; instance normalization (RevIN/DishTS) is mandatory." },
        @{ H = "Consensus 3: Token Semantics Matter More Than Attention Math"; B = "Replacing O(L^2) point-wise attention with Patch tokens or Variate tokens solved both the accuracy and efficiency bottlenecks." },
        @{ H = "Consensus 4: Hybrid Statistical + Deep Modularity Wins"; B = "Combining classical signal processing (Moving Average, Fourier DFT, Wavelets) with lightweight neural heads gives the best Pareto frontier." }
    )
} "Reading TSCOMP alongside TFB (VLDB'24) and the KDD'24 TSFM Survey gives a complete 360-degree map of modern time-series mining."

# ==============================================================================
# SLIDE 13: "My Two Cents" -- Critical Analysis, Strengths & Limitations
# ==============================================================================
Draw-TwoCardSlide 13 "CRITICAL PERSPECTIVE" "My Two Cents: Critical Review & Practitioner Perspective" "An honest evaluation of TSCOMP's breakthroughs, blindspots, and real-world impact" @{
    Title = "What I Loved About This Paper (Strengths)"
    Color = $cEmerald; Bg = $cEmeraldLight
    Points = @(
        @{ H = "1. Intellectual Honesty & Scientific Rigor"; B = "In an era where papers add 3 undocumented preprocessing tricks and credit a 'novel attention block', TSCOMP audits every trick transparently." },
        @{ H = "2. Constrained Orthogonal Design is Brilliant Data Mining"; B = "Instead of burning millions of GPU hours on full grid search, orthogonal design isolates main effects and 2-way interactions cleanly." },
        @{ H = "3. Elevating Loss Functions & Schedules to First-Class Citizens"; B = "Proving that Stage 4 (Optimization) accounts for 19% of variance--more than the backbone itself (18%)--is a wake-up call for practitioners." },
        @{ H = "4. Actionable Zero-Shot Meta-Predictor"; B = "The TabPFN meta-predictor isn't just an academic curiosity; it gives engineers a concrete, deployable starting recipe in seconds." }
    )
} @{
    Title = "Where the Paper Falls Short (Limitations & Open Questions)"
    Color = $cRose; Bg = $cRoseLight
    Points = @(
        @{ H = "1. Point Forecasting Only (Missing Probabilistic Intervals)"; B = "Real-world supply chains and energy grids need calibrated quantiles (CRPS / Pinball Loss), not just point MSE/MAE predictions." },
        @{ H = "2. Ignored Exogenous & Irregular Covariates"; B = "Production forecasting relies heavily on known future covariates (promotions, holidays, weather forecasts) and missing-value masks." },
        @{ H = "3. Static Offline Windows vs. Online Concept Drift"; B = "TSCOMP evaluates fixed train/val/test splits; streaming data mining requires continuous online adaptation as sensor physics drift." },
        @{ H = "4. Multi-Modal Context Still Under-Explored"; B = "While LLM backbones underperform on pure numbers, pairing numeric sensors with real-time text/event logs remains a huge frontier." }
    )
} "My Verdict: Before you ever deploy a heavy Transformer or LLM forecaster in production, run TSCOMP's modular checklist first!"

# ==============================================================================
# SLIDE 14: Summary & Actionable Takeaways for CMPE 255
# ==============================================================================
Draw-TwoCardSlide 14 "CONCLUSION & LINKS" "Summary & Actionable Takeaways for Data Scientists" "Wrapping up our CMPE 255 Short Story on Component-Level Time-Series Benchmarking" @{
    Title = "Top 4 Takeaways to Remember"
    Color = $cBlue; Bg = $cBlueLight
    Points = @(
        @{ H = "1. Stop Treating Models as Monoliths"; B = "Deconstruct every time-series forecaster into Stage 1 (Prep), Stage 2 (Encoding), Stage 3 (Backbone), and Stage 4 (Optimization)." },
        @{ H = "2. Fix Stage 1 & Stage 2 First (63% of Variance)"; B = "Always turn on RevIN/DishTS (+18.4%) and choose Patch tokens (low C) or Variate tokens (high C > 100) before tuning deep layers." },
        @{ H = "3. Ditch Default MSE Training Loss on Noisy Data"; B = "Train with Smooth L1 (Huber) or Hybrid Time-Frequency Spectral Loss to prevent outlier spikes from wrecking model gradients." },
        @{ H = "4. Use Corpus-Driven Meta-Learning Over Trial-and-Error"; B = "Leverage TSCOMP's 20,000-run corpus and TabPFN meta-predictor for instant, zero-shot pipeline synthesis tailored to your dataset." }
    )
} @{
    Title = "Assignment Artifacts & References in This Repository"
    Color = $cNavy; Bg = $cIndigoLight
    Points = @(
        @{ H = "Primary Paper (KDD Datasets & Benchmarks Track)"; B = "Liang et al., 'Beyond Holistic Models: Systematic Component-level Benchmarking of Deep Multivariate Time-Series Forecasting' (arXiv:2605.26562)." },
        @{ H = "Companion Surveys & Milestones Synthesized"; B = "TFB (VLDB'24, arXiv:2403.20150), TSFM Survey (KDD'24, arXiv:2403.14735), DLinear (AAAI'23), PatchTST (ICLR'23), iTransformer (ICLR'24)." },
        @{ H = "Deliverables Included in GitHub Repo"; B = "- Original Medium Article Draft (medium_article.md) + 5 Custom Figures`n- 14-Slide Presentation Deck (.pptx, .html, PNGs) & Video Script" },
        @{ H = "Thank You! Questions & Discussion"; B = "Explore the full code, figures, Medium link, SlideShare deck, and 10-15 minute video walkthrough in our public GitHub repository!" }
    )
} "Thank you for watching! Check out the README.md for direct links to the Medium article, SlideShare presentation, and video recording."

Write-Output "Rendered all 14 slide PNGs in $imgDir"

# ==============================================================================
# PACKAGE 14 SLIDE PNGs INTO A VALID OPENXML POWERPOINT (.PPTX) FILE
# ==============================================================================
$pptxPath = Join-Path $slidesDir "TSCOMP_Short_Story_Slides.pptx"
$tmpZipDir = Join-Path $slidesDir "_pptx_build"
if (Test-Path $tmpZipDir) { Remove-Item -Recurse -Force $tmpZipDir }
if (Test-Path $pptxPath) { Remove-Item -Force $pptxPath }

New-Item -ItemType Directory -Path "$tmpZipDir\_rels" | Out-Null
New-Item -ItemType Directory -Path "$tmpZipDir\ppt\_rels" | Out-Null
New-Item -ItemType Directory -Path "$tmpZipDir\ppt\slides\_rels" | Out-Null
New-Item -ItemType Directory -Path "$tmpZipDir\ppt\slideLayouts\_rels" | Out-Null
New-Item -ItemType Directory -Path "$tmpZipDir\ppt\slideMasters\_rels" | Out-Null
New-Item -ItemType Directory -Path "$tmpZipDir\ppt\media" | Out-Null

# 1. [Content_Types].xml
$slideOverrides = ""
for ($i = 1; $i -le 14; $i++) {
    $slideOverrides += "  <Override PartName=`"/ppt/slides/slide$i.xml`" ContentType=`"application/vnd.openxmlformats-officedocument.presentationml.slide+xml`"/>`r`n"
}
$contentTypes = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Default Extension="png" ContentType="image/png"/>
  <Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>
  <Override PartName="/ppt/slideMasters/slideMaster1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml"/>
  <Override PartName="/ppt/slideLayouts/slideLayout1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml"/>
$slideOverrides</Types>
"@
[System.IO.File]::WriteAllText("$tmpZipDir\[Content_Types].xml", $contentTypes, [System.Text.Encoding]::UTF8)

# 2. _rels/.rels
$rootRels = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>
</Relationships>
"@
[System.IO.File]::WriteAllText("$tmpZipDir\_rels\.rels", $rootRels, [System.Text.Encoding]::UTF8)

# 3. ppt/presentation.xml & ppt/_rels/presentation.xml.rels
$sldIdLst = ""
$presRels = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="slideMasters/slideMaster1.xml"/>
"@
for ($i = 1; $i -le 14; $i++) {
    $rid = $i + 1
    $sid = 255 + $i
    $sldIdLst += "    <p:sldId id=`"$sid`" r:id=`"rId$rid`"/>`r`n"
    $presRels += "  <Relationship Id=`"rId$rid`" Type=`"http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide`" Target=`"slides/slide$i.xml`"/>`r`n"
}
$presRels += "</Relationships>"
[System.IO.File]::WriteAllText("$tmpZipDir\ppt\_rels\presentation.xml.rels", $presRels, [System.Text.Encoding]::UTF8)

# 16:9 widescreen dimensions in EMU: cx="12192000" cy="6858000"
$presXml = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:sldMasterIdLst>
    <p:sldMasterId id="2147483648" r:id="rId1"/>
  </p:sldMasterIdLst>
  <p:sldIdLst>
$sldIdLst  </p:sldIdLst>
  <p:sldSz cx="12192000" cy="6858000" type="screen16x9"/>
  <p:notesSz cx="6858000" cy="9144000"/>
</p:presentation>
"@
[System.IO.File]::WriteAllText("$tmpZipDir\ppt\presentation.xml", $presXml, [System.Text.Encoding]::UTF8)

# 4. Slide Master & Slide Layout
$masterXml = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sldMaster xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr/></p:spTree></p:cSld>
  <p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/>
  <p:sldLayoutIdLst><p:sldLayoutId id="2147483649" r:id="rId1"/></p:sldLayoutIdLst>
</p:sldMaster>
"@
[System.IO.File]::WriteAllText("$tmpZipDir\ppt\slideMasters\slideMaster1.xml", $masterXml, [System.Text.Encoding]::UTF8)

$masterRels = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/>
</Relationships>
"@
[System.IO.File]::WriteAllText("$tmpZipDir\ppt\slideMasters\_rels\slideMaster1.xml.rels", $masterRels, [System.Text.Encoding]::UTF8)

$layoutXml = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sldLayout xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" type="blank">
  <p:cSld name="Blank"><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr/></p:spTree></p:cSld>
</p:sldLayout>
"@
[System.IO.File]::WriteAllText("$tmpZipDir\ppt\slideLayouts\slideLayout1.xml", $layoutXml, [System.Text.Encoding]::UTF8)

$layoutRels = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="../slideMasters/slideMaster1.xml"/>
</Relationships>
"@
[System.IO.File]::WriteAllText("$tmpZipDir\ppt\slideLayouts\_rels\slideLayout1.xml.rels", $layoutRels, [System.Text.Encoding]::UTF8)

# 5. Each Slide XML + Image Copy
for ($i = 1; $i -le 14; $i++) {
    $srcImg = Join-Path $imgDir ("slide_{0:D2}.png" -f $i)
    $dstImg = "$tmpZipDir\ppt\media\slide_$i.png"
    Copy-Item $srcImg $dstImg

    $slideXml = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld>
    <p:spTree>
      <p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>
      <p:grpSpPr/>
      <p:pic>
        <p:nvPicPr>
          <p:cNvPr id="2" name="SlideImage$i"/>
          <p:cNvPicPr><a:picLocks noChangeAspect="1"/></p:cNvPicPr>
          <p:nvPr/>
        </p:nvPicPr>
        <p:blipFill>
          <a:blip r:embed="rId2"/>
          <a:stretch><a:fillRect/></a:stretch>
        </p:blipFill>
        <p:spPr>
          <a:xfrm><a:off x="0" y="0"/><a:ext cx="12192000" cy="6858000"/></a:xfrm>
          <a:prstGeom prst="rect"><a:avLst/></a:prstGeom>
        </p:spPr>
      </p:pic>
    </p:spTree>
  </p:cSld>
</p:sld>
"@
    [System.IO.File]::WriteAllText("$tmpZipDir\ppt\slides\slide$i.xml", $slideXml, [System.Text.Encoding]::UTF8)

    $slideRels = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/slide_$i.png"/>
</Relationships>
"@
    [System.IO.File]::WriteAllText("$tmpZipDir\ppt\slides\_rels\slide$i.xml.rels", $slideRels, [System.Text.Encoding]::UTF8)
}

[System.IO.Compression.ZipFile]::CreateFromDirectory($tmpZipDir, $pptxPath)
Remove-Item -Recurse -Force $tmpZipDir
Write-Output "Created PowerPoint deck: $pptxPath"
