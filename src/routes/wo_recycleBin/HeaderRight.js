import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Text } from 'react-native';
import HeaderTool from '../../components/HeaderTool';
import theme from '../../theme';


const HeaderRight = ({ navigation, workorderList }) => {
    function handlePress() {
        const { state, setParams } = navigation;
        if (state.params && state.params.checkBoxVisible) {
            setParams({
                checkBoxVisible: false,
                checkedList: [],
                allChecked: false,
            });
        } else {
            setParams({ checkBoxVisible: true });
        }
    }

    if (Array.isArray(workorderList) && workorderList.length > 0) {
        return (
            <HeaderTool onPress={handlePress}>
                <Text style={{ color: theme.header.foregroundColor }}>
                    {
                        navigation.state.params && navigation.state.params.checkBoxVisible ?
                            '完成' : '编辑'
                    }
                </Text>
            </HeaderTool>
        );
    }
    return null;
};

HeaderRight.propTypes = {
    navigation: PropTypes.object.isRequired,
    workorderList: PropTypes.array.isRequired,
};
const mapStateToProps = state => ({
    workorderList: state.workorder.woRecycleBin.workorderList,
});
export default connect(mapStateToProps)(HeaderRight);
