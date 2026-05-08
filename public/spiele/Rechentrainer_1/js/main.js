let aufgabenliste = [];
let aufgabennr = 1;
let fehler = 0;
let wasrechnen = "";
let operand = "";
let zraum = 0;
let zraumBis = 0;
let aktAufgabe = "";
let aufgabeshow = "";
let anzAufgaben = "1";

let erllang = `<div class="w3-block erllangContainer"><h2><u>Einführung in den Rechen-Trainer</u></h2>
			<div class="w3-block w3-left">
			Der Rechen-Trainer funktioniert wie folgt:<br>
			Man bestimmt durch anklicken eines der K&auml;stchen die Rechenart und durch die Eingabe einer Zahl im K&auml;stchen
			daneben die Zahl bzw. den Zahlenraum, in dem gerechnet werden soll. Bei "1:" wird der Zahlenraum durch die Zahl mal 10 festgelegt, bei ":" wird die Zahl mal 50 genommen.<br>
			Im nächsten K&auml;stchen wird die Anzahl der Aufgaben festgelegt. <br>
			Das heißt:<br>
			<p>
				<b><u>K&auml;stchen 1 und 2:</u></b> addieren / subtrahieren von Zahlen bis zur Höhe der eingegebenen Zahl
			</p>
			<p>
				<b><u>K&auml;stchen 3 und 5:</u></b>Das Multiplizieren der eingegebenen Zahl mit 2 bis 10 bzw. das teilen von
				Zahlen durch die eingegebene Zahl. Bei der Division entsteht kein Rest.
			</p>
			<p>
				<b><u>K&auml;stchen 4:</u></b>Das Multiplizieren von Zahlen bis zur H&oumlhe der eingegebenen Zahl.
			</p>
			<p>
				<b><u>K&auml;stchen 6:</u></b>Das Dividieren durch die eingegebenen Zahl, wobei der Zahlenraum (Gr&ouml;&szlig; der zu teilenden Zahl) durch die Zahl mal 50 festgelegt wurde. Bei der Division entsteht kein Rest.
			</p>
			<p>
				Danach dr&uuml;cke bitte den "Start"-Knopf links und los geht es. Nach Eingabe Deiner L&ouml;sung durch
				anklicken der entsprechenden Zahlentaste und Best&auml;tigung durch den "Haken"-Knopf, geht es nach 2
				Sekunden weiter. Dir werden soviele Aufgaben gestellt, wie Du angegebenen hast bzw. 18 Aufgaben bei K&auml;stchen 3. </p>
				<div id="erllangendebtn">Auf das Fenster klicken, um das Fenster zu schliessen!</div>
			</div>
		</div>`;

$(document).ready(function () {
  // when document loaded:

  init();

  $(".rechenart").mouseup(function () {
    $(this).css("background-color", "green");
    wasrechnen = $(this).html();
    if (wasrechnen == "+") {
      $(".rechenart").hide();
      operand = "+";
      $(this).show();
      deactivateRangeMode();
    } else if (wasrechnen == "-") {
      $(".rechenart").hide();
      operand = "-";
      $(this).show();
      deactivateRangeMode();
    } else if (wasrechnen == "1⋅1") {
      operand = "*";
      $(".rechenart").hide();
      $(this).show();
      deactivateRangeMode();
    } else if (wasrechnen == "⋅") {
      operand = "*";
      $(".rechenart").hide();
      $(this).show();
      activateRangeMode();
    } else if (wasrechnen == "1:") {
      operand = "/";
      $(".rechenart").hide();
      $(this).show();
      deactivateRangeMode();
    } else if (wasrechnen == ":") {
      operand = "/";
      $(".rechenart").hide();
      $(this).show();
      activateRangeMode();
    } else {
      alert("Bei der Auswahl der Rechenart ist ein Fehler aufgetreten!");
    }
    $("#zahlengroesse").focus();
  });

  $("#loesung").on("mouseup", function () {
    $(this).html("");
  });

  $(".eZahlen").on("mouseup", function () {
    let wert = $(this).html();
    let loesung = $("#loesung").html();
    $("#loesung").html(loesung + wert);
  });

  $("#startbtn").mouseup(function () {
    if ($("#zahlengroesse").val() == "") {
      $("#zahlengroesse").css("background-color", "orange");
    } else {
      $("#zahlengroesse").css("background-color", "green");
    }

    if ($("#anzAufgaben").val() == "") {
      $("#anzAufgaben").css("background-color", "orange");
    } else {
      $("#anzAufgaben").css("background-color", "green");
    }

    //NOTE - $("#aendernbtn").show();
    $("#endebtn").show();
    aufgabennr = 1;
    $("#aufgabe").html("");
    $("#loesung").html("");
    $("#info").hide();
    $("#hilfelang").hide();
    $("#wertAufgabe").html(aufgabennr);
    $("#wertFehler").html(fehler);
    aufgabenliste_erstellen(zraum);
  });

  //   $("#aendernbtn").mouseup(function () {
  //     $(".rechenart").show();
  //     aufgabenliste_erstellen(zraum);
  //   });

  $("#endebtn").on("mouseup", function () {
    init();
  });

  $("#zahlengroesse").change(function () {
    if ($("#zahlengroesse").val() == "") {
      $("#zahlengroesse").css("background-color", "orange");
    } else {
      $("#zahlengroesse").css("background-color", "green");
      zraum = $("#zahlengroesse").val();
    }
    if (wasrechnen === "⋅" || wasrechnen === ":") {
      $("#zahlengroesseBis").focus();
    } else {
      $("#anzAufgaben").focus();
      $("#startbtn").show();
    }
  });

  $("#zahlengroesseBis").change(function () {
    if ($("#zahlengroesseBis").val() == "") {
      $("#zahlengroesseBis").css("background-color", "orange");
    } else {
      $("#zahlengroesseBis").css("background-color", "green");
      zraumBis = $("#zahlengroesseBis").val();
    }
    $("#anzAufgaben").focus();
    $("#startbtn").show();
  });

  $("#anzAufgaben").change(function () {
    if ($("#anzAufgaben").val() == "") {
      $("#anzAufgaben").css("background-color", "orange");
    } else {
      $("#anzAufgaben").css("background-color", "green");
      anzAufgaben = $("#anzAufgaben").val();
    }
  });

  $("#fertig").on("mouseup", function () {
    aufgabe_pruefen(aktAufgabe);
  });

  $("#hilfe").on("mouseup", function () {
    $("#infocontainer").show();
    $("#info").show();
  });

  $("#langehilfe").mouseup(function () {
    $("#hilfelang").show();
    $("#hilfelang").html(erllang);
  });

  $("#hilfelang").on("mouseup", function () {
    $(this).html("");
    $("#hilfelang").hide();
  });

  $("#endeinfobtn").on("mouseup", function () {
    init();
    $("#endeinfo").hide();
  });

  $("#hilfeendebtn").on("mouseup", function () {
    $("#info").hide();
  });
});

function init() {
  //zurücksetzen aller Variablen

  aufgabenliste = [];
  aufgabennr = 1;
  fehler = 0;
  wasrechnen = "";
  operand = "";
  zraum = $("#zahlengroesse").val();
  zraumBis = 0;
  aktAufgabe = "";
  aufgabeshow = "";
  anzAufgaben = "1";

  $(".rechenart").css("background-color", "yellow");
  $(".rechenart").show();
  $("#endeinfo").hide();
  $("#aufgabe").html("");
  $("#loesung").html("");
  $("#hilfelang").hide();
  $("#zahlengroesse").val("");
  $("#zahlengroesseBis").val("");
  $("#anzAufgaben").val("");
  deactivateRangeMode();
  if ($("#zahlengroesse").val() == "") {
    $("#zahlengroesse").css("background-color", "orange");
  } else {
    $("#zahlengroesse").css("background-color", "green");
  }
  if ($("#anzAufgaben").val() == "") {
    $("#anzAufgaben").css("background-color", "orange");
  } else {
    $("#anzAufgaben").css("background-color", "green");
  }
  anzAufgaben = $("#anzAufgaben").val();
  $("#startbtn").hide();
  $("#aendernbtn").hide();
  $("#endebtn").hide();
}

function aufgabenliste_erstellen(zraum) {
  $("#startbtn").hide();
  aufgabenliste = [];
  switch (wasrechnen) {
    case "+":
      for (let x = 2; x <= parseInt(anzAufgaben) + 1; x++) {
        zahl1 = Math.floor(Math.random() * zraum) + 1;
        zahl2 = Math.floor(Math.random() * zraum) + 1;
        aufgabenliste[x - 2] = `${zahl1} ${operand} ${zahl2}`;
      }
      aufgabenliste.sort(() => 0.5 - Math.random());
      //alert(aufgabenliste.length);
      aufgabe_stellen();
      break;
    case "-":
      for (let x = 2; x <= parseInt(anzAufgaben) + 1; x++) {
        do {
          zahl1 = Math.floor(Math.random() * zraum) + 1;
          zahl2 = Math.floor(Math.random() * zraum) + 1;
        } while (zahl1 === zahl2);
        if (zahl1 > zahl2) {
          aufgabenliste[x - 2] = `${zahl1} ${operand} ${zahl2}`;
        } else {
          aufgabenliste[x - 2] = `${zahl2} ${operand} ${zahl1}`;
        }
      }
      aufgabenliste.sort(() => 0.5 - Math.random());
      aufgabe_stellen();
      break;
    case "1⋅1":
      for (let x = 2; x < 11; x++) {
        $("#anzAufgaben").val("10");
        $("#anzAufgaben").css("background-color", "green");
        aufgabenliste.push(`${x} ${operand} ${zraum}`);
        aufgabenliste.push(`${zraum} ${operand} ${x}`);
        console.log(aufgabenliste);
      }
      aufgabenliste.sort(() => 0.5 - Math.random());
      aufgabe_stellen();
      break;
    case "⋅":
      for (let x = 2; x <= parseInt(anzAufgaben) + 1; x++) {
        const bereich = parseInt(zraumBis) - parseInt(zraum) + 1;
        zahl1 = Math.floor(Math.random() * bereich) + parseInt(zraum);
        zahl2 = Math.floor(Math.random() * bereich) + parseInt(zraum);
        aufgabenliste.push(`${zahl1} ${operand} ${zahl2}`);
      }
      aufgabenliste.sort(() => 0.5 - Math.random());
      aufgabe_stellen();
      break;
    case "1:":
      for (let x = 2; x <= parseInt(anzAufgaben) + 1; x++) {
        zahl1 = Math.floor(Math.random() * (zraum * 10) + 1);
        zahl2 = zraum;
        if (zahl1 % zahl2 == 0) {
          aufgabenliste.push(`${zahl1} ${operand} ${zahl2}`);
        } else {
          zahl1 += zraum - (zahl1 % zahl2);
          aufgabenliste.push(`${zahl1} ${operand} ${zahl2}`);
        }
      }
      aufgabenliste.sort(() => 0.5 - Math.random());
      aufgabe_stellen();
      break;
    case ":":
      for (let x = 2; x <= parseInt(anzAufgaben) + 1; x++) {
        const bereich = parseInt(zraumBis) - parseInt(zraum) + 1;
        zahl2 = Math.floor(Math.random() * bereich) + parseInt(zraum);
        let ergebnis = Math.floor(Math.random() * bereich) + parseInt(zraum);
        zahl1 = zahl2 * ergebnis;
        aufgabenliste.push(`${zahl1} ${operand} ${zahl2}`);
      }
      aufgabenliste.sort(() => 0.5 - Math.random());
      aufgabe_stellen();
      break;
    default:
      alert(
        'Innerhalb der Routine "Aufgabenliste erstellen" ist ein Fehler aufgetreten!'
      );
  }
}

function aufgabe_stellen() {
  $("#wertAufgabe").html(aufgabennr);
  aktAufgabe = aufgabenliste[aufgabennr - 1];
  console.log(aktAufgabe + "|" + wasrechnen);
  if (aktAufgabe.includes("*")) {
    aufgabeshow = aktAufgabe.replace("*", "⋅");
    $("#aufgabe").html(aufgabeshow);
    $("#loesung").css("background-color", "rgb(114, 195, 248)");
    $("#loesung").html("");
  } else if (aktAufgabe.includes("/")) {
    aufgabeshow = aktAufgabe.replace("/", ":");
    $("#aufgabe").html(aufgabeshow);
    $("#loesung").css("background-color", "rgb(114, 195, 248)");
    $("#loesung").html("");
  } else {
    $("#aufgabe").html(aktAufgabe);
    $("#loesung").css("background-color", "rgb(114, 195, 248)");
    $("#loesung").html("");
  }
}

function aufgabe_pruefen(aktAufgabe) {
  let meinErgebnis = $("#loesung").html();
  let tmpErgebnis = eval(aktAufgabe);
  let dasErgebnis = tmpErgebnis.toString();
  if (meinErgebnis == dasErgebnis) {
    $("#loesung").css("background-color", "green");
    setTimeout(naechste_Aufgabe, 2000);
  } else {
    $("#loesung").css("background-color", "orange");
    fehler++;
    $("#wertFehler").html(fehler);
  }
  setTimeout(wiederholen, 2000);
}

function wiederholen() {
  $("#loesung").css("background-color", "rgb(114, 195, 248)");
  $("#loesung").html("");
}

function naechste_Aufgabe() {
  aufgabennr++;
  if (aufgabennr > anzAufgaben) {
    $("#endeinfo").show();
    //alert ("E N D E in naechste Aufgabe");
  } else {
    aufgabe_stellen();
  }
}

function activateRangeMode() {
  $("#zahlengroesse").css({ left: "62%", width: "7%" });
  $("#zahlengroesseBis").show();
  $("#anzAufgaben").css({ left: "78%", width: "7%" });
  $("#lbzr").html("von | bis | Anzahl Aufg.");
}

function deactivateRangeMode() {
  $("#zahlengroesse").css({ left: "62%", width: "8%" });
  $("#zahlengroesseBis").hide();
  zraumBis = 0;
  $("#anzAufgaben").css({ left: "72%", width: "8%" });
  $("#lbzr").html("Zahlenraum (1 / x bis ..) | Anzahl Aufgaben");
}
