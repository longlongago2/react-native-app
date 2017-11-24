import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import RNFS from 'react-native-fs';
import FileOpener from 'react-native-file-opener';
import PushNotification from 'react-native-push-notification';
import Loading from '../../components/Loading';
import ACTIONS from '../../models/actions';
import api from '../../utils/api';

export default class DownloadProgress extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            percent: 0,  // 下载进度
            jobId: 0,    // 用于取消下载任务
        };
        this.downloadAndInstall = this._downloadAndInstall.bind(this);
        this.progressBar = this._progressBar.bind(this);
        this.downloadFile = downloadConfig => (
            RNFS.downloadFile(downloadConfig).promise
                .then(_res => ({ _res }))
                .catch(_err => ({ _err }))
        );
        this.pushNotification = async pushConfig => PushNotification.localNotification(pushConfig);
    }

    componentDidMount() {
        this.downloadAndInstall();
    }

    _progressBar(info) {
        const { bytesWritten, contentLength } = info;
        const progress = Math.floor((bytesWritten / contentLength) * 100);
        this.setState({ percent: progress });
        this.pushNotification({
            id: '0',
            title: `下载进度：${progress}%`,
            message: '软件正在更新下载，请稍候...',
            autoCancel: true,
            largeIcon: 'ic_logo',
            smallIcon: 'ic_notification',
            color: 'red',
            vibrate: false,
            playSound: false,
            group: 'progress',
            ongoing: true,
        });
    }

    async _downloadAndInstall() {
        const { dispatch, latestApkPath, latestVersion } = this.props;
        const rootUrl = RNFS.ExternalDirectoryPath;         // 获取本地的根目录
        const targetFile = `${rootUrl}/${latestApkPath}`;   // 目标文件
        const targetFileArr = targetFile.split('/');        // 计算目标文件夹
        targetFileArr.pop();                                 // 删除数组最后项
        const targetPath = targetFileArr.join('/');         // 目标文件夹
        const exist = await RNFS.exists(targetPath);        // 判断文件夹路径是否存在
        if (!exist) await RNFS.mkdir(targetPath);           // 不存在就创建
        // 下载apk
        const downloadConfig = {
            fromUrl: `${api.database}/download?fileUrl=${latestApkPath.replace(/\//g, '//')}`,
            toFile: targetFile,
            discretionary: true,
            progressDivider: 0,
            begin: (info) => {
                this.setState({
                    jobId: info.jobId,
                });
            },
            progress: this.progressBar,
        };
        const { _res, _err } = await this.downloadFile(downloadConfig);
        if (_err) {
            // 捕获异常
            dispatch({
                type: ACTIONS.LATESTAPP_DOWNLOAD.FAILURE,
                payload: {
                    message: _err.message,
                },
            });
            return false;
        }
        if (_res) {
            switch (_res.statusCode) {
                case 200:
                    dispatch({ type: ACTIONS.LATESTAPP_DOWNLOAD.SUCCESS });
                    dispatch({ type: 'Navigation/BACK' });
                    await FileOpener.open(targetFile, 'application/vnd.android.package-archive');
                    await this.pushNotification({
                        id: '0',
                        title: '下载进度：100%',
                        message: `新版本：v${latestVersion} 下载完成！`,
                        autoCancel: true,
                        largeIcon: 'ic_logo',
                        smallIcon: 'ic_notification',
                        color: 'green',
                        playSound: true,              // 声音
                        soundName: 'default',         // 声音类型
                        vibrate: true,                // 震动
                        vibration: 300,               // 震动时长 毫秒
                        group: 'progress',
                        ongoing: false,
                    });
                    break;
                default:
                    dispatch({
                        type: ACTIONS.LATESTAPP_DOWNLOAD.FAILURE,
                        payload: {
                            message: '下载失败，请重试！',
                        },
                    });
                    break;
            }
        }
        return true;
    }

    render() {
        const { downloading, text } = this.props;
        const { percent } = this.state;
        return <Loading loading={downloading} text={`${text}：${percent}%`} />;
    }
}

DownloadProgress.propTypes = {
    downloading: PropTypes.bool.isRequired,
    text: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    latestApkPath: PropTypes.string.isRequired,
    latestVersion: PropTypes.string.isRequired,
};

