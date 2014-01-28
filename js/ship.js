(function (root) {
  var SpaceGame = root.SpaceGame = (root.SpaceGame || {});

  var Ship = SpaceGame.Ship = function (pos, vel, img) {
    SpaceGame.MovingObject.call(this, pos, vel, img);
    this.type = 'ship';
  };

  _.extend(Ship.prototype, SpaceGame.MovingObject.prototype, {
    SHOT_SPEED: 10,

    fire: function () {
      var shot = new SpaceGame.Shot(this._gunPos(), [0, -this.SHOT_SPEED], 'images/shot.png');
      return shot;
    },

    _gunPos: function () {
      return [this.pos[0] + (this.img.width / 2) - 9, 
              this.pos[1]];
    }
  });
}(this));
