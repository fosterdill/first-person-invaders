(function (root) {
  var SpaceGame = root.SpaceGame = (root.SpaceGame || {});

  var Ship = SpaceGame.Ship = function (pos, vel, img) {
    SpaceGame.MovingObject.call(this, pos, vel, img);
  };

  _.extend(Ship.prototype, SpaceGame.MovingObject.prototype, {
    fire: function () {
      var shot = new SpaceGame.Shot(this._gunPos(), [0, 4], 'images/shot.png');
      return shot;
    },

    _gunPos: function () {
      return [this.pos[0] + (this.img.width / 2) - 5, 
              this.pos[1] + this.img.height];
    }
  });
}(this));
