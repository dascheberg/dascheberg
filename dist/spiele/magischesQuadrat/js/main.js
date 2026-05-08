$(document).ready(function () {
  // when document loaded:

  $("#btn").on("mouseup", function () {
    //eingabe ist evtl ein string, durch eingabe mal 1 wird es zur Zahl
    let mZahl = $("#magZahl").val() * 1;
    let a = Math.floor(mZahl / 21);
    let b = mZahl % 21;

    let z1 = a + b;
    let z2 = a;
    let z3 = 12 * a;
    let z4 = 7 * a;
    let z5 = 11 * a;
    let z6 = 8 * a;
    let z7 = b;
    let z8 = 2 * a;
    let z9 = 5 * a;
    let z10 = 10 * a;
    let z11 = 3 * a;
    let z12 = 3 * a + b;
    let z13 = 4 * a;
    let z14 = 2 * a + b;
    let z15 = 6 * a;
    let z16 = 9 * a;

    $("#div1").html(z1);
    $("#div2").html(z2);
    $("#div3").html(z3);
    $("#div4").html(z4);
    $("#div5").html(z5);
    $("#div6").html(z6);
    $("#div7").html(z7);
    $("#div8").html(z8);
    $("#div9").html(z9);
    $("#div10").html(z10);
    $("#div11").html(z11);
    $("#div12").html(z12);
    $("#div13").html(z13);
    $("#div14").html(z14);
    $("#div15").html(z15);
    $("#div16").html(z16);

    $("#sum1").html(z1 + z5 + z9 + z13);
    $("#sum2").html(z2 + z6 + z10 + z14);
    $("#sum3").html(z3 + z7 + z11 + z15);
    $("#sum4").html(z4 + z8 + z12 + z16);
    $("#sumdiagonal").html(z1 + z6 + z11 + z16);
    $("#sum5").html(z13 + z14 + z15 + z16);
    $("#sum6").html(z9 + z10 + z11 + z12);
    $("#sum7").html(z5 + z6 + z7 + z8);
    $("#sum8").html(z1 + z2 + z3 + z4);
  });
});
