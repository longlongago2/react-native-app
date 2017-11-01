import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Image, Text } from 'react-native';
import RAFTouchableNativeFeedback from '../../components/RAFTouchableNativeFeedback';
import api from '../../utils/api';
import styleModule from './indexStyle';

const styles = StyleSheet.create(styleModule);

const Banner = ({ userInfo, online, onPress }) => (
    <Image
        source={{ uri: `${api.database}/${userInfo.avatar}` }}
        blurRadius={3}
        style={styles.banner}
    >
        <RAFTouchableNativeFeedback
            backgroundColor="rgba(255,255,255,0.5)"
            onPress={online ? () => onPress('Profile') : () => onPress('Login')}
        >
            <View style={styles.layout}>
                <View>
                    {
                        userInfo.avatar ?
                            <Image
                                source={{ uri: `${api.database}/${userInfo.avatar}` }}
                                style={styles.avatar}
                            /> :
                            <Image
                                source={require('../../assets/avatar_default.png')}
                                style={styles.avatar}
                            />
                    }
                </View>
                <View>
                    <Text style={styles.username} numberOfLines={1}>
                        {userInfo.username ? userInfo.username : '未登录'}
                    </Text>
                </View>
                <View>
                    {
                        online &&
                        <Text style={styles.motto} numberOfLines={1}>
                            {
                                userInfo.description && userInfo.description !== '' ?
                                    userInfo.description :
                                    '这个人很懒，什么都没有留下！'
                            }
                        </Text>
                    }
                </View>
            </View>
        </RAFTouchableNativeFeedback>
    </Image>
);

Banner.propTypes = {
    userInfo: PropTypes.object.isRequired,
    online: PropTypes.bool.isRequired,
    onPress: PropTypes.func.isRequired,
};

export default Banner;
