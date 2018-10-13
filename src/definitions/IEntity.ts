import { Body, World } from 'matter-js';
import ImageLoader from '../Image/ImageLoader';
import { IGameState } from './IGameState';

export default abstract class IEntity {
    physicsBody: Body;
    image: HTMLImageElement;
    rotation: number = 0;
    offSet = {
        x: 0,
        y: 0,
    };

    imageLoader = new ImageLoader();

    abstract initialize(x: number, y: number, args?: any): Promise<IEntity>;

    addToWorld(world: World) {
        World.add(world, [this.physicsBody]);
    }

    render(context: CanvasRenderingContext2D) {
        context.save();
        context.translate(this.physicsBody.position.x, this.physicsBody.position.y);
        context.rotate(this.rotation);
        context.drawImage(this.image, -this.image.width / 2 + this.offSet.x, -this.image.height / 2 + this.offSet.y);
        context.restore();
    }

    update(gameState: IGameState) {}
}