# AIGC START
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$utf8 = New-Object System.Text.UTF8Encoding $false
$pattern = '(?s)(\s*<div[^>]*class="logo_bx"[^>]*>.*?</motion>)\s*(<div class="logo_desc">.*?</div>)'
$pattern = '(?s)(\s*<div[^>]*class="logo_bx"[^>]*>.*?</div>)\s*(<div class="logo_desc">.*?</div>)'
$updated = 0
$skipped = 0

Get-ChildItem -Path $root -Filter '*.html' -Recurse -File | ForEach-Object {
    $raw = [System.IO.File]::ReadAllText($_.FullName, $utf8)
    if ($raw -match 'class="brand_group"') {
        $script:skipped++
        return
    }
    if ($raw -notmatch 'class="logo_desc"') {
        return
    }
    $m = [regex]::Match($raw, $pattern)
    if (-not $m.Success) {
        return
    }
    $indent = '      '
    if ($m.Groups[1].Value -match '^(?<ind>\s*)') {
        $indent = $Matches.ind
        if ([string]::IsNullOrWhiteSpace($indent)) { $indent = '      ' }
    }
    $g1 = $m.Groups[1].Value.TrimEnd()
    $g2 = $m.Groups[2].Value.Trim()
    $open = $indent + '<motion class="brand_group">'
    $open = $indent + '<div class="brand_group">'
    $close = $indent + '</div>'
    $block = $open + "`n" + $g1 + "`n" + $indent + $g2 + "`n" + $close
    $new = $raw.Remove($m.Index, $m.Length).Insert($m.Index, $block)
    [System.IO.File]::WriteAllText($_.FullName, $new, $utf8)
    $script:updated++
}

Write-Output "Wrapped brand_group in $updated files, skipped $skipped"
# AIGC END
