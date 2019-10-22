import { listOfPlaylistItemType } from './types/listOfPlaylistItemType';

const dbName = 'youPlayDB';
const tableName = 'playLists';

export type bdType = {
  connect(): void,
  db: any,
  getPlaylists(setFunc:(list: any)=> void):  Promise<void>,
  setPlaylist( playList: listOfPlaylistItemType): Promise<any>,
  removePlaylist(playList: listOfPlaylistItemType): Promise<void>
}

const dataB: bdType = {
  db: null,
  connect: async (): Promise<void> => {
    try {
      // @ts-ignore
      if(window.openDatabase){
        // @ts-ignore
        dataB.db = await window.openDatabase(dbName,"0.1","db of you-play player", 2097152);

        await dataB.db.transaction((tx: any) => {
          tx.executeSql('CREATE TABLE IF NOT EXISTS `'
          + tableName
          + '` (`id` INTEGER PRIMARY KEY , `name`, `url`);');
        });
      }

    } catch (e) {
      console.log( 'Fail of connect to database', e)
    }
  },
  getPlaylists: async (setFunc): Promise<void> => {
    try {
      if (!dataB.db) {
        await dataB.connect();
      }
      dataB.db.readTransaction(async (tx: any) => {
        await tx.executeSql('SELECT * FROM ' + tableName + ';',[], (tx: any, result: any) => {
          setFunc(result)
        } );
      }, (err: string) => {
        console.log('what went wrong reading playlist from database', err)
      });

    } catch (e) {
      console.log( 'Fail of geting playlist from database', e)
      // throw new Error('')
    }

    return null;
  },
  setPlaylist: async ( playList: listOfPlaylistItemType): Promise<any> => {
    try {
      if (!dataB.db) {
        await dataB.connect();
      }
      let res;

      await dataB.db.transaction(async (tx : any) => {
        await tx.executeSql(
          "INSERT INTO "
            + tableName
            + " (url, name) values(?, ?)",
          [
            playList.url,
            playList.name
          ],
          null,
          null
        );
      }, (err: string) => {
        console.log('what went wrong reading playlist from database', err)
      });

      return res;
    } catch (e) {
      console.log( 'Fail of geting playlist from database', e)
    }

    return null;
  },
  removePlaylist : async (playList: listOfPlaylistItemType): Promise<void> => {
    try {
      if (!dataB.db) {
        await dataB.connect();
      }

      dataB.db.transaction(async (tx : any) => {
         tx.executeSql(
          `DELETE FROM ${tableName} WHERE url='${playList.url}' AND name='${playList.name}';`,
          [],
          null,
          null
        );
      }, (err: string) => {
        console.log('what went wrong whith deleting playlist from database', err)
      });
    } catch (e) {
      console.log( 'Fail of deleting playlist from database', e)
    }
  }
}

export default dataB;
