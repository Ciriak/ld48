import MainScene from './scenes/MainScene';
import { Howl } from 'howler';

export default class SoundManager {
  private scene: MainScene;
  public loaded: boolean;
  public loadedCount: number;
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
        src: ['./assets/sounds/lead.ogg'],
        onload: () => {
          this.handleSoundLoaded();
        },
      }),
      support: new Howl({
        src: ['./assets/sounds/support.ogg'],
        loop: true,
        onload: () => {
          this.handleSoundLoaded();
        },
      }),
      bass: new Howl({
        loop: true,
        src: ['./assets/sounds/bass.ogg'],
        onload: () => {
          this.handleSoundLoaded();
        },
      }),
      lead2: new Howl({
        loop: true,
        src: ['./assets/sounds/lead2.ogg'],
        onload: () => {
          this.handleSoundLoaded();
        },
      }),
      support2: new Howl({
        src: ['./assets/sounds/support2.ogg'],
        loop: true,
        onload: () => {
          this.handleSoundLoaded();
        },
      }),
      bass2: new Howl({
        loop: true,
        src: ['./assets/sounds/bass2.ogg'],
        onload: () => {
          this.handleSoundLoaded();
        },
      }),
      drum: new Howl({
        loop: true,
        src: ['./assets/sounds/drum.ogg'],
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
    this.sounds.lead2.play();
    this.sounds.support.play();
    // this.sounds.bass2.play();
    this.sounds.drum.play();
    this.sounds.drum.volume(0);
    // this.sounds.layerBit.volume(0);
    setTimeout(() => {
      this.sounds.drum.fade(0, 1, 3000);
    }, 5000);
  }
}
