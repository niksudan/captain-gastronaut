import { Body, World } from 'matter-js';
import ImageLoader from '../Image/ImageLoader';
import { IGameState } from './IGameState';

export default abstract class IEntity {
    physicsBody: Body;
    image: HTMLImageElement;

    imageLoader = new ImageLoader();

    abstract initialize(x: number, y: number, args?: any): Promise<IEntity>;

    addToWorld(world: World) {
        World.add(world, [this.physicsBody]);
    }

    render(context: CanvasRenderingContext2D) {
        context.save();
        context.translate(this.physicsBody.position.x, this.physicsBody.position.y);
        context.drawImage(this.image, -this.image.width / 2, -this.image.height / 2);
        context.restore();
    }

    update(gameState: IGameState) {}
}