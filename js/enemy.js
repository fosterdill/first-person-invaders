(function (root) {
  var SpaceGame = root.SpaceGame = (root.SpaceGame || {});

  var Enemy = SpaceGame.Enemy = function (pos, vel, img, orientation, originalOrientation) {
    SpaceGame.MovingObject.call(this, pos, vel, img);
    this.orientation = orientation;
    this.originalOrientation = originalOrientation;
    this.type = 'enemy';
  };

  _.extend(Enemy.prototype, SpaceGame.MovingObject.prototype, {
  });
}(this));
