# Inject viewport + responsive.css + responsive-nav.js into all HTML pages
$ErrorActionPreference = 'Stop'
$siteRoot = (Resolve-Path (Split-Path $PSScriptRoot -Parent)).Path
$utf8 = New-Object System.Text.UTF8Encoding $false

$viewport = '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />'
$updated = 0

function Get-StaticsPrefix([string]$fileDir) {
    $rel = $fileDir.Substring($siteRoot.Length).TrimStart('\', '/')
    if ([string]::IsNullOrEmpty($rel)) { return '' }
    $depth = ($rel -split '[\\/]').Count
    if ($depth -le 0) { return '' }
    return ('../' * $depth)
}

$files = Get-ChildItem -Path $siteRoot -Include '*.html','*.htm' -Recurse -File

foreach ($file in $files) {
    $text = [System.IO.File]::ReadAllText($file.FullName, $utf8)
    $orig = $text
    $prefix = Get-StaticsPrefix $file.DirectoryName

    if ($text -notmatch 'name=["'']viewport["'']') {
        if ($text -match '(<meta[^>]+charset[^>]*>)') {
            $text = [regex]::Replace($text, '(<meta[^>]+charset[^>]*>)', "`$1`r`n  $viewport", 1)
        } elseif ($text -match '(<head[^>]*>)') {
            $text = [regex]::Replace($text, '(<head[^>]*>)', "`$1`r`n  $viewport", 1)
        }
    }

    $cssHref = "${prefix}statics/css/responsive.css"
    $jsSrc = "${prefix}statics/js/responsive-nav.js"

    if ($text -notmatch 'responsive\.css') {
        if ($text -match '(<link[^>]+styles\.css[^>]*>)') {
            $cssLink = "<link rel=`"stylesheet`" type=`"text/css`" href=`"$cssHref`" />"
            $text = [regex]::Replace($text, '(<link[^>]+styles\.css[^>]*>)', "`$1`r`n  $cssLink", 1)
        } elseif ($text -match '(</head>)') {
            $cssLink = "<link rel=`"stylesheet`" type=`"text/css`" href=`"$cssHref`" />"
            $text = [regex]::Replace($text, '</head>', "  $cssLink`r`n</head>", 1)
        }
    }

    if ($text -notmatch 'responsive-nav\.js') {
        $jsTag = "<script src=`"$jsSrc`"></script>"
        if ($text -match '(</body>)') {
            $text = [regex]::Replace($text, '</body>', "  $jsTag`r`n</body>", 1)
        }
    }

    if ($text -ne $orig) {
        [System.IO.File]::WriteAllText($file.FullName, $text, $utf8)
        $updated++
    }
}

Write-Host "Updated $updated HTML files with viewport + responsive assets"
