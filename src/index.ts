import { Engine, World } from 'matter-js';
import GameSettings from './data/GameSettings';
import { IScene } from './definitions/IScene';
import { IGameState } from './definitions/IGameState';

const canvas = document.createElement('canvas');
canvas.width = GameSettings.width;
canvas.height = GameSettings.height;

document.body.appendChild(canvas);

const engine = Engine.create();

World.add(engine.world, []);

const gameState = {
    currentScene: null,
    keyPresses: {},
} as IGameState;

document.addEventListener('keyup', (event) => {
    gameState.keyPresses[event.key] = false;
});

document.addEventListener('keydown', (event) => {
    gameState.keyPresses[event.key] = true;
});

const SetScene = (scene: IScene) => {
    gameState.currentScene = scene;
}

const context = canvas.getContext('2d');

const render = () => {

    gameState.currentScene.update(gameState);
    gameState.currentScene.render(context);

    Engine.update(engine);
    requestAnimationFrame(render);
};

render();