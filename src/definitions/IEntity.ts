import { Body } from 'matter-js';
import { IGameState } from './IGameState';

export default abstract class IEntity {
    physicsBody: Body;
    image: HTMLImageElement;

    abstract initialize(x: number, y: number, args?: any): Promise<IEntity>;
    abstract update(gameState: IGameState);

    getPhysicsBodies(): Body[] {
        return [this.physicsBody];
    }

    render(context: CanvasRenderingContext2D) {
        context.save();
        context.translate(this.physicsBody.position.x, this.physicsBody.position.y);
        context.drawImage(this.image, 0, 0);
        context.restore();
    }
}