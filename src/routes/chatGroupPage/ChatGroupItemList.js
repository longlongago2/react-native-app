/**
 * 群聊列表 渲染组件
 * created by zhanqi on 2018-2-1
 * */
import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image } from 'react-native';
import RAFTouchableNativeFeedback from '../../components/RAFTouchableNativeFeedback';
import theme from '../../theme';
import api from '../../utils/api';

const ChatGroupItemList = ({ item, dispatch }) => {
    function handleItemPress(value) {
        alert('正在拼命开发中，敬请期待');
        // dispatch({
        //     type: 'Navigation/NAVIGATE',
        //     routeName: 'GroupChattingPage',
        //     params: {
        //         item: value,
        //     },
        // });
    }
    return (
        <RAFTouchableNativeFeedback
            backgroundColor={theme.rippleColor}
            onPress={() => handleItemPress(item)}
        >
            <View style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                height: 60,
                backgroundColor: 'rgba(255,255,255,0.8)',
            }}
            >
                <View style={{
                    flex: 2,
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                }}
                >
                    <Image
                        style={{ width: 40, height: 40 }}
                        source={{ uri: `${api.database}/${item.icon}` }}
                    />
                </View>
                <View style={{
                    flex: 8,
                    justifyContent: 'flex-start',
                }}
                >
                    <Text style={{ fontSize: 13 }}>{item.chatusergroupname}</Text>
                </View>
            </View>
        </RAFTouchableNativeFeedback>
    );
};

ChatGroupItemList.propTypes = {
    item: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
};

export default ChatGroupItemList;
