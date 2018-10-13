import { Engine, Events, World } from 'matter-js';
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
    focusedEntity: null,
    keyPresses: {},
    collisionSubscriptions: {},
    subscribeToEvent(name: string, subscription: () => void) {
      if (!gameState.collisionSubscriptions[name]) {
        gameState.collisionSubscriptions[name] = [];
      }

      gameState.collisionSubscriptions[name].push(subscription);
    }
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
    gameState.collisionSubscriptions = {};
    gameState.currentScene = scene;

    Events.on(engine, 'collisionStart', function(event) {
      for (let pair of event.pairs) {

        const subscriptions = [
          ...(gameState.collisionSubscriptions[pair.bodyA.label] || []),
          ...(gameState.collisionSubscriptions[pair.bodyB.label] || []),
        ];

        subscriptions.map((subscription) => subscription());
      }
    });
}

const context = canvas.getContext('2d');

const main = async () => {

    SetScene(new Game());

    await gameState.currentScene.initialize(gameState);


    for (let entity of gameState.currentScene.entities) {
        entity.addToWorld(engine.world);
    }

    const render = () => {

        context.save();

        context.clearRect(0, 0, GameSettings.width, GameSettings.height);

        if (gameState.focusedEntity !== null) {
          const position = gameState.focusedEntity.physicsBody.position;

          context.translate(
            -position.x + GameSettings.width / 2,
            -position.y + GameSettings.height / 2,
          );
        }

        gameState.currentScene.update(gameState);
        gameState.currentScene.render(context);
    
        Engine.update(engine);
        requestAnimationFrame(render);

        context.restore();
    };
    
    render();
}

main();