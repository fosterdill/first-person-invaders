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
  game.start();
});
