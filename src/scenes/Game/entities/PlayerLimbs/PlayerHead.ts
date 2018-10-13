import { Bodies, Body } from 'matter-js';
import IEntity from '../../../../definitions/IEntity';

export default class PlayerHead extends IEntity {
    physicsBody: Body;
    image: HTMLImageElement;

    async initialize(x: number, y: number) {
        this.image = await this.imageLoader.loadImage('/assets/playerHead.png');

        this.physicsBody = Bodies.rectangle(x, y, this.image.width, this.image.height);
        
        return this;
    }

}