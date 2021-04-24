import 'phaser';
import MainScene from './scenes/MainScene';
import GameplayEntitie, { gameplayItemName } from './entities/GameplayEntitie';

import mapData from '../assets/map.json';
import { findIndex } from 'lodash';
import Cube from './entities/Cube';

export default class Level {
  public currentLevel: number;
  public maxLevel: number;
  private scene: MainScene;
  public spawnPoint: {
    x: number;
    y: number;
  };

  public exit: {
    x: number;
    y: number;
  };

  public gameplayItems: GameplayEntitie[] = [];
  constructor(scene: MainScene) {
    this.scene = scene;
    this.init();
  }

  private init() {
    const levelIndex = 0;
    const level = mapData.levels[levelIndex];

    for (const layerData of level.layerInstances) {
      for (const tileData of layerData.gridTiles) {
        const sprite = this.scene.matter.add.sprite(tileData.px[0], tileData.px[1], 'tileset', tileData.t, {
          // add collisions if Tiles layer
          isStatic: layerData.__identifier === 'Tiles',
        });
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

  private handleEntities(entitieDef: any, entitiePos: { x: number; y: number }) {
    switch (entitieDef.identifier) {
      case 'Spawn':
        this.spawnPoint = entitiePos;
        break;
      case 'Exit':
        this.exit = entitiePos;
        break;
      case 'Cube':
        new Cube(this.scene).add(entitiePos.x, entitiePos.y);
        break;

      default:
        break;
    }
  }

  private handleExit(entitieDef: any) {}

  public update() {}
}
