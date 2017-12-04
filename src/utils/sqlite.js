import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SQLiteStorage from 'react-native-sqlite-storage';

SQLiteStorage.enablePromise(false);  // 使用 promise(true) 或者 callback(false)

export default class SQLite extends Component {
    constructor(props) {
        super(props);
        this.successInfo = (name, absolutely) => {
            if (__DEV__) {
                if (absolutely) {
                    console.log(name);
                } else {
                    console.log(`SQLiteStorage ${name} success`);
                }
            }
        };
        this.errorInfo = (name, err, absolutely) => {
            if (__DEV__) {
                if (absolutely) {
                    console.log(name, err);
                } else {
                    console.log(`SQLiteStorage ${name} error `, err);
                }
            }
            throw err;
        };
        this.open = this._open.bind(this);
        this.close = this._close.bind(this);
        this.delete = this._delete.bind(this);
        this.createTable = this._createTable.bind(this);
        this.dropTable = this._dropTable.bind(this);
        this.insertItems = this._insertItems.bind(this);
        this.deleteItem = this._deleteItem.bind(this);
        this.updateItem = this._updateItem.bind(this);
        this.selectItems = this._selectItems.bind(this);
    }

    componentWillUnmount() {
        this.close();
    }

    _open() {
        const { databaseName, databaseVersion, databaseDisplayName, databaseSize } = this.props;
        this.db = SQLiteStorage.openDatabase(
            databaseName,
            databaseVersion,
            databaseDisplayName,
            databaseSize,
            () => {
                this.successInfo('open');
            },
            (err) => {
                this.errorInfo('open', err);
            });
        return this.db;
    }

    _delete() {
        const { databaseName } = this.props;
        SQLiteStorage.deleteDatabase(databaseName);
    }

    _close() {
        if (this.db) {
            this.db.close();
            this.successInfo('close');
        } else {
            this.successInfo('SQLiteStorage not open', true);
        }
        this.db = null;
    }

    _createTable(tableInfo) {
        const { tableName, tableFields } = tableInfo;
        if (!this.db) {
            this.open();
        }
        // sql语句累加
        const sqlStr = tableFields.reduce((sqlSegment, field, index, arr) => (
            `${sqlSegment} ${field.columnName} ${field.dataType} ${index + 1 === arr.length ? ');' : ','}`
        ), `CREATE TABLE IF NOT EXISTS ${tableName}(`);
        // 创建表
        this.db.executeSql(sqlStr, [], (res) => {
            this.successInfo(res, true);
        }, (err) => {
            this.errorInfo('createTable', err);
        });
    }

    _dropTable(tableName) {
        if (!this.db) {
            this.open();
        }
        // 删除表
        this.db.executeSql('DROP TABLE ?', [tableName], (res) => {
            this.successInfo(res, true);
        }, (err) => {
            this.errorInfo('dropTable', err);
        });
    }

    _insertItems(tableName, items) {
        if (!this.db) {
            this.open();
        }
        let sqlStr;
        items.forEach((item) => {
            const columns = Object.keys(item);
            sqlStr = columns.reduce((sqlSegment, columnName, index, arr) => (
                `${sqlSegment} ${columnName} ${index + 1 === arr.length ? ')' : ','}`
            ), `INSERT INTO ${tableName} (`);
            sqlStr += columns.reduce((sqlSegment, columnName, index, arr) => (
                `${sqlSegment} ${item[columnName]} ${index + 1 === arr.length ? ')' : ','}`
            ), ' VALUES (');
            this.db.executeSql(
                sqlStr, [], (res) => {
                    this.successInfo(res, true);
                },
                (err) => {
                    this.errorInfo('insertItems', err);
                },
            );
        });
    }

    _deleteItem(tableName, condition) {
        if (!this.db) {
            this.open();
        }
        let sqlStr;
        if (condition && typeof condition === 'object' && condition !== {}) {
            const conditionKeys = Object.keys(condition);
            sqlStr = conditionKeys.reduce((sqlSegment, conditionKey, index, arr) => (
                `${sqlSegment} ${conditionKey}=${condition[conditionKey]} ${index + 1 !== arr.length && 'and'}`
            ), `DELETE FROM ${tableName} WHERE`);
        } else {
            sqlStr = `DELETE FROM ${tableName}`;
        }
        this.db.executeSql(sqlStr, [], (res) => {
            this.successInfo(res, true);
        }, (err) => {
            this.errorInfo('deleteItem', err);
        });
    }

    _updateItem(tableName, item, condition) {
        if (!this.db) {
            this.open();
        }
        const columns = Object.keys(item);
        let sqlStr;
        sqlStr = columns.reduce((sqlSegment, columnName, index, arr) => (
            `${sqlSegment} ${columnName}=${item[columnName]} ${index + 1 !== arr.length && ','}`
        ), `UPDATE ${tableName} SET`);
        const conditionKeys = Object.keys(condition);
        sqlStr += conditionKeys.reduce((sqlSegment, conditionKey, index, arr) => (
            `${sqlSegment} ${conditionKey}=${condition[conditionKey]} ${index + 1 !== arr.length && 'AND'}`
        ), ' WHERE');
        this.db.executeSql(sqlStr, [], (res) => {
            this.successInfo(res, true);
        }, (err) => {
            this.errorInfo('updateItem', err);
        });
    }

    _selectItems(tableName, columns, condition, pagination, perPageNum) {
        if (this.db) {
            this.open();
        }
        const offset = pagination - perPageNum;
        let sqlStr;
        if (columns === '*') {
            if (condition && condition !== {} && typeof condition === 'object') {
                const conditionKeys = Object.keys(condition);
                sqlStr = conditionKeys.reduce((sqlSegment, conditionKey, index, arr) => (
                    `${sqlSegment} ${conditionKey}=${condition[conditionKey]} ${index + 1 !== arr.length && 'AND'}`
                ), `SELECT * FROM ${tableName} WHERE`);
                sqlStr += ` limit ${pagination} offset ${offset > 0 ? offset : 0}`;
            } else {
                sqlStr = `SELECT * FROM ${tableName} limit ${pagination} offset ${offset > 0 ? offset : 0}`;
            }
        } else {
            sqlStr = columns.reduce((sqlSegment, column, index, arr) => (
                `${sqlSegment} ${column} ${index + 1 !== arr.length && ','}`
            ), 'SELECT');
            if (condition && condition !== {} && typeof condition === 'object') {
                const conditionKeys = Object.keys(condition);
                sqlStr += conditionKeys.reduce((sqlSegment, conditionKey, index, arr) => (
                    `${sqlSegment} ${conditionKey}=${condition[conditionKey]} ${index + 1 !== arr.length && 'AND'}`
                ), ` FROM ${tableName} WHERE`);
                sqlStr += ` limit ${pagination} offset ${offset > 0 ? offset : 0}`;
            } else {
                sqlStr += ` FROM ${tableName} limit ${pagination} offset ${offset > 0 ? offset : 0}`;
            }
        }
        this.db.executeSql(sqlStr, [], (res) => {
            this.successInfo(res, true);
        }, (err) => {
            this.errorInfo('selectItems', err);
        });
    }

    render() {
        return null;
    }
}

SQLite.propTypes = {
    databaseName: PropTypes.string.isRequired,
    databaseVersion: PropTypes.string.isRequired,
    databaseDisplayName: PropTypes.string.isRequired,
    databaseSize: PropTypes.number.isRequired,
};
