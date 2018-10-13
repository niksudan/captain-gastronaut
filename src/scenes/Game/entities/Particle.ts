import IEntity from '../../../definitions/IEntity';
import { World, Body, Bodies } from 'matter-js';

export default class Particle extends IEntity {
  physicsBody: Body;
  limbs: IEntity[];
  image: HTMLImageElement;
  buildUp: number = 0.0;

  async initialize(x: number, y: number, images: string[]) {
    const imageSelected = images[~~(Math.random() * (images.length - 1))];
    this.image = await this.imageLoader.loadImage(
      `/assets/images/${imageSelected}`,
    );
    this.physicsBody = Bodies.rectangle(x, y, 0, 0);
    this.physicsBody.force.y = 0;
    return this;
  }

  addToWorld(world: World) {
    World.add(world, this.physicsBody);
  }
}
