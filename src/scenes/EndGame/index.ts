import { IScene } from '../../definitions/IScene';
import IEntity from '../../definitions/IEntity';
import { IGameState } from '../../definitions/IGameState';
import { World } from 'matter-js';
import ImageLoader from '../../loaders/ImageLoader';
import GameSettings from '../../data/GameSettings';
import Game from '../Game';

export default class EndGame implements IScene {
  entities: IEntity[] = [];
  entitiesToDestroy: string[] = [];
  particlesToAdd: IEntity[] = [];
  imageLoader: ImageLoader = new ImageLoader();
  planet: HTMLImageElement;
  invaders: HTMLImageElement;
  flash: number = 1;
  invaderBob: number = 0;
  score: number;
  canRestart: boolean = false;

  async initialize(gameState: IGameState): Promise<boolean> {
    this.planet = await this.imageLoader.loadImage(
      './assets/images/planetDead.png',
    );
    this.invaders = await this.imageLoader.loadImage(
      './assets/images/invaders.png',
    );
    gameState.shakeScreen(20);
    this.score = gameState.score;

    window.setTimeout(() => {
      this.canRestart = true;
    }, 1000);

    return true;
  }

  async update(world: World, gameState: IGameState) {
    if (this.flash > 0) {
      this.flash -= 0.05;
    }
    this.invaderBob += 1;
    if (
      this.canRestart &&
      (gameState.keyPresses['ArrowLeft'] ||
      gameState.keyPresses['ArrowRight'] ||
      gameState.keyPresses['ArrowUp'])
    ) {
      await gameState.setScene(new Game());
    }
  }

  render(context: CanvasRenderingContext2D) {
    context.save();
    context.drawImage(
      this.planet,
      GameSettings.width / 2 - this.planet.width / 2,
      GameSettings.height / 2 - this.planet.height / 2,
    );
    context.drawImage(
      this.invaders,
      GameSettings.width / 2 - this.invaders.width / 2,
      GameSettings.height / 2 -
        this.invaders.height / 2 +
        Math.sin(this.invaderBob / 40) * 10,
    );
    if (this.flash > 0) {
      context.globalAlpha = this.flash;
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, GameSettings.width, GameSettings.height);
      context.globalAlpha = 1;
    }

    // score text
    if (this.canRestart) {
      context.fillStyle = '#ffffff';
      context.textAlign = 'center';
      context.font = '36px GrapeSoda';
      context.fillText(
        'THE WORLD IS DOOMED, BUT YOU SCORED',
        GameSettings.width / 2,
        GameSettings.height * 0.75,
      );
      context.font = '96px GrapeSoda';
      context.fillText(
        String(this.score - 1),
        GameSettings.width / 2,
        GameSettings.height * 0.85,
      );
    }

    context.restore();
  }
}
