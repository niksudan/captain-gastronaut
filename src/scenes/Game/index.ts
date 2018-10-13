import { IScene } from "../../definitions/IScene";
import IEntity from "../../definitions/IEntity";
import { IGameState } from "../../definitions/IGameState";

import Player from './entities/Player';

export default class Game implements IScene {
    entities: IEntity[];

    constructor() {
        this.entities = [];
    }

    async initialize(gameState: IGameState): Promise<boolean> {
      const player = await new Player().initialize(300, 200);

      gameState.focusedEntity = player;

      await Promise.all([
          this.entities.push(player),
      ]);

      return true;
    }

    update(gameState: IGameState) {
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