import React from 'react';
import PropTypes from 'prop-types';
import { View, ActivityIndicator } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';

const ImagesPreview = ({ navigation }) => {
    const { state } = navigation;
    return (
        <View style={{ flex: 1, backgroundColor: '#000000' }}>
            <ImageViewer
                imageUrls={state.params && state.params.images}
                index={(state.params && state.params.initialPage) || 0}
                loadingRender={() => (
                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'stretch',
                        }}
                    >
                        <ActivityIndicator color="#ffffff" size="large" />
                    </View>
                )}
            />
        </View>
    );
};

ImagesPreview.propTypes = {
    navigation: PropTypes.object.isRequired,
};

export default ImagesPreview;
