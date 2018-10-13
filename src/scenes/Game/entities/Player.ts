import { Bodies, Body, World } from 'matter-js';

import PlayerHead from './PlayerLimbs/PlayerHead';
import PlayerArmLeft from './PlayerLimbs/PlayerArmLeft';
import PlayerArmRight from './PlayerLimbs/PlayerArmRight';
import PlayerLegLeft from './PlayerLimbs/PlayerLegLeft';
import PlayerLegRight from './PlayerLimbs/PlayerLegRight';

import IEntity from '../../../definitions/IEntity';
import { IGameState } from "../../../definitions/IGameState";

export default class Player extends IEntity {
    physicsBody: Body;
    limbs: IEntity[];
    image: HTMLImageElement;

    async initialize(x: number, y: number) {
        this.image = await this.imageLoader.loadImage('/assets/playerBody.png');
     
        this.limbs = [
            await new PlayerHead().initialize(x, y - 64),
            await new PlayerArmLeft().initialize(x - 30, y),
            await new PlayerArmRight().initialize(x + 30, y),
            await new PlayerLegLeft().initialize(x - 10, y + 80),
            await new PlayerLegRight().initialize(x + 10, y + 80),
        ];

        this.physicsBody = Body.create({
            parts: [
                Bodies.rectangle(x, y, this.image.width, this.image.height),
                ...this.limbs.map((limb) => limb.physicsBody),
            ],
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

    addToWorld(world: World) {
        World.add(world, [
            this.physicsBody
        ]);
    }

    render(context: CanvasRenderingContext2D) {
        context.save();
        context.translate(this.physicsBody.position.x, this.physicsBody.position.y);

        context.drawImage(this.image, -this.image.width / 2, -this.image.height / 2);

        context.restore();

        for (let limb of this.limbs) {
            limb.render(context);
        }
    }


}