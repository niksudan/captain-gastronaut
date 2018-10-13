import { Bodies, Body } from 'matter-js';
import { IEntity } from "../../../definitions/IEntity";
import { IGameState } from "../../../definitions/IGameState";
import ImageLoader from '../../../Image/ImageLoader';

export default class Player implements IEntity {
    physicsBody: Body;
    image: HTMLImageElement;

    imageWidth: number = 50;
    imageHeight: number = 50;

    async initialize(x: number, y: number) {
        this.image = await new ImageLoader().loadImage('/assets/testimage.jpg');
        this.physicsBody = Bodies.rectangle(x, y, this.image.width, this.image.height);
        
        return this;
    }

    update(gameState: IGameState) {
        
    }
    
    getPhysicsBody(): Body {
        return this.physicsBody;
    }

    render(context: CanvasRenderingContext2D) {
        context.drawImage(this.image, this.physicsBody.position.x, this.physicsBody.position.y);
    }


}