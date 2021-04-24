import Character from './Character';
import { shouldIgnoreMagnets, shouldStickMagnet, velocityToTarget } from './utils';

const speed = 5;

export default class Bullet {
  private scene: Phaser.Scene;
  private shooter: Character;
  private entitie: MatterJS.BodyType;
  private magnet: MatterJS.BodyType;
  private hasCollided: boolean;
  constructor(scene: Phaser.Scene, shooter: Character, origin: { x: number; y: number }, target: { x: number; y: number }) {
    this.scene = scene;
    this.shooter = shooter;
    this.hasCollided = false;
    this.initBullet(origin, target);
  }

  private initBullet(origin: { x: number; y: number }, target: { x: number; y: number }) {
    this.entitie = this.scene.matter.add.circle(origin.x, origin.y, 5, {
      friction: 0,
      frictionAir: 0,
      frictionStatic: 0,
      mass: 0,
      ignoreGravity: true,
      restitution: 1,
      label: 'bullet',
    });

    const velocityExpected = velocityToTarget(this.entitie.position, target, 5);

    this.scene.matter.body.setVelocity(this.entitie, {
      x: velocityExpected.velX,
      y: velocityExpected.velY,
    });

    setInterval(() => {
      //   this.correctVelocity();
    }, 100);

    this.entitie.onCollideCallback = (pair: MatterJS.Pair) => {
      this.handleCollide(pair);
    };

    // setInterval(() => {
    //   console.log(this.entitie.velocity);
    //   if (this.entitie.velocity.x > 0 && this.entitie.velocity.x < 100) {
    //     this.entitie.velocity.x = 100;
    //   }

    //   if (this.entitie.velocity.x < 0 && this.entitie.velocity.x > -100) {
    //     this.entitie.velocity.x = 100;
    //   }

    // }, 100);
  }

  private handleCollide(pair: any) {
    // this.correctVelocity();
    if (this.hasCollided) {
      return;
    }
    this.hasCollided = true;
    this.scene.matter.world.remove(this.entitie, true);

    const collisionPoint = pair.collision.axisBody.position;

    // ignore if non stickable entitie
    if (!shouldStickMagnet(pair.bodyA.label)) {
      return;
    }

    this.magnet = this.scene.matter.add.circle(collisionPoint.x, collisionPoint.y, 5, {
      isStatic: true,
      plugin: {
        attractors: [
          (bodyA: MatterJS.BodyType, bodyB: MatterJS.BodyType) => {
            if (shouldIgnoreMagnets(bodyA.label) || shouldIgnoreMagnets(bodyB.label)) {
              return;
            }

            if (bodyA.isSensor) {
              return;
            }

            return {
              x: (bodyA.position.x - bodyB.position.x) * 0.000002,
              y: (bodyA.position.y - bodyB.position.y) * 0.000002,
            };
          },
        ],
      },
    });

    setTimeout(() => {
      this.destroy();
    }, 3000);
  }

  public destroy() {
    if (this.magnet) {
      this.scene.matter.world.remove(this.magnet, true);
    }

    if (this.entitie) {
      this.scene.matter.world.remove(this.entitie, true);
    }
  }

  private correctVelocity() {
    if (this.entitie.velocity.x > 0 && this.entitie.velocity.x < speed) {
      this.scene.matter.body.setVelocity(this.entitie, {
        x: speed,
        y: this.entitie.velocity.y,
      });
    }
    if (this.entitie.velocity.x < 0 && this.entitie.velocity.x > -speed) {
      this.scene.matter.body.setVelocity(this.entitie, {
        x: -speed,
        y: this.entitie.velocity.y,
      });
    }
  }
}
