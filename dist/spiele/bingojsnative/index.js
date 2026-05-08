//Variablen setzen

const aktZahl = document.getElementById("gezogeneZahl");
let isPlaying = false;
let isStarting = true;
if (isStarting && !isPlaying) {
  aktZahl.classList.remove("ende");
  aktZahl.classList.add("gezogeneZahl");
  aktZahl.innerText = "??";
}
const letzteZahl = document.getElementById("letzteZahl");
const bereitsGezogen = document.getElementById("bereitsGezogen");
const laengeGezogenerZahlen = document.getElementById("laengeGezZahlen");

const bZahlen = document.getElementById("bZahlen");
const iZahlen = document.getElementById("iZahlen");
const nZahlen = document.getElementById("nZahlen");
const gZahlen = document.getElementById("gZahlen");
const oZahlen = document.getElementById("oZahlen");

const nSpielBtn = document.getElementById("neuesSpiel");
const zZiehenBtn = document.getElementById("zahlZiehen");
const abrBtn = document.getElementById("abbrechen");

// let bingoZahlenArray = Array.from({ length: 75 }, (_, i) => i + 1);
let bingoZahlenArray = [];
for (i = 1; i <= 75; i++) {
  if (i >= 1 && i <= 15) {
    bingoZahlenArray.push("B" + i);
  } else if (i >= 16 && i <= 30) {
    bingoZahlenArray.push("I" + i);
  } else if (i >= 31 && i <= 45) {
    bingoZahlenArray.push("N" + i);
  } else if (i >= 46 && i <= 60) {
    bingoZahlenArray.push("G" + i);
  } else if (i >= 61 && i <= 75) {
    bingoZahlenArray.push("O" + i);
  }
}

let gezBingoZahlenArray = [];
let gezBingoZahlenArrayLaenge = 0;
let aktuelleZahl = "";
let letzteGezZahl = "";

let bZahlenArray = [];
let iZahlenArray = [];
let nZahlenArray = [];
let gZahlenArray = [];
let oZahlenArray = [];
let count = 0;

nSpielBtn.addEventListener("click", spielen);
zZiehenBtn.addEventListener("click", neueZahl);
abrBtn.addEventListener("click", abbrechen);

function neueZahl() {
  isStarting = false;
  isPlaying = true;
  count++;
  if (count === 1) {
    aktZahl.classList.remove("ende");
    aktZahl.classList.add("gezogeneZahl");
  }
  if (count <= 75) {
    let arrayLaenge = bingoZahlenArray.length;
    bingoZahlIndex = Math.floor(Math.random() * arrayLaenge);
    let aktBingoZahl = bingoZahlenArray[bingoZahlIndex];
    //console.log(`Index: ${bingoZahlIndex}`);
    if (arrayLaenge <= 75) {
      letzteGezZahl = aktuelleZahl;
      gezBingoZahlenArray.push(letzteGezZahl);
      gezBingoZahlenArrayLaenge = gezBingoZahlenArray.length;
      bZahlenArray = [];
      iZahlenArray = [];
      nZahlenArray = [];
      gZahlenArray = [];
      oZahlenArray = [];
      gezBingoZahlenArray.forEach((element) => {
        const firstChar = element.charAt(0);
        // Extrahieren des ersten Buchstabens
        // Je nach erstem Buchstaben in das entsprechende Array kopieren
        switch (firstChar) {
          case "B":
            bZahlenArray.push(element);
            bZahlenArray.sort((a, b) => {
              const numA = parseInt(a.slice(1)); // Extrahiere die Zahl aus a
              const numB = parseInt(b.slice(1)); // Extrahiere die Zahl aus b
              return numA - numB;
            });
            break;
          case "I":
            iZahlenArray.push(element);
            iZahlenArray.sort((a, b) => {
              const numA = parseInt(a.slice(1)); // Extrahiere die Zahl aus a
              const numB = parseInt(b.slice(1)); // Extrahiere die Zahl aus b
              return numA - numB;
            });
            break;
          case "N":
            nZahlenArray.push(element);
            nZahlenArray.sort((a, b) => {
              const numA = parseInt(a.slice(1)); // Extrahiere die Zahl aus a
              const numB = parseInt(b.slice(1)); // Extrahiere die Zahl aus b
              return numA - numB;
            });
            break;
          case "G":
            gZahlenArray.push(element);
            gZahlenArray.sort((a, b) => {
              const numA = parseInt(a.slice(1)); // Extrahiere die Zahl aus a
              const numB = parseInt(b.slice(1)); // Extrahiere die Zahl aus b
              return numA - numB;
            });
            break;
          case "O":
            oZahlenArray.push(element);
            oZahlenArray.sort((a, b) => {
              const numA = parseInt(a.slice(1)); // Extrahiere die Zahl aus a
              const numB = parseInt(b.slice(1)); // Extrahiere die Zahl aus b
              return numA - numB;
            });
            break;
          default:
            // Wenn der Buchstabe nicht erkannt wird, ignorieren
            break;
        }
      });
    }
    aktuelleZahl = aktBingoZahl;
    bingoZahlenArray.splice(bingoZahlIndex, 1);
    // console.log(
    //   `aktZahl: ${aktuelleZahl} / Rest-Laenge: ${arrayLaenge} \n gezogene Zahlen: ${gezBingoZahlenArray}`
    // );
    ausgabe();
  } else if (!isStarting && isPlaying && bingoZahlenArray.length === 0) {
    letzteZahl.innerText = aktuelleZahl;
    zZiehenBtn.setAttribute("disabled", "true");
    nSpielBtn.removeAttribute("disabled");
    laengeGezZahlen.innerText = gezBingoZahlenArrayLaenge;
    aktZahl.classList.add("ende");
    aktZahl.innerText = "Ende";
  }
}

function ausgabe() {
  aktZahl.innerText = aktuelleZahl;
  letzteZahl.innerText = letzteGezZahl;
  laengeGezZahlen.innerText = gezBingoZahlenArrayLaenge;
  bZahlen.textContent = bZahlenArray.join(" - ");
  iZahlen.textContent = iZahlenArray.join(" - ");
  nZahlen.textContent = nZahlenArray.join(" - ");
  gZahlen.textContent = gZahlenArray.join(" - ");
  oZahlen.textContent = oZahlenArray.join(" - ");
}

function abbrechen() {
  isPlaying = false;
  isStarting = true;
  aktZahl.classList.add("ende");
  aktZahl.innerText = "Ende";
  zZiehenBtn.setAttribute("disabled", "true");
  nSpielBtn.removeAttribute("disabled");
  letzteZahl.innerText = "";
  let bingoZahlenArray = [];
  let gezBingoZahlenArray = [];
  let gezBingoZahlenArrayLaenge = gezBingoZahlenArray.lenght;
  laengeGezZahlen.innerText = gezBingoZahlenArrayLaenge;
  let bZahlenArray = [];
  let iZahlenArray = [];
  let nZahlenArray = [];
  let gZahlenArray = [];
  let oZahlenArray = [];
  bZahlen.textContent = "";
  iZahlen.textContent = "";
  nZahlen.textContent = "";
  gZahlen.textContent = "";
  oZahlen.textContent = "";
  count = 0;
}

function spielen() {
  isPlaying = false;
  isStarting = true;
  aktZahl.classList.remove("ende");
  aktZahl.classList.add("gezogeneZahl");
  aktZahl.innerText = "??";

  zZiehenBtn.removeAttribute("disabled");
  nSpielBtn.setAttribute("disabled", "true");

  letzteZahl.innerText = "";

  bingoZahlenArray = [];
  for (i = 1; i <= 75; i++) {
    if (i >= 1 && i <= 15) {
      bingoZahlenArray.push("B" + i);
    } else if (i >= 16 && i <= 30) {
      bingoZahlenArray.push("I" + i);
    } else if (i >= 31 && i <= 45) {
      bingoZahlenArray.push("N" + i);
    } else if (i >= 46 && i <= 60) {
      bingoZahlenArray.push("G" + i);
    } else if (i >= 61 && i <= 75) {
      bingoZahlenArray.push("O" + i);
    }
  }

  gezBingoZahlenArray = [];
  gezBingoZahlenArrayLaenge = gezBingoZahlenArray.length;
  aktuelleZahl = "";
  letzteGezZahl = "";

  bZahlenArray = [];
  iZahlenArray = [];
  nZahlenArray = [];
  gZahlenArray = [];
  oZahlenArray = [];
  count = 0;

  laengeGezZahlen.innerText = gezBingoZahlenArrayLaenge;
  bZahlen.textContent = "";
  iZahlen.textContent = "";
  nZahlen.textContent = "";
  gZahlen.textContent = "";
  oZahlen.textContent = "";
}
