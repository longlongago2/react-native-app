import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    Button,
    StyleSheet,
    DatePickerAndroid,
    ToastAndroid,
} from 'react-native';
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button';
import ModalPage from '../../components/ModalPage';
import styleModule from './indexStyle';
import ACTIONS from '../../models/actions';

const style = StyleSheet.create(styleModule);
const statusList = [
    { key: 0, value: '未处理' },
    { key: 1, value: '已处理' },
    { key: 2, value: '已解决' },
];

export default class ModalWOScheduleUpdate extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            finishTime: '',
            wStateEmployee: {
                key: '',
                value: '',
            },
            replyInfo: '',
        };
        this.handleDatePicker = this._handleDatePicker.bind(this);
        this.onSelect = this._onSelect.bind(this);
        this.handleUpdate = this._handleUpdate.bind(this);
    }

    async _handleDatePicker() {
        let finishTime = '';
        const { action, year, month, day } = await
            DatePickerAndroid.open({
                // 要设置默认值为今天的话，使用`new Date()`即可。
                date: new Date(),
            });
        if (action !== DatePickerAndroid.dismissedAction) {
            finishTime = `${year}-${month + 1}-${day}`;
            this.setState({
                finishTime,
            });
        }
    }

    _onSelect(index, value) {
        this.setState({
            wStateEmployee: {
                key: value,
                value: statusList[value].value,
            },
        });
    }

    _handleUpdate(close) {
        const { workOrderDetail, dispatch, userid } = this.props;
        const { wStateEmployee, replyInfo, finishTime } = this.state;
        if (this.state.finishTime === null || this.state.finishTime === '') {
            ToastAndroid.show('请填写与预计完成时间', 3000);
        } else {
            dispatch({
                type: ACTIONS.WORKORDER.UPDATE,
                payload: {
                    stateName: 'woMyTask',
                    stateValue: {
                        todo: 'update',
                        params: {
                            ordercode: workOrderDetail.ordercode,
                            wstateemployee: wStateEmployee.key,
                            wstateclient: wStateEmployee.key + 1,
                            finishtime: finishTime,
                            repler: userid,
                            replyinfo: replyInfo, // 主表里的 replyInfo
                            isinside: 1,
                        },
                    },
                },
            });
            close();
        }
    }

    render() {
        const { navigation, workOrderDetail } = this.props;
        const { wStateEmployee, finishTime } = this.state;
        return (
            <ModalPage
                navigation={navigation}
                title="进度更新"
                onSubmit={this.handleUpdate}
            >
                <ScrollView style={{ alignSelf: 'flex-start', width: '100%' }}>
                    <View style={[style.commonStyle,
                        {
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            height: 60,
                            paddingHorizontal: 10,
                        },
                    ]}
                    >
                        <Text>工单状态：{wStateEmployee.value}</Text>
                    </View>
                    <View style={[style.commonStyle, {
                        flexDirection: 'column',
                        height: 150,
                        paddingVertical: 10,
                        justifyContent: 'flex-start',
                    }]}
                    >
                        <RadioGroup
                            selectedIndex={workOrderDetail.wstateemployee}
                            onSelect={(index, value) => this.onSelect(index, value)}
                        >
                            {
                                statusList.map((item, i) => (
                                    <RadioButton key={item.key} value={item.key}>
                                        <Text>{item.value}</Text>
                                    </RadioButton>
                                ))
                            }
                        </RadioGroup>
                    </View>
                    <View style={[
                        style.commonStyle,
                        {
                            flexDirection: 'row',
                            height: 60,
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingVertical: 10,
                        },
                    ]}
                    >
                        <Text>预计完成时间</Text>
                        <Text>{finishTime}</Text>
                        <Button title="选择时间" onPress={this.handleDatePicker} />
                    </View>
                    <View
                        style={[
                            style.commonStyle,
                            {
                                flexDirection: 'row',
                                height: 60,
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                            },
                        ]}
                    >
                        <Text style={{ flex: 0.2 }}>填写描述</Text>
                        <TextInput
                            underlineColorAndroid="transparent"
                            placeholder="输入内容"
                            placeholderTextColor="#cccccc"
                            style={{ flex: 0.8 }}
                            onChangeText={(text) => {
                                this.setState({ replyInfo: text });
                            }}
                        />
                    </View>
                </ScrollView>
            </ModalPage>
        );
    }
}

ModalWOScheduleUpdate.propTypes = {
    navigation: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    workOrderDetail: PropTypes.object.isRequired,
    userid: PropTypes.number.isRequired,
};
