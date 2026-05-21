# 全站注入 lang.css / lang.js（仅追加引用，不修改页面结构与正文）
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

$dirBootstrap = @'
  <!-- kiwl-lang: early dir -->
  <script>(function(){var m=document.cookie.match(/(?:^|; )kiwl_lang=([^;]*)/);var l=m?decodeURIComponent(m[1]):'';if(l==='ar'||l==='fr'){document.documentElement.setAttribute('dir','rtl');document.documentElement.setAttribute('lang','ar');}})();</script>
'@

Get-ChildItem -Path $siteRoot -Include '*.html','*.htm' -Recurse -File | ForEach-Object {
    $text = [System.IO.File]::ReadAllText($_.FullName, $utf8)
    $orig = $text
    $prefix = Get-StaticsPrefix $_.DirectoryName

    $cssHref = "${prefix}statics/css/lang.css"
    $jsSrc = "${prefix}statics/js/lang.js"

    if ($text -notmatch 'lang\.css') {
        if ($text -match '(<link[^>]+site-interactions\.css[^>]*>)') {
            $cssLink = "  <!-- kiwl-lang -->`r`n  <link rel=`"stylesheet`" type=`"text/css`" href=`"$cssHref`" />"
            $text = [regex]::Replace($text, '(<link[^>]+site-interactions\.css[^>]*>)', "`$1`r`n$cssLink", 1)
        } elseif ($text -match '(<link[^>]+responsive\.css[^>]*>)') {
            $cssLink = "  <!-- kiwl-lang -->`r`n  <link rel=`"stylesheet`" type=`"text/css`" href=`"$cssHref`" />"
            $text = [regex]::Replace($text, '(<link[^>]+responsive\.css[^>]*>)', "`$1`r`n$cssLink", 1)
        } elseif ($text -match '(<link[^>]+styles\.css[^>]*>)') {
            $cssLink = "  <!-- kiwl-lang -->`r`n  <link rel=`"stylesheet`" type=`"text/css`" href=`"$cssHref`" />"
            $text = [regex]::Replace($text, '(<link[^>]+styles\.css[^>]*>)', "`$1`r`n$cssLink", 1)
        }
    }

    if ($text -match 'lang\.js' -and $text -notmatch 'kiwl-lang: early dir') {
        if ($text -match '(</head>)') {
            $text = [regex]::Replace($text, '</head>', "$dirBootstrap`r`n</head>", 1)
        }
    }

    if ($text -notmatch 'statics/js/lang\.js') {
        $jsTag = "  <!-- kiwl-lang -->`r`n  <script src=`"$jsSrc`"></script>"
        if ($text -match '(site-interactions\.js[^<]*</script>)') {
            $text = [regex]::Replace($text, '(site-interactions\.js[^<]*</script>)', "`$1`r`n$jsTag", 1)
        } elseif ($text -match '(responsive-nav\.js[^<]*</script>)') {
            $text = [regex]::Replace($text, '(responsive-nav\.js[^<]*</script>)', "`$1`r`n$jsTag", 1)
        } elseif ($text -match '(</body>)') {
            $text = [regex]::Replace($text, '</body>', "$jsTag`r`n</body>", 1)
        }
    }

    if ($text -ne $orig) {
        [System.IO.File]::WriteAllText($_.FullName, $text, $utf8)
        $script:updated++
    }
}

Write-Host "Injected lang switcher into $updated HTML files."
