import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Text, Image } from 'react-native';
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
        const { value, style, stylesheet, dispatch } = this.props;

        function renderNode(node, index) {
            if (node.name === 'img') {
                const width = node.attribs.width;
                const height = node.attribs.height;
                const ratio = Math.round((width / height) * 100) / 100; // 小数点后两位
                const uri = node.attribs.src;
                return (
                    <Text
                        key={index}
                        onPress={() => {
                            dispatch({
                                type: 'Navigation/NAVIGATE',
                                routeName: 'ImagesPreview',
                                params: {
                                    images: [{ url: uri }],
                                    initialPage: 0,
                                },
                            });
                        }}
                    >
                        <Image
                            style={
                                width && height ?
                                    { width: 400, height: 400 / ratio } :
                                    { width: 200, height: 200 }
                            }
                            source={{ uri }}
                            resizeMethod="scale"
                            resizeMode="cover"
                        />
                    </Text>
                );
            }
            return false;
        }

        return (
            <HtmlView
                style={style || null}
                value={value}
                onLinkPress={this.handleLinkPress}
                stylesheet={stylesheet}
                renderNode={renderNode}
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
