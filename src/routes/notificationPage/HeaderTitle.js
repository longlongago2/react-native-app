import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import HeaderTitleC from '../../components/HeaderTitle';

const HeaderTitle = ({ title, navigation, onPress, unread }) => (
    <HeaderTitleC
        title={`${title} (${unread})`}
        navigation={navigation}
        onPress={onPress}
    />
);

HeaderTitle.propTypes = {
    title: PropTypes.string.isRequired,
    navigation: PropTypes.object.isRequired,
    onPress: PropTypes.func.isRequired,
    unread: PropTypes.number.isRequired,
};
const mapStateToProps = state => ({
    unread: state.notification.unread,
});
export default connect(mapStateToProps)(HeaderTitle);
