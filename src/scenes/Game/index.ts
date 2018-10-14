import { findIndex } from 'lodash';
import { IScene } from '../../definitions/IScene';
import IEntity from '../../definitions/IEntity';
import { IGameState } from '../../definitions/IGameState';

import Player from './entities/Player';
import Obstacle from './entities/Obstacle';
import Walls from './entities/Walls';
import GameSettings from '../../data/GameSettings';
import { World } from 'matter-js';
import ImageLoader from '../../loaders/ImageLoader';

const MAX_OBSTACLE_COUNT = 10;

export default class Game implements IScene {
  entities: IEntity[];
  entitiesToDestroy: string[];
  particlesToAdd: IEntity[];
  obstacles: IEntity[] = [];
  background: HTMLImageElement;

  constructor() {
    this.entities = [];
    this.entitiesToDestroy = [];
    this.particlesToAdd = [];
  }

  private async createObstacle(gameState: IGameState) {
    const numberWithinRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const x = numberWithinRange(
      -GameSettings.worldWidth / 2,
      GameSettings.worldWidth / 2,
    );
    const y = numberWithinRange(
      -GameSettings.worldHeight / 2,
      GameSettings.worldHeight / 2,
    );

    const obstacle = await new Obstacle().initialize(gameState, x, y);
    const walls = await new Walls().initialize(gameState);

    this.entities.push(walls);
    this.entities.push(obstacle);
    this.obstacles.push(obstacle);
  }

  private async createObstacles(gameState: IGameState) {
    for (let i: number = this.obstacles.length; i < MAX_OBSTACLE_COUNT; i++) {
      await this.createObstacle(gameState);
    }
  }

  async initialize(gameState: IGameState): Promise<boolean> {
    await this.createObstacles(gameState);
    this.background = await new ImageLoader().loadImage(
      '/assets/images/background.png',
    );
    const player = await new Player().initialize(gameState, 0, 0);

    gameState.focusedEntity = player;
    await Promise.all([this.entities.push(player)]);
    return true;
  }

  update(world: World, gameState: IGameState) {
    if (this.particlesToAdd.length) {
      this.entities = [...this.particlesToAdd, ...this.entities];
      this.particlesToAdd = [];
    }
    if (this.entitiesToDestroy.length) {
      for (let uniqueId of this.entitiesToDestroy) {
        const index = findIndex(this.entities, { uniqueId });
        this.entities.splice(index, 1);
      }
    }
    this.entitiesToDestroy = [];
    for (let entity of this.entities) {
      entity.update(world, gameState);
    }
  }

  render(context: CanvasRenderingContext2D) {
    context.drawImage(
      this.background,
      -(GameSettings.worldWidth / 2),
      -(GameSettings.worldHeight / 2),
    );
    for (let entity of this.entities) {
      entity.render(context);
    }
  }
}
