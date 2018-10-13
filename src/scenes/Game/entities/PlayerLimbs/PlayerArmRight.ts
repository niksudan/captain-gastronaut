import { Bodies, Body } from 'matter-js';
import IEntity from '../../../../definitions/IEntity';
import { IGameState } from '../../../../definitions/IGameState';

export default class PlayerArmRight extends IEntity {
  physicsBody: Body;
  image: HTMLImageElement;

  async initialize(x: number, y: number) {
    this.image = await this.imageLoader.loadImage(
      '/assets/images/playerArmRight.png',
    );
    this.offSet = {
      x: this.image.width / 2,
      y: 0,
    };

    this.physicsBody = Bodies.rectangle(
      x,
      y,
      this.image.width,
      this.image.height,
      {
        collisionFilter: {
          category: 2,
        }
      } as any
    );

    return this;
  }

  update(gameState: IGameState) {}
}
