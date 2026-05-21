$ErrorActionPreference = 'Stop'
$siteRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$utf8 = New-Object System.Text.UTF8Encoding $false
$old = "(function(){var m=document.cookie.match(/(?:^|; )kiwl_lang=([^;]*)/);var l=m?decodeURIComponent(m[1]):'';if(l==='ar'||l==='fr'){document.documentElement.setAttribute('dir','rtl');document.documentElement.setAttribute('lang','ar');}})();"
$new = "(function(){var l='';try{l=localStorage.getItem('kiwl_lang')||'';}catch(e){}if(!l){var m=document.cookie.match(/(?:^|; )kiwl_lang=([^;]*)/);l=m?decodeURIComponent(m[1]):'';}if(l==='ar'||l==='fr'){document.documentElement.setAttribute('dir','rtl');document.documentElement.setAttribute('lang','ar');}})();"
$updated = 0
Get-ChildItem -Path $siteRoot -Include '*.html' -Recurse -File | ForEach-Object {
  $t = [System.IO.File]::ReadAllText($_.FullName, $utf8)
  if ($t -notmatch [regex]::Escape($old.Substring(0, 40))) { return }
  if ($t -notmatch 'kiwl-lang: early dir') { return }
  $n = $t.Replace($old, $new)
  if ($n -ne $t) {
    [System.IO.File]::WriteAllText($_.FullName, $n, $utf8)
    $script:updated++
  }
}
Write-Host "Patched early dir in $updated files."
