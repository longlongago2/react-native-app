import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'react-native';
import ACTIONS from '../../models/actions';
import SectionLineItemWithIcon from '../../components/SectionLineItemWithIcon';

const SettingListOption = ({ item, dispatch }) => {
    // 退出登录
    function logout() {
        dispatch({ type: ACTIONS.USER_LOGOUT.REQUEST });
    }

    // 清除缓存
    function clearAllStorage() {
        // storage.clearMap():clear map and remove all key-id data (but keep the key-only data)
        Alert.alert(
            '询问',
            '本次操作会清除所有本地数据，请慎重选择，确定吗？',
            [
                { text: '取消', onPress: () => console.log('Cancel') },
                { text: '是', onPress: () => global.storage.clearMap() },
            ],
            { cancelable: false },
        );
    }

    // 修改密码
    function updatePassword(object) {
        const obj = {
            oldPwd: '',
            newPwd: '',
            confirmNewPwd: '',
        };
        dispatch({
            type: 'Navigation/NAVIGATE',
            routeName: object,
            params: {
                item: obj,
            },
        });
    }


    function handItemPress(value) {
        const { routeName, params } = value.redirect;
        if (routeName === 'clearAllStorage') {
            clearAllStorage();
        } else if (routeName === 'logout') {
            logout();
        } else if (routeName === 'UpdatePassword') {
            updatePassword(routeName);
        } else {
            dispatch({
                type: 'Navigation/NAVIGATE',
                routeName,
                params,
            });
        }
    }

    return (
        <SectionLineItemWithIcon item={item} onItemPress={value => handItemPress(value)} />
    );
};
SettingListOption.propTypes = {
    item: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
};
export default SettingListOption;
