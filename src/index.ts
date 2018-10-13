import { Engine } from 'matter-js';
import GameSettings from './data/GameSettings';

const canvas = document.createElement('canvas');
canvas.width = GameSettings.width;
canvas.height = GameSettings.height;

document.body.appendChild(canvas);

