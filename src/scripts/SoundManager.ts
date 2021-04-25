import MainScene from './scenes/MainScene';
import { Howl } from 'howler';

const mainVolume = 0.5;
const effectsVolume = 0.3;
const transitionDelay = 5000;
const eventDelay = 1000;
const soundCooldown = 200;

export default class SoundManager {
  private scene: MainScene;
  public loaded: boolean;
  public loadedCount: number;
  private canPlayDoorSound: boolean = true;
  private crashed: boolean = false;
  public sounds: {
    [key: string]: Howl;
  };

  constructor(scene: MainScene) {
    this.loaded = false;
    this.loadedCount = 0;
    this.scene = scene;

    this.sounds = {
      lead: new Howl({
        loop: true,
        volume: 0,

        src: ['./assets/sounds/lead.ogg'],
        onload: () => {
          this.handleSoundLoaded();
        },
      }),
      support: new Howl({
        src: ['./assets/sounds/support.ogg'],
        loop: true,
        volume: 0,

        onload: () => {
          this.handleSoundLoaded();
        },
      }),
      bass: new Howl({
        loop: true,
        volume: 0,

        src: ['./assets/sounds/bass.ogg'],
        onload: () => {
          this.handleSoundLoaded();
        },
      }),
      lead2: new Howl({
        loop: true,
        volume: 0,

        src: ['./assets/sounds/lead2.ogg'],
        onload: () => {
          this.handleSoundLoaded();
        },
      }),
      support2: new Howl({
        src: ['./assets/sounds/support2.ogg'],
        loop: true,
        volume: 0,

        onload: () => {
          this.handleSoundLoaded();
        },
      }),
      bass2: new Howl({
        loop: true,
        volume: 0,

        src: ['./assets/sounds/bass2.ogg'],
        onload: () => {
          this.handleSoundLoaded();
        },
      }),
      drum: new Howl({
        loop: true,
        volume: 0,

        src: ['./assets/sounds/drum.ogg'],
        onload: () => {
          this.handleSoundLoaded();
        },
      }),
      open: new Howl({
        src: ['./assets/sounds/open.ogg'],
        volume: effectsVolume,
        onload: () => {
          this.handleSoundLoaded();
        },
      }),
      crash: new Howl({
        src: ['./assets/sounds/leadCrash.ogg'],

        onload: () => {
          this.handleSoundLoaded();
        },
      }),
      glitch: new Howl({
        src: ['./assets/sounds/glitch.ogg'],

        onload: () => {
          this.handleSoundLoaded();
        },
      }),
      close: new Howl({
        volume: effectsVolume,
        src: ['./assets/sounds/close.ogg'],
        onload: () => {
          this.handleSoundLoaded();
        },
      }),
      door: new Howl({
        volume: effectsVolume,
        src: ['./assets/sounds/door.wav'],
        onload: () => {
          this.handleSoundLoaded();
        },
      }),
      magnet: new Howl({
        volume: 0.03,
        src: ['./assets/sounds/magnet.wav'],
        onload: () => {
          this.handleSoundLoaded();
        },
      }),
      jump: new Howl({
        volume: effectsVolume,
        src: ['./assets/sounds/jump.wav'],
        onload: () => {
          this.handleSoundLoaded();
        },
      }),
      hurt: new Howl({
        volume: effectsVolume,
        src: ['./assets/sounds/hurt.wav'],
        onload: () => {
          this.handleSoundLoaded();
        },
      }),
      shoot: new Howl({
        volume: effectsVolume,
        src: ['./assets/sounds/shoot.wav'],
        onload: () => {
          this.handleSoundLoaded();
        },
      }),
      bounce1: new Howl({
        volume: effectsVolume,
        src: ['./assets/sounds/bounce1.wav'],
        onload: () => {
          this.handleSoundLoaded();
        },
      }),
      bounce2: new Howl({
        volume: effectsVolume,
        src: ['./assets/sounds/bounce2.wav'],
        onload: () => {
          this.handleSoundLoaded();
        },
      }),
      bounce3: new Howl({
        volume: effectsVolume,
        src: ['./assets/sounds/bounce3.wav'],
        onload: () => {
          this.handleSoundLoaded();
        },
      }),
      changeLevel: new Howl({
        volume: effectsVolume,
        src: ['./assets/sounds/changeLevel.wav'],
        onload: () => {
          this.handleSoundLoaded();
        },
      }),
    };
  }

  private handleSoundLoaded() {
    this.loadedCount++;

    let count = 0;
    // tslint:disable-next-line: forin
    for (const soundName in this.sounds) {
      count++;
    }

    if (count === this.loadedCount) {
      this.loaded = true;
      this.handleReady();
    }
  }

  private handleReady() {
    this.sounds.lead.play();
    this.sounds.lead2.play();
    this.sounds.support.play();
    this.sounds.support2.play();
    this.sounds.bass.play();
    this.sounds.bass2.play();
    this.sounds.drum.play();
  }

  public doorOpen() {
    if (this.canPlayDoorSound) {
      this.sounds.open.play();
      this.sounds.door.play();
      this.canPlayDoorSound = false;
      setTimeout(() => {
        this.canPlayDoorSound = true;
      }, soundCooldown);
    }
  }
  public doorClose() {
    if (this.canPlayDoorSound) {
      this.sounds.close.play();
      this.sounds.door.play();
      this.canPlayDoorSound = false;
      setTimeout(() => {
        this.canPlayDoorSound = true;
      }, soundCooldown);
    }
  }

  public crash() {
    // tslint:disable-next-line: forin
    for (const soundName in this.sounds) {
      const sound = this.sounds[soundName];
      sound.volume(0);
      sound.stop();
    }
    this.sounds.crash.volume(1);
    this.sounds.crash.play();
    this.sounds.glitch.volume(0.5);
    this.sounds.glitch.play();
    this.sounds.glitch.loop(true);
    this.scene.character.canMove = false;
    this.scene.character.canJump = false;
    this.scene.character.canShoot = false;
    this.crashed = true;
  }

  private hasSpike() {}

  private fadeOut(sound: Howl, duration: number = 5000) {
    sound.fade(sound.volume(), 0, duration);
  }

  private fadeIn(sound: Howl, duration: number = 5000) {
    sound.fade(sound.volume(), mainVolume, duration);
  }

  public setLevelMusic(params: { diffulty: number; spike?: boolean; button?: boolean; cube?: boolean }) {
    if (this.crashed) {
      return;
    }

    if (params.diffulty < 6) {
      this.fadeIn(this.sounds.bass);
    } else {
      this.fadeOut(this.sounds.bass, 10000);
      this.fadeIn(this.sounds.bass2, 10000);
    }

    if (params.diffulty > 2) {
      this.fadeIn(this.sounds.lead);
    }

    if (params.diffulty >= 6) {
      this.fadeOut(this.sounds.lead);
      this.fadeIn(this.sounds.lead2);
    }

    if (params.diffulty > 10) {
      this.fadeIn(this.sounds.drum);
    }

    if (params.diffulty > 11) {
      this.fadeIn(this.sounds.lead);
    }

    if (params.spike) {
      this.fadeIn(this.sounds.support2);
      this.fadeOut(this.sounds.support);
    } else {
      this.fadeOut(this.sounds.support2);
      this.fadeIn(this.sounds.support);
    }

    // ending
    if (params.diffulty === 13) {
      this.fadeIn(this.sounds.lead);
      this.fadeOut(this.sounds.lead2);
      this.fadeOut(this.sounds.bass);
      this.fadeOut(this.sounds.bass2);
      this.fadeOut(this.sounds.support);
      this.fadeOut(this.sounds.support2);
      this.fadeOut(this.sounds.drum);
    }
  }
}
