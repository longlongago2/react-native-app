/**
 * 使用 react-definitelyTyped 库需要安装： @types/react
 */

/// <reference types="react" path="@types/react/index.d.ts" name="SQLite" />
import * as React from 'react';

interface Field {
    columnName: string;
    dataType: string;
}

interface Table {
    tableName: string;
    tableFields: Array<Field>;
}

interface SQLiteProps {
    databaseName: string;
    databaseVersion: string;
    databaseDisplayName: string;
    databaseSize: number;
}

export default class SQLite extends React.Component<SQLiteProps, any> {
    constructor(props: SQLiteProps);

    successInfo: (name: string, absolutely?: boolean) => void;
    errorInfo: (name: string, err: object, absolutely?: boolean) => void;
    open: (databaseName: string, databaseVersion: string, databaseDisplayName: string, databaseSize: number) => object;
    close: () => void;
    createTable: (tableInfo: Table) => void;
    dropTable: (tableName: string) => void;
    insertItems: (tableName: string, items: Array<object>) => void;
    deleteItem: (tableName: string, condition?: object) => void;
    updateItem: (tableName: string, item: object, condition: object) => void;
    selectItems: (tableName: string,
                  columns: Array<string> | '*',
                  condition: object | null,
                  pagination: number,
                  perPageNum: number) => void;

    delete(): void;

    render(): JSX.Element | null;
}