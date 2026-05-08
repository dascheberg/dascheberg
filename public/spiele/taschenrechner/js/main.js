$(document).ready(function () {
  // when document loaded:
let aufgabe = "";

  $("#display").on("mousedown", function () {
    $("#display").html("");
	$("#aufgabe").html("");
  });
    
  $(".taste").mouseup(function () {
    let zeichen = $(this).html();
    let display = $("#display").html();

    $("#display").html(display + zeichen);
	aufgabe = $("#display").html();
	$("#aufgabe").html(aufgabe);
  });

  $("#gleich").mouseup(function () {
    let display = $("#display").html();
    // let newdisplay = display.replace(/&redic;/g, "Math.sqrt()");
    // display = newdisplay;

    let erg = eval(display);
    $("#display").html(erg);
  });

  $(".taste").mouseenter(function() {
	$(this).css("background-color","rgb(192, 192, 192)");
  })
  $(".taste").mouseleave(function() {
	$(this).css("background-color","rgb(123, 123, 123)");
  })

  $("#gleich").mouseenter(function() {
	$(this).css("background-color","rgb(192, 192, 192)");
  })
  $("#gleich").mouseleave(function() {
	$(this).css("background-color","rgb(123, 123, 123)");
  })
});
