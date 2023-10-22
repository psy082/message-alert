import { Message, type Category } from './Message';
import { MessageQueue } from './MessageQueue';

type QueueWithPriority = {
  priority: number;
  queue: MessageQueue;
};

export class PriorityMessageQueue {
  private pQueue: Map<Category, QueueWithPriority>;

  constructor(queues: { key: Category; value: QueueWithPriority }[] = []) {
    this.pQueue = new Map();

    const usedPriority: number[] = [];
    for (const { key, value } of queues) {
      const { queue, priority } = value;
      if (usedPriority.includes(priority)) {
        throw `Duplicate priority values: ${priority}`;
      }
      this.pQueue.set(key, { queue, priority });
    }
  }

  enqueue(key: Category, value: Message | null) {
    if (value === null) return;
    const { queue } = this.pQueue.get(key) as QueueWithPriority;
    queue.enqueue(value);
  }

  dequeue() {
    let item: Message | undefined;
    for (const { value: queue } of this) {
      if ((item = queue.dequeue())) return item;
    }
    return item;
  }

  *[Symbol.iterator]() {
    const sortedEntries = [...this.pQueue.entries()].sort(
      ([, a], [, b]) => a.priority - b.priority
    );

    for (const [key, value] of sortedEntries) {
      yield { key, value: value.queue };
    }
  }

  toString() {
    let str = '';
    for (const { key, value: queue } of this) {
      str = str + `${key}: ${[...queue].join(', ')}\n`;
    }
    return str;
  }
}
