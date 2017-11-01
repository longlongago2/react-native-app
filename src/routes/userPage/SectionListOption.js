import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SectionLineItemWithIcon from '../../components/SectionLineItemWithIcon';

const SectionListOption = ({ item, dispatch }) => {
    function handleItemPress(value) {
        if (value.redirect) {
            dispatch({
                type: 'Navigation/NAVIGATE',
                routeName: value.redirect.routeName,
                params: null,
            });
        } else {
            alert('暂未开发');
        }
    }

    return (
        <SectionLineItemWithIcon item={item} onItemPress={value => handleItemPress(value)} />
    );
};
SectionListOption.propTypes = {
    item: PropTypes.object.isRequired,
    dispatch: PropTypes.func,
};
export default connect()(SectionListOption);
