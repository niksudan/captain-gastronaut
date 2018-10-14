import ImageLoader from "../../../loaders/ImageLoader";
import { IGameState } from "../../../definitions/IGameState";

export default class Panel {
  private imageLoader: ImageLoader = new ImageLoader();
  private isActive: boolean;

  imagePassive: HTMLImageElement;
  imageActive: HTMLImageElement;

  constructor(private x: number, private y: number) {

  }

  async initialize() {
    this.imagePassive = await this.imageLoader.loadImage('/assets/images/panel.png');
    this.imageActive = await this.imageLoader.loadImage('/assets/images/panelActive.png');
    
    return this;
  }

  public toggleActive(active) {
    this.isActive = active;
  }

  public update(gameState: IGameState) {

  }

  public render(context: CanvasRenderingContext2D) {
    context.save();
    context.translate(this.x, this.y);
    const currentImage = this.isActive ? this.imageActive : this.imagePassive;
    context.drawImage(currentImage, -currentImage.width / 2, -currentImage.height / 2);
    context.restore();
  }
}