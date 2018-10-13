import { Bodies, Body } from 'matter-js';
import ImageLoader from '../../../../Image/ImageLoader';
import { IEntity } from '../../../../definitions/IEntity';
import { IGameState } from '../../../../definitions/IGameState';

export default class Player implements IEntity {
    physicsBody: Body;
    image: HTMLImageElement;

    async initialize(x: number, y: number) {
        this.image = await new ImageLoader().loadImage('/assets/playerArmLeft.png');

        this.physicsBody = Bodies.rectangle(x, y, this.image.width, this.image.height);
        
        return this;
    }

    update(gameState: IGameState) {
        
    }
    
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