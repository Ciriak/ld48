import MainScene from './scenes/MainScene';

export default class SoundManager {
  private scene: MainScene;
  public rewind: Phaser.Sound.BaseSound;
  public bgMusic: Phaser.Sound.BaseSound;
  public respawn: Phaser.Sound.BaseSound;
  public jump: Phaser.Sound.BaseSound;
  public death: Phaser.Sound.BaseSound;
  public bumperJump: Phaser.Sound.BaseSound;
  public brokenPlatform: Phaser.Sound.BaseSound;
  public cannon: Phaser.Sound.BaseSound;
  public end: Phaser.Sound.BaseSound;
  constructor(scene: MainScene) {
    this.scene = scene;
  }

  preload() {
    this.scene.load.audio('bgMusic', './assets/sounds/bg.mp3');
    this.scene.load.audio('jump', './assets/sounds/jump.wav');
    this.scene.load.audio('rewind', './assets/sounds/rewind.wav');
    this.scene.load.audio('respawn', './assets/sounds/respawn.wav');
    this.scene.load.audio('death', './assets/sounds/death.wav');
    this.scene.load.audio('bumperJump', './assets/sounds/bumperJump.wav');
    this.scene.load.audio('brokenPlatform', './assets/sounds/brokenPlatform.wav');
    this.scene.load.audio('cannon', './assets/sounds/cannon.wav');
    this.scene.load.audio('end', './assets/sounds/end.wav');
  }

  create() {
    this.bgMusic = this.scene.sound.add('bgMusic', {
      loop: true,
    });
    // music.play();
    this.rewind = this.scene.sound.add('rewind');
    this.respawn = this.scene.sound.add('respawn');
    this.death = this.scene.sound.add('death');
    this.jump = this.scene.sound.add('jump');
    this.bumperJump = this.scene.sound.add('bumperJump');
    this.brokenPlatform = this.scene.sound.add('brokenPlatform');
    this.cannon = this.scene.sound.add('cannon');
    this.end = this.scene.sound.add('end');
  }

  playRewind() {
    this.rewind.play();
  }
}
