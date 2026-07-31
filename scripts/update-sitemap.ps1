$ErrorActionPreference = 'Stop'

$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$SitemapPath = Join-Path $RepoRoot 'public\sitemap.xml'

[xml]$xml = Get-Content -Raw -LiteralPath $SitemapPath
$ns = New-Object System.Xml.XmlNamespaceManager($xml.NameTable)
$ns.AddNamespace('s', 'http://www.sitemaps.org/schemas/sitemap/0.9')

$staticMap = @{
  '/' = 'src\pages\index.astro'
  '/gases/' = 'src\pages\gases\index.astro'
  '/gas-mixtures/' = 'src\pages\gas-mixtures\index.astro'
  '/specialty-gases/' = 'src\pages\specialty-gases\index.astro'
  '/refrigerants/' = 'src\pages\refrigerants\index.astro'
  '/cryogenic/' = 'src\pages\cryogenic\index.astro'
  '/equipment/' = 'src\pages\equipment\index.astro'
  '/fire-safety/' = 'src\pages\fire-safety\index.astro'
  '/balloons/' = 'src\pages\balloons\index.astro'
  '/industries/' = 'src\pages\industries\index.astro'
  '/about/' = 'src\pages\about.astro'
  '/quality-and-safety/' = 'src\pages\quality-and-safety.astro'
  '/contact/' = 'src\pages\contact.astro'
}

function Get-SourcePath([string]$pathname) {
  if ($staticMap.ContainsKey($pathname)) {
    return $staticMap[$pathname]
  }
  $parts = $pathname.Trim('/').Split('/')
  if ($parts.Count -eq 2) {
    $dir, $slug = $parts
    $jsonDir = Join-Path $RepoRoot "src\content\$dir"
    if (Test-Path -LiteralPath $jsonDir) {
      foreach ($file in Get-ChildItem -LiteralPath $jsonDir -Filter '*.json') {
        $data = Get-Content -Raw -LiteralPath $file.FullName | ConvertFrom-Json
        if ($data.slug -eq $slug) {
          return "src\content\$dir\$($file.Name)"
        }
      }
    }
  }
  throw "No source file mapping for sitemap URL path: $pathname"
}

$nodes = $xml.SelectNodes('//s:url', $ns)
$count = 0
foreach ($node in $nodes) {
  $locNode = $node.SelectSingleNode('s:loc', $ns)
  $pathname = ([System.Uri]$locNode.InnerText).AbsolutePath
  $source = Get-SourcePath $pathname
  $fullPath = Join-Path $RepoRoot $source
  if (-not (Test-Path -LiteralPath $fullPath)) {
    throw "Source file not found: $fullPath"
  }
  $lastmod = (Get-Item -LiteralPath $fullPath).LastWriteTimeUtc.ToString('yyyy-MM-dd')
  $lastmodNode = $node.SelectSingleNode('s:lastmod', $ns)
  if ($null -eq $lastmodNode) {
    $lastmodNode = $xml.CreateElement('lastmod', 'http://www.sitemaps.org/schemas/sitemap/0.9')
    $node.InsertAfter($lastmodNode, $locNode) | Out-Null
  }
  $lastmodNode.InnerText = $lastmod
  $count++
}

$settings = New-Object System.Xml.XmlWriterSettings
$settings.Indent = $true
$settings.IndentChars = '  '
$settings.Encoding = [System.Text.UTF8Encoding]::new($false)
$writer = [System.Xml.XmlWriter]::Create($SitemapPath, $settings)
$xml.Save($writer)
$writer.Close()

Write-Host "Updated lastmod for $count URLs in public\sitemap.xml"
