# AIGC START
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot

$slogan = @'
      <div class="logo_desc">
        <p class="logo_desc_line1">致力于提供灌装机、饮料机理想解决方案</p>
        <p class="logo_desc_line2">15年研发生产经验 产品可按需定制</p>
      </div>
'@

$pattern = '(logo\.jpg"(?:\s+width="537"\s+height="55")?\s*/>\s*</a>\s*</div>)\s*(<motion class="hotline">)'
$pattern = '(logo\.jpg"(?:\s+width="537"\s+height="55")?\s*/>\s*</a>\s*</div>)\s*(<div class="hotline">)'
$updated = 0
$skipped = 0

Get-ChildItem -Path $root -Filter '*.html' -Recurse -File | ForEach-Object {
    $raw = [System.IO.File]::ReadAllText($_.FullName, [System.Text.UTF8Encoding]::new($false))
    if ($raw -match 'class="logo_desc"') {
        $script:skipped++
        return
    }
    if ($raw -notmatch 'class="logo_bx"') {
        return
    }
    if ($raw -notmatch $pattern) {
        return
    }
    $new = [regex]::Replace($raw, $pattern, "`$1`r`n$slogan`r`n      `$2", 1)
    if ($new -eq $raw) {
        return
    }
    [System.IO.File]::WriteAllText($_.FullName, $new, [System.Text.UTF8Encoding]::new($false))
    $script:updated++
}

Write-Output "Updated: $updated, Skipped: $skipped"
# AIGC END
