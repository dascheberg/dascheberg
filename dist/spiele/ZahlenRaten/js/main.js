let zufall;
let versuche;
let untergrenze;
let obergrenze;
let letzterTipp;

$(document).ready(function () {
  // when document loaded:
  baueZahlenstrahlSkala();
  spielstart();

  $("#eingabe").keypress(function (evt) {
    let key = evt.which;
    if (key == 13) {
      auswerten();
    }
  });

  $("#startbutton").mouseup(spielstart);
});

function spielstart() {
  versuche = 0;
  untergrenze = 1;
  obergrenze = 100;
  letzterTipp = null;
  $("#ausgabe").html("");
  $("#eingabe").val("");
  $("#eingabe").prop("disabled", false);
  $("#versuche").html("Versuche: 0");
  $("#titel").css("color", "rgb(15, 7, 168)");
  $("#jubel").addClass("verborgen");

  zufall = Math.floor(Math.random() * 100) + 1;
  $("#startbutton").hide();
  aktualisiereZahlenstrahl();
}

function auswerten() {
  let eingabeText = $("#eingabe").val().trim();
  let eingabe = Number(eingabeText);

  if (!Number.isInteger(eingabe) || eingabe < 1 || eingabe > 100) {
    $("#ausgabe").html("Bitte gib eine ganze Zahl von 1 bis 100 ein.");
    $("#eingabe").val("");
    return;
  }

  versuche++;
  $("#versuche").html("Versuche: " + versuche);

  if (eingabe < zufall) {
    untergrenze = Math.max(untergrenze, eingabe + 1);
    $("#ausgabe").html(eingabe + " ist zu klein!");
  } else if (eingabe > zufall) {
    obergrenze = Math.min(obergrenze, eingabe - 1);
    $("#ausgabe").html(eingabe + " ist zu groß!");
  } else {
    untergrenze = eingabe;
    obergrenze = eingabe;
    $("#ausgabe").html("Fantastisch! " + eingabe + " ist genau richtig!");
    $("#eingabe").prop("disabled", true);
    $("#startbutton").show();
    $("#titel").css("color", "red");
    $("#jubel").removeClass("verborgen");
  }

  letzterTipp = eingabe;
  aktualisiereZahlenstrahl();
  $("#eingabe").val("");
}

function baueZahlenstrahlSkala() {
  let skala = $("#zahlenstrahl-skala");

  for (let zahl = 10; zahl < 100; zahl += 10) {
    let position = ((zahl - 1) / 99) * 100;
    let tick = $("<div></div>")
      .addClass("zahlenstrahl-tick zahlenstrahl-tick--gross")
      .css("left", position + "%");
    let label = $("<div></div>")
      .addClass("zahlenstrahl-tick-label")
      .css("left", position + "%")
      .text(zahl);

    skala.append(tick, label);
  }
}

function aktualisiereZahlenstrahl() {
  let linksBreite = ((untergrenze - 1) / 100) * 100;
  let rechtsBreite = ((100 - obergrenze) / 100) * 100;
  let markerMinPosition = ((untergrenze - 1) / 99) * 100;
  let markerMaxPosition = ((obergrenze - 1) / 99) * 100;

  $("#zahlenstrahl-links").css("width", linksBreite + "%");
  $("#zahlenstrahl-rechts").css("width", rechtsBreite + "%");
  $("#marker-min")
    .css("left", markerMinPosition + "%")
    .text(untergrenze);
  $("#marker-max")
    .css("left", markerMaxPosition + "%")
    .text(obergrenze);

  if (letzterTipp === null) {
    $("#marker-tipp").addClass("verborgen").empty();
  } else {
    let tippPosition = ((letzterTipp - 1) / 99) * 100;
    $("#marker-tipp")
      .removeClass("verborgen")
      .css("left", tippPosition + "%")
      .html("<span>Tipp: " + letzterTipp + "</span>");
  }

  if (untergrenze === obergrenze) {
    $("#zahlenstrahl-bereich").text("Treffer: " + untergrenze);
  } else {
    $("#zahlenstrahl-bereich").text(
      "Aktiver Bereich: " + untergrenze + " bis " + obergrenze,
    );
  }
}
