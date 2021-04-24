import 'phaser';
import Bullet from './Bullet';
import MainScene from './scenes/MainScene';
export default class Character {
  public canMove: boolean;
  private scene: MainScene;
  public cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  public jumpKey: Phaser.Input.Keyboard.Key;
  public direction: 'left' | 'right';
  public facing: 'left' | 'right';
  public canJump: boolean;
  public jumpDirection: 'left' | 'right';
  public isInAir: boolean;
  public isSpawning: boolean;
  public isDead: boolean;
  public isActive: boolean;
  public entitie: Phaser.Physics.Matter.Sprite;
  public sensor: MatterJS.BodyType;
  public ray: Phaser.GameObjects.Line;
  public canShoot: boolean;
  private currentBullet: Bullet;
  public rayHelper: {
    a: MatterJS.BodyType;
    b: MatterJS.BodyType;
    // line: MatterJS.ConstraintType;
  };
  public pointer: Phaser.Input.Pointer;
  public currentRay: 'none' | 'pull' | 'push';

  public acceleration: number;
  public maxVelocity: {
    x: number;
    y: number;
  };
  constructor(scene: MainScene) {
    this.canShoot = true;
    this.direction = 'right';
    this.facing = 'right';
    this.jumpDirection = 'right';
    this.currentRay = 'none';
    this.canJump = false;
    this.isInAir = false;
    this.isDead = false;
    this.isSpawning = false;
    this.isActive = false;
    this.maxVelocity = {
      x: 3,
      y: 3,
    };
    this.acceleration = 0.01;
    this.scene = scene;
    this.canMove = false;

    const spawn = {
      x: 400,
      y: 400,
    };

    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.pointer = this.scene.input.mousePointer;
    this.jumpKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.entitie = this.scene.matter.add.sprite(spawn.x, spawn.y, 'player', null, {
      label: 'player',
    });

    this.sensor = this.scene.matter.add.circle(spawn.x, spawn.y, 10, {
      isSensor: true,
      isStatic: true,
      label: 'player',
    });

    this.entitie.setBody({
      width: 16,
      height: 32,
    });
    this.entitie.setFriction(0.15);
    this.entitie.setFrictionAir(0.0005);
    this.entitie.setFixedRotation();

    this.entitie.setData('isPlayer', true);
    this.inputsListener();
    this.scene.game.input.mouse.disableContextMenu();
    let count = 0;

    this.entitie.setOnCollideActive((e: any) => {
      count++;
      // if collide with it's bottom, reset jump
      this.canJump = false;

      if (e.collision.normal.y !== 0 && !e.bodyA.isSensor && !e.bodyB.isSensor) {
        this.canJump = true;
      }
    });

    this.generateCamera();
  }

  public update() {
    this.updateRayPosition();
    this.inputsListener();
    this.mouseListener();
    this.animationsManager();
    this.checkOutOfBounds();
    this.updateSensor();
    if (this.currentRay !== 'none') {
      // this.rayListener();
    }

    this.isInAir = false;
    if (this.entitie.body.velocity.y < -0.1 || this.entitie.body.velocity.y > 0.1) {
      this.isInAir = true;
    }
  }

  private checkOutOfBounds() {
    if (this.entitie.x > 5000 || this.entitie.y > 2000) {
      this.kill();
    }
  }

  public freeze() {
    this.entitie.setStatic(true);
  }

  public unFreeze() {
    this.entitie.setStatic(false);
  }

  private updateSensor() {
    this.sensor.position = this.entitie.body.position;
  }

  private shoot() {
    // if (this.currentBullet) {
    //   this.currentBullet.destroy();
    // }
    const cursorPoints = this.scene.cameras.main.getWorldPoint(this.pointer.x, this.pointer.y);
    this.currentBullet = new Bullet(this.scene, this, this.rayHelper.a.position, cursorPoints);
    this.canShoot = false;
    setTimeout(() => {
      this.canShoot = true;
    }, 1000);
  }

  private updateRayPosition() {
    if (!this.rayHelper) {
      this.generateRayHelper();
    }

    const cursorPoints = this.scene.cameras.main.getWorldPoint(this.pointer.x, this.pointer.y);

    // look right

    if (cursorPoints.x > this.entitie.x) {
      this.rayHelper.a.position = {
        x: this.entitie.x + this.entitie.width,
        y: this.entitie.y,
      };
    } else {
      this.rayHelper.a.position = {
        x: this.entitie.x - this.entitie.width,
        y: this.entitie.y,
      };
    }

    this.rayHelper.b.position = {
      x: cursorPoints.x,
      y: cursorPoints.y,
    };

    if (this.ray) {
      this.ray.setTo(this.entitie.x + this.entitie.width, this.entitie.y, cursorPoints.x, cursorPoints.y);
    }
  }

  private generateRayHelper() {
    const a = this.scene.matter.add.circle(0, 0, 5, {
      isSensor: true,
      isStatic: false,
    });
    a.label = 'ray-helper-a';
    const b = this.scene.matter.add.circle(0, 0, 5, {
      isSensor: true,
      isStatic: false,
    });
    b.label = 'ray-helper-b';

    // const line = this.scene.matter.add.joint(a, b, 100);

    this.rayHelper = {
      a,
      b,
    };
  }

  private animationsManager() {
    if (this.isSpawning || !this.isActive) {
      return;
    }
    if (this.entitie.body.velocity.y < -0.1) {
      // this.entitie.anims.play('playerJump', true);
    } else {
      if (this.entitie.body.velocity.x !== 0) {
        // this.entitie.anims.play('playerWalk', true);
      } else {
        // this.entitie.anims.play('playerIdle', true);
      }
    }
  }

  private generateCamera() {
    this.scene.cameras.main.zoom = 1.5;
    this.scene.cameras.main.startFollow(this.entitie, true, 0.05, 0.05);
    this.scene.cameras.main.setBounds(0, 0, this.scene.level.bounds.width, this.scene.level.bounds.height);
  }

  public kill() {
    if (this.isDead) {
      return;
    }
    this.isDead = true;
    this.canMove = false;
    this.scene.deathCount++;
    const delay = 1000;

    this.scene.cameras.main.fade(delay, 255, 0, 0, false);
    setTimeout(() => {
      this.scene.level.reload();
      this.spawn();
      this.scene.cameras.main.fadeFrom(500, 255, 0, 0, true);
    }, delay);
  }

  public spawn() {
    const coord = this.scene.level.spawnPoint;
    this.isSpawning = true;
    this.entitie.setPosition(coord.x, coord.y);
    this.entitie.setVelocity(0, 0);
    this.entitie.setIgnoreGravity(false);
    this.entitie.anims.play('playerSpawn');

    setTimeout(() => {
      this.canMove = true;
      this.isDead = false;
      this.isSpawning = false;
    }, 500);
  }

  private mouseListener() {
    // looking direction
    if (this.pointer.position.x > this.entitie.x && this.facing !== 'left') {
      this.entitie.flipX = false;
      this.facing = 'left';
    }
    if (this.pointer.position.x < this.entitie.x && this.facing !== 'right') {
      this.entitie.flipX = true;
      // this.entitie.setScale(1, 1);
      this.facing = 'right';
    }

    // click listener
    if (this.pointer.leftButtonDown() && this.canShoot) {
      // this.currentRay !== 'push'

      this.shoot();
    }
  }

  private inputsListener() {
    if (this.isDead) {
      this.entitie.setVelocity(0, 0);
      this.entitie.setIgnoreGravity(true);
      return;
    }
    // ignore if player can't move
    if (!this.canMove) {
      return;
    }

    if (this.isSpawning) {
      return;
    }

    let acceleration = this.acceleration;
    this.entitie.setIgnoreGravity(false);

    if (this.cursors.left.isDown) {
      if (this.entitie.body.velocity.x < -0.1) {
        this.direction = 'left';
      }
      // needed for some reason
      this.entitie.setFixedRotation();
      const forceVector = new Phaser.Math.Vector2(-5, 0);

      const velocityToApply = this.maxVelocity.x;

      if (this.entitie.body.velocity.x <= -velocityToApply) {
        this.entitie.setVelocityX(-velocityToApply);
      } else {
        // this.entitie.applyForce(forceVector);
        this.entitie.setVelocityX(-velocityToApply);
      }
    } else if (this.cursors.right.isDown) {
      if (this.direction !== 'right' || this.isInAir) {
        acceleration = acceleration / 3;
      }

      if (this.entitie.body.velocity.x > 0.1) {
        this.direction = 'right';
      }

      // needed for some reason
      this.entitie.setFixedRotation();
      const forceVector = new Phaser.Math.Vector2(acceleration, 0);
      if (this.entitie.body.velocity.x >= this.maxVelocity.x) {
        this.entitie.setVelocityX(this.maxVelocity.x);
      } else {
        // this.entitie.applyForce(forceVector);
        this.entitie.setVelocityX(this.maxVelocity.x);
      }
    } else {
      // no direction key pressed
      // reduce velocity if player released the direction keys while in air
      // if (this.isInAir) {
      //   this.entitie.setFrictionAir(this.jumpAirFriction);
      // } else {
      //   this.entitie.setFrictionAir(this.defaultAirFriction);
      // }
    }

    if (this.jumpKey.isDown && this.canJump) {
      this.jumpDirection = this.direction;
      this.entitie.setVelocityY(-4);
      this.canJump = false;
    }
  }

  disable() {
    this.isActive = false;
    this.canJump = false;
    this.canMove = false;

    // disable all collisions
    this.entitie.setToSleep();
    this.entitie.anims.play('playerGlitch');
  }

  enable() {
    this.isActive = true;
    this.canJump = true;
    this.canMove = true;
    this.entitie.setAwake();
  }
}
