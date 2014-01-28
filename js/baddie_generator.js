(function (root) {
  var SpaceGame = root.SpaceGame = (root.SpaceGame || {});

  var BaddieGenerator = SpaceGame.BaddieGenerator = function (canvas) {
    this.baddieCount = 0;
    this.canvas = canvas;
  };
  
  _.extend(BaddieGenerator.prototype, {
    MAX_BADDIES: 5,

    generate: function (side) {
      var baddie = null;
      var randNum = Math.random();
      var orientation;
      var position;
      var velocity;
      if (this.baddieCount < this.MAX_BADDIES) {
        switch (side) {
          case 'top':
            position = [randNum * this.canvas.width, 
                        -(this.canvas.height / 2)];
            velocity = [0, 2];
            orientation = 0;
            break;
          case 'right':
            position = [this.canvas.width / 2,
                        (this.canvas.height) * randNum];
            velocity = [-2, 0];
            orientation = 1;
            break;
          case 'left':
            position = [-(this.canvas.width / 2),
                        (this.canvas.height) * randNum];
            velocity = [2, 0];
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
