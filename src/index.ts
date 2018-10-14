import { Engine, Events, World } from 'matter-js';
import GameSettings from './data/GameSettings';
import { IScene } from './definitions/IScene';
import { IGameState } from './definitions/IGameState';

import Game from './scenes/Game';
import IEntity from './definitions/IEntity';
import SoundLoader from './loaders/SoundLoader';
import StartGame from './scenes/StartGame';
import ImageLoader from './loaders/ImageLoader';

const PRELOAD_IMAGES = [
  'arrow',
  'background',
  'button',
  'dangerometer',
  'fart1',
  'fart2',
  'fart3',
  'fart4',
  'invaders',
  'logo',
  'obstacleBig',
  'obstacleMedium',
  'obstacleSmall',
  'panel',
  'panelActive',
  'planet',
  'planetDead',
  'playerArmLeft',
  'playerArmRight',
  'playerBody',
  'playerHead',
  'playerHead2',
  'playerHead3',
  'playerHeadLeft',
  'playerHeadRight',
  'playerLegLeft',
  'playerLegRight',
  'shit1',
  'shit2',
  'shit3',
  'stars'
];

const PRELOAD_AUDIO = [
  'bigfart1',
  'bigfart2',
  'bigfart3',
  'bump1',
  'bump2',
  'bump3',
  'charge1',
  'charge2',
  'charge3',
  'epic',
  'fart1',
  'fart2',
  'fling',
  'gameover',
  'intro',
  'music',
  'panel',
  'timer'
];

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
  screenShakeTimer: 0,
  shakeForce: 0,
  score: 0,
  shakeScreen(shakeForce: number) {
    gameState.screenShakeTimer = 5;
    gameState.shakeForce = shakeForce;
  },
  subscribeToEvent(name: string, subscription: () => void) {
    if (!gameState.collisionSubscriptions[name]) {
      gameState.collisionSubscriptions[name] = [];
    }

    gameState.collisionSubscriptions[name].push(subscription);
  },
  withinViewPort(entity: IEntity): boolean {
    if (gameState.focusedEntity === null) {
      return false;
    }
    const focusedPosition = gameState.focusedEntity.physicsBody.position;
    const entityPosition = entity.physicsBody.position;

    return (
      entityPosition.x > focusedPosition.x - GameSettings.width &&
      entityPosition.x < focusedPosition.x + GameSettings.width &&
      entityPosition.y > focusedPosition.y - GameSettings.height &&
      entityPosition.y < focusedPosition.y + GameSettings.height
    );
  },
  async setScene(scene: IScene) {
    engine = Engine.create();
    engine.world.gravity.scale = 0;
    engine.world.gravity.y = 0;
    gameState.focusedEntity = null;
    gameState.collisionSubscriptions = {};
    gameState.currentScene = scene;

    Events.on(engine, 'collisionStart', function(event) {
      for (let pair of event.pairs) {
        const subscriptions = [
          ...(gameState.collisionSubscriptions[pair.bodyA.label] || []),
          ...(gameState.collisionSubscriptions[pair.bodyB.label] || []),
        ];

        subscriptions.map((subscription) => subscription(gameState));
      }
    });

    await gameState.currentScene.initialize(gameState);

    for (let entity of gameState.currentScene.entities) {
      entity.addToWorld(engine.world);
    }
  },
} as IGameState;

document.addEventListener('keyup', (event) => {
  gameState.keyPresses[event.key] = false;
});

document.addEventListener('keydown', (event) => {
  gameState.keyPresses[event.key] = true;
});

const context = canvas.getContext('2d');

const main = async () => {
  const imageLoader = new ImageLoader();
  const soundLoader = new SoundLoader();

  await Promise.all(PRELOAD_IMAGES.map(async (image) => await imageLoader.loadImage(`./assets/images/${image}.png`)));
  await Promise.all(PRELOAD_AUDIO.map(async (audio) => await soundLoader.loadSound(`./assets/sounds/${audio}.ogg`)));

  gameState.music = await soundLoader.loadSound(
    './assets/sounds/music.ogg',
  );
  gameState.music.loop = true;

  await gameState.setScene(new StartGame());

  const handleCanvasResize = () => {
    const parent = canvas.parentElement;
    const heightRatio = GameSettings.height / GameSettings.width;

    let canvasWidth = parent.clientWidth;
    let canvasHeight = parent.clientWidth * heightRatio;

    if (canvasHeight > parent.clientHeight) {
      canvasWidth = parent.clientHeight / heightRatio;
      canvasHeight = parent.clientHeight;
    }

    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;
  };

  const render = async () => {
    context.save();

    handleCanvasResize();

    context.clearRect(0, 0, GameSettings.width, GameSettings.height);
    context.fillStyle = '#000000';
    context.fillRect(0, 0, GameSettings.width, GameSettings.height);

    if (gameState.focusedEntity !== null) {
      const position = gameState.focusedEntity.physicsBody.position;

      context.translate(
        -position.x + GameSettings.width / 2,
        -position.y + GameSettings.height / 2,
      );
    }

    if (gameState.screenShakeTimer > 0) {
      gameState.screenShakeTimer -= 0.1;
      context.translate(
        Math.sin(gameState.screenShakeTimer * 50) * gameState.shakeForce,
        0,
      );
    }

    await gameState.currentScene.update(engine.world, gameState);
    gameState.currentScene.render(context);

    Engine.update(engine);
    requestAnimationFrame(render);

    context.restore();
  };

  render();
};

main();
