/** created by zhangqi on 2017-11-27 */
import React, { PureComponent } from 'react';
import {
    View,
    Text,
} from 'react-native';
import SQLite from '../../utils/sqlite';

let db;
const sqLite = new SQLite();

class RecentBrowse extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            userArray: [],
        };
    }

    componentWillMount() {
        // 开启数据库
        if (!db) {
            db = sqLite.open();
        }
        // 建表
        // sqLite.createTable({
        //     tableName: 'people',
        //     tableFields: [
        //         {
        //             columnName: 'name',
        //             dataType: 'varchar',
        //         }, {
        //             columnName: 'age',
        //             dataType: 'varchar',
        //         },
        //     ],
        // });
        // 模拟插入数据
        const userData = [];
        const user = {
            name: '张广龙',
            age: '26',
            sex: '男',
            phone: '17705158337',
            email: '794382866@qq.com',
            qq: '794382866',
        };
        userData.push(user);
        // 插入数据
        sqLite.insertData(userData);
        // 查询
        db.transaction((tx) => {
            tx.executeSql('select * from user', [], (_tx, results) => {
                const len = results.rows.length;
                const _newUserArray = [];
                for (let i = 0; i < len; i++) {
                    const u = results.rows.item(i);
                    _newUserArray.push(u);
                }
                this.setState({
                    userArray: _newUserArray,
                });
            });
        }, (error) => { // 打印异常信息
            console.log(error);
        });
    }

    render() {
        const { userArray } = this.state;
        return (
            <View>
                {
                    userArray.length > 0 && userArray.map((item, i) => (
                        <View key={item.id}>
                            <Text>{item.name}</Text>
                            <Text>{item.age}</Text>
                            <Text>{item.sex}</Text>
                        </View>
                    ))
                }
            </View>
        );
    }
}


export default RecentBrowse;

