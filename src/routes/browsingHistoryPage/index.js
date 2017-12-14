/** created by zhangqi on 2017-11-27 */
import React, { PureComponent } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import ACTIONS from '../../models/actions';

class BrowsingHistory extends PureComponent {
    constructor(props) {
        super(props);
        this.handleInitialData = this._handleInitialData.bind(this);
    }


    componentWillMount() {
        this.handleInitialData();
    }

    _handleInitialData() {
        const { dispatch, userid } = this.props;
        dispatch({
            type: ACTIONS.BROWSING_HISTORY.REQUEST,
            payload: {
                userid,
                date: moment().format('YYYY-MM-DD'),
            },
        });
    }

    render() {
        const { historyList, loading } = this.props;
        return (
            <ScrollView>
                <Text>今日：总共查询到{historyList.length}条数据</Text>
                {
                    historyList.length > 0 && historyList.map(item => (
                        <View
                            key={item.id}
                            style={{
                                paddingVertical: 5,
                                marginHorizontal: 10,
                                borderBottomColor: 'green',
                                borderBottomWidth: 0.5,
                            }}
                        >
                            <Text>工单编号：{item.orderCode}</Text>
                            <Text>工单主题：{item.title}</Text>
                            <Text>浏览时间：{item.time}</Text>
                        </View>
                    ))
                }
            </ScrollView>
        );
    }
}

BrowsingHistory.propTypes = {
    historyList: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    userid: PropTypes.number.isRequired,
    dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    userid: state.user.userInfo.userid,
    ...state.browsingHistory,
});
export default connect(mapStateToProps)(BrowsingHistory);
