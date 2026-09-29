# ALIKE Testing-Bingo

Mobile Web-App für das ALIKE Product Testing: 16 Testszenarien als 4×4-Karten,
die beim Antippen ein Stück des Zielbildes freigeben. Fortschritt wird lokal
im Browser gespeichert (localStorage), sodass man an einem anderen Tag
weitermachen kann.

## Dateien

| Datei | Zweck |
|---|---|
| `index.html` | Grundgerüst der Seite (Struktur, keine Inhalte zum Anpassen) |
| `style.css` | Aussehen (Farben, Layout, Animationen) |
| `app.js` | **Hier werden Inhalte gepflegt** — siehe unten |
| `assets/winner.jpg` | Das Zielbild, das nach und nach freigeschaltet wird |

## Kartenbezeichnungen & Regeltext ändern

Alles, was du normalerweise anpassen willst, steht **ganz oben in `app.js`**
im Block `CONFIG = { ... }`. Öffne die Datei mit einem Texteditor und suche
nach `ZENTRALE KONFIGURATION`.

### 1. Titel ändern

```js
title: "Testing-Bingo",
```

Einfach den Text in den Anführungszeichen ersetzen.

### 2. Spielregeln ändern

```js
rulesText:
`Teste die angegebenen Szenarien im Zeitraum 6.-9.10. ...

Den Gewinner / die Gewinnerin erwarten ewiger Ruhm, Ehre und eine Überraschung.

Dein ALIKE-Projektteam 🚎`,
```

- Der Text steht zwischen den Backtick-Zeichen `` ` `` (nicht normale
  Anführungszeichen!).
- Eine **leere Zeile** erzeugt einen neuen Absatz.
- Der letzte Absatz wird automatisch fett/rot hervorgehoben (Signatur-Zeile).

### 3. Testszenarien (Kartentexte) ändern

```js
testCases: [
  "Abfahrt von Straßburger Str. 86",
  "Abfahrt von Holzmühlenstr. 15",
  "Mache ein Selfie mit dir und dem Fahrzeug",
  ...
],
```

- Jede Zeile in `""` ist genau eine Karte.
- Die **Reihenfolge entspricht der Position im Raster**, zeilenweise von
  oben links: 1. Eintrag = Karte oben links, 4. Eintrag = Karte oben rechts,
  5. Eintrag = erste Karte der zweiten Zeile usw.
- Es müssen **immer genau `cols × rows` Einträge** vorhanden sein (aktuell
  4 × 4 = 16). Bei Abweichung erscheint eine Warnung in der Browser-Konsole.
- Lange Wörter (z. B. "Friedrich-Ebert-Damm") brechen automatisch korrekt
  um — kein manuelles Einfügen von Zeilenumbrüchen nötig.

### 4. Rastergröße ändern (z. B. mehr/weniger Karten)

```js
cols: 4,
rows: 4,
```

- Muss immer zur Anzahl der Einträge in `testCases` passen
  (`cols × rows = Anzahl Karten`).
- **Wichtig:** Das Zielbild `assets/winner.jpg` sollte im gleichen
  Seitenverhältnis wie `cols:rows` zugeschnitten sein (z. B. bei 4×4
  quadratisch, bei 4×5 hochkant im Verhältnis 4:5). Sonst wirken die
  Bildausschnitte auf den Karten verzerrt oder falsch positioniert.

### 5. Zielbild austauschen

1. Neues Bild als `winner.jpg` in den Ordner `assets/` legen (vorhandene
   Datei wird ersetzt), **oder** einen neuen Dateinamen verwenden und den
   Pfad hier anpassen:
   ```js
   winnerImage: "assets/winner.jpg",
   ```
2. Bild vorher passend zuschneiden (Seitenverhältnis = `cols:rows`, siehe
   Punkt 4). Empfehlung: mind. 1000–1200 px Kantenlänge für gute Schärfe.

### 6. Neue Spielrunde starten (Fortschritt aller Spieler zurücksetzen)

```js
storageKey: "alike-testing-bingo-v3",
```

Den Namen/die Versionsnummer ändern (z. B. `v4`), wenn eine neue Kampagne
starten soll. Dadurch wird für alle Nutzer:innen automatisch wieder bei
0/16 gestartet, alte Spielstände bleiben unberührt im Hintergrund.

## Lokal testen

Im Ordner `Testing-App` einen einfachen Server starten und im Browser
öffnen:

```bash
python3 -m http.server 8000
```

Dann im Browser `http://localhost:8000` aufrufen (am besten die
Mobilansicht der Entwicklertools nutzen, um die mobile Darstellung zu
prüfen).

## Hosting

Die App besteht nur aus statischen Dateien (HTML/CSS/JS + Bild) und kann
direkt auf jedem Static-Hosting-Dienst (z. B. Netlify, Vercel, GitHub
Pages, SharePoint) bereitgestellt werden — es ist kein Server-Backend
nötig.
