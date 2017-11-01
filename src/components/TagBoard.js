import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import theme from '../theme';

const TagBoard = ({ title, children, onRefresh, loading }) => (
    <View
        style={{
            backgroundColor: '#fff',
            marginVertical: 10,
            paddingHorizontal: 10,
            paddingBottom: 10,
            flex: -1,
            width: '100%',
            flexDirection: 'column',
        }}
    >
        <View
            style={{
                flex: -1,
                width: '100%',
                height: 45,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 10,
                borderBottomWidth: 0.5,
                borderBottomColor: '#DEDEDE',
            }}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View
                    style={{
                        width: 3,
                        height: 14,
                        backgroundColor: theme.theme,
                        borderRadius: 2,
                        marginRight: 5,
                    }}
                />
                <Text style={{ fontSize: 13, color: '#575757' }}>{title}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 5 }}>
                <ActivityIndicator animating={loading} size={20} color={theme.theme} />
                {
                    onRefresh && !loading &&
                    <TouchableOpacity onPress={onRefresh}>
                        <Icon name="md-refresh" size={20} color={theme.theme} />
                    </TouchableOpacity>
                }
            </View>
        </View>
        {
            Array.isArray(children) && children.length > 0 ?
                children.map(item => item) : children
        }
    </View>
);
TagBoard.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array,
    ]).isRequired,
    onRefresh: PropTypes.func,
    loading: PropTypes.bool,
};

export default TagBoard;
