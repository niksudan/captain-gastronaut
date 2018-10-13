import { Bodies, Body } from 'matter-js';
import IEntity from '../../../../definitions/IEntity';
import { IGameState } from '../../../../definitions/IGameState';

export default class PlayerArmLeft extends IEntity {
    physicsBody: Body;
    image: HTMLImageElement;

    async initialize(x: number, y: number) {
        this.image = await this.imageLoader.loadImage('/assets/playerArmLeft.png');

        this.physicsBody = Bodies.rectangle(x, y, this.image.width, this.image.height);
        
        return this;
    }

    update(gameState: IGameState) {
        
    }
}