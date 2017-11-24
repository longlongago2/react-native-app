import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text, StatusBar, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import BadgeIcon from '../../components/BadgeIcon';
import theme, { rgba } from '../../theme';

class Header extends PureComponent {
    constructor(props) {
        super(props);
        this.handleSearch = this._handleSearch.bind(this);
        this.handleRedirect = this._handleRedirect.bind(this);
    }

    _handleSearch() {
        const { dispatch } = this.props;
        dispatch({
            type: 'Navigation/NAVIGATE',
            routeName: 'Search',
            params: null,
        });
    }

    _handleRedirect(routeName, params) {
        const { dispatch } = this.props;
        dispatch({
            type: 'Navigation/NAVIGATE',
            routeName,
            params,
        });
    }

    render() {
        const { scrollY, unread } = this.props;
        return (
            <Animated.View
                style={{
                    position: 'absolute',
                    top: 0,
                    height: theme.header.height + StatusBar.currentHeight,
                    width: '100%',
                    paddingTop: StatusBar.currentHeight,
                    flex: -1,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: scrollY.interpolate({
                        inputRange: [0, 50, 150],
                        outputRange: [
                            rgba(theme.header.backgroundColor, 0),
                            rgba(theme.header.backgroundColor, 0),
                            rgba(theme.header.backgroundColor, 1),
                        ],
                    }),
                    shadowOpacity: scrollY.interpolate({
                        inputRange: [0, 50, 150],
                        outputRange: [0, 0, 0.1],
                    }),
                    elevation: scrollY.interpolate({
                        inputRange: [0, 50, 150],
                        outputRange: [0, 0, 4],
                    }),
                    shadowColor: '#000000',
                    shadowRadius: StyleSheet.hairlineWidth,
                    shadowOffset: {
                        height: StyleSheet.hairlineWidth,
                    },
                }}
            >
                <View
                    style={{
                        flex: -1,
                        width: 60,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <TouchableOpacity onPress={() => this.handleRedirect('CreateWO', null)}>
                        <Icon name="edit-3" size={25} color="#ffffff" />
                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'stretch',
                    }}
                >
                    <TouchableOpacity onPress={this.handleSearch}>
                        <View
                            style={{
                                flex: -1,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: 30,
                                borderRadius: 15,
                                borderWidth: 0.5,
                                borderColor: '#ffffff',
                                backgroundColor: 'rgba(0,0,0,0.5)',
                                paddingHorizontal: 10,
                            }}
                        >
                            <Text style={{ flex: 1, color: '#cccccc', fontSize: 13, textAlign: 'center' }}>
                                搜索服务平台
                            </Text>
                            <Icon
                                name="search"
                                size={20}
                                color="#ffffff"
                                style={{ flex: -1 }}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        flex: -1,
                        width: 60,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <TouchableOpacity onPress={() => this.handleRedirect('Notification', null)}>
                        <BadgeIcon
                            badge={unread}
                            display="dot"
                            component="icon"
                            icon={<Icon name="message-square" size={25} color="#ffffff" />}
                            badgeStyle={{
                                top: 0,
                                right: 0,
                                width: 10,
                                height: 10,
                                borderRadius: 5,
                            }}
                        />
                    </TouchableOpacity>
                </View>
            </Animated.View>
        );
    }
}

Header.propTypes = {
    dispatch: PropTypes.func.isRequired,
    scrollY: PropTypes.object.isRequired,
    unread: PropTypes.number.isRequired,
};
const mapStateToProps = state => ({
    unread: state.notification.unread,
});
export default connect(mapStateToProps)(Header);
