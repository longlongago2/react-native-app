import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image } from 'react-native';

const ListEmptyComponent = ({ text, icon, customStyle }) => (
    <View
        style={[{
            height: 400,
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'stretch',
        }, customStyle]}
    >
        <View>
            <Image
                source={icon}
                style={{ width: 60, height: 60 }}
            />
        </View>
        <View>
            <Text
                style={{
                    fontSize: 12,
                    textAlign: 'center',
                    lineHeight: 25,
                    color: '#8B8B8B',
                }}
            >
                {text}
            </Text>
        </View>
    </View>
);

ListEmptyComponent.propTypes = {
    text: PropTypes.string.isRequired,
    icon: PropTypes.number.isRequired,
    customStyle: PropTypes.object,
};

export default ListEmptyComponent;
