@echo off
chcp 65001 >nul
setlocal

echo ============================================
echo   CRIPTO RADAR - GERAR AAB PARA PLAY STORE
echo ============================================
echo.
where node >nul 2>&1 || (echo ERRO: instale o Node.js LTS e execute novamente.& pause & exit /b 1)
where npm >nul 2>&1 || (echo ERRO: npm nao encontrado.& pause & exit /b 1)
where keytool >nul 2>&1 || (echo ERRO: instale o JDK 21 e execute novamente.& pause & exit /b 1)

call npm install -g @bubblewrap/cli
if errorlevel 1 goto :erro

if not exist android.keystore (
  echo.
  echo Vamos criar sua CHAVE DE UPLOAD. GUARDE A SENHA E O ARQUIVO android.keystore.
  set /p PASS=Digite uma senha forte para a chave: 
  if "%PASS%"=="" goto :erro
  keytool -genkeypair -v -keystore android.keystore -alias criptoradar -keyalg RSA -keysize 2048 -validity 10000 -storepass "%PASS%" -keypass "%PASS%" -dname "CN=Cripto Radar, OU=Mobile, O=Cripto Radar, C=BR"
  if errorlevel 1 goto :erro
) else (
  set /p PASS=Digite a senha da chave android.keystore: 
)

set BUBBLEWRAP_KEYSTORE_PASSWORD=%PASS%
set BUBBLEWRAP_KEY_PASSWORD=%PASS%

echo.
echo Gerando projeto Android a partir do twa-manifest.json...
call bubblewrap update --skipVersionUpgrade --manifest=.
if errorlevel 1 goto :erro

echo.
echo Gerando APK e AAB...
call bubblewrap build --manifest=.
if errorlevel 1 goto :erro

echo.
echo PRONTO. Procure o arquivo app-release-bundle.aab nesta pasta.
echo Ele e o arquivo para enviar ao Google Play Console.
pause
exit /b 0

:erro
echo.
echo Ocorreu um erro. Veja a mensagem acima.
pause
exit /b 1
