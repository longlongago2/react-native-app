import React from 'react';
import PropTypes from 'prop-types';
import { View, ToastAndroid } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import ImagePicker from 'react-native-image-crop-picker';
import HeaderPopupMenu from '../../components/HeaderPopupMenu';
import ACTIONS from '../../models/actions';


const WoImagePicker = ({ dispatch }) => {
    function handleCameraClick() {
        ImagePicker.openCamera({
            compressImageQuality: 0.5, // 压缩图片（low 0,1 best）
            cropping: false,
        }).then((image) => {
            dispatch({
                type: ACTIONS.FEEDBACK_IMAGE.INSERT,
                payload: {
                    images: [image],
                },
            });
        }).catch(err => ToastAndroid.show(err.message, 3000));
    }

    function handleAlbumClick() {
        ImagePicker.openPicker({
            multiple: true,
            compressImageQuality: 0.5,
            cropping: false,
        }).then((images) => {
            dispatch({
                type: ACTIONS.FEEDBACK_IMAGE.INSERT,
                payload: {
                    images,
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
        <View
            style={{
                width: 70,
                height: 70,
                flex: -1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <HeaderPopupMenu
                menuOptions={menuOptions}
                display="popup"
                customMenuTriggerStyle={{
                    height: 70,
                    width: 70,
                    flex: -1,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Icon name="plus-square-o" size={70} color="#cccccc" />
            </HeaderPopupMenu>
        </View>
    );
};

WoImagePicker.propTypes = {
    dispatch: PropTypes.func.isRequired,
};
export default WoImagePicker;
