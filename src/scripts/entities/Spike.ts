import MainScene from '../scenes/MainScene';
import { isPlayerCollision } from '../utils';
import GameplayEntitie, { gameplayItemName } from './GameplayEntitie';

export default class Spike extends GameplayEntitie {
  name: gameplayItemName = 'spike';
  isTrigger = true;
  constructor(scene: MainScene) {
    super(scene);
  }

  public add(x: number, y: number) {
    this.initialPosition = { x, y };

    const maxFrameIndex = 2;
    const frame = Math.floor(Math.random() * maxFrameIndex) + 0;

    this.sprite = this.scene.matter.add.sprite(this.initialPosition.x, this.initialPosition.y, this.name, frame, {
      isSensor: this.isTrigger,
      isStatic: this.isTrigger,
      label: 'spike',
    });

    this.sprite.setBody({
      type: 'circle',
      radius: 5,
    });
    this.sprite.setSensor(true);
    this.sprite.setStatic(true);

    this.sprite.setOnCollide((collide: Phaser.Types.Physics.Matter.MatterCollisionData) => {
      // if collided with the player
      // kill me FFS
      // TODO refactor
      if (isPlayerCollision(collide)) {
        // stop if level already changing
        this.scene.character.kill();
      }
    });
  }
}
