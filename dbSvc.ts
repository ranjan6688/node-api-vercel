import { Query } from './node_modules/@firebase/firestore-types/index.d';
import * as sqlite from "sqlite3";
import path from 'path';


export class DbService {
    /* Initializing Property Manager | Sqlite3 Db Manager | DbCommand Manager */
    // property: any;
    database: sqlite.Database;
    sqlite3 = sqlite.verbose();
    tables : any = ['mediaserver', 'tenant_settings', 'tenant_state_reason_settings', 'user', 'widget'];

    /* Constructor */
    constructor() {
        this.database = new this.sqlite3.Database(path.join(process.cwd(), 'myapp.db'));
        this.tables.forEach((table: any) => {
            this.createTableIfNotExists(table);
        });
    }

    createTableIfNotExists = (tableName: any) => {
        return new Promise((res: any, rej: any) => {
            this.isTableExists(tableName).catch(() => {
                var sqlStatement = this.getCreateStatement(tableName);
                if(sqlStatement){
                    this.database.run(sqlStatement, (err: any) => {
                        if(err)
                            rej(err);
                        else
                            res();
                    })
                }
                else
                    rej('Invalid table name');
            });
        });
    }

    isTableExists = (tableName: any) => {
        return new Promise((res: any, rej: any) => {
            this.database.get('SELECT name FROM sqlite_master WHERE type=table AND name=?', tableName, (err: any, row: any) => {
                if (err)
                    res(err);
                else
                    rej(row);
            });
        })
    }

    getCreateStatement = (tableName: any) => {
        if(tableName.toUpperCase() === 'MEDIASERVER')
            return this.dbCommand.MediaServerCreate;
        if(tableName.toUpperCase() === 'TENANT_SETTINGS')
            return this.dbCommand.TenantSettingsCreate;
        if(tableName.toUpperCase() === 'TENANT_STATE_REASON_SETTINGS')
            return this.dbCommand.TenantStateReasonSettingsCreate;
        if(tableName.toUpperCase() === 'USER')
            return this.dbCommand.UserCreate;
        if(tableName.toUpperCase() === 'WIDGET')
            return this.dbCommand.MediaServerCreate;
        else
            return undefined;
    }

    /* Fetch */
    fetch(query: any, queryObj: any, callback: any) {
        return this.database.all(query, queryObj, (err: any, rows: any) => {
            callback(err, rows);
        });
    }

    /* Add */
    add(query: any, queryObj: any, callback: any) {
        var result = this.database.prepare(query);
        return result.run(queryObj, function (err: any) {
            callback(err, result);
        });
    }

    /* Update */
    update(query: any, queryObj: any, callback: any) {
        var result = this.database.prepare(query);
        return result.run(queryObj, function (err: any) {
            callback(err, result);
        });
    }

    /* Delete */
    delete(query: any, queryObj: any, callback: any) {
        var result = this.database.prepare(query);
        return result.run(queryObj, function (err: any) {
            callback(err, result);
        });
    }

    addUser() {
        return new Promise((resolve: any) => {

            var query = `INSERT INTO user (UserName,Password,CreatedOn,EditedOn,EntityState,ClientCode) VALUES ($UserName,$Password,$CreatedOn,$EditedOn,$EntityState,$ClientCode)`;

            var queryObj: any = {
                $UserName: 'user2',
                $Password: 'user2',
                $CreatedOn: Date().toString(),
                $EditedOn: Date().toString(),
                $EntityState: 'Active',
                $ClientCode: 'RADIUS',
            };
            var result = this.database.prepare(query);
            result.run(queryObj, (row: any, err: any) => {
                if(err)
                    resolve(err);
                else
                    resolve(result);
            });
        });
    }

    dbCommand: any = {
        UserLogin: "SELECT * FROM user WHERE UserName = ? AND Password = ? AND EntityState = 'Active'",
        UserCreate: `CREATE TABLE "user" (  "Id" INTEGER NOT NULL,  "UserName" TEXT NOT NULL,  "Password" TEXT NOT NULL,  "CreatedOn" TEXT NOT NULL,  "EditedOn" TEXT NOT NULL,  "EntityState" TEXT NOT NULL,  "ClientCode" TEXT NOT NULL,  PRIMARY KEY("Id" AUTOINCREMENT) )`,
        UserFetch: "SELECT * FROM user WHERE EntityState = 'Active'",
        UserAdd: "INSERT INTO user ",
        UserUpdate: "UPDATE user SET EntityState = 'Active'",
        UserDelete: "UPDATE user SET EntityState = 'InActive' WHERE Id = ?",
        MediaServerCreate: `CREATE TABLE "mediaserver" ("Id" INTEGER NOT NULL,"Code" TEXT NOT NULL,"Name" TEXT NOT NULL,"XServerCode" TEXT NOT NULL,"Channel" TEXT NOT NULL,"IP" TEXT NOT NULL,"Port" TEXT NOT NULL,"Description" TEXT,"CreatedOn" TEXT NOT NULL,"EditedOn" TEXT NOT NULL,"EntityState" TEXT NOT NULL,"ClientCode" TEXT NOT NULL,PRIMARY KEY("Id" AUTOINCREMENT))`,
        MediaServerFetch: "SELECT * FROM mediaserver WHERE EntityState = 'Active'",
        MediaServerAdd: "INSERT INTO mediaserver ",
        MediaServerUpdate: "UPDATE mediaserver SET EntityState = 'Active'",
        MediaServerDelete: "UPDATE mediaserver SET EntityState = 'InActive' WHERE Id = ?",
        WidgetCreate: `CREATE TABLE "widget" (  "Id" INTEGER NOT NULL,  "Code" TEXT NOT NULL,  "Name" TEXT NOT NULL,  "SequenceNo" NUMERIC NOT NULL,  "URL" TEXT NOT NULL,  "Size" TEXT NOT NULL,  "Description" TEXT,  "CreatedOn" TEXT NOT NULL,  "EditedOn" TEXT NOT NULL,  "EntityState" TEXT NOT NULL,  "ClientCode" TEXT NOT NULL,  "bytype" TEXT,  PRIMARY KEY("Id" AUTOINCREMENT) )`,
        WidgetFetch: "SELECT * FROM widget WHERE EntityState = 'Active'",
        WidgetAdd: "INSERT INTO widget ",
        WidgetUpdate: "UPDATE widget SET EntityState = 'Active'",
        WidgetDelete: "UPDATE widget SET EntityState = 'InActive' WHERE Id = ?",
        GlobalSettingsFetch: "SELECT * FROM global_settings WHERE EntityState = 'Active'",
        GlobalSettingsUpdate: "UPDATE global_settings SET EntityState = 'Active'",
        TenantSettingsCreate: `CREATE TABLE "tenant_settings" ( "Id" INTEGER NOT NULL, "ClientImgUrl" TEXT, "ClientImgName" INTEGER, "Message" TEXT, "StateReason" TEXT, "AllowManualJoin" TEXT NOT NULL, "AllowAutoJoin" TEXT NOT NULL, "ClientCode" TEXT NOT NULL, "EntityState" TEXT NOT NULL, PRIMARY KEY("Id" AUTOINCREMENT)  )`,
        TenantSettingsFetch: "SELECT * FROM tenant_settings WHERE EntityState = 'Active'",
        TenantSettingsUpdate: "UPDATE tenant_settings SET EntityState = 'Active'",
        TenantStateReasonSettingsCreate: `CREATE TABLE "tenant_state_reason_settings" (  "Id" INTEGER NOT NULL,  "StateReasonImgUrl" INTEGER,  "StateReasonImgName" INTEGER,  "State" TEXT,  "Reason" TEXT,  "ClientCode" TEXT NOT NULL,  "EntityState" TEXT NOT NULL,  "Icon" TEXT,  PRIMARY KEY("Id" AUTOINCREMENT) )`,
        TenantStateReasonSettingsFetch: "SELECT * FROM tenant_state_reason_settings WHERE EntityState = 'Active'",
        TenantStateReasonSettingsAdd: "INSERT INTO tenant_state_reason_settings",
        TenantStateReasonSettingsUpdate: "UPDATE tenant_state_reason_settings SET EntityState = 'Active'",
        TenantStateReasonSettingsDelete: "UPDATE tenant_state_reason_settings SET EntityState = 'InActive' WHERE Id = ?",
    };
}
