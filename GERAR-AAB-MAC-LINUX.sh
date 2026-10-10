#!/usr/bin/env bash
set -euo pipefail
command -v node >/dev/null || { echo "Instale Node.js LTS"; exit 1; }
command -v npm >/dev/null || { echo "npm não encontrado"; exit 1; }
command -v keytool >/dev/null || { echo "Instale JDK 21"; exit 1; }
npm install -g @bubblewrap/cli
if [ ! -f android.keystore ]; then
  read -rsp "Senha forte para a chave de upload: " PASS; echo
  keytool -genkeypair -v -keystore android.keystore -alias criptoradar -keyalg RSA -keysize 2048 -validity 10000 -storepass "$PASS" -keypass "$PASS" -dname "CN=Cripto Radar, OU=Mobile, O=Cripto Radar, C=BR"
else
  read -rsp "Senha da chave android.keystore: " PASS; echo
fi
export BUBBLEWRAP_KEYSTORE_PASSWORD="$PASS"
export BUBBLEWRAP_KEY_PASSWORD="$PASS"
bubblewrap update --skipVersionUpgrade --manifest=.
bubblewrap build --manifest=.
echo "Pronto: app-release-bundle.aab"
