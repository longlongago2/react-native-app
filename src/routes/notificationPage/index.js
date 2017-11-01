import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import ListEmptyComponent from '../../components/ListEmptyComponent';
import ListFooterLoading from '../../components/ListFooterLoading';
import styleModule from './indexStyle';
import ACTIONS from '../../models/actions';

const styles = StyleSheet.create(styleModule);

class NotificationPage extends Component {
    static scrollToTop() {
        NotificationPage.flatList.scrollToOffset({
            animated: true,
            offset: 0,
        }); // 滑到顶部
    }

    constructor(props) {
        super(props);
        this.state = {
            haveHeaderPrompt: false,  // 顶部是否提示过
        };
        this.queryPaginationData = this._queryPaginationData.bind(this);
        this.queryInitialData = this._queryInitialData.bind(this);
        this.handleItemPress = this._handleItemPress.bind(this);
    }

    componentDidMount() {
        this.queryInitialData();
    }

    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch({ type: ACTIONS.NOTIFICATION.INITIAL });
        cancelAnimationFrame(this.timerInitialData);
        cancelAnimationFrame(this.timerPaginstionData);
        clearTimeout(this.timerScrollState);
    }

    _queryPaginationData() {
        const { dispatch } = this.props;
        this.timerPaginstionData = requestAnimationFrame(() => {
            dispatch({ type: ACTIONS.NOTIFICATION.REQUEST });
        });
    }

    _queryInitialData() {
        const { dispatch } = this.props;
        this.timerInitialData = requestAnimationFrame(() => {
            dispatch({ type: ACTIONS.NOTIFICATION.INITIAL });
            dispatch({ type: ACTIONS.NOTIFICATION.REQUEST });
        });
    }

    _handleItemPress(item) {
        const { dispatch } = this.props;
        if (item.workordercode) {
            dispatch({
                type: 'Navigation/NAVIGATE',
                routeName: 'WorkOrderDetail',
                params: {
                    obj: {
                        ordercode: item.workordercode,
                        title: item.workordertitle,
                    },
                    workOrderType: null,
                },
            });
        }
    }

    render() {
        const { loading, pageLoading, loaded, notificationList, navigation, pageNumber }
            = this.props;
        const { setParams, state } = navigation;
        const { haveHeaderPrompt } = this.state;
        return (
            <View style={styles.container}>
                <FlatList
                    ref={(_ref) => {
                        NotificationPage.flatList = _ref; // 定义静态属性，静态属性只能使用ClassName.property定义
                    }}
                    data={notificationList}
                    keyExtractor={(item, index) => item.messagecode}
                    refreshing={loading}
                    onRefresh={this.queryInitialData}
                    onEndReachedThreshold={0.1}
                    onEndReached={this.queryPaginationData}
                    initialNumToRender={10}
                    ItemSeparatorComponent={() => (
                        <View style={{ height: 5, backgroundColor: 'transparent' }} />
                    )}
                    ListEmptyComponent={() => (
                        <ListEmptyComponent
                            text="没有工单数据..."
                            icon={require('../../assets/noData.png')}
                        />
                    )}
                    ListFooterComponent={() => (
                        <ListFooterLoading
                            loading={pageLoading}
                            loaded={loaded}
                            visible={notificationList.length > 0}
                        />
                    )}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity onPress={() => this.handleItemPress(item)}>
                            <View
                                style={{
                                    backgroundColor: '#fff',
                                    padding: 10,
                                    borderLeftColor: item.isdel === 0 ? '#D45325' : '#8C8C8C',
                                    borderLeftWidth: 3,
                                }}
                            >
                                <Text>{item.messagename}</Text>
                                <Text>工单编号：{item.workordercode}</Text>
                                <Text>工单主题：{item.workordertitle}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    onMomentumScrollBegin={() => {
                        if (haveHeaderPrompt === false && pageNumber > 2) {
                            // 只提示一次，且翻页页码大于2
                            this.setState({ haveHeaderPrompt: true }, () =>
                                setParams({ headerTip: true }),
                            );
                        }
                    }}
                    onMomentumScrollEnd={() => {
                        if (state.params && state.params.headerTip === true) {
                            this.timerScrollState = setTimeout(() =>
                                setParams({ headerTip: false }), 5000);
                        }
                    }}
                />
            </View>
        );
    }
}

NotificationPage.propTypes = {
    notificationList: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    loaded: PropTypes.bool.isRequired,
    pageLoading: PropTypes.bool.isRequired,
    pageNumber: PropTypes.number.isRequired,
    dispatch: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
};
const mapStateToProps = state => ({
    ...state.notification,
});
export default connect(mapStateToProps)(NotificationPage);
