/**
 * Created by zhangqi11 on 2017/08/03.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { View, Image, StyleSheet } from 'react-native';
import Swiper from 'react-native-swiper';
import uuid from 'uuid';
import styleModule from './indexStyle';

const styles = StyleSheet.create(styleModule);

const SlideImages = ({ images }) => (
    <Swiper
        style={{ width: '100%', height: 180 }}
        autoplay
    >
        {
            Array.isArray(images) && images.length > 0 ?
                images.map(item => (
                    <View key={uuid()} style={styles.swipe}>
                        <Image
                            source={{ uri: item }}
                            style={{ flex: 1 }}
                            resizeMode="cover"
                            resizeMethod="scale"
                        />
                    </View>
                ))
                :
                <View style={styles.swipe} />
        }
    </Swiper>
);

SlideImages.propTypes = {
    images: PropTypes.array.isRequired,
};

export default SlideImages;
