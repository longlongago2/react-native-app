import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TabBarBadgeWithIcon from '../../components/BadgeIcon';

const TabBarBadge = ({ icon, tintColor, display, unreadSum }) => (
    <TabBarBadgeWithIcon
        component="icon"
        icon={icon}
        badge={unreadSum}
        tintColor={tintColor}
        display={display}
        badgeStyle={{
            top: -2,
            right: -5,
        }}
    />
);
TabBarBadge.propTypes = {
    icon: PropTypes.object.isRequired,
    tintColor: PropTypes.string,
    display: PropTypes.oneOf(['dot', 'number']).isRequired,
    unreadSum: PropTypes.number,
};

const mapStateToProps = state => ({
    unreadSum: state.iMStorage.unreadSum,
});
export default connect(mapStateToProps)(TabBarBadge);
