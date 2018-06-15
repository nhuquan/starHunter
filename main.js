var config = {
  tpe: Phaser.AUTO,
  width: 800,
  height:600,
  backgroundColor: "black",
  physics: {
    default: 'arcade',
     arcade: {
         gravity: { y: 300 },
         debug: false
     }
  },
  scene: {
    "preload": preload,
    "create": create,
    "update": update
  }
}

var game = new Phaser.Game(config);

function preload() {
  this.load.image('sky', "assets/sky.png");
  this.load.image('ground', "assets/ground.png");
  this.load.image('bird', "assets/pig.png");
  this.load.image('pipe', "assets/pipe.png");
  this.load.audio('jump', 'assets/jump.wav');

  this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
}

function create() {
  this.add.image(400, 300, 'sky');

  platforms = this.physics.add.staticGroup();
  platforms.create(400, 568, 'ground').setScale(2).refreshBody();

  platforms.create(600, 400, 'ground');
  platforms.create(50, 250, 'ground');
  platforms.create(750, 220, 'ground');

  player = this.physics.add.sprite(100, 450, 'dude');

  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
  });

  this.anims.create({
      key: 'turn',
      frames: [ { key: 'dude', frame: 4 } ],
      frameRate: 20
  });

  this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
  });


}

function update() {

}

var mainState = {
  preload: function() {
      this.load.image('bird', "assets/pig.png");
      this.load.image('pipe', "assets/pipe.png");
      this.load.audio('jump', 'assets/jump.wav');
  },
  create: function() {
      //game.physics.startSystem(Phaser.Physics.ARCADE);

      this.bird = this.add.sprite(100, 245, "bird");

      game.physics.arcade.enable(this.bird);

      this.bird.body.gravity.y = 1000;

      var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

      spaceKey.onDown.add(this.jump, this);

      this.pipes = game.add.group();

      this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);

      this.score = 0;
      this.labelScore = game.add.text(20,20,"0",{
        font: "30px Arial", fill: "#ffffff"
      });

      this.bird.anchor.setTo(-0.2,0.5);

      this.jumpSound = game.add.audio('jump');
  },
  update: function(){
    if (this.bird.y < 0 || this.bird.y > 490)
      this.restartGame();

    game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this);

    if (this.bird.angle < 20)
      this.bird.angle += 1;
  },
  jump: function() {
      if (this.bird.alive == false)
        return;

      this.bird.body.velocity.y = -350;

      var animation  = game.add.tween(this.bird);
      animation.to({angle: -20}, 100);

      animation.start();

      this.jumpSound.play();
  },
  restartGame: function() {
    game.state.start('main');
  },
  addOnePipe: function(x, y) {
    var pipe = game.add.sprite(x, y, 'pipe');
    this.pipes.add(pipe);

    game.physics.arcade.enable(pipe);

    pipe.body.velocity.x = -200;

    pipe.checkWorldBounds = true;
    pipe.outOfBoundsKill = true;
  },
  addRowOfPipes: function() {
    var hole = Math.floor(Math.random() * 5) + 1;
    for(var i= 0 ; i < 8; i++){
      if (i!=hole && i != hole + 1)
        this.addOnePipe(400, i * 60 + 10);
    }
    this.score +=1;
    this.labelScore.text = this.score;
  },
  hitPipe: function() {
    if (this.bird.alive == false)
      return;

    this.bird.alive = false;

    game.time.events.remove(this.timer);

    this.pipes.forEach(function(p) {
      p.body.velocity.x = 0;
    })
  }
}
