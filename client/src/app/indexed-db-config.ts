import { DBConfig } from 'ngx-indexed-db';

export const dbLocalConfig: DBConfig = {
  name: 'EnglishAiDb',
  version: 1,
  objectStoresMeta: [
    {
      store: 'words',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'text', keypath: 'text', options: { unique: false } },
        { name: 'translations', keypath: 'translations', options: { unique: false } },
        { name: 'owner', keypath: 'owner', options: { unique: false } },
        { name: 'language', keypath: 'language', options: { unique: false } },
      ],
    },
  ],
};
