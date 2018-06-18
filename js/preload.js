function preload() {
  this.load.image('sky', "assets/sky.png");
  this.load.image('ground', "assets/ground.png");
  this.load.image('bomb', "assets/bomb.png");
  this.load.image('star', "assets/star.png");
  this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
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
