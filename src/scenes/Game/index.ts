import { findIndex } from 'lodash';
import { IScene } from '../../definitions/IScene';
import IEntity from '../../definitions/IEntity';
import { IGameState } from '../../definitions/IGameState';

import Player from './entities/Player';
import Obstacle from './entities/Obstacle';
import Walls from './entities/Walls';
import GameSettings from '../../data/GameSettings';
import { World, Body } from 'matter-js';
import ImageLoader from '../../loaders/ImageLoader';
import Panel from './entities/Panel';
import SoundLoader from '../../loaders/SoundLoader';
import Timer from './entities/Timer';
import EndGame from '../EndGame';

const randomValue = (max: number, min: number) => {
  return Math.random() * (max - min) + min;
};

export default class Game implements IScene {
  entities: IEntity[];
  entitiesToDestroy: string[];
  particlesToAdd: IEntity[];
  panels: Panel[];
  background: HTMLImageElement;
  planets: HTMLImageElement[];
  invaders: HTMLImageElement;
  flingTimer: number = randomValue(50, 10);
  flingSound: HTMLAudioElement;
  score: number;
  imageLoader: ImageLoader = new ImageLoader();
  invaderBob: number = 0;
  timer: Timer;
  dangerTime: number;
  soundLoader: SoundLoader = new SoundLoader();
  warningSound: HTMLAudioElement;

  constructor() {
    this.entities = [];
    this.entitiesToDestroy = [];
    this.particlesToAdd = [];
    this.panels = [];
    this.score = 0;
    this.dangerTime = 1;
  }

  private async createPanels() {
    const PANEL_OFFSET = 200;

    this.panels = [
      // Top Left
      await new Panel(
        -GameSettings.worldWidth / 2 + PANEL_OFFSET,
        -GameSettings.worldHeight / 2 + PANEL_OFFSET,
      ).initialize(),

      // Top Right
      await new Panel(
        GameSettings.worldWidth / 2 - PANEL_OFFSET,
        -GameSettings.worldHeight / 2 + PANEL_OFFSET,
      ).initialize(),

      // Bottom Left
      await new Panel(
        -GameSettings.worldWidth / 2 + PANEL_OFFSET,
        GameSettings.worldHeight / 2 - PANEL_OFFSET,
      ).initialize(),

      // Bottom right
      await new Panel(
        GameSettings.worldWidth / 2 - PANEL_OFFSET,
        GameSettings.worldHeight / 2 - PANEL_OFFSET,
      ).initialize(),
    ];

    this.activatePanel();
  }

  public activatePanel() {
    const activePanel = ~~(Math.random() * this.panels.length);
    this.score += 1;
    this.dangerTime = 1;
    for (let i: number = 0; i < this.panels.length; i++) {
      this.panels[i].toggleActive(i === activePanel);
    }
  }

  private async createObstacle(gameState: IGameState, type: number) {
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

    const obstacle = await new Obstacle().initialize(gameState, x, y, type);

    this.entities.push(obstacle);
  }

  private async createObstacles(gameState: IGameState) {
    // smol
    for (let i: number = 0; i < 12; i++) {
      await this.createObstacle(gameState, 0);
    }

    // average joe
    for (let i: number = 0; i < 6; i++) {
      await this.createObstacle(gameState, 1);
    }

    // bigboye
    for (let i: number = 0; i < 3; i++) {
      await this.createObstacle(gameState, 2);
    }
  }

  private async createWalls(gameState: IGameState) {
    const walls = await new Walls().initialize(gameState);
    this.entities.push(walls);
  }

  async initialize(gameState: IGameState): Promise<boolean> {
    await this.createWalls(gameState);
    await this.createPanels();
    await this.createObstacles(gameState);

    this.background = await this.imageLoader.loadImage(
      './assets/images/background.png',
    );
    this.invaders = await this.imageLoader.loadImage(
      './assets/images/invaders.png',
    );
    this.planets = [
      await this.imageLoader.loadImage('./assets/images/planet.png'),
      await this.imageLoader.loadImage('./assets/images/planetDead.png'),
    ];

    this.flingSound = await this.soundLoader.loadSound(
      './assets/sounds/fling.ogg',
    );
    this.warningSound = await this.soundLoader.loadSound(
      './assets/sounds/timer.ogg',
    );

    const player = await new Player().initialize(gameState, 0, 0);
    gameState.focusedEntity = player;
    await Promise.all([this.entities.push(player)]);
    this.timer = await new Timer().initialize();
    return true;
  }

  async update(world: World, gameState: IGameState) {
    const DANGER_SPEED = 0.00075;

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
    this.flingTimer -= 0.1;
    this.dangerTime -= DANGER_SPEED;
    const fling = {
      x: 0,
      y: 0,
    };

    // Add some fling if time runs out
    if (this.flingTimer < 0) {
      const FLING_FORCE = this.score / 10;

      const FLING_DIRECTION = Math.random() * 360;
      this.flingTimer = randomValue(50, 20);
      fling.x = Math.cos(FLING_DIRECTION * (Math.PI / 180)) * FLING_FORCE;
      fling.y = Math.sin(FLING_DIRECTION * (Math.PI / 180)) * FLING_FORCE;

      gameState.shakeScreen(Math.min(50, this.score * 5));

      this.flingSound.play();
    }

    for (let entity of this.entities) {
      entity.update(world, gameState);

      if (entity.physicsBody && fling.x !== 0 && fling.y !== 0) {
        Body.applyForce(entity.physicsBody, entity.physicsBody.position, fling);
      }
    }

    for (let panel of this.panels) {
      panel.update(gameState);
    }

    // invader bob's a nice guy
    // this variable has nothing to do with him
    this.invaderBob += 1;

    if (this.dangerTime <= 0.25) {
      this.warningSound.loop = true;
      this.warningSound.play();
    } else {
      this.warningSound.currentTime = 0;
      this.warningSound.pause();
    }

    if (this.dangerTime <= 0) {
      // TODO: Blow up the world lol
      await gameState.setScene(new EndGame());
    }
  }

  render(context: CanvasRenderingContext2D) {
    context.drawImage(this.planets[0], -150, -150);
    context.drawImage(
      this.invaders,
      -250,
      -125 + Math.sin(this.invaderBob / 40) * 10,
    );
    context.drawImage(
      this.background,
      -(GameSettings.worldWidth / 2) - 128,
      -(GameSettings.worldHeight / 2) - 64,
    );
    for (let panel of this.panels) {
      panel.render(context);
    }
    for (let entity of this.entities) {
      entity.render(context);
    }
    this.timer.render(context, this.dangerTime);
  }
}
