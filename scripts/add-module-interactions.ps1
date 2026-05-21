# 注入 module-interactions.css / module-interactions.js
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

    $cssHref = "${prefix}statics/css/module-interactions.css"
    $jsSrc = "${prefix}statics/js/module-interactions.js"

    if ($text -notmatch 'module-interactions\.css') {
        if ($text -match '(<link[^>]+site-interactions\.css[^>]*>)') {
            $cssLink = "<link rel=`"stylesheet`" type=`"text/css`" href=`"$cssHref`" />"
            $text = [regex]::Replace($text, '(<link[^>]+site-interactions\.css[^>]*>)', "`$1`r`n  $cssLink", 1)
        } elseif ($text -match '(<link[^>]+responsive\.css[^>]*>)') {
            $cssLink = "<link rel=`"stylesheet`" type=`"text/css`" href=`"$cssHref`" />"
            $text = [regex]::Replace($text, '(<link[^>]+responsive\.css[^>]*>)', "`$1`r`n  $cssLink", 1)
        }
    }

    if ($text -notmatch 'module-interactions\.js') {
        $jsTag = "<script src=`"$jsSrc`"></script>"
        if ($text -match 'module-interactions\.css') {
            $text = [regex]::Replace($text, '(module-interactions\.css[^>]*/>)', "`$0`r`n  $jsTag", 1)
        } elseif ($text -match '(site-interactions\.js[^<]*</script>)') {
            $text = [regex]::Replace($text, '(site-interactions\.js[^<]*</script>)', "`$1`r`n  $jsTag", 1)
        } elseif ($text -match '(</body>)') {
            $text = [regex]::Replace($text, '</body>', "  $jsTag`r`n</body>", 1)
        }
    }

    if ($text -ne $orig) {
        [System.IO.File]::WriteAllText($_.FullName, $text, $utf8)
        $script:updated++
    }
}

Write-Host "Injected module-interactions into $updated HTML files."
