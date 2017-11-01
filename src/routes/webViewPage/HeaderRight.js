import React from 'react';
import PropTypes from 'prop-types';
import { View, ToastAndroid, Linking, Share, Clipboard } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import HeaderTool from '../../components/HeaderTool';
import HeaderPopupMenu from '../../components/HeaderPopupMenu';
import theme from '../../theme';

const HeaderRight = ({ navigation, dispatch }) => {
    function handleShare() {
        const { state } = navigation;
        if (state.params && state.params.canShare === false) {
            ToastAndroid.show('此内容无法分享', 3000);
            return false;
        }
        Share.share({
            title: state.params && state.params.title,
            message: state.params && state.params.url,
        }, {
            dialogTitle: '分享至',
        });
        return true;
    }

    function handleBrowser() {
        const { state } = navigation;
        if (state.params && state.params.url) {
            Linking.openURL(state.params.url).catch(err => ToastAndroid.show(err.message, 3000));
        }
    }

    function handleCopyHref() {
        const { state } = navigation;
        if (state.params && state.params.url) {
            Clipboard.setString(state.params.url);
            ToastAndroid.show('内容已复制', 3000);
        } else {
            ToastAndroid.show('无法复制', 3000);
        }
    }

    const menuOptions = [
        {
            key: 'share',
            handler: handleCopyHref,
            text: '复制链接',
        },
        {
            key: 'browser',
            handler: handleBrowser,
            text: '在浏览器打开',
        },
    ];
    return (
        <View
            style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <HeaderTool onPress={handleShare}>
                <Icon
                    name="md-share"
                    size={20}
                    color={theme.header.foregroundColor}
                />
            </HeaderTool>
            <HeaderPopupMenu menuOptions={menuOptions} display="popup">
                <Icon
                    name="md-more"
                    size={25}
                    color={theme.header.foregroundColor}
                />
            </HeaderPopupMenu>
        </View>
    );
};

HeaderRight.propTypes = {
    navigation: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
};

export default connect()(HeaderRight);
