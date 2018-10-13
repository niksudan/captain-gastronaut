import IEntity from '../../../definitions/IEntity';
import { World, Body, Bodies } from 'matter-js';
import { IGameState } from '../../../definitions/IGameState';

export default class Particle extends IEntity {
  physicsBody: Body;
  limbs: IEntity[];
  image: HTMLImageElement;
  buildUp: number = 0.0;

  async initialize(gameState: IGameState, x: number, y: number, images: HTMLImageElement[]) {
    this.image = images[~~(Math.random() * (images.length - 1))];
    this.physicsBody = Bodies.rectangle(x, y, 0, 0);
    this.physicsBody.force.y = 0;
    return this;
  }

  addToWorld(world: World) {
    World.add(world, this.physicsBody);
  }
}
