import IEntity from '../../../definitions/IEntity';
import { World, Body, Bodies, Composite } from 'matter-js';
import { IGameState } from '../../../definitions/IGameState';
import GameSettings from '../../../data/GameSettings';

export default class MenuWalls extends IEntity {
  physicsBody: Body;
  walls: Composite;
  bumpSounds: HTMLAudioElement[];
  bumpSound: HTMLAudioElement;

  async initializeSounds() {
    this.bumpSounds = [
      await this.soundLoader.loadSound('./assets/sounds/bump1.ogg'),
      await this.soundLoader.loadSound('./assets/sounds/bump2.ogg'),
      await this.soundLoader.loadSound('./assets/sounds/bump3.ogg'),
    ];
  }

  async initialize(gameState: IGameState) {
    await this.initializeSounds();
    const wallOptions = {
      label: 'wall',
      collisionFilter: {
        category: 2,
        mask: 2,
      } as any,
      isStatic: true,
    };

    const WALL_SIZE = 50;

    this.physicsBody = Bodies.rectangle(
      0,
      GameSettings.height / 2,
      WALL_SIZE,
      GameSettings.height,
      wallOptions,
    );

    this.walls = Composite.create({
      bodies: [
        // Left
        this.physicsBody,
        // Right
        Bodies.rectangle(
          GameSettings.width,
          GameSettings.height / 2,
          WALL_SIZE,
          GameSettings.height,
          wallOptions,
        ),
        // Up
        Bodies.rectangle(
          GameSettings.width / 2,
          0,
          GameSettings.width,
          WALL_SIZE,
          wallOptions,
        ),
        // Down
        Bodies.rectangle(
          GameSettings.width / 2,
          GameSettings.height,
          GameSettings.width,
          WALL_SIZE,
          wallOptions,
        ),
      ],
    });

    gameState.subscribeToEvent('wall', (gameState: IGameState) => {
      if (this.bumpSound !== null || this.bumpSound.paused) {
        if (this.bumpSound) {
          this.bumpSound.pause();
        }
        this.bumpSound = this.bumpSounds[
          ~~(Math.random() * this.bumpSounds.length)
        ];
        this.bumpSound.currentTime = 0;
        this.bumpSound.volume = 0.4;
        this.bumpSound.play();
      }
    });
    return this;
  }

  addToWorld(world: World) {
    World.add(world, this.walls);
  }

  render() {}
}
