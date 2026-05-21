# AIGC START
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$jsonPath = Join-Path $PSScriptRoot 'logo-desc.json'
$utf8 = New-Object System.Text.UTF8Encoding $false
$data = Get-Content -Path $jsonPath -Encoding UTF8 | ConvertFrom-Json

$nl = [Environment]::NewLine
$block = '      <div class="logo_desc">' + $nl +
         '        <p class="logo_desc_line1">' + $data.line1 + '</p>' + $nl +
         '        <p class="logo_desc_line2">' + $data.line2 + '</p>' + $nl +
         '      </div>'

$pattern = '(?s)\s*<div class="logo_desc">.*?</motion>\s*(?=<div class="hotline">)'
$pattern = '(?s)\s*<motion class="logo_desc">.*?</motion>\s*(?=<div class="hotline">)'
$pattern = '(?s)\s*<div class="logo_desc">.*?</div>\s*(?=<div class="hotline">)'
$updated = 0

Get-ChildItem -Path $root -Filter '*.html' -Recurse -File | ForEach-Object {
    $raw = [System.IO.File]::ReadAllText($_.FullName, $utf8)
    if ($raw -notmatch 'class="logo_desc"') {
        return
    }
    $new = [regex]::Replace($raw, $pattern, $nl + $block + $nl + '      ', 1)
    if ($new -eq $raw) {
        return
    }
    [System.IO.File]::WriteAllText($_.FullName, $new, $utf8)
    $script:updated++
}

Write-Output "Fixed logo_desc text in $updated files"
# AIGC END
