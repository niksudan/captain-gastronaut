import ImageLoader from "../../../loaders/ImageLoader";
import { IGameState } from "../../../definitions/IGameState";
import SoundLoader from "../../../loaders/SoundLoader";

export default class Panel {
  private isActive: boolean;
  private flashing: number = 0;

  imagePassive: HTMLImageElement;
  imageActive: HTMLImageElement;
  panelSound: HTMLAudioElement;

  constructor(private x: number, private y: number) {

  }

  async initialize() {
    const imageLoader = new ImageLoader();
    const audioLoader = new SoundLoader();
    this.imagePassive = await imageLoader.loadImage('./assets/images/panel.png');
    this.imageActive = await imageLoader.loadImage('./assets/images/panelActive.png');
    
    this.panelSound = await audioLoader.loadSound('./assets/sounds/panel.ogg');

    return this;
  }

  public toggleActive(active) {
    this.isActive = active;
    this.flashing = 0;
  }

  public update(gameState: IGameState) {
    if (!this.isActive) {
      return;
    }

    this.flashing += 0.1;
    if (this.flashing > 2) {
      this.flashing = 0;
    }

    const focusedPosition = gameState.focusedEntity.physicsBody.position;
    const NEAR_DISTANCE = this.imageActive.width;

    const isNearFocused = (
      Math.abs(this.x - focusedPosition.x) + Math.abs(this.y - focusedPosition.y) < NEAR_DISTANCE
    );

    if (isNearFocused) {
      this.panelSound.play();
      (gameState.currentScene as any).activatePanel();
    }
  }

  public render(context: CanvasRenderingContext2D) {
    context.save();
    context.translate(this.x, this.y);
    const currentImage = this.isActive && (~~this.flashing) % 2 == 0 ? this.imageActive : this.imagePassive;
    context.drawImage(currentImage, -currentImage.width / 2, -currentImage.height / 2);
    context.restore();
  }
}