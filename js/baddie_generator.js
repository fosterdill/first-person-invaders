(function (root) {
  var SpaceGame = root.SpaceGame = (root.SpaceGame || {});

  var BaddieGenerator = SpaceGame.BaddieGenerator = function (canvas) {
    this.baddieCount = 0;
    this.canvas = canvas;
  };
  
  _.extend(BaddieGenerator.prototype, {
    MAX_BADDIES: 15,

    remove: function (num) {
      this.baddieCount -= num;
    },

    wave: function (side) {
      var baddies = [];
      for (var i = 0; i < 1; i++) {
        baddies.push(this.single(side));
      }
      return baddies;
    },

    single: function (side) {
      var baddie = null;
      var randNum = Math.random();
      var orientation;
      var position;
      var velocity;
      var halfWidth = this.canvas.width / 2;
      var halfHeight = this.canvas.height / 2;
      if (this.baddieCount < this.MAX_BADDIES) {
        switch (side) {
          case 'top':
            position = [randNum * (this.canvas.width) - halfWidth, 
                        -(this.canvas.height / 2)];
            velocity = [0, 2 * Math.random() + 2];
            orientation = 0;
            break;
          case 'right':
            position = [this.canvas.width / 2,
                        (this.canvas.height) * randNum - halfHeight];
            velocity = [-2 * Math.random() + 2, 0];
            orientation = 1;
            break;
          case 'left':
            position = [-(this.canvas.width / 2),
                        (this.canvas.height) * randNum - halfHeight];
            velocity = [2 * Math.random() + 2, 0];
            orientation = -1;
            break;
        }
        baddie = new SpaceGame.Enemy(
          position,
          velocity,
          'images/enemy_' + side + '.png',
          orientation
        );
        this.baddieCount += 1;
      }
      return baddie;
    }
  });
}(this));
