import { AsyncStorage } from 'react-native';
import DeviceInfo from 'react-native-device-info';

export default class LaunchMode {
    constructor() {
        this.launchMode = LaunchMode.MODE_USEDTO;
        this.isOpenMarked = false;
        this.markOpenApp = this._markOpenApp.bind(this);
        this.getLaunchMode = this._getLaunchMode.bind(this);
        this.isFirstOpen = this._isFirstOpen.bind(this);
    }

    async _markOpenApp() {
        if (this.isOpenMarked) return;              // 防止重复标记
        this.isOpenMarked = true;
        const lastVersion = await AsyncStorage.getItem('lastVersion').then(res => res).catch(() => null);
        const thisVersion = DeviceInfo.getVersion();
        if (lastVersion === null) {                 // 全新安装首次启动
            this.launchMode = LaunchMode.MODE_NEWEST;
            await AsyncStorage.setItem('lastVersion', thisVersion);
        } else if (thisVersion !== lastVersion) {   // 更新安装首次启动
            this.launchMode = LaunchMode.MODE_UPDATE;
            await AsyncStorage.setItem('lastVersion', thisVersion);
        } else {                                    // 同一版本已启动过
            this.launchMode = LaunchMode.MODE_USEDTO;
        }
    }

    _getLaunchMode() {
        return this.launchMode;
    }

    _isFirstOpen() {
        return this.launchMode !== LaunchMode.MODE_USEDTO;
    }
}
LaunchMode.MODE_NEWEST = 1;   // 静态属性：全新安装状态
LaunchMode.MODE_UPDATE = 2;   // 静态属性：更新安装状态
LaunchMode.MODE_USEDTO = 3;   // 静态属性：以前安装状态
