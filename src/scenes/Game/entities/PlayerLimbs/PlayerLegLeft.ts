import { Bodies, Body } from 'matter-js';
import IEntity from '../../../../definitions/IEntity';
import { IGameState } from '../../../../definitions/IGameState';

export default class PlayerLegLeft extends IEntity {
  physicsBody: Body;
  image: HTMLImageElement;

  async initialize(gameState: IGameState, x: number, y: number) {
    this.image = await this.imageLoader.loadImage(
      '/assets/images/playerLegLeft.png',
    );
    this.offSet = {
      x: 0,
      y: this.image.height / 2,
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

  update(gameState: IGameState) {}
}
