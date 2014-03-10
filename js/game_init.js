document.addEventListener('DOMContentLoaded', function () {

  window.requestAnimFrame =
    requestAnimationFrame || 
    webkitRequestAnimationFrame || 
    mozRequestAnimationFrame || 
    oRequestAnimationFrame || 
    msRequestAnimationFrame || 
    function (callback, element) { return setTimeout(callback, 1000 / 60); };
;

  var game = new SpaceGame.Game();
  var canvas = document.getElementById('game');
  var ctx = canvas.getContext('2d');
  ctx.fillStyle = '#000000';
  ctx.fillRect(
    0, 
    0, 
    canvas.width, 
    canvas.height
  );
  ctx.font="20px Georgia";
  ctx.fillStyle="white";
  ctx.fillText("Press r to start", 185, 240);

  document.onkeydown = function (event) {
    if (event.keyCode === 82) {
      game.start();
    }
  };
});
