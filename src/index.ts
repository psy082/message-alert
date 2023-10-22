import { createMessage } from './Message';
import { C1Queue, C2Queue } from './MessageQueue';
import { PriorityMessageQueue } from './PriorityMessageQueue';

let c1audio1, c2audio1, c2audio2, c2audio3;

(async () => {
  c1audio1 = await fetch('some audio link');
  c2audio1 = await fetch('some audio link');
  c2audio2 = await fetch('some audio link');
  c2audio3 = await fetch('some audio link');

  c1audio1 = await c1audio1.blob();
  c2audio1 = await c2audio1.blob();
  c2audio2 = await c2audio2.blob();
  c2audio3 = await c2audio3.blob();
})();

const pq = new PriorityMessageQueue([
  { key: 'C1', value: { priority: 1, queue: new C1Queue() } },
  { key: 'C2', value: { priority: 2, queue: new C2Queue() } },
]);

document.getElementById('c1btn')?.addEventListener('click', () => {
  pq.enqueue(
    'C1',
    createMessage('C1', { files: [{ file: c1audio1, interval: 1000 }] })
  );
});

document.getElementById('c2btn')?.addEventListener('click', () => {
  pq.enqueue(
    'C2',
    createMessage('C2', {
      files: [
        { file: c2audio1, interval: 0 },
        { file: c2audio2, interval: 500 },
        { file: c2audio3, interval: 1000 },
      ],
    })
  );
});
