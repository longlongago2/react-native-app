/** created by zhangqi on 2017-10-26 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Text,
} from 'react-native';
import ItemSeparator from '../../components/ItemSeparator';

const progressList = [
    { id: 1, name: '未处理' },
    { id: 2, name: '已评审' },
    { id: 3, name: '已处理' },
    { id: 4, name: '已解决' },
    { id: 5, name: '已关闭' },
];

class OperatingProgress extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            operationIndex: 1,
        };
        this.handleOperationProgress = this._handleOperationProgress.bind(this);
    }

    componentDidMount() {
        this.handleOperationProgress();
    }

    _handleOperationProgress() {
        const { item } = this.props;
        const { wsstatus, wstateemployee } = item;
        if (wsstatus === 0 && wstateemployee === 0) { // 未评审 && 未处理
            this.setState({
                operationIndex: 1,
            });
        }
        if (wsstatus === 1 && wstateemployee === 0) { // 已评审 && 未处理
            this.setState({
                operationIndex: 2,
            });
        }
        if (wsstatus === 1 && wstateemployee === 1) { // 已评审 && 已处理
            this.setState({
                operationIndex: 3,
            });
        }
        if (wsstatus === 1 && wstateemployee === 2) { // 已评审 && 已解决
            this.setState({
                operationIndex: 4,
            });
        }
        if (wsstatus === 1 && wstateemployee === 3) { // 已评审 && 用户关闭
            this.setState({
                operationIndex: 5,
            });
        }
    }
    render() {
        const { operationIndex } = this.state;
        return (
            <View style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
            }}
            >
                {
                    progressList.map((_item, i) => (
                        <View
                            key={_item.id}
                            style={{
                                flexDirection: 'row',
                            }}
                        >
                            <View
                                style={[
                                    {
                                        flex: -1,
                                        width: 30,
                                        height: 30,
                                        borderRadius: 22,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    },
                                    i < operationIndex ? { backgroundColor: '#79B23D' } : { backgroundColor: 'rgba(139,139,139,0.5)' },
                                ]}
                            >
                                <Text style={{ color: '#ffffff', fontSize: 8 }}>{_item.name}</Text>
                            </View>
                            {
                                i < (progressList.length - 1) &&
                                <View
                                    style={{
                                        flex: -1,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    {
                                        i < (operationIndex - 1) ?
                                            <ItemSeparator
                                                backgroundColor="rgba(121,178,61,1.0)"
                                                border={0.8}
                                                lineColor="rgba(139,139,139,0.5)"
                                                marginHorizontal={20}
                                            /> :
                                            <ItemSeparator
                                                backgroundColor="rgba(0,0,0,0.4)"
                                                border={0.8}
                                                lineColor="rgba(139,139,139,0.5)"
                                                marginHorizontal={20}
                                            />
                                    }
                                </View>
                            }
                        </View>
                    ))
                }
            </View>
        );
    }
}

OperatingProgress.propTypes = {
    item: PropTypes.object.isRequired,
};

export default OperatingProgress;
