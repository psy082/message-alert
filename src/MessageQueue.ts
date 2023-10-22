import { C1Message, C2Message, Message } from './Message';

export abstract class MessageQueue {
  protected queue: Message[];

  abstract enqueue(message: Message): void;

  dequeue(): Message | undefined {
    return this.queue.shift();
  }

  *[Symbol.iterator]() {
    for (const item of this.queue) {
      yield item;
    }
  }
}

export class C1Queue extends MessageQueue {
  constructor() {
    super();
  }

  enqueue(message: C1Message): void {
    this.queue.push(message);
  }
}

export const C2Queue = (() => {
  class DebouncingMessages {
    private static DEBOUNCING_TIME = 3000;
    private messages: C2Message[] = [];

    push(message: C2Message) {
      if (this.includes(message)) return;
      this.messages.push(message);
      setTimeout(() => {
        this.messages = this.messages.filter((m) => !m.equals(message));
      }, DebouncingMessages.DEBOUNCING_TIME);
    }

    includes(message: C2Message) {
      return this.messages.some((m) => m.equals(message));
    }
  }

  return class C2Queue extends MessageQueue {
    private debouncingMessages: DebouncingMessages;

    constructor() {
      super();
      this.debouncingMessages = new DebouncingMessages();
    }

    enqueue(message: C2Message): void {
      if (this.debouncingMessages.includes(message)) {
        console.warn('this message aleady exists');
        return;
      }
      this.queue.push(message);
      this.debouncingMessages.push(message);
    }
  };
})();
