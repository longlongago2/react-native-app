import { AsyncStorage } from 'react-native';
import Storage from 'react-native-storage';

export function initialStorage() {
    if (!global.storage) {
        global.storage = new Storage({
            size: 2000,
            storageBackend: AsyncStorage,
            defaultExpires: 1000 * 3600 * 24,
            enableCache: true,
        });
    }
}

export function getAllDataForKey(storageKey) {
    initialStorage();
    return global.storage.getAllDataForKey(storageKey)
        .then(data => ({ data }))
        .catch(err => ({ err }));
}

export function getStorageByKeyAndId(key, id) {
    initialStorage();
    return global.storage.load({ key, id })
        .then(data => ({ data }))
        .catch(err => ({ err }));
}

export function getStorageByKey(key) {
    initialStorage();
    return global.storage.load({ key })
        .then(data => ({ data }))
        .catch(error => ({ error }));
}

export function* getChatListStorageKey() {
    initialStorage();
    const { data, error } = yield getStorageByKey('currentUser');
    if (error) {
        return { error };
    }
    const storageKey = `chatList${data.username}`;
    return { storageKey };
}

/**
 * 根据key和id插入本地数组元素（如果根据key和id查不到本地数组，就新建数组并添加此 参数：数组元素）
 * @param key
 * @param id
 * @param newArrItem 新的数组元素
 * @return {{data: *}}
 */
export function* insertArrayItemWithKeyAndId(key, id, newArrItem) {
    initialStorage();
    // 验证 key 和 id 的合法性（key 和 id 不可以使用下划线_）
    if (typeof key !== 'undefined' && key.indexOf('_') < 0 && typeof id !== 'undefined' && id.indexOf('_') < 0) {
        const { data } = yield getStorageByKeyAndId(key, id);
        let newData;                // 将要存储新数据
        const newArray = [];        // 新接收的元素组成的数组，方便concat
        if (newArrItem) newArray.push(newArrItem);
        if (data) {
            newData = data.concat(newArray);
        } else {
            newData = newArray;
        }
        yield global.storage.save({
            key,
            id,
            data: newData,
            expires: null,
        });
        return { data: newData };
    }
    return { err: new Error('key 和 id 不符合要求') };
}
