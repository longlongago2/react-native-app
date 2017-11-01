import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Alert, ToastAndroid } from 'react-native';
import BottomFuncBtnGroup from '../../components/BottomFuncBtnGroup';
import ACTIONS from '../../models/actions';

const BottomBtnGroup = ({ navigation, dispatch, woDrafts }) => {
    const { workorderList } = woDrafts;

    function handleSelectAll() {
        const { setParams, state } = navigation;
        if (Array.isArray(workorderList) && workorderList.length > 0) {
            if (state.params && state.params.allChecked) {
                setParams({ checkedList: [], allChecked: false });
            } else {
                const checkedList = workorderList.reduce((checkedArr, item) => {
                    checkedArr.push(item.ordercode);
                    return checkedArr;
                }, []);
                setParams({ checkedList, allChecked: true });
            }
        }
    }

    function handleDelete() {
        const { state } = navigation;
        const orderCodes = state.params && state.params.checkedList;
        if (Array.isArray(orderCodes) && orderCodes.length > 0) {
            Alert.alert(
                '询问',
                '是否确定删除？',
                [
                    {
                        text: '取消',
                        style: 'cancel',
                    },
                    {
                        text: '是',
                        onPress: () => {
                            // 删除工单
                            dispatch({
                                type: ACTIONS.WORKORDER.DELETE,
                                payload: {
                                    stateName: 'woDrafts',
                                    stateValue: {
                                        orderCodes: orderCodes.toString(),
                                    },
                                },
                            });
                        },
                    },
                ],
                { cancelable: false },
            );
        } else {
            ToastAndroid.show('没有选中任何项', 3000);
        }
    }

    if (Array.isArray(workorderList) && workorderList.length > 0) {
        return (
            <BottomFuncBtnGroup
                data={[
                    {
                        icon: 'ios-checkmark-circle-outline',
                        text:
                            navigation.state.params &&
                            navigation.state.params.allChecked ?
                                '取消全选' :
                                '全选',
                        onPress: () => handleSelectAll(),
                    },
                    {
                        icon: 'ios-remove-circle-outline',
                        text: '删除',
                        onPress: () => handleDelete(),
                    },
                ]}
            />
        );
    }
    return null;
};
BottomBtnGroup.propTypes = {
    navigation: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    woDrafts: PropTypes.object.isRequired,
};
const mapStateToProps = state => ({
    woDrafts: state.workorder.woDrafts,
});
export default connect(mapStateToProps)(BottomBtnGroup);
