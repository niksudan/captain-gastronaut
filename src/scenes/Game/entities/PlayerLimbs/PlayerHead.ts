import { Bodies, Body } from 'matter-js';
import IEntity from '../../../../definitions/IEntity';

interface faces {
  PASSIVE: HTMLImageElement;
  CHARGING: HTMLImageElement;
  POOP: HTMLImageElement;
}

export default class PlayerHead extends IEntity {
  physicsBody: Body;
  image: HTMLImageElement;
  faces: faces;

  async initialize(x: number, y: number) {
    this.faces = {
      PASSIVE: await this.imageLoader.loadImage(
        '/assets/images/playerHead.png',
      ),
      CHARGING: await this.imageLoader.loadImage(
        '/assets/images/playerHead2.png',
      ),
      POOP: await this.imageLoader.loadImage('/assets/images/playerHead3.png'),
    };

    this.image = this.faces['PASSIVE'];

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
      },
    );
    this.physicsBody.force.y = 0;

    return this;
  }

  public setFace(name: 'PASSIVE' | 'CHARGING' | 'POOP') {
    this.image = this.faces[name];
  }
}
