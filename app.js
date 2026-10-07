// =====================================================================
// ALIKE TESTING-BINGO — ZENTRALE KONFIGURATION
// =====================================================================
// Alles, was du für eine neue Runde/Kampagne anpassen willst, steht in
// diesem CONFIG-Objekt. Änderungen hier -> reicht, um Titel, Regeltext,
// Testszenarien oder das Zielbild-Raster umzustellen. Keine weiteren
// Codeänderungen in index.html / style.css nötig.
// =====================================================================

const CONFIG = {

  // ---- Kopfbereich -----------------------------------------------------
  title: "ALIKE Testing-Bingo",

  // Regeltext (Spielregeln). \n erzeugt einen Absatz-/Zeilenumbruch.
  // Wird 1:1 (mit Zeilenumbrüchen) unter dem Titel angezeigt.
  rulesText:
`Teste die angegebenen Szenarien im Zeitraum 12.-16.10. Nach jedem erfolgreichen Test musst du die Karte umdrehen (durch anklicken), um ein Stück vom Zielbild freizulegen. Ein Stop kann umgedreht werden, wenn deine Fahrt dort entweder beginnt oder endet. Sende uns dein finales Bild als Screenshot an alike@hochbahn.de

Den Gewinner / die Gewinnerin erwarten ewiger Ruhm, Ehre und eine Überraschung!

Dein ALIKE-Projektteam 🚎`,

  // ---- Raster-Layout -----------------------------------------------------
  // Spalten x Reihen des Testcase-/Bildrasters. Aktuell 4 Spalten x 4 Reihen
  // = 16 Karten. Muss zur Anzahl der Einträge in "testCases" passen und
  // zum Seitenverhältnis von assets/winner.jpg (Breite:Höhe = COLS:ROWS).
  cols: 4,
  rows: 4,

  // ---- Testszenarien -----------------------------------------------------
  // HIER die Testcases eintragen/ändern. Ein Eintrag = eine Karte.
  // Reihenfolge = Position im Raster (zeilenweise von oben-links, also
  // Karte 1 = Zeile 1 Spalte 1, Karte 2 = Zeile 1 Spalte 2, usw.).
  // Anzahl MUSS exakt cols * rows (aktuell 16) ergeben.
  testCases: [
    "Straßburger Str. 86 besucht",
    "Holzmühlenstr. 15 besucht",
    "Mache ein Selfie mit dir und dem Fahrzeug",
    "Oberaltenallee 44 besucht",
    "Wagnerstraße 25 besucht",
    "Pooling mit 2 anderen Personen",
    "Wandsbeker Chaussee 273 besucht",
    "Pooling mit 1 anderen Person",
    "Hamburger Straße 176 besucht",
    "Friedrich-Ebert-Damm 19A besucht",
    "Erfolgreiches Überholen eines HOCHBAHN Busses",
    "Nordschleswiger Straße 78 besucht",
    "Walddörferstraße 34 besucht",
    "Dreimal Linksabbiegen ohne Eingriff",
    "Dehnhaide 73 besucht",
    "Wandsbeker Chaussee 95 besucht"
  ],

  // ---- Zielbild -----------------------------------------------------
  // Pfad zum Gewinnerbild. Seitenverhältnis sollte cols:rows entsprechen
  // (z.B. bei 4x4 also quadratisch, wie z.B. 1200x1200px).
  winnerImage: "assets/winner.jpg",

  // ---- Storage -----------------------------------------------------
  // Schlüssel für localStorage. Bei neuer Kampagne/Runde ändern,
  // damit alte Spielstände nicht mit neuen Karten kollidieren.
  storageKey: "alike-testing-bingo-v3"
};

// =====================================================================
// AB HIER: App-Logik (in der Regel keine Anpassung nötig)
// =====================================================================

const GRID_COLS = CONFIG.cols;
const GRID_ROWS = CONFIG.rows;
const TOTAL_CARDS = GRID_COLS * GRID_ROWS;

if (CONFIG.testCases.length !== TOTAL_CARDS) {
  console.warn(
    `Warnung: CONFIG.testCases hat ${CONFIG.testCases.length} Einträge, ` +
    `erwartet werden aber ${TOTAL_CARDS} (cols=${GRID_COLS} x rows=${GRID_ROWS}).`
  );
}

function loadState() {
  try {
    const raw = localStorage.getItem(CONFIG.storageKey);
    if (!raw) return Array(TOTAL_CARDS).fill(false);
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length === TOTAL_CARDS) return parsed;
  } catch (e) {}
  return Array(TOTAL_CARDS).fill(false);
}

function saveState(state) {
  localStorage.setItem(CONFIG.storageKey, JSON.stringify(state));
}

let state = loadState();

const titleEl = document.getElementById("appTitle");
const rulesEl = document.getElementById("rulesText");
const grid = document.getElementById("grid");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const resetBtn = document.getElementById("resetBtn");
const winModal = document.getElementById("winModal");
const closeModal = document.getElementById("closeModal");
const fullImage = document.getElementById("fullImage");

function renderHeader() {
  titleEl.textContent = CONFIG.title;
  // Regeltext mit Zeilenumbrüchen als Absätze darstellen
  rulesEl.innerHTML = CONFIG.rulesText
    .split("\n\n")
    .map(p => `<p>${p.replace(/\n/g, "<br>")}</p>`)
    .join("");
}

function render() {
  grid.style.setProperty("--cols", GRID_COLS);
  grid.innerHTML = "";

  CONFIG.testCases.forEach((label, i) => {
    const col = i % GRID_COLS;
    const row = Math.floor(i / GRID_COLS);
    const posX = GRID_COLS === 1 ? 0 : (col / (GRID_COLS - 1)) * 100;
    const posY = GRID_ROWS === 1 ? 0 : (row / (GRID_ROWS - 1)) * 100;

    const card = document.createElement("div");
    card.className = "card" + (state[i] ? " flipped" : "");
    card.dataset.index = i;

    card.innerHTML = `
      <div class="card-inner">
        <div class="card-face card-front">${label}</div>
        <div class="card-face card-back" style="background-image:url('${CONFIG.winnerImage}'); background-size:${GRID_COLS * 100}% ${GRID_ROWS * 100}%; background-position:${posX}% ${posY}%;"></div>
      </div>
    `;

    card.addEventListener("click", () => onCardTap(card, i));
    grid.appendChild(card);
  });
  updateProgress();
}

function onCardTap(card, i) {
  if (state[i]) return; // bereits aufgedeckt, kein Zurückdrehen
  state[i] = true;
  saveState(state);

  card.classList.add("flipped", "just-flipped");
  setTimeout(() => card.classList.remove("just-flipped"), 650);

  updateProgress();

  if (state.every(Boolean)) {
    setTimeout(() => winModal.classList.remove("hidden"), 700);
  }
}

function updateProgress() {
  const done = state.filter(Boolean).length;
  const pct = Math.round((done / TOTAL_CARDS) * 100);
  progressFill.style.width = pct + "%";
  progressText.textContent = `${done} / ${TOTAL_CARDS}`;
}

resetBtn.addEventListener("click", () => {
  if (confirm("Fortschritt wirklich zurücksetzen?")) {
    state = Array(TOTAL_CARDS).fill(false);
    saveState(state);
    render();
    winModal.classList.add("hidden");
  }
});

closeModal.addEventListener("click", () => winModal.classList.add("hidden"));

fullImage.src = CONFIG.winnerImage;
renderHeader();
render();

if (state.every(Boolean)) {
  winModal.classList.remove("hidden");
}
