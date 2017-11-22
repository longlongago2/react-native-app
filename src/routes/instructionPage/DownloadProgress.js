import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, ActivityIndicator, Text, ToastAndroid } from 'react-native';
import RNFS from 'react-native-fs';
import FileOpener from 'react-native-file-opener';
import downloadProgressStyle from './DownloadProgressStyle';
import ACTIONS from '../../models/actions';
import api from '../../utils/api';

const styles = StyleSheet.create(downloadProgressStyle);

export default class DownloadProgress extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            percent: 0,
            jobId: 0,
        };
        this.downloadAndInstall = this._downloadAndInstall.bind(this);
        this.progressBar = this._progressBar.bind(this);
        this.cancelDownload = this._cancelDownload.bind(this);
    }

    componentDidMount() {
        this.downloadAndInstall();
    }

    _progressBar(info) {
        this.setState({
            percent: Math.floor((info.bytesWritten / info.contentLength) * 100),
        });
    }

    _cancelDownload() {
        const { dispatch } = this.props;
        RNFS.stopDownload(this.state.jobId);
        dispatch({
            type: ACTIONS.LATESTAPP_DOWNLOAD.FAILURE,
        });
    }

    _downloadAndInstall() {
        const { dispatch } = this.props;
        // 下载apk
        const rootUrl = RNFS.ExternalDirectoryPath; // 获取本地的根目录
        const targetPath = `${rootUrl}/android-armv7-debug.apk`; // 目标下载路径
        const DownloadFileOptions = {
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
        const ret = RNFS.downloadFile(DownloadFileOptions);
        ret.promise.then((res) => {
            if (res.statusCode === 200) { // 下载成功
                FileOpener.open( // 打开apk
                    targetPath,
                    'application/vnd.android.package-archive',
                ).then(() => { // 成功安装
                    this.setState({ percent: 0 });
                    dispatch({
                        type: ACTIONS.LATESTAPP_DOWNLOAD.SUCCESS,
                    });
                }, () => { // 安装失败
                    ToastAndroid.show('安装失败,请重试', 3000);
                    dispatch({
                        type: ACTIONS.LATESTAPP_DOWNLOAD.FAILURE,
                    });
                });
            } else { // 下载失败
                ToastAndroid.show('下载失败,请重试', 3000);
                dispatch({
                    type: ACTIONS.LATESTAPP_DOWNLOAD.FAILURE,
                });
            }
        }).catch((_err) => { // 捕获异常
            dispatch({
                type: ACTIONS.LATESTAPP_DOWNLOAD.FAILURE,
            });
        });
    }

    render() {
        const { loading, text } = this.props;
        return (
            <View style={[styles.mask, loading ? null : { display: 'none' }]}>
                <ActivityIndicator color="rgb(255,255,255)" animating size="large" />
                {
                    text &&
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    >
                        <Text
                            style={{
                                color: '#ffffff',
                                textAlign: 'center',
                                lineHeight: 30,
                                fontSize: 13,
                            }}
                        >
                            {text}:{this.state.percent}%
                        </Text>
                        <Text
                            style={{ color: '#2196F3', textDecorationLine: 'underline', zIndex: 99999 }}
                            onPress={this.cancelDownload}
                        >
                            取消下载
                        </Text>
                    </View>
                }
            </View>
        );
    }
}

DownloadProgress.propTypes = {
    loading: PropTypes.bool.isRequired,
    text: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
};

