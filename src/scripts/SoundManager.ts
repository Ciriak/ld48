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

  private hasSpike() {}

  private fadeOut(sound: Howl, duration: number = 5000) {
    sound.fade(sound.volume(), 0, duration);
  }

  private fadeIn(sound: Howl, duration: number = 5000) {
    sound.fade(sound.volume(), mainVolume, duration);
  }

  public setLevelMusic(params: { diffulty: number; spike?: boolean; button?: boolean; cube?: boolean }) {
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

    if (params.cube) {
      this.fadeIn(this.sounds.support);
    } else {
      this.fadeOut(this.sounds.support);
    }

    if (params.spike) {
      this.fadeIn(this.sounds.support2);
      this.fadeOut(this.sounds.support);
    } else {
      this.fadeOut(this.sounds.support2);
      this.fadeIn(this.sounds.support);
    }
  }
}
