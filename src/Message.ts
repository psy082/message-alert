export type Category = 'C1' | 'C2';

export type File = {
  file: Blob;
  interval: number;
};

type BaseContents<Others = {}> = {
  files: File[];
} & Others;

type C1Contents = BaseContents;

type C2Contents = BaseContents<{
  type: C2MESSAGE_TYPE;
}>;

export type Contents = C1Contents | C2Contents;

export const createMessage = (category: Category, contents: Contents) => {
  const { files } = contents;
  if (category === 'C1') {
    return new C1Message(files);
  } else if (category === 'C2') {
    const { type } = contents as C2Contents;
    return new C2Message(files, type);
  }
  return null;
};

export abstract class Message {
  private _timeStamp: number;

  constructor(private _files: File[]) {
    this._timeStamp = Date.now();
  }

  get timeStamp(): number {
    return this._timeStamp;
  }

  get files(): File[] {
    return this._files;
  }

  abstract equals(other: Message): boolean;
}

export class C1Message extends Message {
  constructor(files: File[]) {
    super(files);
  }

  equals(other: C1Message): boolean {
    return this === other;
  }
}

export class C2Message extends Message {
  public static C2_TYPE = Object.freeze({
    TYPE1: 'TYPE1',
    TYPE2: 'TYPE2',
  });
  private _type: C2MESSAGE_TYPE;

  constructor(files: File[], type: C2MESSAGE_TYPE) {
    super(files);
    this._type = type;
  }

  get type(): C2MESSAGE_TYPE {
    return this._type;
  }

  equals(other: C2Message): boolean {
    return this._type === other.type;
  }
}

type C2MESSAGE_TYPE = keyof typeof C2Message.C2_TYPE;
