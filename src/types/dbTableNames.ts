type dbTableNamesType = "playLists" | "settings" | "currentPlayList";

type txType = {
	executeSql(query: string): Promise<void>;
};

type tablesCreatorType = {
	playLists(executor: txType): void;
	settings(executor: txType): void;
	currentPlayList(executor: txType): void;
};

type bdType = {
	connect(): void;
	db: any;
	getData(tableName: dbTableNamesType, callback: (result: any) => Promise<void>): Promise<void>;
	setData(tableName: dbTableNamesType, data: { [key: string]: string }): Promise<any>;
	removeData(tableName: dbTableNamesType, selectors: { [key: string]: string }): Promise<void>;
};

export { txType, dbTableNamesType, tablesCreatorType, bdType };
