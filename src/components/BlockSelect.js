import React, { PureComponent } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import uuid from 'uuid/v4';
import styleModule from './BlockSelectStyle';

const styles = StyleSheet.create(styleModule);

export default class BlockSelect extends PureComponent {
    constructor(props) {
        super(props);
        this.handleFilter = this._handleFilter.bind(this);
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.timerFilter);
    }

    _handleFilter(value) {
        const { navigation, fieldName } = this.props;
        const { setParams, state } = navigation;
        this.timerFilter = requestAnimationFrame(() => {
            const filter = (state.params && state.params.filter) || {};
            filter[fieldName] = value;
            setParams({ filter });  // 设置筛选字段数值，筛选字段全部放在 filter 里
        });
    }

    render() {
        const { navigation, filterOptions, itemMap, fieldName } = this.props;
        return (
            <View style={styles.contentOptionLayout}>
                {
                    filterOptions.map(item => (
                        <TouchableOpacity
                            key={uuid()}
                            activeOpacity={0.5}
                            onPress={() => this.handleFilter(item[itemMap.itemCode])}
                        >
                            <View
                                style={[
                                    styles.contentOption,
                                    navigation.state.params &&
                                    navigation.state.params.filter &&
                                    (navigation.state.params.filter)[fieldName] ===
                                    item[itemMap.itemCode] && { backgroundColor: '#71C671' },
                                ]}
                            >
                                <Text
                                    numberOfLines={2}
                                    style={{ color: '#fff' }}
                                >
                                    {item[itemMap.itemText]}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))
                }
            </View>
        );
    }
}

BlockSelect.propTypes = {
    navigation: PropTypes.object.isRequired,
    filterOptions: PropTypes.array.isRequired,
    itemMap: PropTypes.shape({
        itemCode: PropTypes.string.isRequired,  // 选项代码
        itemText: PropTypes.string.isRequired,  // 选项文字
    }).isRequired,
    fieldName: PropTypes.string.isRequired,     // 筛选字段名称
};
