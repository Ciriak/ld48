import MainScene from '../scenes/MainScene';
import GameplayEntitie, { gameplayItemName } from './GameplayEntitie';

export default class Exit extends GameplayEntitie {
  name: gameplayItemName = 'exit';
  isTrigger = true;
  constructor(scene: MainScene) {
    super(scene);
  }

  public add(x: number, y: number) {
    this.initialPosition = { x, y };

    this.sprite = this.scene.matter.add.sprite(this.initialPosition.x, this.initialPosition.y, this.name, 0, {
      isSensor: this.isTrigger,
      isStatic: this.isTrigger,
      label: 'exit',
    });

    this.sprite.setBody({
      type: 'circle',
      radius: 12,
    });
    this.sprite.setSensor(true);
    this.sprite.setStatic(true);

    this.sprite.setOnCollide((collide: Phaser.Types.Physics.Matter.MatterCollisionData) => {
      // if collided with the player
      // kill me FFS
      // TODO refactor
      if (collide.bodyB.gameObject?.data?.get('isPlayer') === true || collide.bodyA.gameObject?.data?.get('isPlayer') === true) {
        // stop if level already changing
        if (this.scene.level.isChanging) {
          return;
        }
        this.scene.level.loadNextLevel();
      }
    });
  }
}
