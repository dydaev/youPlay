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
        { name: 'url', keypath: 'url', options: { unique: false } },
        { name: 'image', keypath: 'image', options: { unique: false } },
        { name: 'title', keypath: 'title', options: { unique: false } },
        { name: 'album', keypath: 'album', options: { unique: false } },
        { name: 'artist', keypath: 'artist', options: { unique: false } },
        { name: 'length', keypath: 'length', options: { unique: false } },
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
