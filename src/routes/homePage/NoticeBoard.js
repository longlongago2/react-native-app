import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Text, ActivityIndicator } from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Feather';
import TagBoard from '../../components/TagBoard';
import ACTIONS from '../../models/actions';
import theme from '../../theme';

class NoticeBoard extends PureComponent {
    constructor(props) {
        super(props);
        this.handleRefresh = this._handleRefresh.bind(this);
    }

    _handleRefresh() {
        const { dispatch } = this.props;
        dispatch({
            type: ACTIONS.NOTICE.INITIAL,
        });
        dispatch({
            type: ACTIONS.NOTICE.REQUEST,
            payload: {
                pageNumber: -1,
                expirationTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            },
        });
    }

    render() {
        const { loading, noticeList } = this.props;
        return (
            <TagBoard
                title="公告栏"
                onRefresh={this.handleRefresh}
                loading={loading}
            >
                {
                    Array.isArray(noticeList) && noticeList.length > 0 && !loading &&
                    noticeList.map((item, i) => (
                        <View
                            key={item.noticeid}
                            style={[
                                {
                                    borderBottomColor: '#cccccc',
                                    borderBottomWidth: 0.5,
                                    paddingVertical: 10,
                                    marginHorizontal: 10,
                                    flex: -1,
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'stretch',
                                },
                                i === noticeList.length - 1 &&
                                {
                                    borderBottomWidth: 0,
                                },
                            ]}
                        >
                            <View
                                style={{
                                    flex: -1,
                                    width: '100%',
                                    flexDirection: 'row',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                    paddingVertical: 5,
                                }}
                            >
                                <Text
                                    numberOfLines={1}
                                    style={{
                                        color: '#4876FF',
                                        fontSize: 15,
                                        fontWeight: 'bold',
                                        maxWidth: 80,
                                    }}
                                >
                                    {item.noticetitle}
                                </Text>
                                <Text> | </Text>
                                <Text
                                    style={{
                                        fontSize: 12,
                                        color: '#696969',
                                    }}
                                >
                                    {moment(item.createtime).format('YYYY/MM/DD')}
                                </Text>
                            </View>
                            <Text style={{ fontSize: 13 }}>{item.noticetext}</Text>
                        </View>
                    ))
                }
                {
                    Array.isArray(noticeList) && noticeList.length <= 0 && !loading &&
                    <View>
                        <View
                            style={{
                                flex: -1,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                margin: 20,
                                backgroundColor: theme.theme,
                                height: 80,
                                borderRadius: 5,
                            }}
                        >
                            <Text
                                style={{
                                    color: '#fff',
                                    fontSize: 15,
                                    fontWeight: 'bold',
                                }}
                            >
                                公告全都过期啦！
                            </Text>
                        </View>
                        <Icon
                            name="paperclip"
                            size={25}
                            color="#575757"
                            style={{
                                position: 'absolute',
                                top: 15,
                                right: 15,
                            }}
                        />
                    </View>
                }
                {
                    loading && <ActivityIndicator color="#878787" size="large" />
                }
            </TagBoard>
        );
    }
}

NoticeBoard.propTypes = {
    loading: PropTypes.bool.isRequired,
    noticeList: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired,
};
export default NoticeBoard;
