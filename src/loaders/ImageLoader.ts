export default class ImageLoader {
  loadImage(path: string): Promise<HTMLImageElement> {
    const img = document.createElement('img');
    img.src = path;

    return new Promise<HTMLImageElement>((resolve) => {
      img.onload = () => {
        resolve(img);
      };
    });
  }
}
