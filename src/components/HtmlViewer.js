import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import HtmlView from 'react-native-htmlview';

class HtmlViewer extends PureComponent {
    constructor(props) {
        super(props);
        this.handleLinkPress = this._handleLinkPress.bind(this);
    }

    _handleLinkPress(uri) {
        const { dispatch } = this.props;
        dispatch({
            type: 'Navigation/NAVIGATE',
            routeName: 'WebView',
            params: {
                title: '跳转中...',
                canShare: false,
                source: {
                    uri,
                },
            },
        });
    }

    render() {
        const { value, style, stylesheet } = this.props;
        return (
            <HtmlView
                style={style || null}
                value={value}
                onLinkPress={this.handleLinkPress}
                stylesheet={stylesheet}
            />
        );
    }
}

HtmlViewer.propTypes = {
    value: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    style: PropTypes.object,
    stylesheet: PropTypes.object,
};
export default connect()(HtmlViewer);
