import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ToastAndroid, Alert } from 'react-native';
import { connect } from 'react-redux';
import deviceInfo from 'react-native-device-info';
import SectionLineItemWithIcon from '../../components/SectionLineItemWithIcon';
import ACTIONS from '../../models/actions';

class InstructionListOption extends PureComponent {
    constructor(props) {
        super(props);
        this.queryLatestVersion = this._queryLatestVersion.bind(this);
    }
    componentDidMount() {
        this.queryLatestVersion();
    }
    _queryLatestVersion() {
        const { dispatch } = this.props;
        dispatch({
            type: ACTIONS.APPVERSION.REQUEST,
        });
    }
    render() {
        const { item, dispatch, latestVersion, navigation } = this.props;
        const { setParams } = navigation;
        function handItemPress() {
            if (item.redirect) {
                const { routeName, params } = item.redirect;
                dispatch({
                    type: 'Navigation/NAVIGATE',
                    routeName,
                    params,
                });
            } else {
                const { key } = item;
                switch (key) {
                    case 'upgrade':
                        if (latestVersion && (deviceInfo.getVersion() !== latestVersion)) {
                            Alert.alert(
                                '询问',
                                '发现新版本，是否立即更新?',
                                [
                                    { text: '立即更新',
                                        onPress: () => {
                                            setParams({ allowUpdate: true });
                                            dispatch({
                                                type: ACTIONS.LATESTAPP_DOWNLOAD.LOADING,
                                                payload: {
                                                    loading: true,
                                                },
                                            });
                                        },
                                    },
                                    { text: '取消', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                                ],
                                { cancelable: false },
                            );
                        } else {
                            alert('已经是最新版本');
                        }
                        break;
                    default:
                        ToastAndroid.show('未处理的功能选项', 3000);
                }
            }
        }

        return (
            <SectionLineItemWithIcon item={item} onItemPress={handItemPress} />
        );
    }
}

InstructionListOption.propTypes = {
    item: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    latestVersion: PropTypes.string.isRequired,
    navigation: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    ...state.instruction,
});

export default connect(mapStateToProps)(InstructionListOption);
