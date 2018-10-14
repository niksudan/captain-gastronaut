import IEntity from '../../../definitions/IEntity';
import { World, Body, Bodies, Sleeping } from 'matter-js';
import { IGameState } from '../../../definitions/IGameState';

const OBSTACLE_IMAGES = [
  'obstacleSmall.png',
  'obstacleMedium.png',
  'obstacleBig.png',
];

export default class Obstacle extends IEntity {
  physicsBody: Body;
  limbs: IEntity[];
  image: HTMLImageElement;
  buildUp: number = 0.0;
  bumpSounds: HTMLAudioElement[];
  bumpSound: HTMLAudioElement;

  async initializeSounds() {
    this.bumpSounds = [
      await this.soundLoader.loadSound('./assets/sounds/bump1.ogg'),
      await this.soundLoader.loadSound('./assets/sounds/bump2.ogg'),
      await this.soundLoader.loadSound('./assets/sounds/bump3.ogg'),
    ];
  }

  async initialize(gameState: IGameState, x: number, y: number, type: number) {
    const imageSelected = OBSTACLE_IMAGES[type];

    this.image = await this.imageLoader.loadImage(
      `./assets/images/${imageSelected}`,
    );

    if ((Math.abs(x) + Math.abs(y)) < this.image.width * 2) {
      x += this.image.width * 2;
    }

    await this.initializeSounds();

    this.physicsBody = Bodies.rectangle(
      x,
      y,
      this.image.width,
      this.image.height,
      {
        label: 'obstacle',
        collisionFilter: {
          category: 2,
          mask: 2,
        } as any,
      },
    );

    Body.rotate(this.physicsBody, Math.random() * 360 * (180 / Math.PI));

    gameState.subscribeToEvent('obstacle', (gameState: IGameState) => {
      if (!gameState.withinViewPort(this)) {
        return;
      }
      if (this.bumpSound !== null || this.bumpSound.paused) {
        if (this.bumpSound) {
          this.bumpSound.pause();
        }
        this.bumpSound = this.bumpSounds[
          ~~(Math.random() * this.bumpSounds.length)
        ];
        this.bumpSound.currentTime = 0;
        this.bumpSound.volume = 0.6;
        this.bumpSound.play();
      }
    });

    this.physicsBody.force.y = 0;

    return this;
  }

  addToWorld(world: World) {
    World.add(world, this.physicsBody);
  }
}
