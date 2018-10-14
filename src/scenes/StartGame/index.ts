import { World, Body } from "matter-js";
import { IGameState } from "../../definitions/IGameState";
import { findIndex } from 'lodash';
import IEntity from "../../definitions/IEntity";
import ImageLoader from "../../loaders/ImageLoader";
import { IScene } from "../../definitions/IScene";
import Player from "../Game/entities/Player";
import GameSettings from "../../data/GameSettings";
import MenuWalls from "./entities/MenuWalls";
import Game from "../Game";
import Button from "./entities/Button";

export default class StartGame implements IScene {
  entities: IEntity[] = [];
  entitiesToDestroy: string[] = [];
  particlesToAdd: IEntity[] = [];
  imageLoader: ImageLoader = new ImageLoader();
  logo: HTMLImageElement;
  player: IEntity;
  startGame: boolean = false;

  async initialize(gameState: IGameState) {
    const player = await new Player().initialize(gameState, 100, GameSettings.height / 2);
    this.player = player;
    Body.setAngularVelocity(this.player.physicsBody, 0.01);
    this.logo = await this.imageLoader.loadImage('./assets/images/logo.png');
    const button = await new Button().initialize(gameState, GameSettings.width - 66, GameSettings.height / 2, () => {
      this.startGame = true;
    });
    this.entities = [
      player,
      button,
      await new MenuWalls().initialize(gameState),
    ];
    return true;
  }

  async update(world: World, gameState: IGameState) {
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

    if (this.startGame) {
      await gameState.setScene(new Game());
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