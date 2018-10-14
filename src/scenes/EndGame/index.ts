import { IScene } from "../../definitions/IScene";
import IEntity from "../../definitions/IEntity";
import { IGameState } from "../../definitions/IGameState";
import { World } from "matter-js";
import ImageLoader from "../../loaders/ImageLoader";
import GameSettings from "../../data/GameSettings";

export default class EndGame implements IScene {
  entities: IEntity[] = [];
  entitiesToDestroy: string[] = [];
  particlesToAdd: IEntity[] = [];
  imageLoader: ImageLoader = new ImageLoader();
  planet: HTMLImageElement;
  invaders: HTMLImageElement;
  flash: number = 1;
  invaderBob: number = 0;

  async initialize(gameState: IGameState): Promise<boolean> {
    this.planet = await this.imageLoader.loadImage('./assets/images/planetDead.png')
    this.invaders = await this.imageLoader.loadImage(
      './assets/images/invaders.png',
    );
    return true;
  }

  update(world: World, gameState: IGameState) {
    if (this.flash > 0) {
      this.flash -= 0.1;
    }
    this.invaderBob += 1;
  }

  render(context: CanvasRenderingContext2D) {
    context.save();
    context.drawImage(
      this.planet,
      GameSettings.width / 2 - this.planet.width / 2,
      GameSettings.height / 2 - this.planet.height / 2
    );
    context.drawImage(
      this.invaders,
      GameSettings.width / 2 - this.invaders.width / 2,
      GameSettings.height / 2 - this.invaders.height / 2 + Math.sin(this.invaderBob / 40) * 10,
    );
    if (this.flash > 0) {
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, GameSettings.width, GameSettings.height);
    }
    context.restore();
  }
}