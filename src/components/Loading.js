import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import loadingStyle from './LoadingStyle';

const styles = StyleSheet.create(loadingStyle);


const Loading = ({ loading, text }) => (
    <View style={[styles.mask, loading ? null : { display: 'none' }]}>
        <ActivityIndicator color="rgb(255,255,255)" animating size="large" />
        {
            text &&
            <Text
                style={{
                    color: '#ffffff',
                    textAlign: 'center',
                    lineHeight: 30,
                    fontSize: 13,
                }}
            >
                {text}
            </Text>}
    </View>
);
Loading.propTypes = {
    loading: PropTypes.bool.isRequired,
    text: PropTypes.string,
};
export default Loading;
