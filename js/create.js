function create() {
  // Add background sky
  this.add.image(400, 300, 'sky');

  // Initialize platforms objecsts
  platforms = this.physics.add.staticGroup();
  platforms.create(400, 568, 'ground').setScale(2).refreshBody();
  platforms.create(600, 400, 'ground');
  platforms.create(50, 250, 'ground');
  platforms.create(750, 220, 'ground');

  // Initialize stars objects
  stars = this.physics.add.group({
    key: 'star',
    repeat: 11,
    setXY: { x: 12, y: 0, stepX: 70}
  });
    stars.children.iterate(function(child){
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
  })
  // Add collider with the platforms
  this.physics.add.collider(stars, platforms);

  // Initialize player
  player = this.physics.add.sprite(100, 450, 'dude');
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);
  player.body.gravity.y = 500;
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
  // Add collider with platforms
  this.physics.add.collider(player, platforms);

  // Add cursor so that player can move
  cursors = this.input.keyboard.createCursorKeys();

  // Check up player overlap with star
  this.physics.add.overlap(player, stars, collectStar, null, this);

  scoreText = this.add.text(16,16, 'score: 0', {fontsize: '32px', fill: '#fff'});

  bombs = this.physics.add.group();
  this.physics.add.collider(bombs, platforms);
  this.physics.add.collider(player, bombs, hitBomb, null, this);
}

function collectStar(player, star) {
  star.disableBody(true, true);
  score += 10;
  scoreText.setText('score:' + score);

  if (stars.countActive(true) === 0) {
    stars.children.iterate(function (child) {
      child.enableBody(true, child.x, 0, true, true);
    })

    var x = (player.x < 400) ? Phaser.Math.Between(400, 800):   Phaser.Math.Between(0, 400);
    var bomb = bombs.create(x, 16, 'bomb');
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200,200), 20);
    bomb.allowGravity = false;
  }
}

function hitBomb(player, bomb) {
  this.physics.pause();
  player.setTint(0xff0000);
  player.anims.play('turn');
  gameOver = true;
}
