export const DBConfig = {
  name: 'plaYoDB',
  version: 1,
  objectStoresMeta: [
    {
      store: 'playLists', //`name` ,`description` ,`url`
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'name', keypath: 'name', options: { unique: false } },
        { name: 'description', keypath: 'description', options: { unique: false } },
        { name: 'url', keypath: 'url', options: { unique: false } },
      ],
    },
    {
      store: 'currentPlayList', //`url`, `image`, `title`, `album`, `artist`, `length`
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'pathToFile', keypath: 'pathToFile', options: { unique: false } }, //?: string;
        { name: 'readiness', keypath: 'readiness', options: { unique: false } }, //: number;
        { name: 'song', keypath: 'song', options: { unique: false } }, //?: string;
        { name: 'artist', keypath: 'artist', options: { unique: false } }, //?: string;
        { name: 'album', keypath: 'album', options: { unique: false } }, //?: string;
        { name: 'id', keypath: 'id', options: { unique: false } }, //: string;
        { name: 'image', keypath: 'image', options: { unique: false } }, //?: string;
        { name: 'title', keypath: 'title', options: { unique: false } }, //: string;
        { name: 'type', keypath: 'type', options: { unique: false } }, //?: string;
        { name: 'description', keypath: 'description', options: { unique: false } }, //?: string;
        { name: 'length', keypath: 'length', options: { unique: false } }, //?: number;
        { name: 'audioBitrate', keypath: 'audioBitrate', options: { unique: false } }, //?: number;
        { name: 'audioChannels', keypath: 'audioChannels', options: { unique: false } }, //?: number;
        { name: 'audioSampleRate', keypath: 'audioSampleRate', options: { unique: false } }, //?: number;
        { name: 'contentLength', keypath: 'contentLength', options: { unique: false } }, //?: number;
        { name: 'createDate', keypath: 'createDate', options: { unique: false } }, //?: Date;
        { name: 'lastUsedDate', keypath: 'lastUsedDate', options: { unique: false } }, //?: Date;
      ],
    },
    {
      store: 'settings', //`setting`, `value`
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'setting', keypath: 'setting', options: { unique: false } },
        { name: 'value', keypath: 'value', options: { unique: false } },
      ],
    },
    {
      store: 'currentState', //`stateItem`, `value`
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'stateItem', keypath: 'stateItem', options: { unique: true } },
        { name: 'value', keypath: 'value', options: { unique: false } },
      ],
    },
  ],
};
