import {
  Bodies,
  Body,
  Composite,
  World,
  Constraint,
  IEngineDefinition,
} from 'matter-js';
import * as randomItem from 'random-item';

import PlayerHead from './PlayerLimbs/PlayerHead';
import PlayerArmLeft from './PlayerLimbs/PlayerArmLeft';
import PlayerArmRight from './PlayerLimbs/PlayerArmRight';
import PlayerLegLeft from './PlayerLimbs/PlayerLegLeft';
import PlayerLegRight from './PlayerLimbs/PlayerLegRight';

import IEntity from '../../../definitions/IEntity';
import { IGameState } from '../../../definitions/IGameState';
import Particle from './Particle';

interface IPosition {
  x: number;
  y: number;
}

interface ISoundData {
  sound: HTMLAudioElement;
  startTime: number;
}

let fartParticles = [];

export default class Player extends IEntity {
  physicsBody: Body;
  composite: Composite;
  limbs: IEntity[];
  image: HTMLImageElement;
  buildUp: number = 0.0;
  head: PlayerHead;
  chargeSound?: HTMLAudioElement;
  chargeSounds: HTMLAudioElement[];
  canFart: boolean = false;
  fartSounds: HTMLAudioElement[];
  bigFartSounds: HTMLAudioElement[];

  async initializeParticles() {
    fartParticles = await Promise.all([
      await this.imageLoader.loadImage('/assets/images/fart1.png'),
      await this.imageLoader.loadImage('/assets/images/fart2.png'),
      await this.imageLoader.loadImage('/assets/images/fart3.png'),
      await this.imageLoader.loadImage('/assets/images/fart4.png'),
    ]);
  }

  async initialize(gameState: IGameState, x: number, y: number) {
    await this.initializeParticles();

    this.image = await this.imageLoader.loadImage(
      '/assets/images/playerBody.png',
    );

    this.chargeSounds = [
      await this.soundLoader.loadSound('/assets/sounds/charge1.ogg'),
      await this.soundLoader.loadSound('/assets/sounds/charge2.ogg'),
      await this.soundLoader.loadSound('/assets/sounds/charge3.ogg'),
    ];
    this.fartSounds = [
      await this.soundLoader.loadSound('/assets/sounds/fart1.ogg'),
      await this.soundLoader.loadSound('/assets/sounds/fart2.ogg'),
    ];
    this.bigFartSounds = [
      await this.soundLoader.loadSound('/assets/sounds/bigfart1.ogg'),
      await this.soundLoader.loadSound('/assets/sounds/bigfart2.ogg'),
      await this.soundLoader.loadSound('/assets/sounds/bigfart3.ogg'),
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
        gameState,
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

  async addParticle(
    gameState: IGameState,
    x: number,
    y: number,
    images: HTMLImageElement[],
  ) {
    const particle = await new Particle().initialize(gameState, x, y, images);
    gameState.currentScene.entities.push(particle);
  }

  addToWorld(world: World) {
    World.add(world, this.composite);
  }

  update(world: World, gameState: IGameState) {
    const ROTATION_SPEED = 0.025;
    const SPEED = 1.5;
    const BUILD_UP_SPEED = 0.008;

    if (gameState.keyPresses['ArrowLeft']) {
      Body.setAngularVelocity(this.physicsBody, -ROTATION_SPEED);
    }

    if (gameState.keyPresses['ArrowRight']) {
      Body.setAngularVelocity(this.physicsBody, ROTATION_SPEED);
    }

    // time to fart
    if (gameState.keyPresses['ArrowUp']) {
      this.canFart = true;
      this.head.setFace('CHARGING');
      this.buildUp += BUILD_UP_SPEED;

      // HNNNGGGHH
      if (this.buildUp === 0) {
        this.chargeSound = randomItem(this.chargeSounds);
        this.chargeSound.currentTime = 0;
        this.chargeSound.play();
      }

      // wiggle yo ass ;)
      Body.setAngularVelocity(
        this.physicsBody,
        Math.sin(this.buildUp * 100) / 100,
      );
    } else {
      if (this.chargeSound) {
        this.chargeSound.pause();
      }

      // release the crap-ken
      if (this.buildUp > 0) {
        const angle = this.physicsBody.angle - Math.PI / 2;
        if (this.buildUp > 0.1) {
          // wheeeee
          const force = Math.min(1, this.buildUp);
          Body.applyForce(this.physicsBody, this.physicsBody.position, {
            x: Math.cos(angle) * (SPEED * force),
            y: Math.sin(angle) * (SPEED * force),
          });

          // puff daddies
          const { x, y } = this.physicsBody.position;
          for (let i: number = 0; i < Math.round(force * 5); i++) {
            this.addParticle(gameState, x, y, fartParticles);
          }
        }

        // gotta play them bottom burps
        if (this.canFart) {
          this.canFart = false;
          if (this.buildUp > 0.5) {
            randomItem(this.bigFartSounds).play();
          } else {
            randomItem(this.fartSounds).play();
          }
        }

        this.buildUp = 0;
      }

      // be expressive
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
