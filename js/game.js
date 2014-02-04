(function (root) {
  var SpaceGame = root.SpaceGame = (root.SpaceGame || {});

  var Game = SpaceGame.Game = function () {
    this.playerShip = new SpaceGame.Ship([200, 400], [0, 0], 'images/ship.png');
    this.objects = [];
    this.keysPressed = [];
    this.objectsToKill = [];
    this.theta = 0;
    this.orientation = 0;
    this.stars = [];

    this.objects.push(this.playerShip);
  };

  _.extend(Game.prototype, {
    start: function () {
      document.onkeydown = this.keyDownHandler.bind(this);
      document.onkeyup = this.keyUpHandler.bind(this);
      this.canvas = document.getElementById('game');
      this.ctx = this.canvas.getContext('2d');
      this.ctx.translate(this.canvas.width / 2,
                         this.canvas.height / 2);
      this.baddie_generator = new SpaceGame.BaddieGenerator(this.canvas);
      for (var i = 0; i < 500; i++) {
        this.stars.push([
          Math.random() * this.canvas.width - this.canvas.width / 2, 
          Math.random() * this.canvas.height - this.canvas.height / 2
        ]);
      }
      this.loop();
    },

    keyDownHandler: function (event) {
      var keyCode = event.keyCode;
      if (this.keysPressed.indexOf(keyCode) === -1) {
        this.keysPressed.push(keyCode);
      }
    },
    
    keyUpHandler: function (event) {
      this.playerShip.setVel([0, 0]);
      var keyCode = event.keyCode;
      var keyIndex = this.keysPressed.indexOf(keyCode);
      if (keyIndex !== -1) {
        this.keysPressed.splice(keyIndex, 1);
      }
    },

    test: _.throttle(function () {
      this.objects = this.objects.concat(this.baddie_generator.wave('top'));
      this.objects = this.objects.concat(this.baddie_generator.wave('right'));
      this.objects = this.objects.concat(this.baddie_generator.wave('left'));
    }, 1000, { trailing: false }),

    loop: function () {
      this.test();
      window.requestAnimFrame(this.loop.bind(this));
      this.render();
    },

    throttledFire: _.throttle(function () {
      this.objects.push(this.playerShip.fire());
    }, 200, { trailing: false }),

    throttledSpin: _.throttle(function (dir) {
      this['spinning' + dir] = true;
    }, 200, { trailing: false }),

    SHIP_SPEED: 5,

    reactToInput: function () {
      var that = this;
      _.each(this.keysPressed, function (keyCode) {
        switch(keyCode) {
          case 37: 
            that.playerShip.vel[0] = -that.SHIP_SPEED;
            break;
          case 38: 
            that.playerShip.vel[1] = -that.SHIP_SPEED;
            break;
          case 39: 
            that.playerShip.vel[0] = that.SHIP_SPEED;
            break;
          case 40: 
            that.playerShip.vel[1] = that.SHIP_SPEED;
            break;
          case 32:
            that.throttledFire();
            break;
          case 68:
            that.throttledSpin('Right');
            break;
          case 65:
            that.throttledSpin('Left');
            break;
        }
      });
    },

    checkCollisions: function () {
    },

    ROTATION_SPEED: Math.PI / 10,

    handleRotations: function () {
      var that = this;
      _.each(['Right', 'Left'], function (dir) {
        if (that['spinning' + dir]) {
          if ((that.spinningRight && that.theta >= Math.PI / 2) ||
              (that.spinningLeft && that.theta <= -( Math.PI / 2 ))) {
            that['spinning' + dir] = false;
            that.theta = 0;

            //store orientation to know which way enemies are pointing
            that.orientation += (dir === 'Right' ? 1 : -1);
            that.orientation = that.orientation % 4;
          } else {
            that.ctx.rotate(dir == 'Right' ? that.ROTATION_SPEED : -that.ROTATION_SPEED);
            that.theta += (dir == 'Right' ? that.ROTATION_SPEED : -that.ROTATION_SPEED);
          }
        }
      });
    },

    clearAndPaintBackground: function () {
      this.ctx.clearRect(
        -(this.canvas.width / 2), 
        -(this.canvas.height / 2), 
        this.canvas.width, 
        this.canvas.height
      );
      this.ctx.fillStyle = '#000000';
      this.ctx.fillRect(
        -(this.canvas.width / 2), 
        -(this.canvas.height / 2), 
        this.canvas.width, 
        this.canvas.height
      );
      for (var i = 0; i < this.stars.length; i++) {
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(
          this.stars[i][0],
          this.stars[i][1],
          (Math.random()) * 1.5,
          1
        );
      }
    },

    showAndMove: function (object, index) {
      object.show(this.canvas, this.ctx);
      object.move();
      if (object.isOutOfBounds(this.canvas)) {
        this.objectsToKill.push(index);
      }
    },

    garbageCollectObjects: function () {
      var that = this;
      _.each(this.objectsToKill, function (index) {
        if (that.objects[index] && that.objects[index].type === 'enemy') {
          that.baddie_generator.remove(1);
        }
        that.objects.splice(index, 1);
      });
      this.objectsToKill = [];
    },

    render: function () {
      var that = this;
      var objectsToKill = [];

      this.clearAndPaintBackground();
      this.reactToInput();
      this.handleRotations();

      _.each(this.objects, function (object, index) {
        if (object === null)
          return;
        if (object.type === 'ship' || object.type === 'shot') {
          that.ctx.save();
          that.ctx.setTransform(1, 0, 0, 1, 0, 0);
          that.showAndMove(object, index);
          that.ctx.restore();
        } else {
          that.showAndMove(object, index);
        }
      }, this);

      this.garbageCollectObjects();
    }
  });
}(this));
