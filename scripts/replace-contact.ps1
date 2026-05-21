# AIGC START
$ErrorActionPreference = 'Stop'
$siteRoot = Split-Path $PSScriptRoot -Parent
$jsonPath = Join-Path $PSScriptRoot 'replace-contact.json'
$utf8 = New-Object System.Text.UTF8Encoding $false
$pairs = Get-Content -Path $jsonPath -Encoding UTF8 | ConvertFrom-Json

$files = Get-ChildItem -Path $siteRoot -Include '*.html','*.htm' -Recurse -File
$report = New-Object System.Collections.Generic.List[string]
$updatedFiles = New-Object System.Collections.Generic.List[string]

foreach ($file in $files) {
    $rel = $file.FullName.Substring($siteRoot.Length).TrimStart('\', '/')
    $text = [System.IO.File]::ReadAllText($file.FullName, $utf8)
    $orig = $text
    $fileChanges = New-Object System.Collections.Generic.List[string]

    foreach ($pair in $pairs) {
        $old = [string]$pair.old
        $new = [string]$pair.new
        $label = [string]$pair.label
        if ([string]::IsNullOrEmpty($old)) { continue }
        $count = 0
        $idx = 0
        while (($idx = $text.IndexOf($old, $idx)) -ge 0) {
            $count++
            $idx += $old.Length
        }
        if ($count -gt 0) {
            $text = $text.Replace($old, $new)
            [void]$fileChanges.Add(('{0} x{1}' -f $label, $count))
        }
    }

    if ($text -ne $orig) {
        [System.IO.File]::WriteAllText($file.FullName, $text, $utf8)
        [void]$updatedFiles.Add($rel)
        $line = $rel + ' | ' + ($fileChanges -join '; ')
        [void]$report.Add($line)
    }
}

$logList = Join-Path $siteRoot 'scripts\replace-contact-updated.txt'
$logDetail = Join-Path $siteRoot 'scripts\replace-contact-detail.txt'
[System.IO.File]::WriteAllLines($logList, $updatedFiles.ToArray(), $utf8)
[System.IO.File]::WriteAllLines($logDetail, $report.ToArray(), $utf8)
Write-Output ('Updated ' + $updatedFiles.Count + ' files')
# AIGC END
