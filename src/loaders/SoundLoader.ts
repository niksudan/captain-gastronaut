export default class SoundLoader {
  loadSound(path: string): Promise<HTMLAudioElement> {
    const sound = document.createElement('audio');
    sound.src = path;

    return new Promise<HTMLAudioElement>((resolve) => {
      sound.onload = () => {
        resolve(sound);
      };
    });
  }
}
