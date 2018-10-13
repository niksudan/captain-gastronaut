import IEntity from "./IEntity";
import { IGameState } from "./IGameState";

interface IScene {
    entities: IEntity[];
    initialize(gameState: IGameState): Promise<boolean>;
    update(gameState: IGameState);
    render(context: CanvasRenderingContext2D);
}