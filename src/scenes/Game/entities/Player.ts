import { Bodies, Body, Composite, World, Constraint } from 'matter-js';

import PlayerHead from './PlayerLimbs/PlayerHead';
import PlayerArmLeft from './PlayerLimbs/PlayerArmLeft';
import PlayerArmRight from './PlayerLimbs/PlayerArmRight';
import PlayerLegLeft from './PlayerLimbs/PlayerLegLeft';
import PlayerLegRight from './PlayerLimbs/PlayerLegRight';

import IEntity from '../../../definitions/IEntity';
import { IGameState } from "../../../definitions/IGameState";

interface IPosition {
    x: number;
    y: number;
}

export default class Player extends IEntity {
    physicsBody: Body;
    composite: Composite;
    limbs: IEntity[];
    image: HTMLImageElement;

    async initialize(x: number, y: number) {
        this.image = await this.imageLoader.loadImage('/assets/playerBody.png');

        this.physicsBody = Bodies.rectangle(x, y, this.image.width, this.image.height);

        const createLimb = async (LimbClass, offSet: IPosition) => {
            const limb = await new LimbClass().initialize(x + offSet.x, y + offSet.y);

            const constraint = Constraint.create({
                bodyA: this.physicsBody,
                bodyB: limb.physicsBody,
                pointB: {
                    x: 0,
                    y: 0,
                },
            });

            return {
                limb,
                constraint,
            };
        }

        const head = await createLimb(PlayerHead, { x: 0, y: -46 });
        const leftLimb = await createLimb(PlayerArmLeft, { x: -44, y: -34 });
        const rightLimb = await createLimb(PlayerArmRight, { x: +44, y: -34 });

        this.composite = Composite.create({
            bodies: [
                this.physicsBody,
                leftLimb.limb.physicsBody,
                rightLimb.limb.physicsBody,
                head.limb.physicsBody,
            ],
            constraints: [
                leftLimb.constraint,
                rightLimb.constraint,
                head.constraint,
            ],
        });

        this.limbs = [leftLimb.limb, rightLimb.limb, head.limb];

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
        World.add(world, this.composite);
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