Add-Type -AssemblyName System.Drawing

$slidesDir = Join-Path $PSScriptRoot "..\slides"
$imgDir = Join-Path $slidesDir "slide_images"
$pdfPath = Join-Path $slidesDir "TSCOMP_Short_Story_Slides.pdf"

# Convert each 1920x1080 PNG slide into a high-quality JPEG byte array and embed into a valid 14-page PDF-1.4 document
$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$encParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]92)

$slideJpegs = @()
for ($i = 1; $i -le 14; $i++) {
    $pngPath = Join-Path $imgDir ("slide_{0:D2}.png" -f $i)
    $bmp = [System.Drawing.Image]::FromFile($pngPath)
    $ms = New-Object System.IO.MemoryStream
    $bmp.Save($ms, $jpegCodec, $encParams)
    $slideJpegs += ,($ms.ToArray())
    $ms.Dispose()
    $bmp.Dispose()
}

# Build PDF in MemoryStream
# Page size: 16:9 widescreen -> 960 x 540 pt (13.33 in x 7.5 in)
$pageW = 960
$pageH = 540
$imgW = 1920
$imgH = 1080

$pdfStream = New-Object System.IO.MemoryStream
$ascii = [System.Text.Encoding]::ASCII

function Write-PdfStr([string]$s) {
    $bytes = $ascii.GetBytes($s)
    $pdfStream.Write($bytes, 0, $bytes.Length)
}

$offsets = @{}
Write-PdfStr "%PDF-1.4`n"

# Obj 1: Catalog
$offsets[1] = $pdfStream.Position
Write-PdfStr "1 0 obj`n<< /Type /Catalog /Pages 2 0 R >>`nendobj`n"

# Obj 2: Pages
# For each slide i (1..14):
#   Page object ID = 2 + ($i - 1)*3 + 1  (3, 6, 9, ...)
#   Content stream ID = 2 + ($i - 1)*3 + 2 (4, 7, 10, ...)
#   Image XObject ID = 2 + ($i - 1)*3 + 3 (5, 8, 11, ...)
$kidsList = @()
for ($i = 1; $i -le 14; $i++) {
    $pageObjId = 2 + ($i - 1) * 3 + 1
    $kidsList += "$pageObjId 0 R"
}
$kidsStr = $kidsList -join " "
$offsets[2] = $pdfStream.Position
Write-PdfStr "2 0 obj`n<< /Type /Pages /Kids [ $kidsStr ] /Count 14 >>`nendobj`n"

for ($i = 1; $i -le 14; $i++) {
    $pageObjId = 2 + ($i - 1) * 3 + 1
    $contentObjId = 2 + ($i - 1) * 3 + 2
    $imgObjId = 2 + ($i - 1) * 3 + 3
    $jpgBytes = $slideJpegs[$i - 1]

    # Page Object
    $offsets[$pageObjId] = $pdfStream.Position
    Write-PdfStr "$pageObjId 0 obj`n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 $pageW $pageH] /Contents $contentObjId 0 R /Resources << /XObject << /Im$i $imgObjId 0 R >> >> >>`nendobj`n"

    # Content Stream Object (draws image full page)
    $cmd = "q $pageW 0 0 $pageH 0 0 cm /Im$i Do Q"
    $cmdBytes = $ascii.GetBytes($cmd)
    $offsets[$contentObjId] = $pdfStream.Position
    Write-PdfStr "$contentObjId 0 obj`n<< /Length $($cmdBytes.Length) >>`nstream`n"
    $pdfStream.Write($cmdBytes, 0, $cmdBytes.Length)
    Write-PdfStr "`nendstream`nendobj`n"

    # Image XObject
    $offsets[$imgObjId] = $pdfStream.Position
    Write-PdfStr "$imgObjId 0 obj`n<< /Type /XObject /Subtype /Image /Width $imgW /Height $imgH /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length $($jpgBytes.Length) >>`nstream`n"
    $pdfStream.Write($jpgBytes, 0, $jpgBytes.Length)
    Write-PdfStr "`nendstream`nendobj`n"
}

$totalObjs = 2 + 14 * 3
$xrefPos = $pdfStream.Position
Write-PdfStr "xref`n0 $($totalObjs + 1)`n0000000000 65535 f `n"
for ($id = 1; $id -le $totalObjs; $id++) {
    $offStr = "{0:D10} 00000 n `n" -f $offsets[$id]
    Write-PdfStr $offStr
}

Write-PdfStr "trailer`n<< /Size $($totalObjs + 1) /Root 1 0 R >>`nstartxref`n$xrefPos`n%%EOF`n"

[System.IO.File]::WriteAllBytes($pdfPath, $pdfStream.ToArray())
$pdfStream.Dispose()
Write-Output "Created 14-page PDF slide deck: $pdfPath"
