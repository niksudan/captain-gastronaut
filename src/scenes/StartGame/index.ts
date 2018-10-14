import { World } from "matter-js";
import { IGameState } from "../../definitions/IGameState";
import { findIndex } from 'lodash';
import IEntity from "../../definitions/IEntity";
import ImageLoader from "../../loaders/ImageLoader";
import { IScene } from "../../definitions/IScene";
import Player from "../Game/entities/Player";
import GameSettings from "../../data/GameSettings";
import MenuWalls from "./entities/MenuWalls";

export default class StartGame implements IScene {
  entities: IEntity[] = [];
  entitiesToDestroy: string[] = [];
  particlesToAdd: IEntity[] = [];
  imageLoader: ImageLoader = new ImageLoader();
  logo: HTMLImageElement;

  async initialize(gameState: IGameState) {
    const player = await new Player().initialize(gameState, 100, GameSettings.height / 2);
    this.logo = await this.imageLoader.loadImage('./assets/images/logo.png');
    this.entities = [
      player,
      await new MenuWalls().initialize(gameState),
    ];
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
      this.logo,
      GameSettings.width / 2 - this.logo.width / 2,
      GameSettings.height / 2 - this.logo.height / 2
    );
    for (let entity of this.entities) {
      entity.render(context);
    }
  }
}