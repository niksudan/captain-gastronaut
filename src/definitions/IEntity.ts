import { Body, World } from 'matter-js';
import ImageLoader from '../loaders/ImageLoader';
import SoundLoader from '../loaders/SoundLoader';
import { IGameState } from './IGameState';

export default abstract class IEntity {
  physicsBody: Body;
  image: HTMLImageElement;
  offSet = {
    x: 0,
    y: 0,
  };

  imageLoader = new ImageLoader();
  soundLoader = new SoundLoader();

  abstract initialize(gameState: IGameState, x: number, y: number, args?: any): Promise<IEntity>;

  addToWorld(world: World) {
    World.add(world, [this.physicsBody]);
  }

  render(context: CanvasRenderingContext2D) {
    context.save();
    context.translate(this.physicsBody.position.x, this.physicsBody.position.y);
    context.rotate(this.physicsBody.angle);
    context.drawImage(
      this.image,
      -this.image.width / 2 + this.offSet.x,
      -this.image.height / 2 + this.offSet.y,
    );
    context.restore();
  }

  update(gameState: IGameState) {}
}
