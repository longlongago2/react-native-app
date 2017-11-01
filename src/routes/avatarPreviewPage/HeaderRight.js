import React from 'react';
import PropTypes from 'prop-types';
import { ToastAndroid } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';
import theme from '../../theme';
import HeaderPopupMenu from '../../components/HeaderPopupMenu';
import ACTIONS from '../../models/actions/index';

const ImagePreviewHeaderRight = ({ dispatch }) => {
    function handleCameraClick() {
        ImagePicker.openCamera({
            width: 300,
            height: 300,
            cropping: true,
        }).then((image) => {
            dispatch({
                type: ACTIONS.UPLOAD_AVATAR.INSERT,
                payload: {
                    url: image.path,
                },
            });
        }).catch(err => ToastAndroid.show(err.message, 3000));
    }

    function handleAlbumClick() {
        ImagePicker.openPicker({
            width: 300,
            height: 300,
            cropping: true,
        }).then((image) => {
            dispatch({
                type: ACTIONS.UPLOAD_AVATAR.INSERT,
                payload: {
                    url: image.path,
                },
            });
        }).catch(err => ToastAndroid.show(err.message, 3000));
    }

    function handleCancelClick() {
        ToastAndroid.show('取消', 3000);
    }

    const menuOptions = [
        {
            key: 'camera',
            handler: () => handleCameraClick(),
            text: '拍照',
        },
        {
            key: 'album',
            handler: () => handleAlbumClick(),
            text: '从相册中选取',
        },
        {
            key: 'cancel',
            handler: () => handleCancelClick(),
            text: '取消',
        },
    ];

    return (
        <HeaderPopupMenu menuOptions={menuOptions} display="slide">
            <Icon name="md-more" size={25} color={theme.header.foregroundColor} />
        </HeaderPopupMenu>
    );
};
ImagePreviewHeaderRight.propTypes = {
    dispatch: PropTypes.func,
};

export default connect()(ImagePreviewHeaderRight);
