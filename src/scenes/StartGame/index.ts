import { World, Body } from 'matter-js';
import { IGameState } from '../../definitions/IGameState';
import { findIndex } from 'lodash';
import IEntity from '../../definitions/IEntity';
import ImageLoader from '../../loaders/ImageLoader';
import { IScene } from '../../definitions/IScene';
import Player from '../Game/entities/Player';
import GameSettings from '../../data/GameSettings';
import MenuWalls from './entities/MenuWalls';
import Button from './entities/Button';
import IntroScreen from '../IntroScreen';
import SoundLoader from '../../loaders/SoundLoader';

export default class StartGame implements IScene {
  entities: IEntity[] = [];
  entitiesToDestroy: string[] = [];
  particlesToAdd: IEntity[] = [];
  imageLoader: ImageLoader = new ImageLoader();
  soundLoader: SoundLoader = new SoundLoader();
  logo: HTMLImageElement;
  stars: HTMLImageElement;
  player: IEntity;
  startGame: boolean = false;
  pulse: number = 0;
  introSound: HTMLAudioElement;
  buttonSound: HTMLAudioElement;

  async initialize(gameState: IGameState) {
    const player = await new Player().initialize(
      gameState,
      100,
      GameSettings.height / 2,
    );
    this.player = player;
    Body.setAngularVelocity(this.player.physicsBody, 0.01);
    this.logo = await this.imageLoader.loadImage('./assets/images/logo.png');
    this.stars = await this.imageLoader.loadImage('./assets/images/stars.png');
    this.introSound = await this.soundLoader.loadSound(
      './assets/sounds/epic.ogg',
    );
    this.buttonSound = await this.soundLoader.loadSound(
      './assets/sounds/panel.ogg',
    );
    const button = await new Button().initialize(
      gameState,
      GameSettings.width - 66,
      GameSettings.height / 2,
      () => {
        this.startGame = true;
      },
    );
    this.entities = [
      player,
      button,
      await new MenuWalls().initialize(gameState),
    ];
    this.introSound.play();
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
    this.pulse += 0.05;
    if (this.startGame) {
      this.buttonSound.play();
      await gameState.setScene(new IntroScreen());
    }
  }

  render(context: CanvasRenderingContext2D) {
    const SIZE = 0.1;
    const ROTATION_SIZE = 0.2;
    context.drawImage(this.stars, 0, 0);

    for (let entity of this.entities) {
      entity.render(context);
    }

    context.save();
    context.translate(GameSettings.width / 2, GameSettings.height / 2);
    context.rotate(Math.cos(this.pulse / 5) * ROTATION_SIZE);
    context.scale(
      1 + Math.sin(this.pulse) * SIZE,
      1 + Math.sin(this.pulse) * SIZE,
    );
    context.drawImage(this.logo, -this.logo.width / 2, -this.logo.height / 2);
    context.restore();

    context.fillStyle = '#ffffff';
    context.textAlign = 'center';
    context.font = '36px GrapeSoda';
    context.fillText(
      'A GAME BY NIK, BEN, LINKRONNY AND SASCHA FOR #JUPIJAM',
      GameSettings.width / 2,
      GameSettings.height * 0.9,
    );
  }
}
