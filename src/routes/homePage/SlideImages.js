/**
 * Created by zhangqi11 on 2017/08/03.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Dimensions, Image } from 'react-native';
import Carousel from 'react-native-looped-carousel';
import uuid from 'uuid';

const { width, height } = Dimensions.get('window');

export default class CarouselImage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            size: { width, height },
        };
        this.onLayoutDidChange = this._onLayoutDidChange.bind(this);
    }

    _onLayoutDidChange(e) {
        const layout = e.nativeEvent.layout;
        this.setState({ size: { width: layout.width, height: layout.height } });
    }

    render() {
        const { images } = this.props;
        return (
            <View style={{ flex: -1, height: 180, width: '100%' }} onLayout={this.onLayoutDidChange}>
                <Carousel
                    delay={4500}
                    style={this.state.size}
                    autoplay
                    bullets
                    bulletStyle={{
                        width: 5,
                        height: 5,
                        backgroundColor: '#fff',
                    }}
                    chosenBulletStyle={{
                        width: 12,
                        height: 6,
                        backgroundColor: '#fff',
                    }}
                >
                    {
                        Array.isArray(images) && images.length > 0 ?
                            images.map(item => (
                                <View key={uuid()}>
                                    <Image
                                        source={{ uri: item }}
                                        style={this.state.size}
                                        resizeMode="cover"
                                        resizeMethod="scale"
                                    />
                                </View>
                            ))
                            :
                            <View
                                style={[{ backgroundColor: '#EAEAEA' }, this.state.size]}
                            />
                    }
                </Carousel>
            </View>
        );
    }
}

CarouselImage.propTypes = {
    images: PropTypes.array.isRequired,
};
