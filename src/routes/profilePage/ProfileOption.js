import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SectionLineItemWithTitle from '../../components/SectionLineItemWithTitle';

const ProfileOption = ({ item, dispatch }) => {
    function handleItemPress(value) {
        if (value.redirect) {
            dispatch({
                type: 'Navigation/NAVIGATE',
                routeName: value.redirect.routeName,
                params: {
                    item: value,
                },
            });
        }
    }

    return (
        <SectionLineItemWithTitle
            item={item}
            onItemPress={value => handleItemPress(value)}
        />
    );
};
ProfileOption.propTypes = {
    item: PropTypes.object.isRequired,
    dispatch: PropTypes.func,
};
export default connect()(ProfileOption);
