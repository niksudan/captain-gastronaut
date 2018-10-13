import { Body } from 'matter-js';
import { IGameState } from './IGameState';

interface IEntity {
    physicsBody: Body;
    image: HTMLImageElement;

    initialize(x: number, y: number, args?: any): Promise<IEntity>;
    update(gameState: IGameState);
    getPhysicsBodies(): Body[];
    render(context: CanvasRenderingContext2D);
}