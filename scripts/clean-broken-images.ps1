# 全站无效图片扫描与清理（保留可映射到本地的图片路径）
$ErrorActionPreference = 'Stop'
$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$utf8 = New-Object System.Text.UTF8Encoding $false
$report = New-Object System.Collections.Generic.List[object]
$totalRemoved = 0
$totalFixed = 0
$imageExts = @('.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg', '.ico')

function Test-IsImageFile([string]$fullPath) {
    $ext = [IO.Path]::GetExtension($fullPath).ToLowerInvariant()
    return $imageExts -contains $ext
}

function Get-UploadRelativePath([string]$src) {
    if ($src -match '(?:www\.zjgjmx\.(?:com|cn)[/\\]+)?(uploadfile[/\\].+)$') {
        return ($matches[1] -replace '\\', '/')
    }
    if ($src -match 'https?://[^/]+/(uploadfile/.+)$') {
        return $matches[1]
    }
    return $null
}

function Resolve-ImgPath([string]$htmlPath, [string]$src) {
    $src = $src.Trim()
    if ([string]::IsNullOrWhiteSpace($src) -or $src -eq '#' -or $src.StartsWith('javascript:', [StringComparison]::OrdinalIgnoreCase)) {
        return $null
    }
    if ($src -match '^(https?:)?//') {
        $rel = Get-UploadRelativePath $src
        if ($rel) {
            $full = Join-Path $root ($rel.Replace('/', [IO.Path]::DirectorySeparatorChar))
            if ((Test-Path $full) -and (Test-IsImageFile $full)) { return @{ Full = $full; Relative = $rel } }
        }
        return $null
    }
    $htmlDir = Split-Path $htmlPath -Parent
    $candidate = [IO.Path]::GetFullPath((Join-Path $htmlDir ($src -replace '/', [IO.Path]::DirectorySeparatorChar)))
    if ((Test-Path $candidate) -and (Test-IsImageFile $candidate)) {
        return @{ Full = $candidate; Relative = $src }
    }
    $rel = Get-UploadRelativePath $src
    if ($rel) {
        $full = Join-Path $root ($rel -replace '/', [IO.Path]::DirectorySeparatorChar)
        if ((Test-Path $full) -and (Test-IsImageFile $full)) {
            $depth = ($htmlDir.Substring($root.Length).TrimStart('\', '/') -split '[\\/]').Count
            if ($depth -le 0) { $fixedRel = $rel }
            else { $fixedRel = ('../' * $depth) + $rel }
            return @{ Full = $full; Relative = $fixedRel -replace '\\', '/' }
        }
    }
    return $null
}

function Get-RelativePathFromRoot([string]$htmlPath, [string]$fullPath) {
    $htmlDir = Split-Path $htmlPath -Parent
    $rel = $fullPath.Substring($root.Length).TrimStart('\', '/').Replace('\', '/')
    $depth = 0
    if ($htmlDir.Length -gt $root.Length) {
        $depth = ($htmlDir.Substring($root.Length).TrimStart('\', '/') -split '[\\/]').Count
    }
    if ($depth -le 0) { return $rel }
    return ('../' * $depth) + $rel
}

Get-ChildItem -Path $root -Include '*.html','*.htm' -Recurse -File | ForEach-Object {
    $htmlPath = $_.FullName
    $content = [IO.File]::ReadAllText($htmlPath, $utf8)
    $orig = $content
    $removed = 0
    $fixed = 0

    $matches = [regex]::Matches($content, '<img\b[^>]*>', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
    for ($i = $matches.Count - 1; $i -ge 0; $i--) {
        $tag = $matches[$i].Value
        $srcMatch = [regex]::Match($tag, '\bsrc\s*=\s*(["''])(.*?)\1', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
        if (-not $srcMatch.Success) {
            $content = $content.Remove($matches[$i].Index, $matches[$i].Length)
            $removed++
            continue
        }
        $src = $srcMatch.Groups[2].Value
        $resolved = Resolve-ImgPath $htmlPath $src
        if ($null -eq $resolved) {
            $content = $content.Remove($matches[$i].Index, $matches[$i].Length)
            $removed++
            continue
        }
        if ($src -ne $resolved.Relative) {
            $q = $srcMatch.Groups[1].Value
            $newSrc = $resolved.Relative
            $newTag = [regex]::Replace($tag, '\bsrc\s*=\s*(["'']).*?\1', "src=${q}${newSrc}${q}")
            $content = $content.Remove($matches[$i].Index, $matches[$i].Length).Insert($matches[$i].Index, $newTag)
            $fixed++
        }
    }

    # 清理仅含空白/br 的图片容器（img 被删后）
    $content = [regex]::Replace($content, '<div\s+class="img"\s*>\s*</div>', '', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
    $content = [regex]::Replace($content, '<div\s+style="text-align:\s*center;"\s*>\s*</div>', '', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
    $content = [regex]::Replace($content, '<div\s+style="text-align:\s*center;"\s*>\s*&nbsp;\s*</div>', '', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
    $content = [regex]::Replace($content, '<div\s+style="text-align:\s*center;"\s*>\s*<br\s*/?>\s*(?:&nbsp;\s*)?</div>', '', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
    $content = [regex]::Replace($content, '(<div\s+style="text-align:\s*center;"\s*>\s*)<br\s*/?>\s*</div>', '$1</div>', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)

    if ($content -ne $orig) {
        [IO.File]::WriteAllText($htmlPath, $content, $utf8)
        $relPath = $htmlPath.Substring($root.Length).TrimStart('\', '/')
        $report.Add([PSCustomObject]@{
            File = $relPath
            Removed = $removed
            FixedPaths = $fixed
        })
        $script:totalRemoved += $removed
        $script:totalFixed += $fixed
    }
}

$jsonPath = Join-Path $root "scripts\broken-images-report-data.json"
$report | Sort-Object File | ConvertTo-Json -Depth 3 | Out-File -FilePath $jsonPath -Encoding utf8
$meta = @{
    generated = (Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
    filesModified = $report.Count
    removed = $totalRemoved
    fixed = $totalFixed
} | ConvertTo-Json
$metaPath = Join-Path $root "scripts\broken-images-report-meta.json"
$meta | Out-File -FilePath $metaPath -Encoding utf8
Write-Host "Modified $($report.Count) files. Removed: $totalRemoved, Fixed: $totalFixed"
Write-Host "Data: $jsonPath"
