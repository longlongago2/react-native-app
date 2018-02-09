import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, FlatList, Dimensions, ToastAndroid } from 'react-native';
import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import FlatSquaredItem from '../../components/FlatSquaredItem';
import { fetchFunctionOptions } from '../../services/menuOptions';
import ACTIONS from '../../models/actions';

const FunctionItem = ({ dispatch, item, width, navigation }) => {
    function uploadImage(image) {
        const { state } = navigation;
        dispatch({
            type: ACTIONS.SEND_IMAGE.REQUEST,
            payload: {
                image: {
                    path: image.path,
                    name: image.path.split('/').reverse()[0],
                },
                topicId: state.params.userId.toString(),
                receiverId: state.params.userId,    // 接受者编号
                receiver: state.params.personName,  // 接受者名称
                type: state.params.type,            // 聊天类型
            },
        });
    }

    function handlePress(value) {
        switch (value.type) {
            case 0:
                break;
            case 1:
                break;
            case 2:
                ImagePicker.openPicker({
                    width: 300,
                    height: 300,
                    cropping: true,
                }).then((image) => {
                    uploadImage(image);
                }).catch(err => ToastAndroid.show(err.message, 3000));
                break;
            case 3:
                ImagePicker.openCamera({
                    width: 300,
                    height: 300,
                    cropping: true,
                }).then((image) => {
                    uploadImage(image);
                }).catch(err => ToastAndroid.show(err.message, 3000));
                break;
            default:
        }
    }

    return (
        <FlatSquaredItem item={item} onPress={handlePress} width={width} />
    );
};
FunctionItem.propTypes = {
    dispatch: PropTypes.func,
    item: PropTypes.object.isRequired,
    width: PropTypes.number.isRequired,
    navigation: PropTypes.object.isRequired,
};

class Functions extends PureComponent {
    constructor(props) {
        super(props);
        const { width } = Dimensions.get('window');
        this.state = {
            screenWidth: width,
            numColumns: 4,
        };
        this.handleLayout = this._handleLayout.bind(this);
    }

    _handleLayout(e) {
        const { width } = e.nativeEvent.layout;
        this.setState({ screenWidth: width });
    }

    render() {
        const { dispatch, navigation } = this.props;
        const { numColumns, screenWidth } = this.state;
        return (
            <View style={{ paddingTop: 20 }} onLayout={this.handleLayout}>
                <FlatList
                    keyExtractor={item => item.key}
                    columnWrapperStyle={{
                        height: 100,
                        paddingVertical: 5,
                    }}
                    horizontal={false}
                    numColumns={numColumns}
                    data={fetchFunctionOptions()}
                    renderItem={({ item }) => (
                        <FunctionItem
                            item={item}
                            dispatch={dispatch}
                            width={screenWidth / numColumns}
                            navigation={navigation}
                        />
                    )}
                />
            </View>
        );
    }
}

Functions.propTypes = {
    dispatch: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
};
export default connect()(Functions);
