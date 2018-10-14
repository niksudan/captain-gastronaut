import { IScene } from "../../definitions/IScene";
import IEntity from "../../definitions/IEntity";
import { IGameState } from "../../definitions/IGameState";
import { World } from "matter-js";
import ImageLoader from "../../loaders/ImageLoader";

export default class EndGame implements IScene {
  entities: IEntity[] = [];
  entitiesToDestroy: string[] = [];
  particlesToAdd: IEntity[] = [];
  imageLoader: ImageLoader = new ImageLoader();
  planet: HTMLImageElement;

  async initialize(gameState: IGameState): Promise<boolean> {
    this.planet = await this.imageLoader.loadImage('./assets/images/planetDead.png')
    return true;
  }

  update(world: World, gameState: IGameState) {

  }

  render(context: CanvasRenderingContext2D) {
    context.save();
    context.drawImage(this.planet, 0, 0);
    context.restore();
  }
}