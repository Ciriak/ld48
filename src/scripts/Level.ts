import 'phaser';
import MainScene from './scenes/MainScene';
import GameplayEntitie, { gameplayItemName } from './entities/GameplayEntitie';

import mapData from '../assets/map.json';
import { findIndex } from 'lodash';
import Cube from './entities/Cube';
import Exit from './entities/Exit';
import Spike from './entities/Spike';

export default class Level {
  public currentLevel: number;
  public maxLevel: number;
  private scene: MainScene;
  private entities: GameplayEntitie[];
  private tiles: Phaser.Physics.Matter.Sprite[];
  private bgTexture: Phaser.GameObjects.TileSprite;
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
      width: level.pxWid,
      height: level.pxHei,
    };
    const trueSize = {
      w: level.layerInstances[2].__cWid * level.layerInstances[0].__gridSize * 2 - level.layerInstances[0].__gridSize,
      h: level.layerInstances[2].__cHei * level.layerInstances[0].__gridSize * 2 - level.layerInstances[0].__gridSize,
    };

    this.bgTexture = this.scene.add.tileSprite(0, 0, trueSize.w, trueSize.h, 'roomBg');
    this.bgTexture.setDepth(-1);

    for (const layerData of level.layerInstances) {
      for (const tileData of layerData.gridTiles) {
        const sprite = this.scene.matter.add.sprite(tileData.px[0], tileData.px[1], 'tileset', tileData.t, {
          // add collisions if Tiles layer
          isStatic: true,
          label: 'gridBlock',
        });

        // remove the phydic properties
        if (layerData.__identifier === 'Background') {
          sprite.alpha = 0.7;
          this.scene.matter.world.remove(sprite);
        }

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

    this.bgTexture.destroy();
    this.bgTexture = null;

    this.entities = [];
    this.tiles = [];
  }

  public loadNextLevel() {
    this.currentLevel++;
    this.clean();
    this.init();
    this.isChanging = false;
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
      case 'Spike':
        newEntitie = new Spike(this.scene);
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
