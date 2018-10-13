import { IScene } from "../../definitions/IScene";
import { IEntity } from "../../definitions/IEntity";
import { IGameState } from "../../definitions/IGameState";

import Player from './entities/Player';

export default class Game implements IScene {
    entities: IEntity[];

    constructor() {
        this.entities = [];
    }

    async initialize(): Promise<boolean> {
        await Promise.all([
            this.entities.push(await new Player().initialize(20, 40)),
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