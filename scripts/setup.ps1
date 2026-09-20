$ErrorActionPreference = 'Stop'
$version = '0.166.0'
$projectRoot = Split-Path -Parent $PSScriptRoot
$toolDir = Join-Path $projectRoot '.tools'
$binary = Join-Path $toolDir 'hugo.exe'
if (Test-Path -LiteralPath $binary) {
    $installedVersion = & $binary version
    if ($installedVersion -match "v$([regex]::Escape($version))\b") {
        Write-Output $installedVersion
        exit 0
    }
}
New-Item -ItemType Directory -Force -Path $toolDir | Out-Null
$archiveName = "hugo_${version}_windows-amd64.zip"
$archive = Join-Path $toolDir $archiveName
$checksums = Join-Path $toolDir 'checksums.txt'
$releaseUrl = "https://github.com/gohugoio/hugo/releases/download/v$version"
Invoke-WebRequest "$releaseUrl/$archiveName" -OutFile $archive -UseBasicParsing
Invoke-WebRequest "$releaseUrl/hugo_${version}_checksums.txt" -OutFile $checksums -UseBasicParsing
$line = Get-Content -LiteralPath $checksums | Where-Object { $_ -match "\s$([regex]::Escape($archiveName))$" }
if (!$line) { throw 'Archive not found in official checksums.' }
$expected = ($line -split '\s+')[0]
if ((Get-FileHash -LiteralPath $archive -Algorithm SHA256).Hash -ne $expected) { throw 'Hugo SHA256 checksum mismatch.' }
Expand-Archive -LiteralPath $archive -DestinationPath $toolDir -Force
& $binary version
