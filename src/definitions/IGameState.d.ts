import { IScene } from "./IScene";

interface IGameState {
    currentScene: IScene;
    keyPresses: {[key: string]: boolean};
}