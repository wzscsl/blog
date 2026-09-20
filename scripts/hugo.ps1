param([Parameter(ValueFromRemainingArguments = $true)][string[]]$HugoArgs)
$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$localHugo = Join-Path $projectRoot '.tools/hugo.exe'
if (!(Test-Path -LiteralPath $localHugo)) {
    throw 'Hugo not found. Run: powershell -ExecutionPolicy Bypass -File scripts/setup.ps1'
}
Push-Location $projectRoot
try {
    & $localHugo @HugoArgs
    if ($LASTEXITCODE -ne 0) { throw "Hugo failed with exit code $LASTEXITCODE" }
} finally { Pop-Location }
