/**
 * created by zhangqi on 2017-9-26
 * */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TextInput,
} from 'react-native';
import StarRating from 'react-native-star-rating';
import styleModule from './indexStyle';
import ModalPage from '../../components/ModalPage';
import ACTIONS from '../../models/actions';

const style = StyleSheet.create(styleModule);
const starTypeList = [
    { id: 1, name: '整体评价', type: 'wholeScore' },
    { id: 2, name: '完成情况', type: 'finishScore' },
    { id: 3, name: '处理速度', type: 'speedScore' },
];

class ModalWOClose extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            wholeScore: 5,
            finishScore: 5,
            speedScore: 5,
            appraise: '',
        };
        this.onStarRatingPress = this._onStarRatingPress.bind(this);
        this.handleUpdate = this._handleUpdate.bind(this);
    }

    _onStarRatingPress(rating, type) {
        const newState = {};
        newState[type] = rating;
        this.setState(newState);
    }

    _handleUpdate(close) {
        const { dispatch, workOrderDetail, userid } = this.props;
        const { wholeScore, finishScore, speedScore, appraise } = this.state;
        dispatch({
            type: ACTIONS.WORKORDER.UPDATE,
            payload: {
                stateName: 'woiCreated',
                stateValue: {
                    todo: 'update',
                    params: {
                        ordercode: workOrderDetail.ordercode,
                        wstateclient: 4,
                        wstateemployee: 3,
                        wholescore: wholeScore,
                        finishscore: finishScore,
                        speedscore: speedScore,
                        appraise,
                        repler: userid,
                        replyinfo: `编号${workOrderDetail.ordercode}工单已被用户关闭`,
                        isinside: 1,
                    },
                },
            },
        });
        close();
    }

    render() {
        const { navigation, workOrderDetail } = this.props;
        const { wholeScore, finishScore, speedScore } = this.state;
        const starProperty = {
            disabled: false,
            maxStars: 5,
            starSize: 25,
            starColor: '#F18101',
            emptyStarColor: '#F18101',
        };

        function handleRating(type) {
            switch (type) {
                case 'wholeScore':
                    return wholeScore;
                case 'finishScore':
                    return finishScore;
                case 'speedScore':
                    return speedScore;
                default:
                    return 5;
            }
        }

        return (
            <ModalPage
                navigation={navigation}
                title="关闭并评价"
                onSubmit={this.handleUpdate}
            >
                <ScrollView style={{ width: '100%' }}>
                    <View style={{ borderBottomWidth: 0.5, borderBottomColor: 'rgba(139,139,139,0.3)' }}>
                        <View style={{ padding: 10 }}>
                            <Text>编号：{workOrderDetail.ordercode}</Text>
                            <Text>主题：{workOrderDetail.title}</Text>
                        </View>
                    </View>
                    <View style={{
                        borderBottomWidth: 0.5,
                        borderBottomColor: 'rgba(139,139,139,0.3)',
                    }}
                    >
                        <View style={{ padding: 10 }}>
                            <Text>请对本次的服务做出评价：</Text>
                        </View>
                        {
                            starTypeList.map((item, i) => (
                                <View key={item.id} style={style.appraiseStar}>
                                    <View style={{ flex: 0.25 }}>
                                        <Text>{item.name}</Text>
                                    </View>
                                    <View style={{ flex: 0.4 }}>
                                        <StarRating
                                            {...starProperty}
                                            rating={handleRating(item.type)}
                                            selectedStar={rating => this.onStarRatingPress(rating, item.type)}
                                        />
                                    </View>
                                    <View style={{ flex: 0.1 }} />
                                    <View style={{ flex: 0.2 }}>
                                        <Text>{handleRating(item.type)}分</Text>
                                    </View>
                                </View>
                            ))
                        }
                    </View>
                    <View style={[style.commonStyle, {
                        flexDirection: 'row',
                        height: 60,
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                    }]}
                    >
                        <Text style={{ flex: 0.2 }}>填写评价</Text>
                        <TextInput
                            underlineColorAndroid="transparent"
                            placeholder="您宝贵的建议是我们向上的动力"
                            placeholderTextColor="#cccccc"
                            style={{ flex: 0.8 }}
                            onChangeText={(text) => {
                                this.setState({ appraise: text });
                            }}
                        />
                    </View>
                </ScrollView>
            </ModalPage>
        );
    }
}

ModalWOClose.propTypes = {
    navigation: PropTypes.object.isRequired,
    workOrderDetail: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    userid: PropTypes.number.isRequired,
};

export default ModalWOClose;
