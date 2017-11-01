import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, ActivityIndicator } from 'react-native';
import theme from '../theme';

const ListFooterLoading = ({ loading, loaded, visible }) => (
    <View
        style={[
            {
                height: 60,
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }, visible === false && { display: 'none' },
        ]}
    >
        {
            loading &&
            <View
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <ActivityIndicator
                    animating={loading}
                    style={{ paddingHorizontal: 5 }}
                    color={theme.theme}
                    size="small"
                />
                <Text>正在加载...</Text>
            </View>
        }
        {
            loaded && !loading &&
            <View
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <View
                    style={{
                        flex: -1,
                        height: 0.5,
                        width: 100,
                        backgroundColor: '#ccc',
                    }}
                />
                <View style={{ paddingHorizontal: 5 }}>
                    <Text style={{ fontSize: 11 }}>我是有底线的</Text>
                </View>
                <View
                    style={{
                        flex: -1,
                        height: 0.5,
                        width: 100,
                        backgroundColor: '#ccc',
                    }}
                />
            </View>
        }
    </View>
);

ListFooterLoading.propTypes = {
    loading: PropTypes.bool.isRequired,
    loaded: PropTypes.bool.isRequired,
    visible: PropTypes.bool,
};

export default ListFooterLoading;
