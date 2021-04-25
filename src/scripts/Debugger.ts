import MainScene from './scenes/MainScene';

export default class Debugger {
  scene: MainScene;
  active: boolean;
  private debugText: Phaser.GameObjects.Text;
  constructor(scene: MainScene) {
    this.scene = scene;
  }

  create() {
    this.active = false;
    this.debugText = this.scene.add.text(500, 500, 'Debug', { font: '5px Courier' }).setScrollFactor(0);
    this.debugText.setVisible(false);
  }

  toggle() {
    this.active = !this.active;

    if (this.active) {
      this.debugText.setVisible(true);
      this.scene.game.config.physics.matter.debug = {};
      this.debugText.setDepth(5);
    } else {
      this.debugText.setVisible(false);
      this.scene.game.config.physics.matter.debug = false;
    }
  }

  update() {
    if (!this.active) {
      return;
    }

    const character = this.scene.character;
    const pointer = character.entitie.body;
    const cursors = character.cursors;
    this.debugText.setText([
      'position x: ' + character.entitie.x,
      'position y: ' + character.entitie.y,
      'velocity x: ' + pointer.velocity.x,
      'velocity y: ' + pointer.velocity.y,
      'left: ' + cursors.left.isDown,
      'right: ' + cursors.right.isDown,
      'facing: ' + character.facing,
      'direction: ' + character.direction,
      'jumpDirection: ' + character.jumpDirection,
      'jumpKey :' + character.jumpKey.isDown,
      'canJump: ' + character.canJump,
      'currentRay: ' + character.currentRay,
      'canShoot: ' + character.canShoot,
      'canMove: ' + character.canMove,
      'isInAir: ' + character.isInAir,
      // 'animation: ' + character.entitie.anims.currentAnim.key,
      'currentLevel: ' + this.scene.level.currentLevel,
    ]);
  }
}
