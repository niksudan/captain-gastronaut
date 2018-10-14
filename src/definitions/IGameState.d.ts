import { IScene } from "./IScene";
import IEntity from "./IEntity";

interface IGameState {
    currentScene: IScene;
    focusedEntity: IEntity;
    keyPresses: {[key: string]: boolean};
    collisionSubscriptions: {[key: string]: Array<(gameState: IGameState) => void>}
    subscribeToEvent(name: string, subscription: (gameState: IGameState) => void);
    withinViewPort(entity: IEntity): boolean;
}