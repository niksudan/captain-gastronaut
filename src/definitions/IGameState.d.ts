import { IScene } from './IScene';
import IEntity from './IEntity';

interface IGameState {
    currentScene: IScene;
    focusedEntity: IEntity;
    keyPresses: {[key: string]: boolean};
    score: number;
    collisionSubscriptions: {[key: string]: Array<(gameState: IGameState) => void>}
    subscribeToEvent(name: string, subscription: (gameState: IGameState) => void);
    withinViewPort(entity: IEntity): boolean;
    shakeScreen(shakeForce: number);
    shakeForce: number;
    screenShakeTimer: number;
    setScene(scene: IScene);
}
