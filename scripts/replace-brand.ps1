$siteRoot = Split-Path $PSScriptRoot -Parent
$jsonPath = Join-Path $PSScriptRoot 'replace-brand.json'
$utf8 = New-Object System.Text.UTF8Encoding $false
$pairs = Get-Content -Path $jsonPath -Encoding UTF8 | ConvertFrom-Json

$files = Get-ChildItem -Path $siteRoot -Include '*.html','*.htm' -Recurse -File
$updated = New-Object System.Collections.Generic.List[string]

foreach ($file in $files) {
    $rel = $file.FullName.Substring($siteRoot.Length).TrimStart('\', '/')
    $text = [System.IO.File]::ReadAllText($file.FullName, $utf8)
    $orig = $text
    foreach ($pair in $pairs) {
        $old = [string]$pair[0]
        $new = [string]$pair[1]
        if ($text.Contains($old)) {
            $text = $text.Replace($old, $new)
        }
    }
    if ($text -ne $orig) {
        [System.IO.File]::WriteAllText($file.FullName, $text, $utf8)
        [void]$updated.Add($rel)
    }
}

$logPath = Join-Path $siteRoot 'scripts\replace-brand-updated.txt'
[System.IO.File]::WriteAllLines($logPath, $updated.ToArray(), $utf8)
Write-Output ('Updated ' + $updated.Count + ' files')
