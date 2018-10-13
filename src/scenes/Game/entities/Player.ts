import { Bodies, Body, Composite, World, Constraint } from 'matter-js';
import * as randomItem from 'random-item';

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

interface ISoundData {
  sound: HTMLAudioElement;
  startTime: number;
}

export default class Player extends IEntity {
  physicsBody: Body;
  composite: Composite;
  limbs: IEntity[];
  image: HTMLImageElement;
  buildUp: number = 0.0;
  head: PlayerHead;
  chargeSounds: ISoundData[];
  chargeSound?: ISoundData;

  async initialize(x: number, y: number) {
    this.image = await this.imageLoader.loadImage(
      '/assets/images/playerBody.png',
    );

    this.chargeSounds = [
      {
        sound: await this.soundLoader.loadSound('/assets/sounds/charge1.ogg'),
        startTime: 0.1,
      },
      {
        sound: await this.soundLoader.loadSound('/assets/sounds/charge2.ogg'),
        startTime: 0.1,
      },
      {
        sound: await this.soundLoader.loadSound('/assets/sounds/charge3.ogg'),
        startTime: 0,
      },
    ];

    this.physicsBody = Bodies.rectangle(
      x,
      y,
      this.image.width,
      this.image.height,
      {
        collisionFilter: {
          category: 2,
          mask: 0,
        } as any,
      },
    );

    this.physicsBody.force.y = 0;

    const createLimb = async (LimbClass, offSet: IPosition) => {
      const entity = await new LimbClass().initialize(
        x + offSet.x,
        y + offSet.y,
      );

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
    };

    const head = await createLimb(PlayerHead, { x: 0, y: -40 });
    this.head = head.entity;
    const leftArm = await createLimb(PlayerArmLeft, { x: -44, y: -34 });
    const rightArm = await createLimb(PlayerArmRight, { x: +44, y: -34 });
    const leftLeg = await createLimb(PlayerLegLeft, { x: -38, y: 46 });
    const rightLeg = await createLimb(PlayerLegRight, { x: 38, y: 46 });

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
    const SPEED = 2;
    const BUILD_UP_SPEED = 0.01;

    if (gameState.keyPresses['ArrowLeft']) {
      Body.setAngularVelocity(this.physicsBody, -ROTATION_SPEED);
    }

    if (gameState.keyPresses['ArrowRight']) {
      Body.setAngularVelocity(this.physicsBody, ROTATION_SPEED);
    }

    if (gameState.keyPresses['ArrowUp']) {
      if (this.buildUp === 0) {
        this.chargeSound = randomItem(this.chargeSounds);
        this.chargeSound.sound.currentTime = this.chargeSound.startTime;
        this.chargeSound.sound.play();
      }
      this.buildUp += BUILD_UP_SPEED;
      Body.setAngularVelocity(
        this.physicsBody,
        Math.sin(this.buildUp * 50) / 100,
      );
      this.head.setFace('CHARGING');
    } else {
      if (this.chargeSound) {
        this.chargeSound.sound.pause();
      }
      if (this.buildUp > 0) {
        const angle = this.physicsBody.angle - Math.PI / 2;

        if (this.buildUp > 0.5) {
          const force = Math.min(1, this.buildUp);
          Body.applyForce(this.physicsBody, this.physicsBody.position, {
            x: Math.cos(angle) * (SPEED * force),
            y: Math.sin(angle) * (SPEED * force),
          });
        }

        this.buildUp = 0;
      }
      if (this.physicsBody.speed > 2) {
        this.head.setFace('POOP');
      } else {
        this.head.setFace('PASSIVE');
      }
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
