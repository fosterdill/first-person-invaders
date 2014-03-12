(function (root) {
  var SpaceGame = root.SpaceGame = (root.SpaceGame || {});

  var Game = SpaceGame.Game = function () {
    this.playerShip = new SpaceGame.Ship([200, 400], [0, 0], 'images/ship.png');
    this.objects = [];
    this.bullets = [];
    this.enemies = [];
    this.keysPressed = [];
    this.objectsToKill = [];
    this.theta = 0;
    this.orientation = 0;
    this.stars = [];
    this.score = 0;
    this.orientation = 0;

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
      for (var i = 0; i < 300; i++) {
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

    loop: function () {
      if (this.baddie_generator.totalCount >= this.baddie_generator.ALL_BADDIES) {
        var that = this;
        this.drawEndScreen();
        document.onkeydown = function (event) {
          if (event.keyCode === 82) {
            var game = new SpaceGame.Game();
            game.start();
          }
        };
        return;
      }
      if (this.baddie_generator.baddieCount < this.baddie_generator.MAX_BADDIES) {
        var index = parseInt(Math.random() * 3);
        var side = ['right', 'top', 'left'][index];
        this.enemies = this.enemies.concat(this.baddie_generator.wave(side, this.orientation));
      }
      window.requestAnimFrame(this.loop.bind(this));
      this.render();
    },

    throttledFire: _.throttle(function () {
      this.bullets.push(this.playerShip.fire());
    }, 150, { trailing: false }),

    throttledSpin: _.throttle(function (dir) {
      this['spinning' + dir] = true;
    }, 50, { trailing: false }),

    drawEndScreen: function () {
        var accuracy = (this.baddie_generator.killedBaddies * 100) / (this.bullets.length + this.baddie_generator.killedBaddies);
        var missed = this.baddie_generator.ALL_BADDIES - this.baddie_generator.killedBaddies - 3;
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.font="30px Georgia";
        this.ctx.fillText(missed - 1 + ' missed kills',160,50);
        this.ctx.fillText(parseInt(accuracy) + '% accuracy',160,100);
        this.ctx.fillText(parseInt(accuracy * 1000 / missed) + ' points',160,150);
        this.ctx.fillText("Press r to try again", 130, 200);
    },

    SHIP_SPEED: 8,

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

    ENEMY_POINT_VALUE: 5,

    explodeEnemy: function (bullet, enemy) {
      this.bullets.splice(this.bullets.indexOf(bullet), 1);
      this.enemies.splice(this.enemies.indexOf(enemy), 1);
      this.baddie_generator.remove(1);
      this.baddie_generator.killedBaddies += 1;
      this.score += this.ENEMY_POINT_VALUE;
    },

    checkCollisions: function () {
      var that = this;

      _.each(this.bullets, function (bullet) {
        _.each(that.enemies, function (enemy) {
          if ((enemy.orientation % 4) != 0) {
            return;
          } else if (bullet.collidesWith(enemy)) {
            that.explodeEnemy(bullet, enemy);
          }
        });
      });
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


            that.orientation += (dir === 'Right' ? 1 : -1);
            _.each(that.enemies, function (baddie) {
              baddie.orientation += (dir === 'Right' ? 1 : -1);
            });
          } else {
            that.ctx.rotate(dir == 'Right' ? that.ROTATION_SPEED : -that.ROTATION_SPEED);
            that.theta += (dir == 'Right' ? that.ROTATION_SPEED : -that.ROTATION_SPEED);
          }
        }
      });
    },

    eachBaddie: function (callback) {
      _.each(this.enemies, callback.bind(this));
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

    showAndMove: function (object) {
      var index = 0;
      object.show(this.canvas, this.ctx);
      object.move();
      switch (object.type) {
        case 'enemy':
          index = this.enemies.indexOf(object);
          break;
        case 'bullet':
          index = this.bullets.indexOf(object);
          break;
      }
      if (object.isOutOfBounds(this.canvas)) {
        this.objectsToKill.push([index, object.type]);
      }
    },

    garbageCollectObjects: function () {
      var that = this;
      _.each(this.objectsToKill, function (data) {
        switch (data[1]) {
          case 'enemy':
            that.enemies.splice(data[0], 1);
            that.baddie_generator.remove(1);
            break;
          case 'shot':
            that.bullets.splice(data[0], 1);
            break;
        }
      });
      this.objectsToKill = [];
    },

    render: function () {
      var that = this;
      var objectsToKill = [];
      var objects = [];

      this.checkCollisions();
      this.clearAndPaintBackground();
      this.reactToInput();
      this.handleRotations();

      objects = this.objects.concat(this.enemies);
      objects = objects.concat(this.bullets);

      _.each(objects, function (object) {
        if (object === null)
          return;
        if (object.type === 'ship' || object.type === 'shot') {
          that.ctx.save();
          that.ctx.setTransform(1, 0, 0, 1, 0, 0);
          that.showAndMove(object);
          that.ctx.restore();
        } else {
          that.showAndMove(object);
        }
      }, this);

      this.garbageCollectObjects();
    }
  });
}(this));
