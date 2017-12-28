/** created by zhangqi on 2017-11-27 */
import React, { PureComponent } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';
import ACTIONS from '../../models/actions';
import theme from '../../theme';

class BrowsingHistory extends PureComponent {
    constructor(props) {
        super(props);
        this.handleInitialData = this._handleInitialData.bind(this);
        this.handlePress = this._handlePress.bind(this);
    }

    componentWillMount() {
        this.handleInitialData();
    }

    _handlePress(item) {
        const { dispatch } = this.props;
        dispatch({
            type: 'Navigation/NAVIGATE',
            routeName: 'WorkOrderDetail',
            params: {
                obj: item,
                workOrderType: item.workOrderType,
            },
        });
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
        function getMonthAndDate(time) {
            const obj = time.replace(/-/g, '/');
            const newTime = new Date(obj);
            const month = newTime.getMonth() + 1;
            const date = newTime.getDate();
            return `${month}.${date}`;
        }
        return (
            <ScrollView>
                <View style={{
                    height: 30,
                    backgroundColor: '#FEFCEC',
                    justifyContent: 'center',
                }}
                >
                    <Text style={{
                        left: 10,
                        color: '#FF7F50',
                    }}
                    >
                        今日：总共查询到{historyList.length}条数据
                    </Text>
                </View>
                {
                    historyList.length > 0 && historyList.map(item => (
                        <TouchableOpacity key={item.id} onPress={() => this.handlePress(item)}>
                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                    backgroundColor: '#ffffff',
                                    marginTop: 5,
                                }}
                            >
                                <View style={{ flex: 0.05 }} />
                                <View style={{ flex: 0.15, alignItems: 'center' }}>
                                    <View
                                        style={{
                                            width: 50,
                                            height: 50,
                                            flex: -1,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderRadius: 10,
                                            backgroundColor: '#FF6853',
                                        }}
                                    >
                                        <Icon
                                            size={20}
                                            name="calendar"
                                            color={theme.header.foregroundColor}
                                        />
                                        <Text style={{ color: '#ffffff', fontSize: 12 }}>{ getMonthAndDate(item.time) }</Text>
                                    </View>
                                </View>
                                <View
                                    style={{
                                        flex: 0.7,
                                        paddingVertical: 10,
                                        paddingHorizontal: 10,
                                    }}
                                >
                                    <Text>工单编号：{item.ordercode}</Text>
                                    <Text>工单主题：{item.title}</Text>
                                    <Text>浏览时间：{item.time}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
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
