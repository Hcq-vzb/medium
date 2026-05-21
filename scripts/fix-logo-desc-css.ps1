$p = Join-Path (Split-Path -Parent $PSScriptRoot) 'statics\css\styles.css'
$utf8 = New-Object System.Text.UTF8Encoding $false
$t = [IO.File]::ReadAllText($p, $utf8)
$t = $t -replace '(?m)^\s*font-family: "[^"]+", "Microsoft YaHei", Arial, sans-serif;\r?\n', ''
[IO.File]::WriteAllText($p, $t, $utf8)
Write-Output 'done'
