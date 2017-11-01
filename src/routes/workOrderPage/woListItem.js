import React from 'react';
import PropTypes from 'prop-types';
import OrderListItem from '../../components/FlatOrderListItem';

const WorkorderListItem = ({ item, index, dispatch, navigation }) => {
    function handlePress(value) {
        dispatch({
            type: 'Navigation/NAVIGATE',
            routeName: 'WorkOrderDetail',
            params: { obj: value, workOrderType: 'WOGroup' },
        });
    }

    function handleTextTranslate(status) {
        switch (status) {
            case 1:
                return '未处理';
            case 2:
                return '处理中';
            case 3:
                return '处理完';
            case 4:
                return '已关闭';
            default:
                return '未识别编码';
        }
    }

    function handleTextColor(status) {
        switch (status) {
            case 1:
                return '#FF4040';
            case 2:
                return '#FF7F24';
            case 3:
                return '#008B00';
            case 4:
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
        />
    );
};
WorkorderListItem.propTypes = {
    item: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    dispatch: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
};

export default WorkorderListItem;
