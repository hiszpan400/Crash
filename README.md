# Crash Offline - Android WebView + wlasne sterowanie dotykowe

Gra "Crash Bandicoot 2D" (klon Cedric-M/crash-bandicoot-2d, Phaser 3)
z dodana nakladka sterowania dotykowego:

- Przeciaganie w dolnej-lewej czesci ekranu = lewo/prawo (strzalki).
- Przycisk A (dol prawy) = skok.
- Przycisk B (nad A) = restart poziomu (oryginalnie trzeba bylo nacisnac F5).
- Silnik Phaser dziala z lokalnej kopii (offline, bez CDN).
- Canvas gry (800x600) skaluje sie automatycznie do pelnego ekranu telefonu.

## Budowanie APK

W folderze crash-apk:

```bash
git init
git add .
git commit -m "Crash offline z wlasnym sterowaniem dotykowym"
git branch -M main
git remote add origin <adres_twojego_repo>
git push -u origin main
```

GitHub Actions zbuduje APK automatycznie - Actions -> ostatni run -> Artifacts
-> crash-offline-apk.
