import 'phaser';
import MainScene from '../scenes/MainScene';
export type gameplayItemName = string;

// WHY ??????? WTF MATTER
export const offset = 16;

export default abstract class GameplayEntitie {
  /**
   * The spritesheet image must match the entitie name
   */
  public name: gameplayItemName;
  protected scene: MainScene;
  public sprite: Phaser.Physics.Matter.Sprite;
  public isTrigger: boolean;
  public initialPosition: {
    x: number;
    y: number;
  };
  constructor(scene: MainScene, isTrigger?: boolean) {
    this.scene = scene;
    this.isTrigger = isTrigger;
    setInterval(() => {
      this.checkOutOfBounds();
    }, 500);
  }

  private checkOutOfBounds() {
    if (this.sprite && this.sprite.body && (this.sprite.body.position.x > 5000 || this.sprite.body.position.y > 2000)) {
      this.reset();
    }
  }

  public reset() {
    this.sprite.setVelocity(0, 0);
    this.sprite.setPosition(this.initialPosition.x, this.initialPosition.y);
  }

  public add(x: number, y: number) {
    this.initialPosition = { x, y };

    this.sprite = this.scene.matter.add.sprite(this.initialPosition.x, this.initialPosition.y, this.name, 0, {
      isSensor: this.isTrigger,
      isStatic: this.isTrigger,
      label: this.name,
    });

    // rebuild as a trigger if needed
    if (this.isTrigger) {
      this.sprite.setBody({
        type: 'circle',
        radius: 12,
      });
      this.sprite.setSensor(true);
      this.sprite.setStatic(true);
    }
  }

  public remove() {
    this.sprite.destroy();
  }

  onDestroy() {}
}
