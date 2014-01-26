(function (root) {
  var SpaceGame = root.SpaceGame = (root.SpaceGame || {});

  var Shot = SpaceGame.Shot = function (pos, vel, img) {
    SpaceGame.MovingObject.call(this, pos, vel, img);
  };

  _.extend(Shot.prototype, SpaceGame.MovingObject.prototype, {
    drawPath: function (canvas, ctx) {
      var x = this.pos[0];
      var y = this.pos[1];
      ctx.fillStyle="#FF0000";
      ctx.fillRect(x, y, 150, 75);
    }
  });
}(this));
