import { IScene } from "./IScene";
import IEntity from "./IEntity";

interface IGameState {
    currentScene: IScene;
    focusedEntity: IEntity;
    keyPresses: {[key: string]: boolean};
    collisionSubscriptions: {[key: string]: Array<() => void>}
    subscribeToEvent(name: string, subscription: () => void);
}