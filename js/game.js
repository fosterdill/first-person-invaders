(function (root) {
  var SpaceGame = root.SpaceGame = (root.SpaceGame || {});

  var Game = SpaceGame.Game = function () {
    this.playerShip = new SpaceGame.Ship([200, 0], [0, 0], 'images/ship.png');
    this.objects = [];

    this.objects.push(this.playerShip);
  };

  _.extend(Game.prototype, {
    start: function () {
      this.canvas = document.getElementById('game');
      this.ctx = this.canvas.getContext('2d');
      var that = this;
      setTimeout(function () {
        that.objects.push(that.playerShip.fire());
      }, 2000);
      this.loop();
    },

    loop: function () {
      window.requestAnimFrame(this.loop.bind(this));
      this.render();
    },

    render: function () {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      _.each(this.objects, function (object) {
        object.show(this.canvas, this.ctx);
        object.move();
      }, this);
    }
  });
}(this));
