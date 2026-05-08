let punkte = 0;
let sp1Punkte = 0;
let sp2Punkte = 0;
let spieler1 = true;
let spieler2 = false;

$(document).ready(function () {
  // when document loaded:

  $("#start").on("mouseup", function () {
    $("#wuerfelzahl").html("");

    $("#wuerfelbild1").attr("src", "img/Wuerfel_joker.svg");
    $("#wuerfelbild2").attr("src", "img/Wuerfel_joker.svg");

    spieler1 = true;
    spieler2 = false;
    punkte = 0;
    sp1Punkte = 0;
    sp2Punkte = 0;
    $("#spieler1").css("background-color", "rgb(204,204,0)");
    $("#pfeil").css("left","10%");
    $("#spieler2").css("background-color", "rgb(130,236,165)");
    $("#sp1summe").html("");
    $("#sp2summe").html("");
  });

  $("#button").on("mouseup", function () {
    $("#wuerfelzahl").html("");

    $("#wuerfelbild1").attr("src", "img/Wuerfel_joker.svg");
    $("#wuerfelbild2").attr("src", "img/Wuerfel_joker.svg");

    let sound = new Audio("sound/wuerfeln.mp3");
    sound.play();

    setTimeout(wuerfeln, 1000);
  });

  $("#wbtn").on("mouseup", function () {
    if (spieler1 == true) {
      sp1Punkte += punkte;
      spieler1 = false;
      spieler2 = true;
      punkte = 0;
      $("#sp1summe").html(sp1Punkte);
      $("#wuerfelzahl").html("");
      $("#wbtn").css("display", "none");
      $("#spieler1").css("background-color", "rgb(130,236,165)");
      $("#spieler2").css("background-color", "rgb(204,204,0)");
      $("#pfeil").css("left","80%");
    } else {
      sp2Punkte += punkte;
      spieler1 = true;
      spieler2 = false;
      punkte = 0;
      $("#sp2summe").html(sp2Punkte);
      $("#wuerfelzahl").html("");
      $("#wbtn").css("display", "none");
      $("#spieler1").css("background-color", "rgb(204,204,0)");
      $("#pfeil").css("left","10%");
      $("#spieler2").css("background-color", "rgb(130,236,165)");
    }
  });
});

function wuerfeln() {
  let zahl1 = Math.floor(Math.random() * 6) + 1;
  let zahl2 = Math.floor(Math.random() * 6) + 1;
  if (zahl1 == zahl2) {
    $("#div1").css("background-color","red");
    setTimeout(grau,300);
    punkte = 0;
    if (spieler1 == true) {
      spieler1 = false;
      spieler2 = true;
      $("#spieler2").css("background-color", "rgb(204,204,0)");
      $("#pfeil").css("left","80%");
      $("#spieler1").css("background-color", "rgb(130,236,165)");
    } else {
      spieler1 = true;
      spieler2 = false;
      $("#spieler1").css("background-color", "rgb(204,204,0)");
      $("#pfeil").css("left","10%");
      $("#spieler2").css("background-color", "rgb(130,236,165)");
    }
  } else {
    punkte += zahl1 + zahl2;
  }
  $("#wuerfelzahl").html(punkte);
  if (punkte >= 30) {
    $("#wbtn").css("display", "flex");
  } else {
    $("#wbtn").css("display", "none");
  }
  $("#wuerfelbild1").attr("src", "img/Wuerfel_" + zahl1 + ".svg");
  $("#wuerfelbild2").attr("src", "img/Wuerfel_" + zahl2 + ".svg");
}

function grau () {
  $("#div1").css("background-color","rgb(228, 228, 228)");
};