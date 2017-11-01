import React from 'react';
import PropTypes from 'prop-types';
import { Alert, ToastAndroid } from 'react-native';
import ACTIONS from '../../models/actions';
import SectionLineItemWithIcon from '../../components/SectionLineItemWithIcon';

const InstructionListOption = ({ item, dispatch }) => {
    function handItemPress() {
        if (item.redirect) {
            const { routeName } = item.redirect;
            dispatch({
                type: 'Navigation/NAVIGATE',
                routeName,
            });
        } else {
            const { key } = item;
            switch (key) {
                case 'upgrade':
                    alert('已经是最新版本');
                    break;
                default:
                    ToastAndroid.show('未处理的功能选项', 3000);
            }
        }
    }

    return (
        <SectionLineItemWithIcon item={item} onItemPress={handItemPress} />
    );
};
InstructionListOption.propTypes = {
    item: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
};
export default InstructionListOption;
