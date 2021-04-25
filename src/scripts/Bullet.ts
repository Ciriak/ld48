import Character from './Character';
import MainScene from './scenes/MainScene';
import { shouldBounce, shouldIgnoreMagnets, shouldStickMagnet, velocityToTarget } from './utils';

const speed = 5;

export default class Bullet {
  private scene: MainScene;
  private shooter: Character;
  private entitie: Phaser.Physics.Matter.Sprite;
  private magnet: MatterJS.BodyType;
  private hasCollided: boolean;
  private emmiter: Phaser.GameObjects.Particles.ParticleEmitter;
  constructor(scene: MainScene, shooter: Character, origin: { x: number; y: number }, target: { x: number; y: number }) {
    this.scene = scene;
    this.shooter = shooter;
    this.hasCollided = false;
    this.initBullet(origin, target);
  }

  public update() {
    if (this.emmiter && this.entitie && this.entitie.body) {
      this.emmiter.setPosition(this.entitie.body.position.x, this.entitie.body.position.y);
    }
  }

  private initBullet(origin: { x: number; y: number }, target: { x: number; y: number }) {
    this.scene.anims.create({
      key: 'bulletIdle',
      frames: this.scene.anims.generateFrameNumbers('bullet', { start: 0, end: 7 }),
      repeat: -1,
      frameRate: 30,
    });

    this.scene.anims.create({
      key: 'bulletMagnet',
      frames: this.scene.anims.generateFrameNumbers('bullet', { start: 8, end: 13 }),
      repeat: -1,
      frameRate: 30,
    });

    this.entitie = this.scene.matter.add.sprite(origin.x, origin.y, 'bullet', 5, {
      friction: 0,
      frictionAir: 0,
      frictionStatic: 0,
      mass: 0,
      ignoreGravity: true,
      restitution: 1,
      label: 'bullet',
      gravityScale: { x: 0, y: 0 },
      isSensor: false,
      isStatic: false,
      circleRadius: 3,
    });

    // set random rotation
    const maxRotation = 180;
    const rotation = Math.floor(Math.random() * maxRotation) + 0;
    this.entitie.setRotation(rotation);

    this.entitie.anims.play('bulletIdle');

    const velocityExpected = velocityToTarget(
      {
        x: this.entitie.x,
        y: this.entitie.y,
      },
      target,
      5
    );

    this.scene.matter.body.setVelocity(this.entitie.body as MatterJS.BodyType, {
      x: velocityExpected.velX,
      y: velocityExpected.velY,
    });

    this.entitie.setOnCollide((collide: Phaser.Types.Physics.Matter.MatterCollisionData) => {
      this.handleCollide(collide);
    });

    const body = this.entitie.body as any;
    body.label = 'bullet';

    // particle emitter
    const particle = this.scene.add.particles('bulletParticle', 0);
    particle.setDepth(5);

    this.emmiter = particle.createEmitter({
      x: this.entitie.x,
      y: this.entitie.y,
      lifespan: 1000,
      speed: { min: 1, max: 20 },
      scale: { start: 0.4, end: 0 },
      quantity: 0.5,
      blendMode: 'ADD',
    });

    // const int = setInterval(() => {
    //   if (!this.entitie) {
    //     clearInterval(int);
    //     return;
    //   }
    //   if (lastPos.x !== this.entitie.x) {
    //     this.emmiter.setPosition(this.entitie.x, this.entitie.y);
    //     lastPos = {
    //       x: this.entitie.x,
    //       y: this.entitie.y,
    //     };
    //   }
    // }, 100);
  }

  // setInterval(() => {
  //   console.log(this.entitie.velocity);
  //   if (this.entitie.velocity.x > 0 && this.entitie.velocity.x < 100) {
  //     this.entitie.velocity.x = 100;
  //   }

  //   if (this.entitie.velocity.x < 0 && this.entitie.velocity.x > -100) {
  //     this.entitie.velocity.x = 100;
  //   }

  // }, 100);

  private handleCollide(collide: Phaser.Types.Physics.Matter.MatterCollisionData) {
    // this.correctVelocity();
    if (this.hasCollided) {
      return;
    }

    // bullet keep moving if its a bouncable entitie (do not remove the bullet)
    if (shouldBounce(collide.bodyA.label) || shouldBounce(collide.bodyB.label)) {
      return;
    }

    this.hasCollided = true;
    this.entitie.destroy();

    const col = collide as any;
    const collisionPoint = col.collision.axisBody.position;

    // ignore if non stickable entitie
    if (!shouldStickMagnet(collide.bodyA.label)) {
      return;
    }

    this.scene.soundManager.sounds.magnet.play();

    this.magnet = this.scene.matter.add.circle(collisionPoint.x, collisionPoint.y, 5, {
      isStatic: true,
      plugin: {
        attractors: [
          (bodyA: MatterJS.BodyType, bodyB: MatterJS.BodyType) => {
            // if (shouldIgnoreMagnets(bodyA.label) || shouldIgnoreMagnets(bodyB.label)) {
            //   // less powerfull
            //   return {
            //     x: (bodyA.position.x - bodyB.position.x) * 0.000002,
            //     y: (bodyA.position.y - bodyB.position.y) * 0.000002,
            //   };
            // }

            if (bodyA.isSensor) {
              return;
            }

            return {
              x: (bodyA.position.x - bodyB.position.x) * 0.0000005,
              y: (bodyA.position.y - bodyB.position.y) * 0.0000005,
            };
          },
        ],
      },
    });

    const magnetEffect = this.scene.matter.add.sprite(collisionPoint.x, collisionPoint.y, 'bullet', 8, {
      isSensor: true,
      isStatic: true,
    });

    magnetEffect.anims.play('bulletMagnet');

    setTimeout(() => {
      magnetEffect.destroy();
      this.destroy();

      // gracefully destroy the emitter and then remove it
      this.emmiter.stop();
      setTimeout(() => {
        this.emmiter.remove();
        this.emmiter = null;
      }, 1000);
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

  // private correctVelocity() {
  //   if (this.entitie.velocity.x > 0 && this.entitie.velocity.x < speed) {
  //     this.scene.matter.body.setVelocity(this.entitie, {
  //       x: speed,
  //       y: this.entitie.velocity.y,
  //     });
  //   }
  //   if (this.entitie.velocity.x < 0 && this.entitie.velocity.x > -speed) {
  //     this.scene.matter.body.setVelocity(this.entitie, {
  //       x: -speed,
  //       y: this.entitie.velocity.y,
  //     });
  //   }
  // }
}
