(function (root) {
  var SpaceGame = root.SpaceGame = (root.SpaceGame || {});

  var Enemy = SpaceGame.Enemy = function (pos, vel, img, orientation) {
    SpaceGame.MovingObject.call(this, pos, vel, img);
    this.orientation = orientation;
    this.type = 'enemy';
  };

  _.extend(Enemy.prototype, SpaceGame.MovingObject.prototype, {
  });
}(this));
