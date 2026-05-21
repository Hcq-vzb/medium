# AIGC START
$ErrorActionPreference = 'Stop'
$siteRoot = Split-Path $PSScriptRoot -Parent
$utf8 = New-Object System.Text.UTF8Encoding $false

$szgsScript = '<script>var szgs_protocol = (("https:" == document.location.protocol) ? "https://" : "http://");document.write(unescape("%3C/script%3E%3Cspan id=''szgs_stat_icon_1413405232511057920''%3E%3C/span%3E%3Cscript src=''"+szgs_protocol+"www.beian.suzhou.gov.cn/sendMark?siteid=1413405232511057920&type=1'' type=''text/javascript''%3E%3C/script%3E"));</script>'

# Match entire ICP + tech-support paragraph (any whitespace / line breaks inside)
$icpPattern = '(?s)<p><a href="https://beian\.miit\.gov\.cn/">.*?</p>'

$literalRemovals = @(
    ' <p><a href="https://beian.miit.gov.cn/">苏ICP备17040775号-1</a>&nbsp; &nbsp;&nbsp;技术支持：<a href="http://www.rfkjok.com/">瑞风科技</a></p>  ',
    ' <p><a href="https://beian.miit.gov.cn/">苏ICP备17040775号-1</a>&nbsp; &nbsp;&nbsp;技术支持：<a href="http://www.rfkjok.com/">瑞风科技</a></p> ',
    '<p><a href="https://beian.miit.gov.cn/">苏ICP备17040775号-1</a>&nbsp; &nbsp;&nbsp;技术支持：<a href="http://www.rfkjok.com/">瑞风科技</a></p>  ',
    '<p><a href="https://beian.miit.gov.cn/">苏ICP备17040775号-1</a>&nbsp; &nbsp;&nbsp;技术支持：<a href="http://www.rfkjok.com/">瑞风科技</a></p> '
)

$files = Get-ChildItem -Path $siteRoot -Include '*.html','*.htm' -Recurse -File
$updated = 0

foreach ($file in $files) {
    $text = [System.IO.File]::ReadAllText($file.FullName, $utf8)
    $orig = $text

    if ($text.Contains($szgsScript)) {
        $text = $text.Replace($szgsScript, '')
    }

    foreach ($lit in $literalRemovals) {
        if ($text.Contains($lit)) {
            $text = $text.Replace($lit, '')
        }
    }

    $text = [regex]::Replace($text, $icpPattern, '')

    if ($text -ne $orig) {
        [System.IO.File]::WriteAllText($file.FullName, $text, $utf8)
        $updated++
    }
}

Write-Output ("Updated $updated files")
# AIGC END
