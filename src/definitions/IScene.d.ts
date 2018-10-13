import { IEntity } from "./IEntity";
import { IGameState } from "./IGameState";

interface IScene {
    entities: IEntity[];
    update(gameState: IGameState);
    render(context: CanvasRenderingContext2D);
}