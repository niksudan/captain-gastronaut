import { Bodies, Body } from 'matter-js';

import PlayerArm from './PlayerLimbs/PlayerArm';

import { IEntity } from "../../../definitions/IEntity";
import { IGameState } from "../../../definitions/IGameState";
import ImageLoader from '../../../Image/ImageLoader';

export default class Player implements IEntity {
    physicsBody: Body;
    limbs: IEntity[];
    image: HTMLImageElement;

    async initialize(x: number, y: number) {
        this.image = await new ImageLoader().loadImage('/assets/playerBody.png');
     
        this.limbs = [
            await new PlayerArm().initialize(x + 30, y),
        ];

        this.physicsBody = Body.create({
            parts: [
                Bodies.rectangle(x, y, this.image.width, this.image.height),
                ...this.limbs.map((limb) => limb.physicsBody)
            ]
        });

        Body.applyForce(this.physicsBody, this.physicsBody.position, {
            x: 2,
            y: 0,
        });
        
        return this;
    }

    update(gameState: IGameState) {
        for (let limb of this.limbs) {
            limb.update(gameState);
        }
    }
    
    getPhysicsBodies(): Body[] {
        return [this.physicsBody, ...this.limbs.map((limb) => limb.physicsBody)];
    }

    render(context: CanvasRenderingContext2D) {
        context.drawImage(this.image, this.physicsBody.position.x, this.physicsBody.position.y);

        for (let limb of this.limbs) {
            limb.render(context);
        }
    }


}