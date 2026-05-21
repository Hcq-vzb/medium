# Inject kiwl-i18n-en-ar.js before lang.js on all HTML pages

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

    $coreSrc = "${prefix}statics/js/kiwl-i18n-core-ar.js"

    $jsSrc = "${prefix}statics/js/kiwl-i18n-en-ar.js"

    $wfSrc = "${prefix}statics/js/kiwl-ar-word-fallback.js"
    $tag = "  <!-- kiwl-i18n -->`r`n  <script src=`"$wfSrc`"></script>`r`n  <script src=`"$coreSrc`"></script>`r`n  <script src=`"$jsSrc`"></script>"



    if ($text -match 'lang\.js' -and $text -notmatch 'kiwl-i18n-en-ar\.js') {

        $text = [regex]::Replace($text, '(<!-- kiwl-lang -->\s*\r?\n\s*<script src="[^"]*lang\.js"></script>)', "$tag`r`n`$1", 1)

        if ($text -eq $orig) {

            $text = [regex]::Replace($text, '(<script src="[^"]*lang\.js"></script>)', "$tag`r`n  `$1", 1)

        }

    }



    if ($text -ne $orig) {

        [System.IO.File]::WriteAllText($_.FullName, $text, $utf8)

        $script:updated++

    }

}



Write-Host "Injected kiwl-i18n-en-ar.js into $updated HTML files."


