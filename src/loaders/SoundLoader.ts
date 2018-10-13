export default class SoundLoader {
  loadSound(path: string): Promise<HTMLAudioElement> {
    const sound = new Audio(path);
    sound.load();

    return new Promise<HTMLAudioElement>((resolve) => {
      sound.oncanplaythrough = () => {
        resolve(sound);
      };
    });
  }
}
