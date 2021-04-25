import MainScene from './scenes/MainScene';
import { Howl } from 'howler';

const mainVolume = 0.5;
const transitionDelay = 5000;
const eventDelay = 1000;
const soundCooldown = 200;

export default class SoundManager {
  private scene: MainScene;
  public loaded: boolean;
  public loadedCount: number;
  private canPlayDoorSound: boolean = true;
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

        onload: () => {
          this.handleSoundLoaded();
        },
      }),
      close: new Howl({
        src: ['./assets/sounds/close.ogg'],
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
      this.canPlayDoorSound = false;
      setTimeout(() => {
        this.canPlayDoorSound = true;
      }, soundCooldown);
    }
  }
  public doorClose() {
    if (this.canPlayDoorSound) {
      this.sounds.close.play();
      this.canPlayDoorSound = false;
      setTimeout(() => {
        this.canPlayDoorSound = true;
      }, soundCooldown);
    }
  }

  private hasSpike() {
    this.sounds.support.fade(1.0, 0.2, transitionDelay);
    this.sounds.support2.fade(0, 1, transitionDelay);
  }

  private fadeOut(sound: Howl, duration: number = 5000) {
    sound.fade(sound.volume(), 0, duration);
  }

  private fadeIn(sound: Howl, duration: number = 5000) {
    sound.fade(sound.volume(), mainVolume, duration);
  }

  public setLevelMusic(params: { diffulty: number; spike?: boolean }) {
    if (params.diffulty === 0) {
      this.fadeIn(this.sounds.bass);
    }

    if (params.diffulty === 1) {
      this.fadeIn(this.sounds.support);
    }

    if (params.diffulty === 2) {
      this.hasSpike();
    }
  }
}
