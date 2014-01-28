(function (root) {
  var SpaceGame = root.SpaceGame = (root.SpaceGame || {});

  var Game = SpaceGame.Game = function () {
    this.playerShip = new SpaceGame.Ship([200, 0], [0, 0], 'images/ship.png');
    this.objects = [];
    this.keysPressed = [];

    this.objects.push(this.playerShip);
  };

  _.extend(Game.prototype, {
    start: function () {
      document.onkeydown = this.keyDownHandler.bind(this);
      document.onkeyup = this.keyUpHandler.bind(this);
      this.canvas = document.getElementById('game');
      this.ctx = this.canvas.getContext('2d');
      this.loop();
    },

    keyDownHandler: function (event) {
      var keyCode = event.keyCode;
      if (this.keysPressed.indexOf(keyCode) === -1) {
        this.keysPressed.push(keyCode);
      }
    },
    
    keyUpHandler: function (event) {
      var keyCode = event.keyCode;
      var keyIndex = this.keysPressed.indexOf(keyCode);
      if (keyIndex !== -1) {
        this.keysPressed.splice(keyIndex, 1);
      }
    },

    loop: function () {
      window.requestAnimFrame(this.loop.bind(this));
      this.render();
    },

    throttledFire: _.throttle(function () {
      this.objects.push(this.playerShip.fire());
    }, 500, { trailing: false }),

    reactToInput: function () {
      var that = this;
      that.playerShip.setVel([0, 0]);
      console.log(this.keysPressed.length);
      _.each(this.keysPressed, function (keyCode) {
        switch(keyCode) {
          case 37: 
            that.playerShip.vel[0] = -3;
            break;
          case 38: 
            that.playerShip.vel[1] = 3;
            break;
          case 39: 
            that.playerShip.vel[0] = 3;
            break;
          case 40: 
            that.playerShip.vel[1] = -3;
            break;
          case 32:
            that.throttledFire();
            break;
        }
      });
    },

    render: function () {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      var that = this;
      var objectsToKill = [];
      this.reactToInput();

      _.each(this.objects, function (object, index) {
        object.show(that.canvas, that.ctx);
        object.move();
        if (object.isOutOfBounds(that.canvas)) {
          objectsToKill.push(index);
        }
      }, this);
      _.each(objectsToKill, function (index) {
        delete that.objects[index];
        that.objects.splice(index, 1);
      });
    }
  });
}(this));
