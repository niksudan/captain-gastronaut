import { Bodies, Body } from 'matter-js';

import PlayerHead from './PlayerLimbs/PlayerHead';
import PlayerArmLeft from './PlayerLimbs/PlayerArmLeft';
import PlayerArmRight from './PlayerLimbs/PlayerArmRight';

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
            await new PlayerHead().initialize(x + 32, y - 64),
            await new PlayerArmLeft().initialize(x - 30, y),
            await new PlayerArmRight().initialize(x + 30, y),
        ];

        this.physicsBody = Body.create({
            parts: [
                Bodies.rectangle(x, y, this.image.width, this.image.height),
                ...this.limbs.map((limb) => limb.physicsBody)
            ]
        });

        Body.applyForce(this.physicsBody, this.physicsBody.position, {
            x: 1,
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
        context.save();
        context.translate(this.physicsBody.position.x, this.physicsBody.position.y);

        context.drawImage(this.image, 0, 0);

        for (let limb of this.limbs) {
            limb.render(context);
        }

        context.restore();
    }


}