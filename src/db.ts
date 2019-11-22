import { listOfPlaylistItemType } from "./types/listOfPlaylistItemType";
import { dbTableNamesType, txType, tablesCreatorType, bdType } from "./types/dbTableNames";

const dbName = "youPlayDB";

const tablesCreators: tablesCreatorType = {
  playLists: (tx: txType) => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS `playLists` (`id` INTEGER PRIMARY KEY ,`name` ,`description` ,`url`);",
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
      }
    } catch (e) {
      console.log("Fail of connect to database", e);
      throw new Error("Can`t create database(");
    }
  },
  // @ts-ignore
  getData: async (
    tableName: dbTableNamesType,
    callback: (result: any) => Promise<any>,
  ): Promise<any> => {
    if (!tableName) {
      console.log("Table name is not specified!");
      return null;
    }

    try {
      if (!dataB.db) {
        await dataB.connect();
      }
      return dataB.db.readTransaction(
        async (tx: txType) => {
          await tx.executeSql(
            "SELECT * FROM " + tableName + ";",
            [],
            (tx: txType, result: any): Promise<any> => {
              callback(result);
              return result;
            },
          );
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
  updateData: async (
    tableName: dbTableNamesType,
    selectors: { [key: string]: any },
    data: { [key: string]: any },
  ): Promise<any> => {
    try {
      if (!dataB.db) {
        await dataB.connect();
      }
      let res;

      if (!tableName) {
        console.log("Table name for updating is not specified!");
        return null;
      }

      if (!Object.keys(data).length) {
        console.log("Not data for updating in database", tableName);
        return null;
      }

      if (!Object.keys(selectors).length) {
        console.log("Not selector for selecting rows for updating", tableName);
        return null;
      }

      await dataB.db.transaction(
        async (tx: txType) => {
          const keys = Object.keys(data).join(",");

          const selectorFromQuery = Object.keys(selectors).reduce(
            (res: string, keyOfSecector: string, index: number): string =>
              res + (!index ? "`" : " AND `") + keyOfSecector + "`=?",
            "",
          );

          const query: string =
            "UPDATE " +
            tableName +
            " SET " +
            Object.keys(data)
              .map((key: string) => key + "=?")
              .join(", ") +
            " WHERE " +
            selectorFromQuery;

          const params: any[] = Object.values(data).concat(Object.values(selectors));

          // console.log(query, params);

          await tx.executeSql(query, params);
        },
        (err: string) => {
          console.log("what went wrong reading playlist to database " + tableName, err);
          throw new Error("Can`t set data to database " + tableName + " because: " + err);
        },
      );

      return res;
    } catch (e) {
      console.log("Fail of geting playlist from database", e);
      throw new Error("Can`t use database(");
    }

    return null;
  },
  setData: async (tableName: dbTableNamesType, data: { [key: string]: any }): Promise<any> => {
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
            "INSERT INTO " +
              tableName +
              " (" +
              keys +
              ") values(" +
              Object.keys(data)
                .map((_: any) => "?")
                .join(" ,") +
              ")",
            Object.values(data),
            null,
            null,
          );
        },
        (err: string) => {
          console.log("what went wrong reading playlist to database " + tableName, err);
          throw new Error("Can`t set data to database " + tableName + " because: " + err);
        },
      );

      return res;
    } catch (e) {
      console.log("Fail of geting playlist from database", e);
      throw new Error("Can`t use database(");
    }

    return null;
  },
  removeTable: async (tableName: dbTableNamesType): Promise<void> => {
    if (!dataB.db) {
      await dataB.connect();
    }
    if (!tableName) {
      console.log("Table name is not specified!");
      return null;
    }

    dataB.db.transaction(async (tx: txType) => {
      tx.executeSql("DROP TABLE " + tableName, [], null, function(tx: txType, error: any) {
        console.log("Could not delete", error);
      });
    });
  },
  removeData: async (
    tableName: dbTableNamesType,
    selectors: { [key: string]: any },
  ): Promise<void> => {
    try {
      if (!dataB.db) {
        await dataB.connect();
      }

      if (!tableName) {
        console.log("Table name is not specified!");
        return null;
      }

      // if (!Object.keys(selectors).length) {
      //   console.log("Not data for seving to database", tableName);
      //   return null;
      // }

      dataB.db.transaction(
        async (tx: txType) => {
          let query: string = `DELETE FROM ${tableName}`;

          if (Object.keys(selectors).length) {
            const selectorFromQuery = Object.keys(selectors).reduce(
              (res: string, keyOfSecector: string, index: number): string =>
                res + (!index ? "`" : " AND `") + keyOfSecector + "`=?",
              "",
            );

            query = query + ` WHERE ${selectorFromQuery}`;
          }

          tx.executeSql(query, Object.values(selectors), null, null);
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
