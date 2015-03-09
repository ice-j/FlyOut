'use strict'; 
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

var game;
  

document.onload = function() {

  window.addEventListener('load', function() {
    game = new Game();
  });
  
  window.addEventListener('resize',function(){
    game.init();
  });


  var Game = function() {
    var theCanvas = document.getElementById('screen');
    theCanvas.width = window.innerWidth;
    theCanvas.height = window.innerHeight;
    this.canvas = theCanvas;
    var screen = theCanvas.getContext('2d');
    this.screen = screen;
    this.size = { x: screen.canvas.width, y: screen.canvas.height };
    this.bodies = createInvaders(this).concat(new Player(this));
    this.explosions = [];
    this.shootSound = document.getElementById('shoot-sound');
    this.explosionSound = document.getElementById('explosion-sound');

    var joystick = new VirtualJoystick({
      // container: document.getElementById('container'),
      limitStickTravel: true,
    // mouseSupport: true,
    stickRadius : 50
    });
    this.joystick = joystick;
    this.animFrameId = 0;

    var self = this;
    var tick = function() {
      self.update();
      self.draw(screen);
      self.animFrameId = requestAnimationFrame(tick);
    };
    this.score = parseInt(0);
    this.lives = parseInt(3);
    this.newBossCount = 100;
    tick();
    


    var init = function(){

      window.addEventListener('resize',function(){
          document.getElementById('screen').width = window.innerWidth;
          document.getElementById('screen').height = window.innerHeight;

          this.updateHeight(window.innerHeight);
          this.updateWidth(window.innerWidth);
      });  
    };

    init();
  };

  Game.prototype = {
    update: function() {
      if(this.score > this.newBossCount){
        this.bodies = this.bodies.concat(createBoss(this));
        this.newBossCount*=2;
      }
      reportCollisions(this.bodies);

      for (var i = 0; i < this.bodies.length; i++) {
        if(this.bodies[i].center.y > this.size.y){
          this.removeBody(this.bodies[i]);
          continue;
        }
        if (this.bodies[i].update !== undefined) {
          this.bodies[i].update();
        }
      }

      for(var i=0;i<this.explosions.length;i++)
      {
          this.explosions[i].update();
      }

      var bonusLife = Math.random() * (1 - 2) + 1;
      if(bonusLife > 0.999 && this.lives)
        this.incrementLives();
    },

    draw: function(screen) {
      screen.clearRect(0, 0, this.size.x, this.size.y);
      for (var i = 0; i < this.bodies.length; i++) {
        if (this.bodies[i].draw !== undefined) {
          this.bodies[i].draw(screen);
        }
      }
      var explImageCount = 0;
      for(var i=0;i<this.explosions.length;i++)
      {
        this.explosions[i].draw(screen);
        explImageCount = this.explosions[i].imageCount;
      }
      if(explImageCount === 8)
        this.decrementLives();
      if(this.lives < 1)
      {
        this.screen.font = "72px Arial";
        this.screen.strokeStyle = "white";
        this.screen.strokeText("Game Over :(",200,200);
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
          this.decrementLives();
          return;
      }
      else if(body instanceof Invader)
          this.incrementScore();

      
      var bodyIndex = this.bodies.indexOf(body);
      if (bodyIndex !== -1) {
        this.bodies.splice(bodyIndex, 1);
      }

      if(this.bodies.length <=10 && this.bodies.length > 0)
      {
        if(this.explosions.length === 0)
          this.bodies = createInvaders(this).concat(this.bodies); 
      }
    },

    incrementScore: function(){
      this.score=  parseInt(this.score)+1;
      document.getElementById("score").innerHTML = this.score;
    },

    decrementLives: function(){
      this.lives = parseInt(this.lives)-1;
      document.getElementById("lives").innerHTML = this.lives;
      if(this.lives < 1){
          this.over();
      }
    },

    incrementLives: function(){
      this.lives = parseInt(this.lives)+1;
      document.getElementById("lives").innerHTML = this.lives;
    },

    over: function(){
      this.bodies = [];
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
                                { x: Math.random() - 0.5, y: 2 }, "invader");
        this.game.addBody(bullet);
      }

      this.center.x += this.speedX;
      this.patrolX += this.speedX;
      this.center.y += 0.3;
    },

    draw: function(screen) {
      drawImage(screen, this, "enemy\\"+this.enemyImgCount+".png");
      if(this.enemyImgCount == 15)
        this.enemyImgCount = 0;
      else
        this.enemyImgCount++;
    },

    collision: function() {
      var bgsound = document.getElementById('bg-sound');
      if(!bgsound.paused){
        this.game.explosionSound.load();
        this.game.explosionSound.play();
      }
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
    this.movementSpeed = 5;
    this.size = { x: 76, y: 102 };
    this.center = { x: this.game.size.x / 2, y: this.game.size.y - 120};
    this.keyboarder = new Keyboarder();

    this.lastFired = Date.now();
    this.playerImgCount = 0;
    this.playerGasImgCount = 0;
  };

  Player.prototype = {
    update: function() {

        var theCanvas= document.getElementById('screen');
      if (this.keyboarder.isDown(this.keyboarder.KEYS.LEFT) || this.game.joystick.left() ) {
        if(this.center.x-this.movementSpeed > 0)
            this.center.x -= this.movementSpeed;
      } else if (this.keyboarder.isDown(this.keyboarder.KEYS.RIGHT) || this.game.joystick.right()) {
        if(this.center.x+this.movementSpeed < theCanvas.width)
        this.center.x += this.movementSpeed;
      }
      // }else if (this.keyboarder.isDown(this.keyboarder.KEYS.UP )) {
      //   //if(this.center.y-this.movementSpeed < theCanvas.width)
      //   this.center.y -= this.movementSpeed;
      // }else if (this.keyboarder.isDown(this.keyboarder.KEYS.DOWN )) {
      //   //if(this.center.y-this.movementSpeed < theCanvas.width)
      //   this.center.y += this.movementSpeed;
      // }
      else if(this.keyboarder.isDown(this.keyboarder.KEYS.X)){
        console.log("x')");
        this.kamikaze();
      }

      if (this.keyboarder.isDown(this.keyboarder.KEYS.SPACE) || this.game.joystick.up()) {
        
        var bullet = new Bullet(this.game,
                                { x: this.center.x -10 , y: this.center.y - this.size.y +40},
                                { x: 0, y: -10 }, "player");
        this.game.addBody(bullet);
        var bgsound = document.getElementById('bg-sound');
      if(!bgsound.paused){
        this.game.shootSound.load();
        this.game.shootSound.play();
      }
      }
    },

    draw: function(screen) {
      drawImage(screen, this, "player\\"+this.playerImgCount+".png");
      if(this.playerImgCount == 14)
        this.playerImgCount = 0;
      else
        this.playerImgCount++;
this.size = { x: 76, y: 102 };
      drawImage(screen, {size: {x: 64, y: 128}, center: {x: this.center.x, y: this.center.y+90 } }, "player\\gas\\"+this.playerGasImgCount+".png");
      if(this.playerGasImgCount == 15)
        this.playerGasImgCount = 0;
      else
        this.playerGasImgCount++;
    },

    collision: function() {
      this.game.removeBody(this);
    },

    kamikaze: function(){
      console.log("kamikaze!!!!");
      for(var i=0;i<this.game.bodies.length;i++)
      {
        if(this.game.bodies[i] instanceof Invader || this.game.bodies[i] instanceof Boss)
        {
          this.game.explosions.push(new Explosion(this.game,this.game.bodies[i].center));
          this.game.removeBody(this.game.bodies[i]);
        }
      }
      
    }
  };

  var Bullet = function(game, center, velocity, shooter) {
    this.shooter= shooter;
    this.game = game;
    this.center = center;
    this.size = { x: 3, y: 3 };
    this.velocity = velocity;
    this.enemyBullet = "enemy\\bullet.png";
    this.playerBullet = "player\\bullet.png";
    this.bossBullet = "boss\\bullet.png";
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
      if(this.shooter == "invader")
      drawImage(screen, this, this.enemyBullet);
    else if(this.shooter == "boss")
      drawImage(screen, this, this.bossBullet);
    else
      drawImage(screen,this, this.playerBullet);
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

    this.KEYS = { LEFT: 37, RIGHT: 39, SPACE: 32, X:88, UP: 38, DOWN: 40 };
  };

  var drawRect = function(screen, body) {
    screen.fillRect(body.center.x - body.size.x / 2,
                    body.center.y - body.size.y / 2,
                    body.size.x,
                    body.size.y);
  };

  var drawImage = function(screen, body, image) {
    var htmlImage = new Image();
    htmlImage.src = image;
    screen.drawImage(htmlImage,
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
        if (isColliding(bodies[i], bodies[j]) && (bodies[i] instanceof Player || bodies[j] instanceof Player
                                              || (bodies[i].shooter === "player")
                                              || (bodies[j].shooter === "player"))) {
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


  var Boss = function(game) {
    this.game = game;
    this.center = {x: this.game.size.x /2,y: 50};
    this.size = { x: 60, y: 78 };
    this.patrolX = 0;
    this.speedX = 0.3;
    this.bossImgCount = 0;
    this.health = 1000;
  };

  Boss.prototype = {
    update: function() {
      if (this.patrolX < 0 || this.patrolX > 30) {
        this.speedX = -this.speedX;
      }

      if (Math.random() > 0.995)
      {
        var bullet = new Bullet(this.game,
                                { x: this.center.x, y: this.center.y + this.size.y / 2 },
                                { x: Math.random() - 0.5, y: 2 }, "boss");
        this.game.addBody(bullet);
        }
      this.center.x += this.speedX;
      this.patrolX += this.speedX;
    },

    draw: function(screen) {
      drawImage(screen, this, "boss\\"+this.bossImgCount+".png");
      if(this.bossImgCount == 15)
        this.bossImgCount = 0;
      else
        this.bossImgCount++;
    },

    collision: function() {
      var bgsound = document.getElementById('bg-sound');
      if(!bgsound.paused){
        this.game.explosionSound.load();
        this.game.explosionSound.play();
      }
      this.health-=100;
      console.log('bosshit');
      if(this.health < 1){
        this.game.removeBody(this);
        console.log("bossdead");
      }
    }
  };

  var createBoss = function(game) {
    var boss =  [new Boss(game)];
    console.log(boss);
    return boss;
  };

  var Explosion = function(game, center) {
    this.game = game;
    this.center = center;
    this.size = { x: 3, y: 3 };
    this.imageCount = 0;
  };

  Explosion.prototype = {
    update: function() {
      for(var i=0;i<this.game.explosions.length;i++)
      {
        if(this.game.explosions[i].imageCount > 8)
        {
          var index = this.game.explosions.indexOf(this.game.explosions[i]);
          this.game.explosions.splice(index,1);
        }
      }
      
    },
    draw: function(screen) {
      drawImage(screen, this, "explosion\\"+this.imageCount + ".png");
      this.imageCount++;

    }
  };
}();

