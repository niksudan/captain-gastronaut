import { Engine, World } from 'matter-js';
import GameSettings from './data/GameSettings';
import { IScene } from './definitions/IScene';
import { IGameState } from './definitions/IGameState';

import Game from './scenes/Game';

const canvas = document.createElement('canvas');
canvas.width = GameSettings.width;
canvas.height = GameSettings.height;

document.body.appendChild(canvas);

let engine = Engine.create();

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
    engine = Engine.create();
    gameState.currentScene = scene;
}

const context = canvas.getContext('2d');

const main = async () => {

    SetScene(new Game());

    await gameState.currentScene.initialize();
    
    World.add(engine.world, gameState.currentScene.entities.map((entity) => entity.getPhysicsBody()));

    const render = () => {

        context.clearRect(0, 0, GameSettings.width, GameSettings.height);

        gameState.currentScene.update(gameState);
        gameState.currentScene.render(context);
    
        Engine.update(engine);
        requestAnimationFrame(render);
    };
    
    render();
}

main();