import React from 'react';
import PropTypes from 'prop-types';
import { Share, ToastAndroid, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DeviceInfo from 'react-native-device-info';
import { connect } from 'react-redux';
import HeaderPopupMenu from '../../components/HeaderPopupMenu';
import ACTIONS from '../../models/actions';
import theme from '../../theme';
import api from '../../utils/api';

const CreateWOHeaderRight = ({ dispatch, navigation, feedbackImageList, workOrderDetail }) => {
    function modification(code) {
        switch (code) {
            case '1':
                return '当天';
            case '2':
                return '3日内';
            case '3':
                return '一周内';
            case '4':
                return '一周以后';
            default:
                return '';
        }
    }

    function handleShareClick() {
        const { state } = navigation;
        const imageArr = (
            Array.isArray(feedbackImageList) &&
            feedbackImageList.length > 0 &&
            feedbackImageList.map(item => `${api.database}/${item.uri}`)
        ) || [];
        if (
            state.params &&
            state.params.dataFilling &&
            workOrderDetail.title.trim() !== '' &&
            workOrderDetail.wstype.toString().trim() !== '' &&
            workOrderDetail.wskind.toString().trim() !== '' &&
            workOrderDetail.productid.toString().trim() !== ''
        ) {
            // 修改工单界面
            Share.share({
                title: '才丰软件服务平台工单',
                message: `
                工单主题：${workOrderDetail.title}；
                工单类型：${workOrderDetail.wstypename}；
                问题种类：${workOrderDetail.wskindname}；
                所述产品：${workOrderDetail.productname}；
                期望服务时间：${modification(workOrderDetail.servertime)}；
                问题描述：${workOrderDetail.orderbody}；
                图片描述：${imageArr.toString().replace(/,/g, ' ； ')}；`,
            }, {
                dialogTitle: '请选择分享方式',
            }).catch(error => ToastAndroid.show(`错误: ${error.message}`));
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
            // 创建工单界面
            Share.share({
                title: '才丰软件服务平台工单',
                message: `
                工单主题：${state.params.woTitle}；
                工单类型：${state.params.woType.label}；
                问题种类：${state.params.woKind.label}；
                所述产品：${state.params.woProduct.label}；
                期望服务时间：${state.params.woServerTime && state.params.woServerTime.label}；
                问题描述：${state.params.woBody}；
                图片描述：${imageArr.toString().replace(/,/g, ' ； ')}；`,
            }, {
                dialogTitle: '请选择分享方式',
            }).catch(error => ToastAndroid.show(`错误: ${error.message}`));
        } else {
            ToastAndroid.show('请填写完整，带 * 号为必填项', 3000);
        }
    }

    function handleClearClick() {
        const { setParams, state } = navigation;
        if (state.params && state.params.dataFilling) {
            dispatch({
                type: ACTIONS.WORKORDER_DETAIL.UPDATE,
                payload: {
                    workOrderDetail: {
                        title: '',
                        wskind: '',
                        wskindname: '',
                        wstype: '',
                        wstypename: '',
                        productid: '',
                        productname: '',
                        servertime: '',
                        orderbody: '',
                    },
                },
            });
        } else {
            setParams({
                woTitle: '',
                woType: { label: '', value: '' },
                woKind: { label: '', value: '' },
                woProduct: { label: '', value: '' },
                woServerTime: { label: '', value: '' },
                woBody: '',
            });
        }
        ToastAndroid.show('文本内容已重置！', 3000);
    }

    function handleSaveDraftClick() {
        // 存储为草稿
        const { state } = navigation;
        if (
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
            dispatch({
                type: ACTIONS.WORKORDER.INSERT,
                payload: {
                    title: state.params.woTitle,
                    productid: state.params.woProduct.value,
                    wstype: state.params.woType.value,
                    wskind: state.params.woKind.value,
                    servertime: state.params.woServerTime && state.params.woServerTime.value,
                    orderbody: state.params.woBody,
                    wstateclient: '0',                // 是否存储为草稿:('0':草稿，'1'：未处理)
                    device: DeviceInfo.getModel(),    // 设备信息
                    terminal: Platform.OS,            // 终端标识
                    mediaInfo,
                    mediaType,
                },
            });
        } else {
            ToastAndroid.show('请填写完整，带 * 号为必填项', 3000);
        }
    }

    const menuOptions = [
        {
            key: 'clear',
            handler: handleClearClick,
            text: '重置文本',
        },
        {
            key: 'draft',
            handler: handleSaveDraftClick,
            text: '存储草稿',
            disabled: navigation.state.params && navigation.state.params.dataFilling === true,
        },
        {
            key: 'share',
            handler: handleShareClick,
            text: '分享内容',
        },
    ];

    return (
        <HeaderPopupMenu menuOptions={menuOptions} display="popup">
            <Icon name="md-more" size={25} color={theme.header.foregroundColor} />
        </HeaderPopupMenu>
    );
};
CreateWOHeaderRight.propTypes = {
    dispatch: PropTypes.func,
    navigation: PropTypes.object.isRequired,
    feedbackImageList: PropTypes.array.isRequired,
    workOrderDetail: PropTypes.object.isRequired,
};
const mapStateToProps = state => ({
    feedbackImageList: state.feedbackImage.feedbackImageList,
    workOrderDetail: state.workorderDetail.workOrderDetail,
});
export default connect(mapStateToProps)(CreateWOHeaderRight);
