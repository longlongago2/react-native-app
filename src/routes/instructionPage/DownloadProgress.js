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
    }

    componentDidMount() {
        this.downloadAndInstall();
    }

    _progressBar(info) {
        this.setState({
            percent: Math.floor((info.bytesWritten / info.contentLength) * 100),
        });
    }

    _downloadAndInstall() {
        const { dispatch, navigation } = this.props;
        const { setParams } = navigation;
        // 下载apk
        const rootUrl = RNFS.ExternalDirectoryPath;              // 获取本地的根目录
        const targetPath = `${rootUrl}/android-armv7-debug.apk`; // 目标下载路径
        const downloadConfig = {
            fromUrl: `${api.database}/download?fileUrl=apk//android-armv7-debug.apk`,
            toFile: targetPath,
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
        RNFS.downloadFile(downloadConfig).promise
            .then((res) => {
                if (res.statusCode === 200) {
                    // 下载成功
                    dispatch({ type: ACTIONS.LATESTAPP_DOWNLOAD.SUCCESS });
                    // 打开apk
                    FileOpener.open(
                        targetPath,
                        'application/vnd.android.package-archive',
                    ).then(() => {
                        // 成功安装
                        ToastAndroid.show('打开成功', 3000);
                    }, () => {
                        // 安装失败
                        ToastAndroid.show('打开失败', 3000);
                    });
                } else {
                    // 下载失败
                    dispatch({
                        type: ACTIONS.LATESTAPP_DOWNLOAD.FAILURE,
                        payload: {
                            message: '下载失败，请重试！',
                        },
                    });
                }
                // 卸载下载面板组件
                setParams({ showDownloadComponent: false });
            })
            .catch((_err) => {
                dispatch({
                    type: ACTIONS.LATESTAPP_DOWNLOAD.FAILURE,
                    payload: {
                        message: _err.message,
                    },
                });
                // 卸载下载面板组件
                setParams({ showDownloadComponent: false });
            });
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
};

