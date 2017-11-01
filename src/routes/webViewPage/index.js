import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, WebView, BackHandler, RefreshControl } from 'react-native';
import theme from '../../theme';

export default class Browser extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            refreshControlEnabled: false,
        };
        this.handleBackAndroid = this._handleBackAndroid.bind(this);
        this.handleRefresh = this._handleRefresh.bind(this);
        this.handleNavigationStateChange = this._handleNavigationStateChange.bind(this);
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackAndroid);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackAndroid);
    }

    _handleBackAndroid() {
        const { state } = this.props.navigation;
        const canGoBack = state.params && state.params.canGoBack;
        if (canGoBack) {
            this.browser.goBack();
            return true;
        }
        return false;
    }

    _handleRefresh() {
        this.browser.reload();
    }

    _handleNavigationStateChange(navState) {
        const { setParams } = this.props.navigation;
        const regexp = new RegExp('(http[s]?|ftp):\\/\\/[^\\/\\.]+?\\..+\\w$', 'g'); // 匹配网址
        setParams({
            title: navState.title.indexOf('data:text/html;') >= 0 ? '静态页' : navState.title,
            loading: navState.loading,
            canGoBack: navState.canGoBack,
            canShare: regexp.test(navState.url),
            url: navState.url,
        });
    }


    render() {
        const { state } = this.props.navigation;
        const { refreshControlEnabled } = this.state;
        return (
            <ScrollView
                contentContainerStyle={{
                    flex: 1,
                }}
                refreshControl={
                    <RefreshControl
                        refreshing={state.params && state.params.loading === true}
                        onRefresh={this.handleRefresh}
                        colors={[theme.theme]}
                        enabled={refreshControlEnabled}
                    />
                }
            >
                <WebView
                    ref={(_ref) => {
                        this.browser = _ref;
                    }}
                    automaticallyAdjustContentInset
                    scalesPageToFit
                    javaScriptEnabled
                    domStorageEnabled
                    mixedContentMode="always"
                    source={state.params && state.params.source}
                    onNavigationStateChange={this.handleNavigationStateChange}
                />
            </ScrollView>
        );
    }
}
Browser.propTypes = {
    navigation: PropTypes.object.isRequired,
};
