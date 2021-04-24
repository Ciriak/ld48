import MainScene from './scripts/scenes/MainScene';
import './styles/style.scss';
import 'phaser';

export const gameSize = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const gameConfig: Phaser.Types.Core.GameConfig = {
  backgroundColor: '#212121',
  width: gameSize.width,
  height: gameSize.height,
  parent: 'game',

  render: {
    pixelArt: true,
  },
  physics: {
    default: 'matter',
    matter: {
      debug: true,
      'plugins.attractors': true,
    },
  },
  scene: [MainScene],
  type: Phaser.AUTO,
};
// tslint:disable-next-line: no-unused-expression
new Phaser.Game(gameConfig);
