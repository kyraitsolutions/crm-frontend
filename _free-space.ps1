$ErrorActionPreference = 'Continue'
$out = 'D:\Kyra\crm-frontend\_disk-report.txt'

function Log($m) {
  Add-Content -Path $out -Value $m
}

Set-Content -Path $out -Value "=== disk before ==="
Get-PSDrive -Name C,D | ForEach-Object {
  Log ("{0}: Free={1:N2} GB Used={2:N2} GB" -f $_.Name, ($_.Free/1GB), ($_.Used/1GB))
}

Log "=== npm cache clean ==="
& npm.cmd cache clean --force 2>&1 | ForEach-Object { Log $_ }

$cache = Join-Path $env:LOCALAPPDATA 'npm-cache'
if (Test-Path $cache) {
  Log "=== removing leftover npm-cache ==="
  try {
    Remove-Item -LiteralPath $cache -Recurse -Force -ErrorAction Continue
    Log "removed $cache"
  } catch {
    Log "remove cache error: $_"
  }
}

Log "=== disk after ==="
Get-PSDrive -Name C,D | ForEach-Object {
  Log ("{0}: Free={1:N2} GB Used={2:N2} GB" -f $_.Name, ($_.Free/1GB), ($_.Used/1GB))
}

Log "=== done ==="
