import IEntity from "../../../definitions/IEntity";
import { World, Body, Bodies } from "matter-js";

const OBSTICLE_IMAGES = [
  'obstacleBig.png',
  'obstacleMedium.png',
];

export default class Obsticle extends IEntity {
  physicsBody: Body;
  limbs: IEntity[];
  image: HTMLImageElement;
  buildUp: number = 0.0;

  async initialize(x: number, y: number) {
    const imageSelected = OBSTICLE_IMAGES[~~(Math.random() * (OBSTICLE_IMAGES.length - 1))];
    this.image = await this.imageLoader.loadImage(`/assets/images/${imageSelected}`);

    this.physicsBody = Bodies.rectangle(x, y, this.image.width, this.image.height, {
      collisionFilter: {
        category: 2,
        mask: 2,
      } as any,
    });

    this.physicsBody.force.y = 0;

    return this;
  }

  addToWorld(world: World) {
    World.add(world, this.physicsBody);
  }
}