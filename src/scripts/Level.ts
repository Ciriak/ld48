import 'phaser';
import MainScene from './scenes/MainScene';
import GameplayEntitie, { gameplayItemName } from './entities/GameplayEntitie';

import mapData from '../assets/map.json';
import { findIndex } from 'lodash';
import Cube from './entities/Cube';
import Exit from './entities/Exit';

export default class Level {
  public currentLevel: number;
  public maxLevel: number;
  private scene: MainScene;
  private entities: GameplayEntitie[];
  private tiles: Phaser.Physics.Matter.Sprite[];
  public isChanging: boolean;

  public bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  public spawnPoint: {
    x: number;
    y: number;
  };

  public exit: {
    x: number;
    y: number;
  };

  constructor(scene: MainScene) {
    this.currentLevel = 0;
    this.scene = scene;
    this.isChanging = false;
    this.init();
  }

  private init() {
    const levelIndex = this.currentLevel;
    const level = mapData.levels[levelIndex];
    this.entities = [];
    this.tiles = [];

    this.bounds = {
      x: 0,
      y: 0,
      width: mapData.levels[levelIndex].pxWid,
      height: mapData.levels[levelIndex].pxHei,
    };

    for (const layerData of level.layerInstances) {
      for (const tileData of layerData.gridTiles) {
        const sprite = this.scene.matter.add.sprite(tileData.px[0], tileData.px[1], 'tileset', tileData.t, {
          // add collisions if Tiles layer
          isStatic: layerData.__identifier === 'Tiles',
          label: 'gridBlock',
        });

        this.tiles.push(sprite);
      }

      for (const entitieData of layerData.entityInstances) {
        const entitiePosition = {
          x: entitieData.px[0],
          y: entitieData.px[1],
        };

        const entitieDefIndex = findIndex(mapData.defs.entities, {
          uid: entitieData.defUid,
        });

        if (entitieDefIndex === -1) {
          break;
        }

        const entitieDef = mapData.defs.entities[entitieDefIndex];
        this.handleEntities(entitieDef, entitiePosition);
      }
    }
  }

  // clear the map and reload it
  public reload() {
    this.clean();

    this.init();
  }

  private clean() {
    for (const entitie of this.entities) {
      entitie.remove();
    }

    for (const sprite of this.tiles) {
      sprite.destroy();
    }

    this.entities = [];
    this.tiles = [];
  }

  public loadNextLevel() {
    this.isChanging = true;
    this.scene.cameras.main.fade(1000, 255, 255, 255, true);
    this.scene.character.freeze();
    setTimeout(() => {
      this.currentLevel++;
      this.clean();
      this.init();
      this.scene.character.spawn();
      this.scene.character.unFreeze();
      this.scene.cameras.main.fadeFrom(1000, 255, 255, 255, true);
      this.isChanging = false;
    }, 1500);
  }

  private handleEntities(entitieDef: any, entitiePos: { x: number; y: number }) {
    let newEntitie: GameplayEntitie;
    switch (entitieDef.identifier) {
      case 'Spawn':
        this.spawnPoint = entitiePos;
        break;
      case 'Exit':
        newEntitie = new Exit(this.scene);
        break;
      case 'Cube':
        newEntitie = new Cube(this.scene);
        break;

      default:
        break;
    }

    if (newEntitie) {
      newEntitie.add(entitiePos.x, entitiePos.y);
      this.entities.push(newEntitie);
    }
  }

  private handleExit(entitieDef: any) {}

  public update() {}
}
