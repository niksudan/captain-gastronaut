import { Bodies, Body } from 'matter-js';
import IEntity from '../../../../definitions/IEntity';
import { IGameState } from '../../../../definitions/IGameState';

interface faces {
  PASSIVE: HTMLImageElement;
  CHARGING: HTMLImageElement;
  POOP: HTMLImageElement;
  LEFT: HTMLImageElement;
  RIGHT: HTMLImageElement;
}

export default class PlayerHead extends IEntity {
  physicsBody: Body;
  image: HTMLImageElement;
  faces: faces;

  async initialize(gameState: IGameState, x: number, y: number) {
    this.faces = {
      PASSIVE: await this.imageLoader.loadImage(
        './assets/images/playerHead.png',
      ),
      CHARGING: await this.imageLoader.loadImage(
        './assets/images/playerHead2.png',
      ),
      POOP: await this.imageLoader.loadImage('./assets/images/playerHead3.png'),
      LEFT: await this.imageLoader.loadImage(
        './assets/images/playerHeadLeft.png',
      ),
      RIGHT: await this.imageLoader.loadImage(
        './assets/images/playerHeadRight.png',
      ),
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
      this.image.height,
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

  public setFace(name: 'PASSIVE' | 'CHARGING' | 'POOP' | 'LEFT' | 'RIGHT') {
    this.image = this.faces[name];
  }
}
