import { Category, createMessage, type Contents, type File } from './Message';
import { MessagePlayer } from './MessagePlayer';
import { PriorityMessageQueue } from './PriorityMessageQueue';

export class MessageDeliver {
  static STATUS = Object.freeze({
    READY: 'READY',
    DELIVERING: 'DELIVERING',
    IDLE: 'IDLE',
  });

  private static DELIVER_TIMEOUT = 60 * 1000;
  private _status: keyof typeof MessageDeliver.STATUS =
    MessageDeliver.STATUS.READY;

  constructor(
    private messagePlayer: MessagePlayer,
    private pQueue: PriorityMessageQueue
  ) {
    this._scan();
  }

  register(category: Category, contents: Contents) {
    const newMessage = createMessage(category, contents);
    if (newMessage === null) return;

    this.pQueue.enqueue(category, newMessage);
  }

  _scan() {
    if (this._status === MessageDeliver.STATUS.READY) {
      let message = this.pQueue.dequeue();
      if (message) {
        const { timeStamp, files } = message;
        if (Date.now() - timeStamp < MessageDeliver.DELIVER_TIMEOUT) {
          this._status = MessageDeliver.STATUS.DELIVERING;
          this._deliver(files);
        }
      }
    }
    requestAnimationFrame(this._scan.bind(this));
  }

  _deliver(files: File[]) {
    const _this = this;

    const playMessage = (_files: File[]) => {
      const file = _files.shift() as File;
      const { file: blob, interval } = file;

      let callback = () => {};
      if (_files.length === 0) {
        callback = () => {
          _this._status = MessageDeliver.STATUS.IDLE;
          setTimeout(() => {
            _this._status = MessageDeliver.STATUS.READY;
          }, interval);
        };
      } else {
        callback = () => {
          setTimeout(() => {
            playMessage(files);
          }, interval);
        };
      }

      this.messagePlayer.play({
        file: blob,
        callback,
      });
    };
  }
}
