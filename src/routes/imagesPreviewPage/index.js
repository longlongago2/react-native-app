import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';

class ImagesPreview extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 1,
            renderToHardwareTextureAndroid: false,
        };
        this.timerRenderToHardware = () => requestAnimationFrame(() =>
            this.setState({ renderToHardwareTextureAndroid: true }),
        );
    }

    componentDidMount() {
        this.timerRenderToHardware();
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.timerPageSelected);
        cancelAnimationFrame(this.timerRenderToHardware);
        const { renderToHardwareTextureAndroid } = this.state;
        if (renderToHardwareTextureAndroid) {
            this.setState({ renderToHardwareTextureAndroid: false });
        }
    }

    render() {
        const { navigation } = this.props;
        const { currentPage, renderToHardwareTextureAndroid } = this.state;
        const { state } = navigation;
        return (
            <View
                renderToHardwareTextureAndroid={renderToHardwareTextureAndroid}
                style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'stretch',
                }}
            >
                <View
                    style={{
                        position: 'absolute',
                        bottom: 20,
                        left: 20,
                    }}
                >
                    {
                        state.params &&
                        state.params.images &&
                        <Text
                            style={{
                                fontSize: 15,
                                color: '#ffffff',
                            }}
                        >
                            {`${currentPage}/${state.params.images.length}`}
                        </Text>
                    }
                </View>
            </View>
        );
    }
}

ImagesPreview.propTypes = {
    navigation: PropTypes.object.isRequired,
};

export default ImagesPreview;
