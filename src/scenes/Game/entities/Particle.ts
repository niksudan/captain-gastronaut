import IEntity from '../../../definitions/IEntity';
import { World, Body } from 'matter-js';
import { IGameState } from '../../../definitions/IGameState';

export default class Particle extends IEntity {
  physicsBody: Body;
  limbs: IEntity[];
  image: HTMLImageElement;
  buildUp: number = 0.0;
  direction: number = 0.0;
  speed: number = 0.0;
  fade: number = 1.0;
  position = {
    x: 0,
    y: 0,
  };

  async initialize(gameState: IGameState, x: number, y: number, images: HTMLImageElement[]) {
    this.image = images[~~(Math.random() * (images.length - 1))];
    this.direction = Math.random();
    this.position = {
      x,
      y,
    };
    this.speed = 2.0;
    return this;
  }

  addToWorld(world: World) {
    World.add(world, this.physicsBody);
  }

  update(world: World, gameState: IGameState) {
    const FADE_SPEED = 0.01;
    const direction = this.direction * (180 / Math.PI);

    this.position.x += Math.cos(direction) * this.speed;
    this.position.y += Math.cos(direction) * this.speed;
    this.fade -= FADE_SPEED;
    if (this.fade <= 0.0) {
      gameState.currentScene.entitiesToDestroy.push(this.uniqueId);
    }
  }

  render(context: CanvasRenderingContext2D) {
    if (this.fade <= 0.0) {
      return;
    }
    context.save();
    context.translate(this.position.x, this.position.y);
    context.globalAlpha = this.fade;
    context.drawImage(this.image, -this.image.width / 2, -this.image.height / 2);
    context.globalAlpha = 1;
    context.restore();
  }
}
