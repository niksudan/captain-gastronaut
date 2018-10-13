import { IScene } from "../../definitions/IScene";
import IEntity from "../../definitions/IEntity";
import { IGameState } from "../../definitions/IGameState";

import Player from './entities/Player';
import Obsticle from './entities/Obsticle';
import GameSettings from "../../data/GameSettings";

const MAX_OBSTICLE_COUNT = 10;
const MAX_OBSTICLE_CREATION_WIDTH = GameSettings.width + 200;
const MAX_OBSTICLE_CREATION_HEIGHT = GameSettings.height + 200;

export default class Game implements IScene {
    entities: IEntity[];
    obsticles: IEntity[] = [];

    constructor() {
        this.entities = [];
    }

    private async createObsticle(ignoreScreen = false) {
      const numberWithinRange = (min: number, max: number) => {
        return (Math.random() * (max - 1)) + min;
      };

      const numberWithinTwoRanges = (min1: number, max1: number, min2: number, max2: number) => {
        return Math.random() > 0.5 ? numberWithinRange(min1, max1) : numberWithinRange(min2, max2);
      }

      let x: number = 0, y: number = 0;
      if (!ignoreScreen) {
        x = numberWithinRange(
          -MAX_OBSTICLE_CREATION_WIDTH, GameSettings.width + MAX_OBSTICLE_CREATION_WIDTH
        );
        y = numberWithinRange(
          -MAX_OBSTICLE_CREATION_HEIGHT, GameSettings.height + MAX_OBSTICLE_CREATION_HEIGHT
        );
      } else {
        x = numberWithinTwoRanges(
          -MAX_OBSTICLE_CREATION_WIDTH, 0,
          GameSettings.width, GameSettings.width + MAX_OBSTICLE_CREATION_WIDTH,
        );
        y = numberWithinTwoRanges(
          -MAX_OBSTICLE_CREATION_WIDTH, 0,
          GameSettings.width, GameSettings.width + MAX_OBSTICLE_CREATION_WIDTH,
        );
      }

      const obsticle = await new Obsticle().initialize(x, y);
      this.entities.push(obsticle);
      this.obsticles.push(obsticle);
    }

    private async createObsticles(ignoreScreen = false) {
      for (let i: number = this.obsticles.length; i < MAX_OBSTICLE_COUNT; i ++) {
        await this.createObsticle(ignoreScreen);
      }
    }

    async initialize(gameState: IGameState): Promise<boolean> {
      await this.createObsticles(false);
      const player = await new Player().initialize(300, 200);

      gameState.focusedEntity = player;

      await Promise.all([
          this.entities.push(player),
      ]);

      return true;
    }

    update(gameState: IGameState) {
      this.createObsticles(true);
      for (let entity of this.entities) {
        entity.update(gameState);
      }
    }
    
    render(context: CanvasRenderingContext2D) {
      for (let entity of this.entities) {
        entity.render(context);
      }
    }
}