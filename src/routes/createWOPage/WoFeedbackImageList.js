import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Image,
    StyleSheet,
    TouchableWithoutFeedback,
    ActivityIndicator,
    Alert,
    ToastAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import WoImagePicker from './WoImagePicker';
import styleModule from './indexStyle';
import ACTIONS from '../../models/actions';
import api from '../../utils/api';
import theme from '../../theme';

const styles = StyleSheet.create(styleModule);

class WoFeedbackImageList extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            renderToHardwareTextureAndroid: false,
        };
        this.handleImagePreview = this._handleImagePreview.bind(this);
        this.handleDelete = this._handleDelete.bind(this);
        this.timerRenderToHardware = () => requestAnimationFrame(() =>
            this.setState({ renderToHardwareTextureAndroid: true }),
        );
    }

    componentDidMount() {
        this.timerRenderToHardware();
    }

    componentWillUnmount() {
        const { renderToHardwareTextureAndroid } = this.state;
        if (renderToHardwareTextureAndroid) {
            this.setState({ renderToHardwareTextureAndroid: false });
        }
    }

    _handleDelete(key, uri) {
        const { dispatch } = this.props;
        Alert.alert(
            '询问',
            '是否确定删除此图片？',
            [
                {
                    text: '取消',
                    onPress: () => ToastAndroid.show('取消', 3000),
                    style: 'cancel',
                },
                {
                    text: '确定',
                    onPress: () => {
                        dispatch({
                            type: ACTIONS.FEEDBACK_IMAGE.DELETE,
                            payload: { key, uri },
                        });
                    },
                },
            ],
            { cancelable: false },
        );
    }

    _handleImagePreview(initialPage) {
        const { dispatch, woImageList } = this.props;
        dispatch({
            type: 'Navigation/NAVIGATE',
            routeName: 'ImagesPreview',
            params: {
                images: woImageList.map(item => `${api.database}/${item.uri}`),
                initialPage,
            },
        });
    }

    render() {
        const { dispatch, woImageList, loading } = this.props;
        const { renderToHardwareTextureAndroid } = this.state;
        return (
            <View
                style={styles.imageListLayout}
            >
                {
                    Array.isArray(woImageList) && woImageList.length > 0 &&
                    woImageList.map((item, i) => (
                        <View
                            key={item.key}
                            style={styles.imageLayout}
                            renderToHardwareTextureAndroid={renderToHardwareTextureAndroid}
                        >
                            <View style={styles.image}>
                                {
                                    !item.disabled &&
                                    <TouchableWithoutFeedback
                                        onPress={() => this.handleDelete(item.key, item.uri)}
                                    >
                                        <Icon
                                            name="minus-circle"
                                            color="red"
                                            size={20}
                                            style={styles.imageDelBtn}
                                        />
                                    </TouchableWithoutFeedback>
                                }
                                <TouchableWithoutFeedback
                                    onPress={() => this.handleImagePreview(i)}
                                >
                                    <Image
                                        source={{ uri: `${api.database}/${item.uri}` }}
                                        resizeMode="cover"
                                        resizeMethod="scale"
                                        style={[styles.image, {
                                            borderWidth: 1,
                                            borderColor: '#000',
                                        }]}
                                    />
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                    ))
                }
                <View style={styles.imageLayout}>
                    {
                        loading ?
                            <ActivityIndicator size="large" color={theme.theme} /> :
                            <WoImagePicker dispatch={dispatch} />
                    }
                </View>
            </View>
        );
    }
}

WoFeedbackImageList.propTypes = {
    dispatch: PropTypes.func.isRequired,
    woImageList: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
};
export default WoFeedbackImageList;
