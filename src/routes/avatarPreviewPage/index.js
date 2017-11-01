import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { connect } from 'react-redux';
import Loading from '../../components/Loading';
import api from '../../utils/api';


const ImagesPreview = ({ userInfo, loading }) => (
    <View
        style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'stretch',
        }}
    >
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
