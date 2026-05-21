# 全站移除 lang.css / lang.js 及 kiwl-lang 注释（还原多语言注入）
$ErrorActionPreference = 'Stop'
$siteRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$utf8 = New-Object System.Text.UTF8Encoding $false
$updated = 0

Get-ChildItem -Path $siteRoot -Include '*.html','*.htm' -Recurse -File | ForEach-Object {
    $text = [System.IO.File]::ReadAllText($_.FullName, $utf8)
    $orig = $text

    $text = [regex]::Replace($text, '\r?\n\s*<!-- kiwl-lang(?::[^>]*)? -->\s*', "`r`n", 'IgnoreCase')
    $text = [regex]::Replace($text, '\r?\n\s*<link[^>]+lang\.css[^>]*>\s*', "`r`n", 'IgnoreCase')
    $text = [regex]::Replace(
        $text,
        '\r?\n\s*<!-- kiwl-lang: early RTL from cookie -->\s*\r?\n\s*<script>\(function\(\)\{var m=document\.cookie\.match\([^<]+</script>\s*',
        "`r`n",
        'IgnoreCase'
    )
    $text = [regex]::Replace($text, '\r?\n\s*<script[^>]+lang\.js[^<]*</script>\s*', "`r`n", 'IgnoreCase')

    if ($text -ne $orig) {
        [System.IO.File]::WriteAllText($_.FullName, $text, $utf8)
        $script:updated++
    }
}

Write-Host "Removed lang switcher from $updated HTML files."
