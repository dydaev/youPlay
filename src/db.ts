import { listOfPlaylistItemType } from "./types/listOfPlaylistItemType";
import { dbTableNamesType, txType, tablesCreatorType, bdType } from "./types/dbTableNames";

const tablesCreators: tablesCreatorType = {
  playLists: (tx: txType) => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS `playLists` (`id` INTEGER PRIMARY KEY , `name`, `url`);",
    );
  },
  currentPlayList: (tx: txType) => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS `currentPlayList` (`id` INTEGER PRIMARY KEY ,`url`, `image`, `title`, `album`, `artist`, `length`);",
    );
  },
  settings: (tx: txType) => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS `settings` (`id` INTEGER PRIMARY KEY ,`setting`, `value`);",
    );
  },
};

const dataB: bdType = {
  db: null,
  connect: async (): Promise<void> => {
    try {
      // @ts-ignore
      if (window.openDatabase) {
        // @ts-ignore
        dataB.db = await window.openDatabase(dbName, "0.1", "db of you-play player", 2097152);

        Object.values(tablesCreators).forEach(async (tableCreator: any) => {
          await dataB.db.transaction(tableCreator);
        });

        // await dataB.db.transaction((tx: txType) => {
        //   tx.executeSql(
        //     "CREATE TABLE IF NOT EXISTS `" +
        //       tablePlaylistsName +
        //       "` (`id` INTEGER PRIMARY KEY , `name`, `url`);",
        //   );
        // });

        // await dataB.db.transaction((tx: txType) => {
        //   tx.executeSql(
        //     "CREATE TABLE IF NOT EXISTS `" +
        //       tableOfPlaylistName +
        //       "` (`id` INTEGER PRIMARY KEY ,`url`, `image`, `title`, `album`, `artist`, `length`);",
        //   );
        // });
      }
    } catch (e) {
      console.log("Fail of connect to database", e);
      throw new Error("Can`t create database(");
    }
  },
  getData: async (
    tableName: dbTableNamesType,
    callback: (result: any) => Promise<void>,
  ): Promise<void> => {
    if (!tableName) {
      console.log("Table name is not specified!");
      return null;
    }

    try {
      if (!dataB.db) {
        await dataB.connect();
      }
      dataB.db.readTransaction(
        async (tx: txType) => {
          await tx.executeSql("SELECT * FROM " + tableName + ";", [], (tx: txType, result: any) => {
            callback(result);
          });
        },
        (err: string) => {
          console.log("what went wrong reading data from database", err);
          throw new Error("Can`t get data from database(");
        },
      );
    } catch (e) {
      console.log("Fail of geting data from database", e);
      throw new Error("Can`t use database(");
    }

    return null;
  },
  setData: async (tableName: dbTableNamesType, data: { [key: string]: string }): Promise<any> => {
    try {
      if (!dataB.db) {
        await dataB.connect();
      }
      let res;

      if (!tableName) {
        console.log("Table name is not specified!");
        return null;
      }

      if (!Object.keys(data).length) {
        console.log("Not data for seving to database", tableName);
        return null;
      }

      await dataB.db.transaction(
        async (tx: txType) => {
          const keys = Object.keys(data).join(",");

          await tx.executeSql(
            "INSERT INTO " + tableName + " (" + keys + ") values(?, ?)",
            Object.values(data),
            null,
            null,
          );
        },
        (err: string) => {
          console.log("what went wrong reading playlist from database", err);
          throw new Error("Can`t set data from database(");
        },
      );

      return res;
    } catch (e) {
      console.log("Fail of geting playlist from database", e);
      throw new Error("Can`t use database(");
    }

    return null;
  },
  removeData: async (
    tableName: dbTableNamesType,
    selectors: { [key: string]: string },
  ): Promise<void> => {
    try {
      if (!dataB.db) {
        await dataB.connect();
      }

      if (!tableName) {
        console.log("Table name is not specified!");
        return null;
      }

      if (!Object.keys(selectors).length) {
        console.log("Not data for seving to database", tableName);
        return null;
      }

      dataB.db.transaction(
        async (tx: txType) => {
          const selectorFromQuery = Object.keys(selectors).reduce(
            (res: string, keyOfSecector: string, index: number): string =>
              res + index ? "" : " AND" + `${keyOfSecector}='${selectors[keyOfSecector]}'`,
            "",
          );

          tx.executeSql(`DELETE FROM ${tableName} WHERE ${selectorFromQuery};`, [], null, null);
        },
        (err: string) => {
          console.log("what went wrong whith deleting playlist from database", err);
        },
      );
    } catch (e) {
      console.log("Fail of deleting playlist from database", e);
    }
  },
};

export default dataB;
