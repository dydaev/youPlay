import { useIndexedDB } from 'react-indexed-db';
import { dbTableNamesType } from '../types/dbTableNames';

const useStorage = {
  getAll: async (nameOfStorage: dbTableNamesType): Promise<any> => {
    const { getAll } = useIndexedDB(nameOfStorage);

    try {
      return await getAll().then((stateFromDb: any[]): any => {
        if (Array.isArray(stateFromDb) && stateFromDb.length) {
          return stateFromDb.reduce(
            (acc: any, stateParam: any): any => ({
              ...acc,
              [stateParam.stateItem]: stateParam.value,
            }),
            {},
          );
        }
      });
    } catch (e) {
      console.warn('Can`t get data from storage:', e);
      return [];
    }
  },
  replaceAll: async (
    nameOfStorage: dbTableNamesType,
    newData: any,
    useForKeys?: string[],
  ): Promise<void> => {
    const { add, clear }: any = useIndexedDB(nameOfStorage);

    await clear().then((): void => {
      const replacingKeys = Array.isArray(useForKeys) ? useForKeys : Object.keys(newData);

      replacingKeys.forEach((key: string): void => {
        add({ stateItem: key, value: newData[key] }).catch((err: any): void =>
          console.log('Cannt replace key ' + key + ' in storage.', err),
        );
      });
    });
  },
};

export default useStorage;
