import IEntity from '../../definitions/IEntity';
import ImageLoader from '../../loaders/ImageLoader';
import { IGameState } from '../../definitions/IGameState';
import { IScene } from '../../definitions/IScene';
import { World } from 'matter-js';
import Game from '../Game';
import SoundLoader from '../../loaders/SoundLoader';
import GameSettings from '../../data/GameSettings';

export default class IntroScreen implements IScene {
  entities: IEntity[] = [];
  entitiesToDestroy: string[] = [];
  particlesToAdd: IEntity[] = [];
  imageLoader: ImageLoader = new ImageLoader();
  soundLoader: SoundLoader = new SoundLoader();
  canStart: boolean = false;
  introSound: HTMLAudioElement;
  stars: HTMLImageElement;

  async initialize(gameState: IGameState) {
    this.introSound = await this.soundLoader.loadSound(
      './assets/sounds/intro.ogg',
    );
    this.stars = await this.imageLoader.loadImage('./assets/images/stars.png');
    window.setTimeout(() => {
      this.canStart = true;
    }, 3000);
    this.introSound.play();
    gameState.music.volume = 0.5;
    return true;
  }

  async update(world: World, gameState: IGameState) {
    // Use me nik 😘
    if (
      this.canStart &&
      (gameState.keyPresses['ArrowLeft'] ||
        gameState.keyPresses['ArrowRight'] ||
        gameState.keyPresses['ArrowUp'])
    ) {
      await gameState.setScene(new Game());
      this.introSound.pause();
      gameState.music.volume = 1;
    }
  }

  render(context: CanvasRenderingContext2D) {
    context.drawImage(this.stars, 0, 0);
    context.fillStyle = '#ffffff';
    context.textAlign = 'center';
    context.font = '36px GrapeSoda';
    const w = GameSettings.width / 2;

    context.fillText(
      "WELL DONE... NOW YOU'VE DONE IT!",
      w,
      GameSettings.height * 0.2,
    );
    context.fillText(
      'THAT BUTTON YOU JUST PRESSED?',
      w,
      GameSettings.height * 0.3,
    );
    context.fillText(
      "IT'S SUMMONED THE GREAT GALACTIC FLEET! WE'RE DOOMED!",
      w,
      GameSettings.height * 0.4,
    );
    context.fillText(
      'ONLY YOU CAN SAVE US NOW, CAPTAIN GASTRONAUT!',
      w,
      GameSettings.height * 0.5,
    );
    context.fillText(
      'ACTIVATE THE CONTROL PANELS ON YOUR SPACE BASE',
      w,
      GameSettings.height * 0.6,
    );
    context.fillText(
      'THEY WILL HELP US SURVIVE... I THINK?',
      w,
      GameSettings.height * 0.7,
    );
    context.fillText(
      'MAY THE BEANS BE WITH YOU, ALWAYS',
      w,
      GameSettings.height * 0.8,
    );
  }
}
