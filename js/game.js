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
      setInterval(function () {
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
      var that = this;
      var objectsToKill = [];

      _.each(this.objects, function (object, index) {
        object.show(that.canvas, that.ctx);
        object.move();
        if (object.pos[0] > this.canvas.width || object.pos[0] < 0 ||
              object.pos[1] > this.canvas.height || object.pos[1] < 0) {
          objectsToKill.push(index);
        }
      }, this);
      _.each(objectsToKill, function (index) {
        that.objects.splice(index, 1);
      });
    }
  });
}(this));
