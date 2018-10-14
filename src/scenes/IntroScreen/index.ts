import IEntity from "../../definitions/IEntity";
import ImageLoader from "../../loaders/ImageLoader";
import { IGameState } from "../../definitions/IGameState";
import { IScene } from "../../definitions/IScene";
import { World } from "matter-js";
import Game from "../Game";

export default class IntroScreen implements IScene {
  entities: IEntity[] = [];
  entitiesToDestroy: string[] = [];
  particlesToAdd: IEntity[] = [];
  imageLoader: ImageLoader = new ImageLoader();

  async initialize(gameState: IGameState) {

    return true;
  }

  async update(world: World, gameState: IGameState) {
    // Use me nik 😘
    // await gameState.setScene(new Game());
  }

  render(context: CanvasRenderingContext2D) {

  }
}