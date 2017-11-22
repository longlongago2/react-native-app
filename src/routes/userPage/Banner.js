import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Image, Text, ImageBackground, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import RAFTouchableNativeFeedback from '../../components/RAFTouchableNativeFeedback';
import ThrownIntoAnimation from '../../components/ThrownIntoAnimation';
import api from '../../utils/api';
import styleModule from './indexStyle';

const styles = StyleSheet.create(styleModule);

const Banner = ({ userInfo, online, onPress }) => (
    <ImageBackground
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
        {
            online &&
            <ThrownIntoAnimation
                style={styles.tip}
                duration={500}
                position={{
                    right: { initial: -81, final: -1 },
                    top: { initial: -30, final: 20 },
                }}
            >
                <TouchableOpacity onPress={() => alert('正在开发，敬请期待')}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <Icon name="calendar" size={20} color="#ffffff" />
                        <Text style={styles.tipText}>
                            签到
                        </Text>
                    </View>
                </TouchableOpacity>
            </ThrownIntoAnimation>
        }
    </ImageBackground>
);

Banner.propTypes = {
    userInfo: PropTypes.object.isRequired,
    online: PropTypes.bool.isRequired,
    onPress: PropTypes.func.isRequired,
};

export default Banner;
