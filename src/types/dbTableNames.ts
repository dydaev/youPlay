export type dbTableNamesType = 'playLists' | 'settings' | 'currentPlayList' | 'currentState';

type txType = {
  executeSql(
    query: string,
    params?: any[],
    callback?: (tx: txType, result: any) => Promise<any>,
    other?: any,
  ): Promise<void>;
};

type tablesCreatorType = {
  playLists(executor: txType): void;
  settings(executor: txType): void;
  currentPlayList(executor: txType): void;
  currentState(executor: txType): void;
};

type bdType = {
  db: any;
  connect(): void;
  getData(tableName: dbTableNamesType, callback: (result: any) => void): Promise<void>;
  setData(tableName: dbTableNamesType, data: { [key: string]: any }): Promise<any>;
  updateData(
    tableName: dbTableNamesType,
    selectors: { [key: string]: any },
    data: { [key: string]: any },
  ): Promise<any>;
  removeData(tableName: dbTableNamesType, selectors: { [key: string]: any }): Promise<void>;
  removeTable(tableName: dbTableNamesType): Promise<void>;
};

export { txType, tablesCreatorType, bdType };
