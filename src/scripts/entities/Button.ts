import MainScene from '../scenes/MainScene';
import { isPlayerCollision } from '../utils';
import GameplayEntitie, { gameplayItemName } from './GameplayEntitie';

export default class Button extends GameplayEntitie {
  name: gameplayItemName = 'button';
  isTrigger = true;
  constructor(scene: MainScene) {
    super(scene);
  }

  public add(x: number, y: number) {
    this.initialPosition = { x, y };

    this.sprite = this.scene.matter.add.sprite(this.initialPosition.x, this.initialPosition.y, this.name, 0, {
      isSensor: this.isTrigger,
      isStatic: this.isTrigger,
      label: 'button',
    });

    this.sprite.setBody({
      type: 'circle',
      radius: 5,
    });

    this.sprite.setSensor(true);
    this.sprite.setStatic(true);

    this.sprite.setOnCollide((collide: Phaser.Types.Physics.Matter.MatterCollisionData) => {
      this.enable();
    });

    this.sprite.setOnCollideEnd(() => {
      this.disable();
    });
  }

  public enable() {
    this.sprite.setFrame(1);

    this.scene.soundManager.doorOpen();
    this.scene.level.openExit();
  }

  public disable() {
    this.sprite.setFrame(0);
    this.scene.level.closeExit();
  }
}
