<#
  Заливка dist/ на боевой хостинг по SFTP.

  Доступы в репозитории не хранятся: адрес и логин передаются параметрами,
  пароль спрашивает сам sftp. Заливаем только добавлением и перезаписью,
  ничего не удаляя (рядом лежит чужой .envrc). Тяжёлые видео из videos/
  пропускаем, если не указан -WithVideos: они меняются редко, а весят 25 МБ.

  Использование:
    .\scripts\deploy.ps1 -Target user@host -Port 2222
    .\scripts\deploy.ps1 -Target user@host -Port 2222 -WithVideos
    .\scripts\deploy.ps1 -Target user@host -Port 2222 -RemoteDir domains/example.com -SkipBuild
#>
param(
  [Parameter(Mandatory = $true)] [string] $Target,
  [Parameter(Mandatory = $true)] [int] $Port,
  [string] $RemoteDir = 'domains/robbox.tech',
  [switch] $WithVideos,
  [switch] $SkipBuild
)

$ErrorActionPreference = 'Stop'
Set-Location (Join-Path $PSScriptRoot '..')

if (-not $SkipBuild) {
  npm run build
  if ($LASTEXITCODE -ne 0) { throw 'Сборка не удалась, заливать нечего.' }
}

$dist = 'dist'

# Порядок важен: сначала бандлы и медиа, index.html — последним, чтобы страница
# ни на секунду не ссылалась на ещё не залитый бандл.
$files = @()
$files += Get-ChildItem "$dist/assets" -File | ForEach-Object { "assets/$($_.Name)" }
$files += Get-ChildItem $dist -File | Where-Object { $_.Name -ne 'index.html' } | ForEach-Object { $_.Name }
if ($WithVideos) {
  $files += Get-ChildItem "$dist/videos" -File | ForEach-Object { "videos/$($_.Name)" }
}
$files += 'index.html'

# Первый ls проверяет, что каталог существует: в пакетном режиме любая ошибка
# прерывает sftp, и ничего не уедет не туда. Команды с «-» ошибок не боятся.
$lines = @("ls -l $RemoteDir", "cd $RemoteDir", '-mkdir assets')
if ($WithVideos) { $lines += '-mkdir videos' }
# Windows-клиент sftp кладёт файлы с правами 666, поэтому сразу выставляем 644.
foreach ($file in $files) {
  $lines += "put $dist/$file $file"
  $lines += "chmod 644 $file"
}
$lines += 'ls -l', 'ls -l assets', 'ls -l videos'

$batch = New-TemporaryFile
Set-Content -Path $batch.FullName -Value $lines -Encoding ascii

Write-Host "Заливаем $($files.Count) файлов -> $Target`:$RemoteDir"
$files | ForEach-Object { Write-Host "  $_" }

# sftp -b сам включает BatchMode и тем отключает ввод пароля. Явный -o BatchMode=no,
# поставленный раньше -b, возвращает запрос пароля (ssh берёт первое значение опции),
# а пакетный режим оставляет главное: остановку на первой ошибке.
sftp -o BatchMode=no -o StrictHostKeyChecking=accept-new -P $Port -b $batch.FullName $Target
$code = $LASTEXITCODE
Remove-Item $batch.FullName -ErrorAction SilentlyContinue

if ($code -ne 0) { throw "sftp завершился с кодом $code — смотрите вывод выше." }
Write-Host 'Готово. Проверяйте сайт живым запросом, не через кеширующие прокси.'
