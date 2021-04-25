import MainScene from '../scenes/MainScene';
import { shouldBounce } from '../utils';
import GameplayEntitie, { gameplayItemName } from './GameplayEntitie';

/**
 * Represent an entitie that is not related to gameplay (like a bloc)
 */
export default class BouncePanel extends GameplayEntitie {
  name: gameplayItemName = 'bouncePanel';

  public add(x: number, y: number) {
    this.initialPosition = { x, y };

    this.scene.anims.create({
      key: 'bouncePanelHit',
      frames: this.scene.anims.generateFrameNumbers('bouncePanel', { start: 1, end: 4 }),
      repeat: 0,
      frameRate: 6,
    });

    this.sprite = this.scene.matter.add.sprite(this.initialPosition.x, this.initialPosition.y, this.name, 0, {
      isStatic: true,
      label: this.name,
    });

    this.sprite.setOnCollide((collide: Phaser.Types.Physics.Matter.MatterCollisionData) => {
      if (collide.bodyB.label === 'bullet') {
        const maxFrameIndex = 6;
        const frame = Math.floor(Math.random() * maxFrameIndex) + 0;
        this.sprite.anims.play('bouncePanelHit');
        this.sprite.once('animationcomplete', () => {
          this.sprite.setFrame(0);
        });
      }
    });
  }
}
