import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, WebView, BackHandler, RefreshControl } from 'react-native';
import theme from '../../theme';

export default class Browser extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            refreshControlEnabled: true,
        };
        this.handleBackAndroid = this._handleBackAndroid.bind(this);
        this.handleRefresh = this._handleRefresh.bind(this);
        this.handleNavigationStateChange = this._handleNavigationStateChange.bind(this);
        this.handleReceiveWebViewMsg = this._handleReceiveWebViewMsg.bind(this);
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
        const regexp = new RegExp('^((ht|f)tps?):\\/\\/[\\w\\-]+(\\.[\\w\\-]+)+([\\w\\-\\.,@?^=%&:\\/~\\+#]*[\\w\\-\\@?^=%&\\/~\\+#])?$', 'g'); // 匹配网址
        setParams({
            title: navState.title.indexOf('data:text/html;') >= 0 ? '静态页面' : navState.title,
            loading: navState.loading,
            canGoBack: navState.canGoBack,
            canShare: regexp.test(navState.url),
            url: navState.url,
        });
    }

    _handleReceiveWebViewMsg(e) {
        // 网页滚动会postMessage
        const nextRefreshControlEnabled = (e.nativeEvent.data === '0');
        this.setState((state) => {
            if (state.refreshControlEnabled === nextRefreshControlEnabled) {
                return null;  // react 16 新特性：setState 传入 null 避免组件重新渲染
            }
            return { refreshControlEnabled: nextRefreshControlEnabled };
        });
    }

    render() {
        const { state } = this.props.navigation;
        const { refreshControlEnabled } = this.state;
        const injectedJavaScript = `
        window.onscroll = function() {
            var scrollToTop = document.documentElement.scrollTop || document.body.scrollTop;
            window.postMessage(scrollToTop);
        }`;
        return (
            <ScrollView
                contentContainerStyle={{ flex: 1 }}
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
                    injectedJavaScript={injectedJavaScript}
                    onMessage={this.handleReceiveWebViewMsg}
                />
            </ScrollView>
        );
    }
}
Browser.propTypes = {
    navigation: PropTypes.object.isRequired,
};
