# 全站注入 site-interactions.css / site-interactions.js
$ErrorActionPreference = 'Stop'
$siteRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$utf8 = New-Object System.Text.UTF8Encoding $false
$updated = 0

function Get-StaticsPrefix([string]$fileDir) {
    $rel = $fileDir.Substring($siteRoot.Length).TrimStart('\', '/')
    if ([string]::IsNullOrEmpty($rel)) { return '' }
    $depth = ($rel -split '[\\/]').Count
    if ($depth -le 0) { return '' }
    return ('../' * $depth)
}

Get-ChildItem -Path $siteRoot -Include '*.html','*.htm' -Recurse -File | ForEach-Object {
    $text = [System.IO.File]::ReadAllText($_.FullName, $utf8)
    $orig = $text
    $prefix = Get-StaticsPrefix $_.DirectoryName

    $cssHref = "${prefix}statics/css/site-interactions.css"
    $jsSrc = "${prefix}statics/js/site-interactions.js"

    if ($text -notmatch 'site-interactions\.css') {
        if ($text -match '(<link[^>]+responsive\.css[^>]*>)') {
            $cssLink = "<link rel=`"stylesheet`" type=`"text/css`" href=`"$cssHref`" />"
            $text = [regex]::Replace($text, '(<link[^>]+responsive\.css[^>]*>)', "`$1`r`n  $cssLink", 1)
        } elseif ($text -match '(<link[^>]+styles\.css[^>]*>)') {
            $cssLink = "<link rel=`"stylesheet`" type=`"text/css`" href=`"$cssHref`" />"
            $text = [regex]::Replace($text, '(<link[^>]+styles\.css[^>]*>)', "`$1`r`n  $cssLink", 1)
        }
    }

    if ($text -notmatch 'site-interactions\.js') {
        $jsTag = "<script src=`"$jsSrc`"></script>"
        if ($text -match '(responsive-nav\.js[^<]*</script>)') {
            $text = [regex]::Replace($text, '(responsive-nav\.js[^<]*</script>)', "`$1`r`n  $jsTag", 1)
        } elseif ($text -match '(</body>)') {
            $text = [regex]::Replace($text, '</body>', "  $jsTag`r`n</body>", 1)
        }
    }

    if ($text -ne $orig) {
        [System.IO.File]::WriteAllText($_.FullName, $text, $utf8)
        $script:updated++
    }
}

Write-Host "Injected site-interactions into $updated HTML files."
