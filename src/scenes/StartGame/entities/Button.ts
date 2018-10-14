import IEntity from '../../../definitions/IEntity';
import { World, Body, Bodies, Sleeping } from 'matter-js';
import { IGameState } from '../../../definitions/IGameState';

export default class Button extends IEntity {
  physicsBody: Body;
  limbs: IEntity[];
  image: HTMLImageElement;
  buildUp: number = 0.0;

  async initialize(gameState: IGameState, x: number, y: number, startGame) {
    this.image = await this.imageLoader.loadImage('./assets/images/button.png');

    this.physicsBody = Bodies.rectangle(
      x,
      y,
      this.image.width,
      this.image.height,
      {
        label: 'button',
        isStatic: true,
        collisionFilter: {
          category: 2,
          mask: 2,
        } as any,
      },
    );

    gameState.subscribeToEvent('button', (gameState: IGameState) => {
      startGame();
    });

    return this;
  }

  addToWorld(world: World) {
    World.add(world, this.physicsBody);
  }
}
