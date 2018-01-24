/**
 * 初始化数据库：判断是否启动状态（全新安装，更新安装）
 */
import filesystem from 'react-native-fs';
import LaunchMode from '../../utils/LaunchMode';
import { createChatListTable } from './chatList';
import { createMessagesTable } from './messages';
import { createTypeTable, initialTypeTableData, clearTypeTableData } from './type';
import { createBrowsingHistoryTable } from './browsingHistory';

function* initialAction() {
    yield createBrowsingHistoryTable();
    yield createMessagesTable();
    yield createChatListTable();
    yield createTypeTable();
    yield initialTypeTableData();
}

function* upgradeAction() {
    yield clearTypeTableData();
    yield initialTypeTableData();
}

export default function* (databaseName) {
    // 判断db是否存在
    const arr = filesystem.DocumentDirectoryPath.split('/');
    arr.pop();
    arr.push('databases', `${databaseName}.db`);
    const dbPath = arr.join('/');
    const dbExistStatus = yield filesystem.exists(dbPath).then(res => res);
    // 启动状态标记
    const launchMode = new LaunchMode();
    yield launchMode.markOpenApp();
    const mode = launchMode.getLaunchMode();
    switch (mode) {
        case LaunchMode.MODE_NEWEST:
            yield initialAction();
            break;
        case LaunchMode.MODE_UPDATE:
            if (!dbExistStatus) {
                yield initialAction();
            } else {
                yield upgradeAction();
            }
            break;
        case LaunchMode.MODE_USEDTO:
            if (!dbExistStatus) yield initialAction();
            break;
        default:
    }
}
