import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import RNFS from 'react-native-fs';
import FileOpener from 'react-native-file-opener';
import downloadProgressStyle from './DownloadProgressStyle';
import ACTIONS from '../../models/actions';

const styles = StyleSheet.create(downloadProgressStyle);

export default class DownloadProgress extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            percent: 0,
        };
        this.downloadAndInstall = this._downloadAndInstall.bind(this);
        this.progressBar = this._progressBar.bind(this);
        // this.handleBegin = this._handleBegin(this);
    }
    componentDidMount() {
        // this.handleBegin();
        // this.progressBar();
        this.downloadAndInstall();
    }

    // _handleBegin(info) {
    //     switch (info.statusCode) {
    //         case 200:
    //             this.downloadAndInstall();
    //             break;
    //         default:
    //             break;
    //     }
    // }
    _progressBar(info) {
        this.state = {
            percent: (info.bytesWritten / info.contentLength) * 100,
        };
    }

    _downloadAndInstall() {
        const { dispatch } = this.props;
        // 下载apk
        const rootUrl = RNFS.ExternalDirectoryPath; // 获取本地的根目录
        const targetPath = `${rootUrl}/android-armv7-debug.apk`; // 目标下载路径
        const DownloadFileOptions = {
            fromUrl: 'http://www.ezhr.com.cn:10101/CFSP/download?fileUrl=apk//android-armv7-debug.apk',
            toFile: targetPath,
            discretionary: true,
            progressDivider: 0,
            // begin: (info) => {
            //     this.handleBegin(info);
            // },
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
                    dispatch({
                        type: ACTIONS.LATESTAPP_DOWNLOAD.SUCCESS,
                    });
                }, () => { // 安装失败
                    dispatch({
                        type: ACTIONS.LATESTAPP_DOWNLOAD.FAILURE,
                    });
                });
            } else { // 下载失败
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

