(function (root) {
  var SpaceGame = root.SpaceGame = (root.SpaceGame || {});

  var Shot = SpaceGame.Shot = function (pos, vel, img) {
    SpaceGame.MovingObject.call(this, pos, vel, img);
    this.type = 'shot';
  };

  _.extend(Shot.prototype, SpaceGame.MovingObject.prototype, {
  });
}(this));
