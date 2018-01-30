import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    FlatList,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import ItemSeparator from '../../components/ItemSeparator';
import ListEmptyComponent from '../../components/ListEmptyComponent';
import ListFooterLoading from '../../components/ListFooterLoading';
import WorkorderListItem from './woListItem';
import BottomFuncBtnGroup from './BottomFuncBtnGroup';
import styleModule from './indexStyle';
import ACTIONS from '../../models/actions';

const styles = StyleSheet.create(styleModule);

class WODrafts extends PureComponent {
    static scrollToTop() {
        WODrafts.flatList.scrollToOffset({
            animated: true,
            offset: 0,
        });
    }

    constructor(props) {
        super(props);
        this.state = {
            screenHeight: Dimensions.get('window').height, // 设备屏幕高度
            haveHeaderPrompt: false,
        };
        this.queryInitialData = this._queryInitialData.bind(this);
        this.queryPaginationData = this._queryPaginationData.bind(this);
        this.handleLayoutResize = this._handleLayoutResize.bind(this);
    }

    componentDidMount() {
        this.queryInitialData();
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.timerQueryInitialData);
        cancelAnimationFrame(this.timerQueryPaginationData);
        clearTimeout(this.timerScrollState);
    }

    _queryInitialData() {
        const { dispatch } = this.props;
        // 使用timer异步可以可以解决refresh请求两次的问题
        this.timerQueryInitialData = requestAnimationFrame(() => {
            // 初始化
            dispatch({
                type: ACTIONS.WORKORDER.INITIAL,
                payload: {
                    stateName: 'woDrafts',
                    stateValue: {
                        pageNumber: 0,         // 当前加载页码
                        workorderList: [],     // 数据列表
                        loaded: false,         // 所有数据加载完成
                    },
                },
            });
            // 查询首页数据
            dispatch({
                type: ACTIONS.WORKORDER.REQUEST,
                payload: {
                    stateName: 'woDrafts',
                    stateValue: {
                        pageNumber: 0,
                        isDel: 0,
                        wStateClient: 0,
                        queryType: 0,
                    },
                },
            });
        });
    }

    _queryPaginationData() {
        const { dispatch, workorderList } = this.props;
        if (workorderList.length > 0) {
            this.timerQueryPaginationData = requestAnimationFrame(() => {
                dispatch({
                    type: ACTIONS.WORKORDER.REQUEST,
                    payload: {
                        stateName: 'woDrafts',
                        stateValue: {
                            isDel: 0,
                            wStateClient: 0,
                            queryType: 0,
                        },
                    },
                });
            });
        }
    }

    _handleLayoutResize() {
        this.setState({
            screenHeight: Dimensions.get('window').height,
        });
    }

    render() {
        const { loading, workorderList, pageNumber, pageLoading, loaded, dispatch, navigation }
            = this.props;
        const { screenHeight, haveHeaderPrompt } = this.state;
        const { state, setParams } = navigation;
        return (
            <View style={styles.container} onLayout={this.handleLayoutResize}>
                <View style={{ flex: 1 }}>
                    <FlatList
                        ref={(_ref) => {
                            WODrafts.flatList = _ref;
                        }}
                        data={workorderList}
                        keyExtractor={(item, index) => item.ordercode}
                        refreshing={loading}
                        onRefresh={this.queryInitialData}
                        onEndReachedThreshold={0.1}
                        onEndReached={this.queryPaginationData}
                        initialNumToRender={10}
                        ItemSeparatorComponent={() => (
                            <ItemSeparator
                                backgroundColor="rgba(255,255,255,0.8)"
                                border={0.8}
                                lineColor="rgba(139,139,139,0.3)"
                                marginHorizontal={15}
                            />
                        )}
                        ListEmptyComponent={() => (
                            <ListEmptyComponent
                                text={loading ? '正在拼命加载...' : '没有工单数据...'}
                                icon={loading ? require('../../assets/loading.png') : require('../../assets/noData.png')}
                                customStyle={{
                                    height: screenHeight - 150 > 85 ? screenHeight - 150 : 85,
                                }}
                            />
                        )}
                        ListFooterComponent={() => (
                            <ListFooterLoading
                                loading={pageLoading}
                                loaded={loaded}
                                visible={workorderList.length > 0}
                            />
                        )}
                        renderItem={({ item, index }) => (
                            <WorkorderListItem
                                item={item}
                                index={index}
                                navigation={navigation}
                                dispatch={dispatch}
                                onBackRequest={(checkedList) => {
                                    if (checkedList) alert(checkedList);
                                }}
                            />
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
                {
                    state.params && state.params.checkBoxVisible &&
                    <BottomFuncBtnGroup navigation={navigation} />
                }
            </View>
        );
    }
}

WODrafts.propTypes = {
    loading: PropTypes.bool.isRequired,
    workorderList: PropTypes.array.isRequired,
    pageNumber: PropTypes.number.isRequired,
    pageLoading: PropTypes.bool.isRequired,
    loaded: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    ...state.workorder.woDrafts,
});


export default connect(mapStateToProps)(WODrafts);
