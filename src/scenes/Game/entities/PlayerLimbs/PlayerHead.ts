import { Bodies, Body } from 'matter-js';
import ImageLoader from '../../../../Image/ImageLoader';
import IEntity from '../../../../definitions/IEntity';
import { IGameState } from '../../../../definitions/IGameState';

export default class Player extends IEntity {
    physicsBody: Body;
    image: HTMLImageElement;

    async initialize(x: number, y: number) {
        this.image = await new ImageLoader().loadImage('/assets/playerHead.png');

        this.physicsBody = Bodies.rectangle(x, y, this.image.width, this.image.height);
        
        return this;
    }

}