/** created by zhangqi on 2017-11-29 */
import React, { Component } from 'react';
import {
    ToastAndroid,
} from 'react-native';
import SQLiteStorage from 'react-native-sqlite-storage';

SQLiteStorage.DEBUG(true);
const databaseName = 'test.db';// 数据库文件
const databaseVersion = '1.0';// 版本号
const databaseDisplayName = 'MySQLite';
const databaseSize = -1;// -1应该是表示无限制
let db;

export default class SQLite extends Component {
    constructor(props) {
        super(props);
        this.successCB = (name) => {
            console.log(`SQLiteStorage${name}success`);
        };
        this.errorCB = (name, err) => {
            console.log(`SQLiteStorage${name}`);
            console.log(err);
        };
        this.open = this._open.bind(this);
        this.close = this._close.bind(this);
        this.createTable = this._createTable.bind(this);
        this.deleteData = this._deleteData.bind(this);
        this.dropTable = this._dropTable.bind(this);
        this.insertUserData = this._insertUserData.bind(this);
    }

    componentWillUnmount() {
        if (db) {
            this.successCB('close');
            db.close();
        } else {
            console.log('SQLiteStorage not open');
        }
    }

    _open() {
        db = SQLiteStorage.openDatabase(
            databaseName,
            databaseVersion,
            databaseDisplayName,
            databaseSize,
            () => {
                this.successCB('open');
            },
            (err) => {
                this.errorCB('open', err);
            });
        return db;
    }

    _createTable() {
        if (!db) {
            this.open();
        }
        // 创建表
        db.transaction((tx) => {
            tx.executeSql('CREATE TABLE IF NOT EXISTS USER(' +
                'id INTEGER PRIMARY KEY  AUTOINCREMENT,' +
                'name varchar,' +
                'age VARCHAR,' +
                'sex VARCHAR,' +
                'phone VARCHAR,' +
                'email VARCHAR,' +
                'qq VARCHAR)'
                , [], () => {
                this.successCB('executeSql');
            }, (err) => {
                this.errorCB('executeSql', err);
            });
        }, (err) => {
            this.errorCB('transaction', err);
        }, () => {
            this.successCB('transaction');
        });
    }

    _deleteData() {
        if (!db) {
            this.open();
        }
        db.transaction((tx) => {
            tx.executeSql('delete from user', [], () => {
            });
        });
    }

    _dropTable() {
        db.transaction((tx) => {
            tx.executeSql('drop table user', [], () => {

            });
        }, (err) => {
            this.errorCB('transaction', err);
        }, () => {
            this.successCB('transaction');
        });
    }

    _insertUserData(userData) {
        const len = userData.length;
        if (!db) {
            this.open();
        }
        this.createTable();
        // this.deleteData();
        db.transaction((tx) => {
            for (let i = 0; i < len; i++) {
                const user = userData[i];
                const { name, age, sex, phone, email, qq } = user;
                const sql = 'INSERT INTO user(name,age,sex,phone,email,qq)' +
                    'values(?,?,?,?,?,?)';
                tx.executeSql(sql, [name, age, sex, phone, email, qq], () => {
                }, (err) => {
                    console.log(err);
                },
                );
            }
        }, (error) => {
            this.errorCB('transaction', error);
            ToastAndroid.show('数据插入失败', 3000);
        }, () => {
            this.successCB('transaction insert data');
            ToastAndroid.show(`成功插入${len}条用户数据`, 3000);
        });
    }

    _close() {
        if (db) {
            this.successCB('close');
            db.close();
        } else {
            console.log('SQLiteStorage not open');
        }
        db = null;
    }

    render() {
        return null;
    }
}

