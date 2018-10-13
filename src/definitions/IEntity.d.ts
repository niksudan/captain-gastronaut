import { Body } from 'matter-js';
import { IGameState } from './IGameState';

interface IEntity {
    update(gameState: IGameState);
    getPhysicsBody(): Body;
    render(context: CanvasRenderingContext2D);
}