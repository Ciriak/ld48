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
      layer1: new Howl({
        loop: true,
        src: ['./assets/sounds/layer1.ogg'],
        onload: () => {
          this.handleSoundLoaded();
        },
      }),
      layerPiano: new Howl({
        src: ['./assets/sounds/layerPiano.ogg'],
        loop: true,
        onload: () => {
          this.handleSoundLoaded();
        },
      }),
      layerBit: new Howl({
        loop: true,
        src: ['./assets/sounds/layerBit.ogg'],
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
    // this.sounds.layer1.play();
    // this.sounds.layerPiano.play();
    // this.sounds.layerBit.play();
    // this.sounds.layerPiano.volume(0);
    // this.sounds.layerBit.volume(0);
  }
}
