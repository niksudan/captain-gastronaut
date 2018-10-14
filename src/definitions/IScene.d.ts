import IEntity from "./IEntity";
import { IGameState } from "./IGameState";
import { World } from "matter-js";

interface IScene {
    entities: IEntity[];
    entitiesToDestroy: string[];
    particlesToAdd: IEntity[];
    initialize(gameState: IGameState): Promise<boolean>;
    update(world: World, gameState: IGameState);
    render(context: CanvasRenderingContext2D);
}