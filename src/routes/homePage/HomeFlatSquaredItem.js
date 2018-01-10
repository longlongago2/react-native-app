/**
 * Created by zhangqi on 2017/08/07.
 */
import React from 'react';
import PropTypes from 'prop-types';
import FlatSquaredItem from '../../components/FlatSquaredItem';

const HomeFlatSquaredItem = ({ dispatch, item, width }) => {
    function handlePress(value) {
        if (value.redirect) {
            dispatch({
                type: 'Navigation/NAVIGATE',
                routeName: value.redirect.routeName,
                params: value.redirect.params,
            });
        }
    }

    return (
        <FlatSquaredItem item={item} onPress={handlePress} width={width} />
    );
};
HomeFlatSquaredItem.propTypes = {
    dispatch: PropTypes.func,
    item: PropTypes.object.isRequired,
    width: PropTypes.number.isRequired,
};

export default HomeFlatSquaredItem;
