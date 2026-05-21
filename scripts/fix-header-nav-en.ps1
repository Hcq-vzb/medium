# 顶栏导航改为英文 + 热线英文（仅替换固定文案，不改结构与 class="cur"）
$ErrorActionPreference = 'Stop'
$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$utf8 = New-Object System.Text.UTF8Encoding $false
$count = 0

$pairs = @(
    @('title="网站首页"', 'title="Home"'),
    @('>网站首页</a>', '>Home</a>'),
    @('title="关于我们"', 'title="About Us"'),
    @('>关于我们</a>', '>About Us</a>'),
    @('title="产品中心"', 'title="Products"'),
    @('>产品中心</a>', '>Products</a>'),
    @('title="新闻动态"', 'title="News"'),
    @('>新闻动态</a>', '>News</a>'),
    @('title="技术支持"', 'title="Support"'),
    @('>技术支持</a>', '>Support</a>'),
    @('title="客户案例"', 'title="Case Studies"'),
    @('>客户案例</a>', '>Case Studies</a>'),
    @('<h3>全球服务热线：</h3>', '<h3>Global Service Hotline:</h3>'),
    @('<h3>全球服务热线</h3>', '<h3>Global Service Hotline:</h3>'),
    @('<h3>24/7 Service Hotline:</h3>', '<h3>Global Service Hotline:</h3>'),
    @('title="Technical Support"', 'title="Support"'),
    @('>Technical Support</a>', '>Support</a>')
)

Get-ChildItem -Path $root -Filter *.html -Recurse -File | ForEach-Object {
    $raw = [System.IO.File]::ReadAllText($_.FullName, $utf8)
    $orig = $raw
    foreach ($p in $pairs) {
        $raw = $raw.Replace($p[0], $p[1])
    }
    if ($raw -ne $orig) {
        [System.IO.File]::WriteAllText($_.FullName, $raw, $utf8)
        $script:count++
    }
}

Write-Host "Updated header nav/hotline in $count HTML files."
