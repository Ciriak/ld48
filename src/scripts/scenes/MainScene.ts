import 'phaser';
import Character from '../Character';
import Debugger from '../Debugger';
import Level from '../Level';
import moment from 'moment';
import SoundManager from '../SoundManager';
import { gameSize } from '../../app';
export default class MainScene extends Phaser.Scene {
  public character: Character;
  public level: Level;
  public soundManager: SoundManager;
  public speedRunText: Phaser.GameObjects.Text;
  public deathCountText: Phaser.GameObjects.Text;
  public speedRunStart: any;
  public speedRunActive: boolean;
  public deathCount: number = 0;
  private debugger: Debugger;
  private tabKey: Phaser.Input.Keyboard.Key;
  private UKey: Phaser.Input.Keyboard.Key;
  constructor() {
    super({
      key: 'MainScene',
    });
    this.soundManager = new SoundManager(this);
    this.debugger = new Debugger(this);
  }
  preload() {
    const progress = this.add.graphics();

    this.load.spritesheet('tileset', 'assets/graphics/tileset.png', {
      frameWidth: 16,
      frameHeight: 16,
    });

    this.load.spritesheet('cube', 'assets/graphics/entities/cube.png', {
      frameWidth: 16,
      frameHeight: 16,
    });

    this.load.spritesheet('spike', 'assets/graphics/entities/spike.png', {
      frameWidth: 16,
      frameHeight: 16,
    });

    this.load.spritesheet('player', 'assets/graphics/entities/player.png', {
      frameWidth: 16,
      frameHeight: 32,
    });

    this.load.image('roomBg', 'assets/graphics/room-bg.png');

    this.load.on('progress', (value: any) => {
      progress.clear();
      progress.fillStyle(0x00bbff, 1);
      const barHeight = 25;
      progress.fillRect(0, gameSize.height / 2 - barHeight, gameSize.width * value, barHeight);
    });

    this.load.on('complete', () => {
      progress.destroy();
    });
  }
  create() {
    this.level = new Level(this);
    this.character = new Character(this);
    this.character.spawn();
    this.character.enable();
    this.debugger.create();
    this.deathCount = 0;

    //

    // listen debug key press
    this.tabKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TAB);
    // listen debug level key
    this.UKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.U);
  }

  update() {
    this.character.update();
    this.level.update();
    this.debugger.update();
    this.handleSpeedRunCounter();
    this.handleDebugKey();
    this.handleDebugLevelKey();
  }

  private handleSpeedRunCounter() {
    if (!this.speedRunText || !this.speedRunActive) {
      return;
    }
    const pos = this.cameras.main.getWorldPoint(gameSize.width - 150, 10);

    this.speedRunText.setPosition(pos.x, pos.y);
    const msElapsed = moment().diff(this.speedRunStart, 'milliseconds');

    this.speedRunText.setText(moment(msElapsed).format('mm:ss:SS'));
  }
  private handleDebugKey() {
    if (Phaser.Input.Keyboard.JustDown(this.tabKey)) {
      this.debugger.toggle();
    }
  }
  private handleDebugLevelKey() {
    if (Phaser.Input.Keyboard.JustDown(this.UKey)) {
      // this.soundManager.layer1.stop();
    }
  }

  public nextLevel() {
    this.level.isChanging = true;
    this.cameras.main.fade(1000, 255, 255, 255, true);
    this.character.freeze();
    this.character.removeAllBullets();
    setTimeout(() => {
      this.level.loadNextLevel();
      this.character.spawn();
      this.character.unFreeze();
      this.cameras.main.fadeFrom(1000, 255, 255, 255, true);
    }, 1500);
  }
}
