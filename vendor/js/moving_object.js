(function (root) {
  var SpaceGame = root.SpaceGame = (root.SpaceGame || {});

  var MovingObject = SpaceGame.MovingObject = function (pos, vel, img) {
    this.pos = pos;
    this.vel = vel;

    if (img) this.setImage(img);
  };

  _.extend(MovingObject.prototype, {
    move: function () {
      this.pos[0] += this.vel[0];
      this.pos[1] += this.vel[1];
    },

    collidesWith: function (movingObject) {
      var imageWidth = movingObject.getRealWidth();
      var imageHeight = movingObject.getRealHeight();
      var imagePos = movingObject.getRealPos();
      var selfWidth = this.getRealWidth();
      var selfHeight = this.getRealHeight();
      var selfPos = this.getRealPos();

      return selfPos[0] <= imagePos[0] + imageWidth &&
        selfPos[0] + selfWidth >= imagePos[0] &&
        selfPos[1] + selfHeight >= imagePos[1] &&
        selfPos[1] <= imagePos[1] + imageHeight;
    },

    show: function (canvas, ctx) {
      if (this.img) {
        ctx.drawImage(
          this.getImage(), 
          this.pos[0],
          this.pos[1]
        );
      } else {
        this.drawPath(canvas, ctx);
      }
    },

    isOutOfBounds: function (canvas) {
      var halfWidth = canvas.width / 2;
      var halfHeight = canvas.height / 2;

      if (this.type != 'ship' && this.type != 'shot') {
        return (this.pos[0] > halfWidth || this.pos[0] < -halfWidth ||
                      this.pos[1] > halfHeight || this.pos[1] < -halfHeight);
      } else {
        return false;
      }
    },

    //Getters and setters
    setImage: function (img) {
      this.img = new Image();
      this.img.src = img;
    },

    getImage: function () {
      return this.img;
    },

    setVel: function (vel) {
      this.vel = vel;
    },

    getVel: function () {
      return this.vel;
    },

    setPos: function (vel) {
      this.pos = pos;
    },

    getPos: function () {
      return this.pos;
    },

    getRealPos: function () {
      var pos = this.getPos().slice(0);
      if (this.type == 'enemy') {
        switch (this.originalOrientation) {
          case 0:
            pos[0] = 250 + pos[0];
            pos[1] = 250 + pos[1];
            break;
          case -1:
            var tmp = [0, 0];
            tmp[0] = 250 - (pos[1] + this.getRealWidth());
            tmp[1] = 250 + pos[0];
            pos = tmp;
            break;
          case 1:
            var tmp = [0, 0];
            tmp[0] = 250 + pos[1];
            tmp[1] = 250 - (pos[0] + this.getRealHeight());
            pos = tmp;
            break;
        }
      }
      return pos;
    },

    getRealWidth: function () {
      var width = this.getImage().width;
      if (this.type == 'enemy') {
        switch (this.originalOrientation) {
          case 1:
            width = this.getImage().height;
            break;
          case -1:
            width = this.getImage().height;
            break;
        }
      }
      return width;
    },

    getRealHeight: function () {
      var height = this.getImage().height;
      if (this.type == 'enemy') {
        switch (this.originalOrientation) {
          case 1:
            height = this.getImage().width;
            break;
          case -1:
            height = this.getImage().width;
            break;
        }
      }
      return height;
    }
  });
})(this);
