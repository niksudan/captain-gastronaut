import { Body } from 'matter-js';
import { IGameState } from './IGameState';

interface IEntity {
    physicsBody: Body;
    image: HTMLImageElement;


    initialize(x: number, y: number): Promise<IEntity>;
    update(gameState: IGameState);
    getPhysicsBody(): Body;
    render(context: CanvasRenderingContext2D);
}