/** created by zhangqi 2017-12-14 */
import React from 'react';
import PropTypes from 'prop-types';
import { DatePickerAndroid } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Feather';
import HeaderTool from '../../components/HeaderTool';
import ACTIONS from '../../models/actions/index';
import theme from '../../theme';

const BrowsingHistoryHeaderRight = ({ dispatch, userid }) => {
    async function handlePress() {
        let finishTime = '';
        const { action, year, month, day } = await
            DatePickerAndroid.open({
                // 要设置默认值为今天的话，使用`new Date()`即可。
                date: new Date(),
            });
        if (action !== DatePickerAndroid.dismissedAction) {
            finishTime = `${year}-${month + 1}-${day}`;
            dispatch({
                type: ACTIONS.BROWSING_HISTORY.REQUEST,
                payload: {
                    userid,
                    date: finishTime,
                },
            });
        }
    }
    return (
        <HeaderTool onPress={handlePress}>
            <Icon
                size={20}
                name="calendar"
                color={theme.header.foregroundColor}
            />
        </HeaderTool>
    );
};

BrowsingHistoryHeaderRight.propTypes = {
    dispatch: PropTypes.func.isRequired,
    userid: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
    userid: state.user.userInfo.userid,
});

export default connect(mapStateToProps)(BrowsingHistoryHeaderRight);
