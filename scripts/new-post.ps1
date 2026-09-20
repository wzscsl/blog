param(
    [Parameter(Mandatory = $true)][ValidatePattern('^[a-z0-9]+(?:-[a-z0-9]+)*$')][string]$Slug,
    [ValidateSet('agent', 'engineering', 'backend')][string]$Area = 'agent'
)
$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$sectionDir = Join-Path $projectRoot "content/posts/$Area"
$sectionIndex = Join-Path $sectionDir '_index.md'
if (!(Test-Path -LiteralPath $sectionIndex)) {
    New-Item -ItemType Directory -Path $sectionDir -Force | Out-Null
    [System.IO.File]::WriteAllText($sectionIndex, "---`ntitle: $Area`n---`n", (New-Object System.Text.UTF8Encoding $false))
}
& (Join-Path $PSScriptRoot 'hugo.ps1') new content "posts/$Area/$Slug/index.md"
Write-Output "Edit content/posts/$Area/$Slug/index.md; set draft to false when ready."
