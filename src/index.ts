import { Engine, World } from 'matter-js';
import { flatMap } from 'lodash';
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
    engine.world.gravity.scale = 0;
    engine.world.gravity.y = 0;
    gameState.currentScene = scene;
}

const context = canvas.getContext('2d');

const main = async () => {

    SetScene(new Game());

    await gameState.currentScene.initialize();


    for (let entity of gameState.currentScene.entities) {
        entity.addToWorld(engine.world);
    }

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