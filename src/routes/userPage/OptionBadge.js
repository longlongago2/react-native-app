import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';

const OptionBadge = ({ unread, customStyle }) => {
    if (!unread || unread === 0) return null;
    return (
        <View
            style={
                customStyle && customStyle.container ? customStyle.container :
                    {
                        flex: -1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'red',
                        width: 16,
                        height: 16,
                        borderRadius: 8,
                        left: 10,
                    }
            }
        >
            <Text
                style={
                    customStyle && customStyle.text ? customStyle.text :
                        {
                            fontSize: 8,
                            color: '#fff',
                        }
                }
            >{unread > 100 ? '99+' : unread}</Text>
        </View>
    );
};
OptionBadge.propTypes = {
    unread: PropTypes.number.isRequired,
    customStyle: PropTypes.shape({
        container: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.object),
            PropTypes.object,
        ]),
        text: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.object),
            PropTypes.object,
        ]),
    }),
};
const mapStateToProps = state => ({
    unread: state.notification.unread,
});
export default connect(mapStateToProps)(OptionBadge);
