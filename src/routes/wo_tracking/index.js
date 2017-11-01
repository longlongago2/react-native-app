import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    View,
    FlatList,
    StyleSheet,
    Dimensions,
} from 'react-native';
import ACTIONS from '../../models/actions';
import styleModule from './indexStyle';
import ItemSeparator from '../../components/ItemSeparator';
import ListEmptyComponent from '../../components/ListEmptyComponent';
import WorkorderListItem from './woListItem';
import ListFooterLoading from '../../components/ListFooterLoading';

const styles = StyleSheet.create(styleModule);

class WOTracking extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            screenHeight: Dimensions.get('window').height, // 设备屏幕高度
        };
        this.queryInitialTrackingList = this._queryInitialTrackingList.bind(this);
        this.queryPaginationTrackingList = this._queryPaginationTrackingList.bind(this);
        this.clearState = this._clearState.bind(this);
    }

    componentDidMount() {
        this.queryInitialTrackingList();
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.timeQueryInitialTrackingList);
        cancelAnimationFrame(this.timerQueryPaginationTrackingList);
        this.clearState();
    }

    _clearState() {
        const { dispatch } = this.props;
        dispatch({
            type: ACTIONS.TRACKINGWORKORDER.INITIAL,
        });
    }

    _queryInitialTrackingList() {
        const { dispatch } = this.props;
        this.timeQueryInitialTrackingList = requestAnimationFrame(() => {
            this.clearState();
            dispatch({
                type: ACTIONS.TRACKINGWORKORDER.REQUEST,
                payload: {
                    pageNumber: 0,
                },
            });
        });
    }

    _queryPaginationTrackingList() {
        const { dispatch, trackingWOList } = this.props;
        if (trackingWOList.length > 0) {
            this.timerQueryPaginationTrackingList = requestAnimationFrame(() => {
                dispatch({
                    type: ACTIONS.TRACKINGWORKORDER.REQUEST,
                });
            });
        }
    }

    render() {
        const { trackingWOList, navigation, dispatch, loading, loaded, pageLoading } = this.props;
        const { screenHeight } = this.state;
        return (
            <View style={styles.container}>
                <FlatList
                    ref={(_ref) => {
                        this.flatList = _ref;
                    }}
                    data={trackingWOList}
                    keyExtractor={(item, index) => item.ordercode}
                    refreshing={loading}
                    onRefresh={this.queryInitialTrackingList}
                    onEndReachedThreshold={0.1}
                    onEndReached={this.queryPaginationTrackingList}
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
                            text="没有工单数据..."
                            icon={require('../../assets/noData.png')}
                            customStyle={{
                                height: screenHeight - 150 > 85 ? screenHeight - 150 : 85,
                            }}
                        />
                    )}
                    ListFooterComponent={() => (
                        <ListFooterLoading
                            loading={pageLoading}
                            loaded={loaded}
                            visible={trackingWOList.length > 0}
                        />
                    )}
                    renderItem={({ item, index }) => (
                        <WorkorderListItem
                            item={item}
                            index={index}
                            navigation={navigation}
                            dispatch={dispatch}
                        />
                    )}
                />
            </View>
        );
    }
}

WOTracking.propTypes = {
    loading: PropTypes.bool.isRequired,
    loaded: PropTypes.bool.isRequired,
    pageLoading: PropTypes.bool.isRequired,
    navigation: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    trackingWOList: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
    ...state.trackingWorkOrder,
    userInfo: state.user.userInfo,
});

export default connect(mapStateToProps)(WOTracking);
