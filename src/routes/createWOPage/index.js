import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    TextInput,
    ToastAndroid,
    Platform,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import FilletButton from '../../components/FilletButton';
import Loading from '../../components/Loading';
import WoTypeSelect from './WoTypeSelect';
import WoKindSelect from './WoKindSelect';
import WoProductSelect from './WoProductSelect';
import WoServerTimeSelect from './WoServerTimeSelect';
import WoFeedbackImageList from './WoFeedbackImageList';
import styleModule from './indexStyle';
import ACTIONS from '../../models/actions';

const styles = StyleSheet.create(styleModule);

class CreateWOPage extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this._handleSubmit.bind(this);
    }

    componentDidMount() {
        const { dispatch, navigation } = this.props;
        const { state } = navigation;
        // 清空本地回显图片数据
        dispatch({
            type: ACTIONS.FEEDBACK_IMAGE.INITIAL,
            payload: {
                feedbackImageList: [],
            },
        });
        // 加载初始数据
        dispatch({
            type: ACTIONS.WO_TYPE.REQUEST,
        });
        dispatch({
            type: ACTIONS.WO_KIND.REQUEST,
        });
        dispatch({
            type: ACTIONS.WO_PRODUCT.REQUEST,
        });
        if (state.params && state.params.dataFilling) {
            // 数据填充：修改工单
            dispatch({
                type: ACTIONS.WORKORDER_DETAIL.REQUEST,
                payload: {
                    orderCode: state.params.orderCode,
                },
            });
        }
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.timerSubmit);
    }

    _handleSubmit() {
        const { workOrderDetail, userInfo } = this.props;
        this.timerSubmit = requestAnimationFrame(() => {
            const { dispatch, navigation, feedbackImageList } = this.props;
            const { state } = navigation;
            const mediaInfo = (
                Array.isArray(feedbackImageList) &&
                feedbackImageList.length > 0 &&
                feedbackImageList.map(item => item.uri)
            ) || [];
            const mediaType = (
                Array.isArray(feedbackImageList) &&
                feedbackImageList.length > 0 &&
                feedbackImageList.map(item => '0')
            ) || [];
            if (
                state.params &&
                state.params.dataFilling &&
                workOrderDetail.title.trim() !== '' &&
                workOrderDetail.wstype.toString().trim() !== '' &&
                workOrderDetail.wskind.toString().trim() !== '' &&
                workOrderDetail.productid.toString().trim() !== ''
            ) {
                // 修改工单 todo: bug：修改工单没有清除之前的mediaInfo,导致新图片里有修改前的图片重复
                dispatch({
                    type: ACTIONS.WORKORDER.UPDATE,
                    payload: {
                        stateName: state.params.stateName,   // 重新编辑的按钮在多个数据模块中出现，所以需要指定更改哪个数据模块
                        stateValue: {
                            todo: 'update',
                            params: {
                                // 接口接收的参数
                                ordercode: workOrderDetail.ordercode,
                                title: workOrderDetail.title,
                                productid: workOrderDetail.productid,
                                wstype: workOrderDetail.wstype,
                                wskind: workOrderDetail.wskind,
                                servertime: workOrderDetail.servertime,
                                orderbody: workOrderDetail.orderbody,
                                device: DeviceInfo.getModel(),
                                terminal: Platform.OS,
                                mediaInfo,
                                mediaType,
                                repler: userInfo.userid,
                                replyInfo: `工单由 ${userInfo.personname} 重新编辑`,
                                // 非接收参数：目的是为了更改本地state属性
                                productname: workOrderDetail.productname,
                                wstypename: workOrderDetail.wstypename,
                                wskindname: workOrderDetail.wskindname,
                            },
                        },
                    },
                });
            } else if (
                state.params &&
                state.params.woTitle &&
                state.params.woTitle.trim() !== '' &&
                state.params.woType &&
                state.params.woType.label.trim() !== '' &&
                state.params.woKind &&
                state.params.woKind.label.trim() !== '' &&
                state.params.woProduct &&
                state.params.woProduct.label.trim() !== ''
            ) {
                // 创建工单
                dispatch({
                    type: ACTIONS.WORKORDER.INSERT,
                    payload: {
                        title: state.params.woTitle,
                        productid: state.params.woProduct.value,
                        wstype: state.params.woType.value,
                        wskind: state.params.woKind.value,
                        servertime: state.params.woServerTime && state.params.woServerTime.value,
                        orderbody: state.params.woBody,
                        wstateclient: '1',                // 是否存储为草稿:('0':草稿，'1'：未处理)
                        device: DeviceInfo.getModel(),    // 设备信息
                        terminal: Platform.OS,            // 终端标识
                        mediaInfo,
                        mediaType,
                    },
                });
            } else {
                ToastAndroid.show('请填写完整，带 * 号为必填项', 3000);
            }
        });
    }

    render() {
        const {
            woTypeItems,
            woKindItems,
            woProductItems,
            feedbackImageList,
            feedbackImageLoading,
            navigation,
            dispatch,
            loading,
            workOrderDetail,
            dataFillingLoading,
            online,
        } = this.props;
        const { state, setParams } = navigation;
        const woServerTimeSelect = [
            { label: '当天', value: '1' },
            { label: '3日内', value: '2' },
            { label: '1周内', value: '3' },
            { label: '1周以后', value: '4' },
        ];
        return (
            <View>
                <Loading loading={loading} />
                <Loading loading={dataFillingLoading} />
                <ScrollView
                    style={styles.container}
                    keyboardDismissMode="on-drag"
                >
                    <View
                        pointerEvents={online ? 'auto' : 'none'}
                        style={!online && { opacity: 0.5 }}
                    >
                        <View style={styles.contentOption}>
                            <View style={styles.contentLabel}>
                                <Text>工单主题<Text style={{ color: 'red' }}>
                                    *</Text></Text>
                            </View>
                            <View style={styles.contentInput}>
                                <TextInput
                                    underlineColorAndroid="transparent"
                                    placeholder="填写主题"
                                    placeholderTextColor="#cccccc"
                                    value={
                                        (state.params && state.params.dataFilling) ?
                                            workOrderDetail.title :
                                            (state.params && state.params.woTitle)
                                    }
                                    onChangeText={(text) => {
                                        if (state.params && state.params.dataFilling) {
                                            dispatch({
                                                type: ACTIONS.WORKORDER_DETAIL.UPDATE,
                                                payload: {
                                                    workOrderDetail: {
                                                        title: text,
                                                    },
                                                },
                                            });
                                        } else {
                                            setParams({ woTitle: text });
                                        }
                                    }}
                                />
                            </View>
                        </View>
                        <WoTypeSelect
                            woTypeItems={woTypeItems}
                            navigation={navigation}
                            workOrderDetail={workOrderDetail}
                            dispatch={dispatch}
                        />
                        <WoKindSelect
                            woKindItems={woKindItems}
                            navigation={navigation}
                            workOrderDetail={workOrderDetail}
                            dispatch={dispatch}
                        />
                        <WoProductSelect
                            woProductItems={woProductItems}
                            navigation={navigation}
                            workOrderDetail={workOrderDetail}
                            dispatch={dispatch}
                        />
                        <WoServerTimeSelect
                            woServerTimeItems={woServerTimeSelect}
                            navigation={navigation}
                            workOrderDetail={workOrderDetail}
                            dispatch={dispatch}
                        />
                        <View style={styles.contentOptionBig}>
                            <View style={styles.contentOptionBigLabel}>
                                <Text>上传图片</Text>
                            </View>
                            <View style={styles.contentOptionBigInput}>
                                <WoFeedbackImageList
                                    woImageList={feedbackImageList}
                                    dispatch={dispatch}
                                    loading={feedbackImageLoading}
                                    navigation={navigation}
                                />
                            </View>
                        </View>
                        <View style={styles.contentOption}>
                            <View style={styles.contentLabel}>
                                <Text>文字描述</Text>
                            </View>
                            <View style={styles.contentInput}>
                                <TextInput
                                    placeholder="文字描述"
                                    placeholderTextColor="#cccccc"
                                    underlineColorAndroid="transparent"
                                    value={
                                        (state.params && state.params.dataFilling) ?
                                            workOrderDetail.orderbody :
                                            (state.params && state.params.woBody)
                                    }
                                    onChangeText={(text) => {
                                        if (state.params && state.params.dataFilling) {
                                            dispatch({
                                                type: ACTIONS.WORKORDER_DETAIL.UPDATE,
                                                payload: {
                                                    workOrderDetail: {
                                                        orderbody: text,
                                                    },
                                                },
                                            });
                                        } else {
                                            setParams({ woBody: text });
                                        }
                                    }}
                                />
                            </View>
                        </View>
                        <View style={styles.contentOption}>
                            <View style={styles.contentLabel}>
                                <Text>设备信息</Text>
                            </View>
                            <View style={styles.contentInput}>
                                <Text>{DeviceInfo.getModel()}</Text>
                            </View>
                        </View>
                        <View
                            style={{
                                paddingVertical: 15,
                                paddingHorizontal: 20,
                            }}
                        >
                            <FilletButton
                                title="提交"
                                onPress={this.handleSubmit}
                            />
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

CreateWOPage.propTypes = {
    dispatch: PropTypes.func.isRequired,
    woKindItems: PropTypes.array.isRequired,
    woTypeItems: PropTypes.array.isRequired,
    woProductItems: PropTypes.array.isRequired,
    feedbackImageList: PropTypes.array.isRequired,
    feedbackImageLoading: PropTypes.bool.isRequired,
    workOrderDetail: PropTypes.object.isRequired,
    dataFillingLoading: PropTypes.bool.isRequired,
    navigation: PropTypes.object.isRequired,
    userInfo: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    online: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
    ...state.itemCode,
    feedbackImageList: state.feedbackImage.feedbackImageList,
    feedbackImageLoading: state.feedbackImage.loading,
    workOrderDetail: state.workorderDetail.workOrderDetail,
    dataFillingLoading: state.workorderDetail.loading,
    userInfo: state.user.userInfo,
    loading: state.workorder.loading,
    online: state.user.online,
});

export default connect(mapStateToProps)(CreateWOPage);
