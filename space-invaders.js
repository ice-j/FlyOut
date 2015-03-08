<<<<<<< HEAD
var mute = function(){
                    var bgsound = document.getElementById('bg-sound');
                    var shootsound = document.getElementById('shoot-sound');
                    var explosionsound = document.getElementById('explosion-sound');
                    var muteIcon = document.getElementById("muteIcon");
                    if(muteIcon.src.indexOf("mute.png") >= 0){
                        bgsound.pause();
                        shootsound.pause();
                        explosionsound.pause();
                        muteIcon.src = "mute-active.png";
                    }else{
                      muteIcon.src = "mute.png";
                        bgsound.play();
                        shootsound.stop();
                        explosionsound.stop();
                    }
                };

document.onload = function() {

  


=======
document.onload = function() {
>>>>>>> origin/gh-pages
  var Game = function() {
    var theCanvas = document.getElementById('screen');
    theCanvas.width = window.innerWidth;
    theCanvas.height = window.innerHeight;
    this.canvas = theCanvas;
    var screen = theCanvas.getContext('2d');
    this.screen = screen;
    this.size = { x: screen.canvas.width, y: screen.canvas.height };
    this.bodies = createInvaders(this).concat(new Player(this));

    this.shootSound = document.getElementById('shoot-sound');
    this.explosionSound = document.getElementById('explosion-sound');

<<<<<<< HEAD
    var joystick = new VirtualJoystick({
      // container: document.getElementById('container'),
      limitStickTravel: true,
    stickRadius : 50,
      mouseSupport  : true
    });
=======
    var joystick = new VirtualJoystick();
>>>>>>> origin/gh-pages
    this.joystick = joystick;


    var self = this;
    var tick = function() {
      self.update();
      self.draw(screen);
      requestAnimationFrame(tick);
    };
    this.score = parseInt(0);
    this.lives = parseInt(3);
    tick();
    


    var init = function(){

      window.addEventListener('resize',function(){
          document.getElementById('screen').width = window.innerWidth;
          document.getElementById('screen').height = window.innerHeight;

          this.updateHeight(window.innerHeight);
          this.updateWidth(window.innerWidth);
      });  
    };
  };

  Game.prototype = {
    update: function() {
      reportCollisions(this.bodies);

      for (var i = 0; i < this.bodies.length; i++) {
        if (this.bodies[i].update !== undefined) {
          this.bodies[i].update();
        }
      }
    },

    draw: function(screen) {
      screen.clearRect(0, 0, this.size.x, this.size.y);
      for (var i = 0; i < this.bodies.length; i++) {
        if (this.bodies[i].draw !== undefined) {
          this.bodies[i].draw(screen);
        }
      }
    },

    invadersBelow: function(invader) {
      return this.bodies.filter(function(b) {
        return b instanceof Invader &&
          Math.abs(invader.center.x - b.center.x) < b.size.x &&
          b.center.y > invader.center.y;
      }).length > 0;
    },

    addBody: function(body) {
      this.bodies.push(body);
    },

    removeBody: function(body) {
      if(body instanceof Player){
        if(this.lives > 1){
          this.decrementLives();
          return;
        }
        else{
          this.over();
        }
      }
      else if(body instanceof Invader)
          this.incrementScore();

      
      var bodyIndex = this.bodies.indexOf(body);
      if (bodyIndex !== -1) {
        this.bodies.splice(bodyIndex, 1);
      }
    },

    incrementScore: function(){
<<<<<<< HEAD
=======
      console.log(this.score);
>>>>>>> origin/gh-pages
      this.score=  parseInt(this.score)+1;
      document.getElementById("score").innerHTML = this.score;
    },

    decrementLives: function(){
      this.lives = parseInt(this.lives)-1;
      document.getElementById("lives").innerHTML = this.lives;
    },

    over: function(){
      this.bodies = [];
<<<<<<< HEAD
      this.decrementLives();
      console.log(this.bodies);
      this.screen.font="20px Times Roman";
      this.screen.fillText("Game Over :(", 400, 400);
        return 1;
=======
      console.log(this.bodies);
      this.screen.font="20px Times Roman";
      this.screen.fillText("Game Over :(", 400, 400);
>>>>>>> origin/gh-pages
    },

    updateHeight: function(height)
    {
      this.size.y = height;
    },

    updateWidth: function(width)
    {
      this.size.x = width;
    }
  };

  var Invader = function(game, center) {
    this.game = game;
    this.center = center;
    this.size = { x: 50, y: 48 };
    this.patrolX = 0;
    this.speedX = 0.3;
    this.enemyImgCount = 0;
  };

  Invader.prototype = {
    update: function() {
      if (this.patrolX < 0 || this.patrolX > 30) {
        this.speedX = -this.speedX;
      }

      if (Math.random() > 0.995 &&
          !this.game.invadersBelow(this)) {
        var bullet = new Bullet(this.game,
                                { x: this.center.x, y: this.center.y + this.size.y / 2 },
<<<<<<< HEAD
                                { x: Math.random() - 0.5, y: 2 }, "invader");
=======
                                { x: Math.random() - 0.5, y: 2 });
>>>>>>> origin/gh-pages
        this.game.addBody(bullet);
      }

      this.center.x += this.speedX;
      this.patrolX += this.speedX;
    },

    draw: function(screen) {
      drawImage(screen, this, "enemy\\"+this.enemyImgCount+".png");
      if(this.enemyImgCount == 15)
        this.enemyImgCount = 0;
      else
        this.enemyImgCount++;
    },

    collision: function() {
<<<<<<< HEAD
      var bgsound = document.getElementById('bg-sound');
      if(!bgsound.paused){
        this.game.explosionSound.load();
        this.game.explosionSound.play();
      }
=======
      this.game.explosionSound.load();
        this.game.explosionSound.play();
>>>>>>> origin/gh-pages
      this.game.removeBody(this);
    }
  };

  var createInvaders = function(game) {
    var invaders = [];
    for (var i = 0; i < 24; i++) {
      var x = 60 + (i % 11) * 150;
      var y = 60 + (i % 4) * 60;
      invaders.push(new Invader(game, { x: x, y: y}));
    }

    return invaders;
  };

  var Player = function(game) {
    this.game = game;
<<<<<<< HEAD
    this.movementSpeed = 5;
=======
>>>>>>> origin/gh-pages
    this.size = { x: 76, y: 102 };
    this.center = { x: this.game.size.x / 2, y: this.game.size.y - 120};
    this.keyboarder = new Keyboarder();

    this.lastFired = Date.now();
    this.playerImgCount = 0;
<<<<<<< HEAD
    this.playerGasImgCount = 0;
=======
>>>>>>> origin/gh-pages
    this.circle = {x: this.game.size.x/2, y: this.game.size.y/2, angle: 0};
  };

  Player.prototype = {
    update: function() {
<<<<<<< HEAD

        var theCanvas= document.getElementById('screen');
      if (this.keyboarder.isDown(this.keyboarder.KEYS.LEFT) || this.game.joystick.left() ) {
        if(this.center.x-this.movementSpeed > 0)
            this.center.x -= this.movementSpeed;
      } else if (this.keyboarder.isDown(this.keyboarder.KEYS.RIGHT) || this.game.joystick.right()) {
        if(this.center.x+this.movementSpeed < theCanvas.width)
        this.center.x += this.movementSpeed;
      }else if (this.keyboarder.isDown(this.keyboarder.KEYS.UP )) {
        //if(this.center.y-this.movementSpeed < theCanvas.width)
        this.center.y -= this.movementSpeed;
      }else if (this.keyboarder.isDown(this.keyboarder.KEYS.DOWN )) {
        //if(this.center.y-this.movementSpeed < theCanvas.width)
        this.center.y += this.movementSpeed;
=======
      if (this.keyboarder.isDown(this.keyboarder.KEYS.LEFT) || this.game.joystick.left() ) {
        if(this.center.x-2 > 0)
            this.center.x -= 2;
      } else if (this.keyboarder.isDown(this.keyboarder.KEYS.RIGHT || this.game.joystick.right())) {
        var theCanvas= document.getElementById('screen');
        if(this.center.x+2 < theCanvas.width)
        this.center.x += 2;
>>>>>>> origin/gh-pages
      }
      else if(this.keyboarder.isDown(this.keyboarder.KEYS.X)){
        console.log("x')");
        this.kamikaze();
      }

      if (this.keyboarder.isDown(this.keyboarder.KEYS.SPACE) || this.game.joystick.up()) {
        
        var bullet = new Bullet(this.game,
                                { x: this.center.x, y: this.center.y - this.size.y - 10 },
<<<<<<< HEAD
                                { x: 0, y: -7 }, "player");
        this.game.addBody(bullet);
        var bgsound = document.getElementById('bg-sound');
      if(!bgsound.paused){
        this.game.shootSound.load();
        this.game.shootSound.play();
      }
      }
=======
                                { x: 0, y: -7 });
        this.game.addBody(bullet);
        this.game.shootSound.load();
        this.game.shootSound.play();
      }
>>>>>>> origin/gh-pages
    },

    draw: function(screen) {
      drawImage(screen, this, "player\\"+this.playerImgCount+".png");
      if(this.playerImgCount == 14)
        this.playerImgCount = 0;
      else
        this.playerImgCount++;
<<<<<<< HEAD
this.size = { x: 76, y: 102 };
      drawImage(screen, {size: {x: 64, y: 128}, center: {x: this.center.x, y: this.center.y+90 } }, "player\\gas\\"+this.playerGasImgCount+".png");
      if(this.playerGasImgCount == 15)
        this.playerGasImgCount = 0;
      else
        this.playerGasImgCount++;
=======
>>>>>>> origin/gh-pages
    },

    collision: function() {
      this.game.removeBody(this);
    },

    kamikaze: function(){
      for(var i =0; i< 100;i++){
        this.center.x = this.circle.centerX + Math.cos(this.circle.angle) * this.circle.radius;
        circle.angle += ball.speed;
      };
    }
  };

<<<<<<< HEAD
  var Bullet = function(game, center, velocity, shooter) {
    this.shooter= shooter;
=======
  var Bullet = function(game, center, velocity) {
>>>>>>> origin/gh-pages
    this.game = game;
    this.center = center;
    this.size = { x: 3, y: 3 };
    this.velocity = velocity;

<<<<<<< HEAD
    this.enemyBullet = "enemy\\bullet.png";
    this.playerBullet = "player\\bullet.png";
=======
    this.bulletImage = "player\\bullet.png";
>>>>>>> origin/gh-pages
  };

  Bullet.prototype = {
    update: function() {
      this.center.x += this.velocity.x;
      this.center.y += this.velocity.y;

      var screenRect = {
        center: { x: this.game.size.x / 2, y: this.game.size.y / 2 },
        size: this.game.size
      };

      if (!isColliding(this, screenRect)) {
        this.game.removeBody(this);
      }
    },

    draw: function(screen) {
<<<<<<< HEAD
      if(this.shooter == "invader")
      drawImage(screen, this, this.enemyBullet);
    else
      drawImage(screen,this, this.playerBullet);
=======

      drawImage(screen, this, this.bulletImage);
>>>>>>> origin/gh-pages
    },

    collision: function() {
      this.game.removeBody(this);
    }
  };

  var Keyboarder = function() {
    var keyState = {};
    window.addEventListener('keydown', function(e) {
      keyState[e.keyCode] = true;
    });

    window.addEventListener('keyup', function(e) {

      keyState[e.keyCode] = false;
    });

    this.isDown = function(keyCode) {
      return keyState[keyCode] === true;
    };

<<<<<<< HEAD
    this.KEYS = { LEFT: 37, RIGHT: 39, SPACE: 32, X:45, UP: 38, DOWN: 40 };
=======
    this.KEYS = { LEFT: 37, RIGHT: 39, SPACE: 32, X:45 };
>>>>>>> origin/gh-pages
  };

  var drawRect = function(screen, body) {
    screen.fillRect(body.center.x - body.size.x / 2,
                    body.center.y - body.size.y / 2,
                    body.size.x,
                    body.size.y);
  };

  var drawImage = function(screen, body, image) {
<<<<<<< HEAD
    var htmlImage = new Image();
    htmlImage.src = image;
    screen.drawImage(htmlImage,
=======
    var playerNowImage = new Image();
    playerNowImage.src = image;
    screen.drawImage(playerNowImage,
>>>>>>> origin/gh-pages
                    body.center.x - body.size.x/2,
                    body.center.y);
  };

  var isColliding = function(b1, b2) {
    return !(
      b1 === b2 ||
        b1.center.x + b1.size.x / 2 <= b2.center.x - b2.size.x / 2 ||
        b1.center.y + b1.size.y / 2 <= b2.center.y - b2.size.y / 2 ||
        b1.center.x - b1.size.x / 2 >= b2.center.x + b2.size.x / 2 ||
        b1.center.y - b1.size.y / 2 >= b2.center.y + b2.size.y / 2
    );
  };

  var reportCollisions = function(bodies) {
    var bodyPairs = [];
    for (var i = 0; i < bodies.length; i++) {
      for (var j = i + 1; j < bodies.length; j++) {
        if (isColliding(bodies[i], bodies[j])) {
          bodyPairs.push([bodies[i], bodies[j]]);
        }
      }
    }

    for (var i = 0; i < bodyPairs.length; i++) {
      if (bodyPairs[i][0].collision !== undefined) {
        bodyPairs[i][0].collision(bodyPairs[i][1]);
      }

      if (bodyPairs[i][1].collision !== undefined) {
        bodyPairs[i][1].collision(bodyPairs[i][0]);
      }
    }
  };

  window.addEventListener('load', function() {
    new Game();
  });
  
  
}();
