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
  if ($text -notmatch 'kiwl-i18n-en-ar\.js') { return }
  if ($text -match 'kiwl-i18n-core-ar\.js') { return }
  $prefix = Get-StaticsPrefix $_.DirectoryName
  $coreTag = '<script src="' + $prefix + 'statics/js/kiwl-i18n-core-ar.js"></script>'
  $text = $text -replace '(<script src="[^"]*kiwl-i18n-en-ar\.js"></script>)', ($coreTag + ' $1')
  [System.IO.File]::WriteAllText($_.FullName, $text, $utf8)
  $script:updated++
}
Write-Host "Injected core-ar into $updated files."
