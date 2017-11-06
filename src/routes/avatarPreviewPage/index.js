import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { connect } from 'react-redux';
import ImageViewer from 'react-native-image-zoom-viewer';
import Loading from '../../components/Loading';
import api from '../../utils/api';


const ImagesPreview = ({ userInfo, loading }) => (
    <View style={{ flex: 1, backgroundColor: '#000000' }}>
        <ImageViewer imageUrls={[{ url: `${api.database}/${userInfo.avatar}` }]} />
        <Loading loading={loading} />
    </View>
);
ImagesPreview.propTypes = {
    userInfo: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
};
const mapStateToProps = state => ({
    loading: state.user.loading,
    userInfo: state.user.userInfo,
});

export default connect(mapStateToProps)(ImagesPreview);
