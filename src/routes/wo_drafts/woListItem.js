import React from 'react';
import PropTypes from 'prop-types';
import OrderListItem from '../../components/FlatOrderListItem';

const WorkorderListItem = ({ item, index, dispatch, navigation, onBackRequest }) => {
    function handlePress(value) {
        dispatch({
            type: 'Navigation/NAVIGATE',
            routeName: 'WorkOrderDetail',
            params: { obj: value, workOrderType: navigation.state.params.workOrderType },
        });
    }

    function handleTextTranslate(status) {
        switch (status) {
            case 0:
                return '草稿箱';
            default:
                return '未识别编码';
        }
    }

    function handleTextColor(status) {
        switch (status) {
            case 0:
                return '#8F8F8F';
            default:
                return '#000000';
        }
    }

    return (
        <OrderListItem
            item={item}
            index={index}
            onPress={value => handlePress(value)}
            itemMap={{
                status: 'wstateclient',
                modification: {
                    text: handleTextTranslate,
                    color: handleTextColor,
                },
            }}
            navigation={navigation}
            checkBoxEnabled
            onBackRequest={checkedList => onBackRequest(checkedList)}
        />
    );
};
WorkorderListItem.propTypes = {
    item: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    dispatch: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
    onBackRequest: PropTypes.func.isRequired,
};

export default WorkorderListItem;
