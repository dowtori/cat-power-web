param([string]$GameRoot = (Join-Path $PSScriptRoot '../../cat-power'))
$ErrorActionPreference = 'Stop'
$siteRoot = Split-Path $PSScriptRoot
$version = (Get-Content -LiteralPath (Join-Path $GameRoot 'VERSION.txt') -Raw).Trim()
if ($version -notmatch '^\d+\.\d+\.\d+$') { throw 'Invalid game version' }
$build = Join-Path $GameRoot "out/$version"
$exeName = "CatPower-v$version.exe"
$manifest = Get-Content -LiteralPath (Join-Path $build "$exeName.manifest.json") -Raw | ConvertFrom-Json
if ($manifest.Version -ne $version -or $manifest.Executable -ne $exeName) { throw 'Build version mismatch' }
if ((Get-FileHash -LiteralPath (Join-Path $build $exeName)).Hash -ne $manifest.BinaryHash) { throw 'Binary hash mismatch' }
$dataPath = Join-Path $siteRoot 'content/releases.json'
$data = Get-Content -LiteralPath $dataPath -Raw | ConvertFrom-Json
if ($data.releases[0].version -ne $version) { throw 'Add release notes for the current version first' }
$destination = Join-Path $siteRoot 'artifacts'
New-Item -ItemType Directory -Force -Path $destination | Out-Null
$stage = Join-Path $destination ("package-$version-" + [Guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $stage | Out-Null
Copy-Item -LiteralPath (Join-Path $build $exeName) -Destination $stage
Copy-Item -LiteralPath (Join-Path $build 'assets') -Destination $stage -Recurse
$files = @([ordered]@{ path = $exeName; sha256 = $manifest.BinaryHash.ToLowerInvariant() })
foreach ($asset in $manifest.Assets) {
    $normalized = $asset.Path.Replace('\','/')
    $marker = $normalized.LastIndexOf('/assets/')
    if ($marker -lt 0) { throw 'Invalid asset path in manifest' }
    $relative = $normalized.Substring($marker + 1)
    if ($relative.Contains('..')) { throw 'Unsafe asset path' }
    $hash = (Get-FileHash -LiteralPath (Join-Path $stage $relative)).Hash
    if ($hash -ne $asset.Hash) { throw "Asset hash mismatch: $relative" }
    $files += [ordered]@{ path = $relative; sha256 = $hash.ToLowerInvariant() }
}
[ordered]@{ version=$version; channel=$data.releases[0].channel; files=$files } | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath (Join-Path $stage 'manifest.json') -Encoding utf8
@"
냥력발전소 v$version 개발판

ZIP 전체를 새 폴더에 압축 해제하고 $exeName 파일을 실행하세요.
assets 폴더를 실행 파일과 함께 두세요. Windows / .NET Framework 4.x가 필요합니다.
업데이트 전에는 이전 게임을 트레이에서 종료하세요.
저장: %LOCALAPPDATA%/CatPower/companion-reboot/save.json
공식 배포: https://github.com/$($data.repository)/releases/tag/v$version
개발판은 정식 출시 전 버전으로 게임 내용과 밸런스가 바뀔 수 있습니다.
"@ | Set-Content -LiteralPath (Join-Path $stage '시작하기.txt') -Encoding utf8
$zipName = "CatPower-v$version-windows.zip"
$zip = Join-Path $destination $zipName
if (Test-Path -LiteralPath $zip) { throw 'Release ZIP already exists; do not overwrite a versioned artifact' }
Compress-Archive -Path (Join-Path $stage '*') -DestinationPath $zip -CompressionLevel Optimal
$hash = (Get-FileHash -LiteralPath $zip).Hash.ToLowerInvariant()
"$hash  $zipName" | Set-Content -LiteralPath (Join-Path $destination "CatPower-v$version-SHA256SUMS.txt") -Encoding ascii
$metadata = [ordered]@{ url="https://github.com/$($data.repository)/releases/download/v$version/$zipName"; bytes=(Get-Item -LiteralPath $zip).Length; sha256=$hash }
# Write staged metadata only. Activate the download after the GitHub release is published and verified.
$metadata | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $destination "download-$version.json") -Encoding utf8
Write-Output "Verified $($files.Count) files. ZIP: $zip"
Write-Output ($metadata | ConvertTo-Json -Compress)
