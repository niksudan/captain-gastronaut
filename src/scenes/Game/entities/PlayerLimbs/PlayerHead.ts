import { Bodies, Body } from 'matter-js';
import IEntity from '../../../../definitions/IEntity';

export default class PlayerHead extends IEntity {
  physicsBody: Body;
  image: HTMLImageElement;

  async initialize(x: number, y: number) {
    this.image = await this.imageLoader.loadImage(
      '/assets/images/playerHead.png',
    );
    this.offSet = {
      x: 0,
      y: -this.image.height / 2,
    };

    this.physicsBody = Bodies.rectangle(
      x,
      y,
      this.image.width / 2,
      this.image.height / 2,
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
}
