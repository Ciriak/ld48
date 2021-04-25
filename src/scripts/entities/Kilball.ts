import MainScene from '../scenes/MainScene';
import { isPlayerCollision } from '../utils';
import GameplayEntitie, { gameplayItemName } from './GameplayEntitie';

export default class KillBall extends GameplayEntitie {
  name: gameplayItemName = 'killball';
  isTrigger = true;
  constructor(scene: MainScene) {
    super(scene);
  }

  public add(x: number, y: number) {
    this.initialPosition = { x, y };

    this.sprite = this.scene.matter.add.sprite(this.initialPosition.x, this.initialPosition.y, this.name, 0, {
      label: 'killball',
      mass: 10,
    });

    this.sprite.setBody({
      type: 'circle',
      radius: 3,
    });

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
