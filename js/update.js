
// Game update loop
function update() {
  // Move player left and right
  if (cursors.left.isDown) {
    player.setVelocityX(-160);
    player.anims.play('left', true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(160);
    player.anims.play('right', true);
  } else {
    player.setVelocityX(0);
    player.anims.play('turn');
  }

  // Player jump
  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-330);
  }
}
