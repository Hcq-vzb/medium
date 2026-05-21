# 顶栏热线英文文案 + 导航两项（UTF-8）
$root = Join-Path $PSScriptRoot ".."
if (-not (Test-Path (Join-Path $root "index.html"))) {
    throw "Site root not found: $root"
}
$root = (Resolve-Path $root).Path

$count = 0
Get-ChildItem -Path $root -Filter *.html -Recurse -File | ForEach-Object {
    $raw = [System.IO.File]::ReadAllText($_.FullName, [System.Text.UTF8Encoding]::new($false))
    $orig = $raw

    $raw = $raw.Replace('<h3>全国服务热线：</h3>', '<h3>全球服务热线：</h3>')
    $raw = $raw.Replace('<h3>24/7 Service Hotline:</h3>', '<h3>全球服务热线：</h3>')
    $raw = $raw.Replace('<h2>全国服务热线：</h2>', '<h2>全球服务热线：</h2>')
    $raw = $raw.Replace('title="在线留言"', 'title="Online Message"')
    $raw = $raw.Replace('title="联系我们"', 'title="Contact Us"')
    $raw = [regex]::Replace($raw, '(href="(?:\.\./)*message/[^"]*">)在线留言</a>', '${1}Online Message</a>')
    $raw = [regex]::Replace($raw, '(href="(?:\.\./)*contactus/[^"]*">)联系我们</a>', '${1}Contact Us</a>')

    if ($raw -ne $orig) {
        [System.IO.File]::WriteAllText($_.FullName, $raw, [System.Text.UTF8Encoding]::new($false))
        $count++
    }
}
Write-Host "Updated $count HTML files."
