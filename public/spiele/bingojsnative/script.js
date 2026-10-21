"use strict";

// ---------- Konfiguration ----------

const RANGES = {
  B: [1, 15],
  I: [16, 30],
  N: [31, 45],
  G: [46, 60],
  O: [61, 75],
};
const LETTERS = ["B", "I", "N", "G", "O"];

// Zeit in ms, die auf eine mögliche zweite Ziffer gewartet wird,
// bevor eine einstellige Eingabe (1-7) automatisch übernommen wird.
const MANUAL_INPUT_TIMEOUT = 900;

// ---------- Zustand ----------

let pool = [];        // noch nicht gezogene Zahlen
let drawn = [];        // gezogene Zahlen in Reihenfolge
let gameRunning = false;
let manualMode = false; // true = Zahlen werden per Tastatur eingegeben statt zufällig gezogen
let buffer = "";        // aktuell eingetippte Ziffern im manuellen Modus
let bufferTimeout = null;
let lastDisplay = { letter: "", n: "" }; // zuletzt bestätigte Anzeige (für Korrektur/Escape)

// ---------- DOM-Referenzen ----------

const btnNeu = document.getElementById("btnNeu");
const btnZiehen = document.getElementById("btnZiehen");
const btnManuell = document.getElementById("btnManuell");
const btnAbbruch = document.getElementById("btnAbbruch");
const btnDoc = document.getElementById("btnDoc");

const drawDisplay = document.getElementById("drawDisplay");
const currentLetterEl = document.getElementById("currentLetter");
const currentNumberEl = document.getElementById("currentNumber");
const modeHintEl = document.getElementById("modeHint");
const lastDrawnEl = document.getElementById("lastDrawn");
const drawnCountEl = document.getElementById("drawnCount");

const rowEls = {};
LETTERS.forEach((l) => (rowEls[l] = document.getElementById("row-" + l)));

// ---------- Hilfsfunktionen ----------

function letterFor(n) {
  for (const l of LETTERS) {
    const [min, max] = RANGES[l];
    if (n >= min && n <= max) return l;
  }
  return "?";
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildBoard() {
  LETTERS.forEach((l) => {
    const [min, max] = RANGES[l];
    const container = rowEls[l];
    container.innerHTML = "";
    for (let n = min; n <= max; n++) {
      const chip = document.createElement("span");
      chip.className = "num-chip";
      chip.textContent = n;
      chip.id = "chip-" + n;
      container.appendChild(chip);
    }
  });
}

function updateButtons() {
  btnNeu.disabled = gameRunning;
  btnZiehen.disabled = !gameRunning || pool.length === 0 || manualMode;
  btnAbbruch.disabled = !gameRunning;
  btnManuell.classList.toggle("active", manualMode);
  modeHintEl.textContent =
    manualMode && gameRunning
      ? "Manueller Modus: Ziffern eintippen · Enter = übernehmen · Esc = korrigieren"
      : "";
}

function resetDisplay() {
  currentLetterEl.textContent = "";
  currentNumberEl.textContent = "";
  lastDrawnEl.textContent = "–";
  drawnCountEl.textContent = "0";
  lastDisplay = { letter: "", n: "" };
  buffer = "";
  clearTimeout(bufferTimeout);
}

function restoreLastDisplay() {
  currentLetterEl.textContent = lastDisplay.letter;
  currentNumberEl.textContent = lastDisplay.n;
}

function flashDisplay() {
  drawDisplay.classList.remove("flash");
  // reflow erzwingen, damit die Animation erneut abspielt
  void drawDisplay.offsetWidth;
  drawDisplay.classList.add("flash");
}

function flashError() {
  drawDisplay.classList.remove("error-flash");
  void drawDisplay.offsetWidth;
  drawDisplay.classList.add("error-flash");
}

// ---------- Spielsteuerung ----------

function neuesSpiel() {
  pool = [];
  for (let n = 1; n <= 75; n++) pool.push(n);
  shuffle(pool);
  drawn = [];
  gameRunning = true;

  buildBoard();
  resetDisplay();
  updateButtons();
}

// Trägt eine Zahl als gezogen ein (egal ob zufällig oder manuell) und
// aktualisiert Anzeige, Tafel und Zähler.
function commitZahl(n) {
  drawn.push(n);
  const letter = letterFor(n);

  // vorherige "zuletzt gezogen"-Markierung entfernen
  document.querySelectorAll(".num-chip.latest").forEach((el) => el.classList.remove("latest"));

  const chip = document.getElementById("chip-" + n);
  if (chip) {
    chip.classList.add("drawn");
    chip.classList.add("latest");
  }

  currentLetterEl.textContent = letter;
  currentNumberEl.textContent = n;
  lastDrawnEl.textContent = letter + "-" + n;
  drawnCountEl.textContent = drawn.length;
  lastDisplay = { letter, n };

  flashDisplay();
  updateButtons();

  if (pool.length === 0) {
    currentLetterEl.textContent = "Fertig";
  }
}

function zahlZiehen() {
  if (!gameRunning || pool.length === 0 || manualMode) return;
  const n = pool.pop();
  commitZahl(n);
}

function abbruch() {
  gameRunning = false;
  pool = [];
  drawn = [];

  document.querySelectorAll(".num-chip").forEach((el) => {
    el.classList.remove("drawn");
    el.classList.remove("latest");
  });

  resetDisplay();
  updateButtons();
}

function toggleManuell() {
  manualMode = !manualMode;
  buffer = "";
  clearTimeout(bufferTimeout);
  restoreLastDisplay();
  updateButtons();
}

// ---------- Manuelle Zahleneingabe ----------

// Übernimmt den aktuellen Eingabepuffer als gezogene Zahl.
function commitBuffer() {
  clearTimeout(bufferTimeout);
  if (!buffer) return;
  const n = parseInt(buffer, 10);
  buffer = "";

  if (!gameRunning) {
    restoreLastDisplay();
    return;
  }
  if (n < 1 || n > 75 || drawn.includes(n)) {
    flashError();
    restoreLastDisplay();
    return;
  }

  const idx = pool.indexOf(n);
  if (idx >= 0) pool.splice(idx, 1);
  commitZahl(n);
}

// Verarbeitet eine eingetippte Ziffer (als String "0".."9") im manuellen Modus.
function handleDigit(d) {
  if (!manualMode || !gameRunning) return;

  if (buffer === "" && d === "0") {
    // "0" allein kann keine gültige Bingo-Zahl (1-75) einleiten
    flashError();
    return;
  }

  buffer += d;

  if (buffer.length === 1) {
    currentLetterEl.textContent = "";
    currentNumberEl.textContent = buffer;

    const n1 = parseInt(buffer, 10);
    // 8 und 9 können zu keiner gültigen zweistelligen Zahl (<=75) mehr
    // erweitert werden -> sofort übernehmen.
    if (n1 >= 8) {
      commitBuffer();
      return;
    }
    // 1-7: könnte noch eine zweite Ziffer folgen (z.B. "6" -> "63").
    // Kommt keine, wird nach kurzer Pause die einstellige Zahl übernommen.
    clearTimeout(bufferTimeout);
    bufferTimeout = setTimeout(commitBuffer, MANUAL_INPUT_TIMEOUT);
  } else if (buffer.length === 2) {
    clearTimeout(bufferTimeout);
    const n2 = parseInt(buffer, 10);
    if (n2 >= 1 && n2 <= 75) {
      currentLetterEl.textContent = "";
      currentNumberEl.textContent = buffer;
      commitBuffer();
    } else {
      // Ungültige zweistellige Zahl (z.B. 76-99): zweite Ziffer als
      // Beginn einer neuen Eingabe werten.
      const zweiteZiffer = buffer[1];
      buffer = "";
      if (zweiteZiffer !== "0") {
        handleDigit(zweiteZiffer);
      } else {
        flashError();
        restoreLastDisplay();
      }
    }
  }
}

// ---------- Initialisierung ----------

btnNeu.addEventListener("click", neuesSpiel);
btnZiehen.addEventListener("click", zahlZiehen);
btnManuell.addEventListener("click", toggleManuell);
btnAbbruch.addEventListener("click", abbruch);
document.getElementById("btnDoc").addEventListener("click", () => window.open("hilfe.html", "_blank"));

document.addEventListener("keydown", (e) => {
  // Solange die Erklärung offen ist, gehören die Tasten ihr - sonst würde
  // die Leertaste beim Erklären schon eine Zahl ziehen.
  if (erklaerungIstOffen()) {
    if (e.code === "Space" || e.key === "Enter" || e.key === "ArrowRight") {
      e.preventDefault();
      erklaerungWeiter();
    } else if (e.key === "Escape") {
      e.preventDefault();
      erklaerungSchliessen();
    }
    return;
  }

  if (manualMode && gameRunning) {
    if (e.key >= "0" && e.key <= "9") {
      e.preventDefault();
      handleDigit(e.key);
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      commitBuffer();
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      clearTimeout(bufferTimeout);
      buffer = "";
      restoreLastDisplay();
      return;
    }
  }

  // Leertaste zieht eine Zahl, wenn ein Spiel läuft und der automatische
  // Modus aktiv ist (bequem für den Beamer-Betrieb).
  if (e.code === "Space" && !btnZiehen.disabled) {
    e.preventDefault();
    zahlZiehen();
  }
});

buildBoard();
resetDisplay();
updateButtons();

// ---------- Erklärung für die Gruppe ----------

// Die Zahlen von Zettel Nr. 74 - genau der Zettel, den die Spieler in der Hand haben.
const ZETTEL = [
  [11, 28, 34, 55, 73],
  [3, 30, 35, 48, 75],
  [13, 17, 42, 49, 72],
  [1, 18, 38, 51, 65],
  [5, 22, 39, 59, 61],
];

// Felder jeweils als [Zeile, Spalte]
const LINIE_WAAGERECHT = [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4]];
const LINIE_SENKRECHT = [[0, 2], [1, 2], [2, 2], [3, 2], [4, 2]];
const LINIE_DIAGONAL1 = [[0, 0], [1, 1], [2, 2], [3, 3], [4, 4]];
const LINIE_DIAGONAL2 = [[0, 4], [1, 3], [2, 2], [3, 1], [4, 0]];

// Im Schlussbild wandern der waagerechte und der senkrechte Rahmen gemeinsam
// über den Zettel, damit nacheinander jede Reihe und jede Spalte zu sehen ist.
// Zuletzt stehen beide wieder in der Mitte.
const WANDER_MS = 5000;
const WANDER_SCHRITTE = [0, 1, 2, 3, 4, 2];

const SCHRITTE = [
  {
    titel: "So sieht Ihr Zettel aus",
    text: "25 Zahlen in fünf Spalten: B, I, N, G und O. Jede gezogene Zahl, die Sie finden, streichen Sie ab.",
    markiert: [],
  },
  {
    titel: "Waagerechtes Bingo",
    text: "Eine ganze Reihe quer - von links nach rechts. Alle fünf Zahlen abgestrichen: Bingo!",
    markiert: LINIE_WAAGERECHT,
    farbe: "farbe-waagerecht",
  },
  {
    titel: "Senkrechtes Bingo",
    text: "Eine ganze Spalte - von oben nach unten. Auch das ist ein Bingo.",
    markiert: LINIE_SENKRECHT,
    farbe: "farbe-senkrecht",
  },
  {
    titel: "Diagonales Bingo",
    text: "Von links oben nach rechts unten - quer durch den Zettel.",
    markiert: LINIE_DIAGONAL1,
    farbe: "farbe-diagonal",
  },
  {
    titel: "Die andere Diagonale",
    text: "Von rechts oben nach links unten zählt genauso. Die 42 in der Mitte gehört zu beiden.",
    markiert: LINIE_DIAGONAL1,
    farbe: "farbe-diagonal",
    zusatz: LINIE_DIAGONAL2,
    zusatzFarbe: "farbe-diagonal-hell",
  },
  {
    titel: "Alle Möglichkeiten",
    text: "Jede Reihe und jede Spalte zählt, dazu die beiden Diagonalen. Rot und Blau wandern gleich über den ganzen Zettel.",
    markiert: [],
    linien: true,
  },
];

const erklaerungOverlay = document.getElementById("erklaerungOverlay");
const erklaerungClose = document.getElementById("erklaerungClose");
const erklaerungTitel = document.getElementById("erklaerungTitel");
const erklaerungText = document.getElementById("erklaerungText");
const erklaerungLegende = document.getElementById("erklaerungLegende");
const erklaerungWeiterEl = document.getElementById("erklaerungWeiter");
const zettelGitter = document.getElementById("zettelGitter");
const zettelLinien = document.getElementById("zettelLinien");

let erklaerungSchritt = 0;
const zettelZellen = [];
let linieWaagerecht = null;
let linieSenkrecht = null;
let wanderIndex = 0;
let wanderTimer = null;

function baueZettel() {
  zettelGitter.innerHTML = "";
  ZETTEL.forEach((zeile, z) => {
    zettelZellen[z] = [];
    zeile.forEach((zahl, s) => {
      const zelle = document.createElement("div");
      zelle.className = "zettel-zelle";
      zelle.textContent = zahl;
      zettelGitter.appendChild(zelle);
      zettelZellen[z][s] = zelle;
    });
  });

  zettelLinien.innerHTML = "";
  const linien = {};
  ["waagerecht", "senkrecht", "diagonal1", "diagonal2"].forEach((art) => {
    const linie = document.createElement("div");
    linie.className = "linie linie-" + art;
    zettelLinien.appendChild(linie);
    linien[art] = linie;
  });
  linieWaagerecht = linien.waagerecht;
  linieSenkrecht = linien.senkrecht;
}

function wanderPositionSetzen() {
  const feld = WANDER_SCHRITTE[wanderIndex];
  linieWaagerecht.style.top = feld * 20 + "%";
  linieSenkrecht.style.left = feld * 20 + "%";
}

function wanderStoppen() {
  clearInterval(wanderTimer);
  wanderTimer = null;
}

function wanderStarten() {
  wanderStoppen();
  wanderIndex = 0;
  wanderPositionSetzen();
  wanderTimer = setInterval(() => {
    if (wanderIndex >= WANDER_SCHRITTE.length - 1) {
      wanderStoppen();
      return;
    }
    wanderIndex++;
    wanderPositionSetzen();
  }, WANDER_MS);
}

function zeigeSchritt() {
  const schritt = SCHRITTE[erklaerungSchritt];

  zettelZellen.forEach((zeile) =>
    zeile.forEach((zelle) => (zelle.className = "zettel-zelle"))
  );
  schritt.markiert.forEach(([z, s]) => {
    zettelZellen[z][s].classList.add("markiert", schritt.farbe);
  });
  // Felder, die zu beiden Diagonalen gehören, tragen beide Farbklassen und
  // werden dadurch geteilt dargestellt.
  (schritt.zusatz || []).forEach(([z, s]) => {
    zettelZellen[z][s].classList.add("markiert", schritt.zusatzFarbe);
  });

  zettelLinien.hidden = !schritt.linien;
  erklaerungLegende.hidden = !schritt.linien;
  if (schritt.linien) {
    wanderStarten();
  } else {
    wanderStoppen();
  }

  erklaerungTitel.textContent = schritt.titel;
  erklaerungText.textContent = schritt.text;

  const istLetzter = erklaerungSchritt === SCHRITTE.length - 1;
  erklaerungWeiterEl.textContent =
    "Schritt " + (erklaerungSchritt + 1) + " von " + SCHRITTE.length +
    (istLetzter
      ? " · Klicken oder Leertaste: zurück zum Spiel"
      : " · Klicken oder Leertaste für weiter");
}

function erklaerungIstOffen() {
  return !erklaerungOverlay.hidden;
}

function erklaerungOeffnen() {
  erklaerungSchritt = 0;
  zeigeSchritt();
  erklaerungOverlay.hidden = false;
}

function erklaerungSchliessen() {
  wanderStoppen();
  erklaerungOverlay.hidden = true;
}

function erklaerungWeiter() {
  erklaerungSchritt++;
  if (erklaerungSchritt >= SCHRITTE.length) {
    erklaerungSchliessen();
    return;
  }
  zeigeSchritt();
}

document.getElementById("btnErklaerung").addEventListener("click", erklaerungOeffnen);

erklaerungClose.addEventListener("click", (e) => {
  e.stopPropagation();
  erklaerungSchliessen();
});

erklaerungOverlay.addEventListener("click", erklaerungWeiter);

baueZettel();
