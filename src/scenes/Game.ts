import { IScene } from "../definitions/IScene";
import { IEntity } from "../definitions/IEntity";
import { IGameState } from "../definitions/IGameState";

export default class Game implements IScene {
    entities: IEntity[];

    constructor() {

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