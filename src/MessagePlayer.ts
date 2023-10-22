type PlayContext = {
  file: Blob | undefined;
  callback: (() => void) | undefined;
};

export class MessagePlayer {
  private playContext: PlayContext = {
    file: undefined,
    callback: undefined,
  };

  constructor() {
    this._play();
  }

  play(context: PlayContext) {
    this.playContext = context;
  }

  _play() {
    const { file, callback } = this.playContext;
    if (file) {
      const audioUrl = URL.createObjectURL(file);
      const audio = new Audio(audioUrl);

      audio.addEventListener('ended', () => {
        URL.revokeObjectURL(audio.src);
        callback?.();
      });

      audio.play();
      this.playContext = { file: undefined, callback: undefined };
    }
    requestAnimationFrame(this._play.bind(this));
  }
}
