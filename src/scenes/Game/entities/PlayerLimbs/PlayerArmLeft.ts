import { Bodies, Body, World } from 'matter-js';
import IEntity from '../../../../definitions/IEntity';
import { IGameState } from '../../../../definitions/IGameState';

export default class PlayerArmLeft extends IEntity {
  physicsBody: Body;
  image: HTMLImageElement;

  async initialize(gameState: IGameState, x: number, y: number) {
    this.image = await this.imageLoader.loadImage(
      './assets/images/playerArmLeft.png',
    );
    this.offSet = {
      x: -this.image.width / 2,
      y: 0,
    };

    this.physicsBody = Bodies.rectangle(
      x,
      y,
      this.image.width / 2,
      this.image.height,
      {
        collisionFilter: {
          category: 2,
          mask: 2,
        } as any,
      }
    );
    this.physicsBody.force.y = 0;

    return this;
  }

  update(world: World, gameState: IGameState) {
  }
}
