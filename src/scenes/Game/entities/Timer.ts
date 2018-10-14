import ImageLoader from "../../../loaders/ImageLoader";
import GameSettings from "../../../data/GameSettings";

export default class Timer {
  private background: HTMLImageElement;
  private arrow: HTMLImageElement;

  async initialize() {
    const imageLoader = new ImageLoader();

    this.background = await imageLoader.loadImage('./assets/images/dangerometer.png');
    this.arrow = await imageLoader.loadImage('./assets/images/arrow.png');

    return this;
  }

  render(context: CanvasRenderingContext2D, time: number) {
    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.drawImage(
      this.background,
      GameSettings.width / 2 - this.background.width / 2,
      GameSettings.height - this.background.height
    );
    
    context.save();

    context.translate(GameSettings.width / 2, GameSettings.height - 25);

    const dialRotation = Math.max((90 * (time - 0.5) * 2 ) * (Math.PI / 180), -90);

    context.rotate(dialRotation);

    context.drawImage(
      this.arrow,
      -this.arrow.width / 2,
      -this.arrow.height
    );

    context.restore();

    context.restore();
  }
}