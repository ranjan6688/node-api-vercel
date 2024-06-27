"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbService = void 0;
const sqlite = __importStar(require("sqlite3"));
const path_1 = __importDefault(require("path"));
class DbService {
    /* Constructor */
    constructor() {
        this.sqlite3 = sqlite.verbose();
        this.tables = ['mediaserver', 'tenant_settings', 'tenant_state_reason_settings', 'user', 'widget'];
        this.createTableIfNotExists = (tableName) => {
            return new Promise((res, rej) => {
                this.isTableExists(tableName).catch(() => {
                    var sqlStatement = this.getCreateStatement(tableName);
                    if (sqlStatement) {
                        this.database.run(sqlStatement, (err) => {
                            if (err)
                                rej(err);
                            else
                                res();
                        });
                    }
                    else
                        rej('Invalid table name');
                });
            });
        };
        this.isTableExists = (tableName) => {
            return new Promise((res, rej) => {
                this.database.get('SELECT name FROM sqlite_master WHERE type=table AND name=?', tableName, (err, row) => {
                    if (err)
                        res(err);
                    else
                        rej(row);
                });
            });
        };
        this.getCreateStatement = (tableName) => {
            if (tableName.toUpperCase() === 'MEDIASERVER')
                return this.dbCommand.MediaServerCreate;
            if (tableName.toUpperCase() === 'TENANT_SETTINGS')
                return this.dbCommand.TenantSettingsCreate;
            if (tableName.toUpperCase() === 'TENANT_STATE_REASON_SETTINGS')
                return this.dbCommand.TenantStateReasonSettingsCreate;
            if (tableName.toUpperCase() === 'USER')
                return this.dbCommand.UserCreate;
            if (tableName.toUpperCase() === 'WIDGET')
                return this.dbCommand.MediaServerCreate;
            else
                return undefined;
        };
        this.dbCommand = {
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
        this.database = new this.sqlite3.Database(path_1.default.join(process.cwd(), 'myapp.db'));
        this.tables.forEach((table) => {
            this.createTableIfNotExists(table);
        });
    }
    /* Fetch */
    fetch(query, queryObj, callback) {
        return this.database.all(query, queryObj, (err, rows) => {
            callback(err, rows);
        });
    }
    /* Add */
    add(query, queryObj, callback) {
        var result = this.database.prepare(query);
        return result.run(queryObj, function (err) {
            callback(err, result);
        });
    }
    /* Update */
    update(query, queryObj, callback) {
        var result = this.database.prepare(query);
        return result.run(queryObj, function (err) {
            callback(err, result);
        });
    }
    /* Delete */
    delete(query, queryObj, callback) {
        var result = this.database.prepare(query);
        return result.run(queryObj, function (err) {
            callback(err, result);
        });
    }
    addUser() {
        return new Promise((resolve) => {
            var query = `INSERT INTO user (UserName,Password,CreatedOn,EditedOn,EntityState,ClientCode) VALUES ($UserName,$Password,$CreatedOn,$EditedOn,$EntityState,$ClientCode)`;
            var queryObj = {
                $UserName: 'user2',
                $Password: 'user2',
                $CreatedOn: Date().toString(),
                $EditedOn: Date().toString(),
                $EntityState: 'Active',
                $ClientCode: 'RADIUS',
            };
            var result = this.database.prepare(query);
            var sss = result.run(queryObj, (row, err) => {
                console.log(row);
                console.log(err);
            });
            resolve(sss);
        });
    }
}
exports.DbService = DbService;
//# sourceMappingURL=dbSvc.js.map