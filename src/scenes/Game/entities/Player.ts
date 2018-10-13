import { Bodies, Body, Composite, World, Constraint } from 'matter-js';

import PlayerHead from './PlayerLimbs/PlayerHead';
import PlayerArmLeft from './PlayerLimbs/PlayerArmLeft';
import PlayerArmRight from './PlayerLimbs/PlayerArmRight';
import PlayerLegLeft from './PlayerLimbs/PlayerLegLeft';
import PlayerLegRight from './PlayerLimbs/PlayerLegRight';

import IEntity from '../../../definitions/IEntity';
import { IGameState } from '../../../definitions/IGameState';

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
        this.image = await this.imageLoader.loadImage('/assets/images/playerBody.png');

        this.physicsBody = Bodies.rectangle(x, y, this.image.width / 2, this.image.height / 2, {
          collisionFilter: {
            category: 1,
            mask: 0,
          } as any,
        });

        this.physicsBody.force.y = 0;

        const createLimb = async (LimbClass, offSet: IPosition) => {
            const entity = await new LimbClass().initialize(x + offSet.x, y + offSet.y);

            const constraint = Constraint.create({
                bodyA: this.physicsBody,
                bodyB: entity.physicsBody,
                stiffness: 0.6,
                pointA: {
                    x: offSet.x,
                    y: offSet.y,
                },
                
            });

            return {
                entity,
                constraint,
            };
        }

        const head = await createLimb(PlayerHead, { x: 0, y: -40 });
        const leftArm = await createLimb(PlayerArmLeft,
          { x: -44, y: -34 },
        );
        const rightArm = await createLimb(PlayerArmRight, { x: +44, y: -34 });
        const leftLeg = await createLimb(PlayerLegLeft,
          { x: -38, y: 46 },
        );
        const rightLeg = await createLimb(PlayerLegRight,
          { x: 38, y: 46 },
        );

        this.composite = Composite.create({
            bodies: [
                this.physicsBody,
                leftArm.entity.physicsBody,
                rightArm.entity.physicsBody,
                head.entity.physicsBody,
                leftLeg.entity.physicsBody,
                rightLeg.entity.physicsBody,
            ],
            constraints: [
                leftArm.constraint,
                rightArm.constraint,
                head.constraint,
                leftLeg.constraint,
                rightLeg.constraint,
            ],
        });

        this.limbs = [
          head.entity,
          leftArm.entity,
          rightArm.entity,
          leftLeg.entity,
          rightLeg.entity,
        ];
        
        return this;
    }

    addToWorld(world: World) {
        World.add(world, this.composite);
    }

    update(gameState: IGameState) {
      const ROTATION_SPEED = 0.02;

      if (gameState.keyPresses['ArrowLeft']) {
        Body.setAngularVelocity(this.physicsBody, -ROTATION_SPEED);
      }

      if (gameState.keyPresses['ArrowRight']) {
        Body.setAngularVelocity(this.physicsBody, ROTATION_SPEED);
      }
    }

    render(context: CanvasRenderingContext2D) {
        context.save();
        context.translate(this.physicsBody.position.x, this.physicsBody.position.y);
        context.rotate(this.physicsBody.angle);

        context.drawImage(
          this.image,
          -this.image.width / 2,
          -this.image.height / 2,
        );

        context.restore();

        for (let limb of this.limbs) {
          limb.render(context);
        }
    }
}
