import React from 'react';
import PropTypes from 'prop-types';
import { Text, ToastAndroid } from 'react-native';
import { connect } from 'react-redux';
import HeaderTool from '../../components/HeaderTool';
import ACTIONS from '../../models/actions/index';
import theme from '../../theme';


const UpdatePasswordHeaderRight = ({ dispatch, navigation }) => {
    function handlePress() {
        const { state } = navigation;
        const { oldPwd, newPwd, confirmNewPwd } = state.params.item;
        if (oldPwd.trim() !== '' && newPwd.trim() !== '' && confirmNewPwd.trim() !== '') {
            const reg = /^[a-zA-Z]\w{5,17}$/;
            const result = reg.test(newPwd.trim());
            if (result) {
                if (newPwd === confirmNewPwd) {
                    dispatch({
                        type: ACTIONS.USER_PASSWORD.UPDATE,
                        payload: {
                            oldpwd: oldPwd,
                            newpwd: newPwd,
                            confirmnewpwd: confirmNewPwd,
                        },
                    });
                } else {
                    ToastAndroid.show('两次密码输入不一致,请重新输入', 3000);
                }
            } else {
                ToastAndroid.show('新密码必须由6-18位的字母、数字、下划线组成', 3000);
            }
        } else {
            ToastAndroid.show('请填写完成信息', 3000);
        }
    }

    return (
        <HeaderTool onPress={handlePress}>
            <Text style={{ color: theme.header.foregroundColor }}>
                保存
            </Text>
        </HeaderTool>
    );
};

UpdatePasswordHeaderRight.propTypes = {
    dispatch: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
};


export default connect()(UpdatePasswordHeaderRight);
