import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ToastAndroid } from 'react-native';
import RNFS from 'react-native-fs';
import FileOpener from 'react-native-file-opener';
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
    }

    componentDidMount() {
        this.downloadAndInstall();
    }

    _progressBar(info) {
        this.setState({
            percent: Math.floor((info.bytesWritten / info.contentLength) * 100),
        });
    }

    async _downloadAndInstall() {
        const { dispatch, navigation, latestApkPath } = this.props;
        const { setParams } = navigation;
        const rootUrl = RNFS.ExternalDirectoryPath;         // 获取本地的根目录
        const targetFile = `${rootUrl}/${latestApkPath}`;   // 目标文件
        const targetFileArr = targetFile.split('/');        // 计算目标文件夹
        targetFileArr.pop();
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
            progress: (info) => {
                this.progressBar(info);
            },
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
        } else if (_res.statusCode === 200) {
            // 下载成功：打开apk
            await FileOpener.open(targetFile, 'application/vnd.android.package-archive');
        } else {
            // 下载失败：轻提示
            dispatch({
                type: ACTIONS.LATESTAPP_DOWNLOAD.FAILURE,
                payload: {
                    message: '下载失败，请重试！',
                },
            });
        }
        // 卸载下载面板组件
        setParams({ showDownloadComponent: false });
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
    navigation: PropTypes.object.isRequired,
    latestApkPath: PropTypes.string.isRequired,
};

