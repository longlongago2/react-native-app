import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Text, ViewPagerAndroid, StyleSheet } from 'react-native';
import uuid from 'uuid/v4';
import theme from '../theme';

const styleModule = {
    container: {
        flex: -1,
        width: '100%',
        borderTopWidth: 0.5,
        borderTopColor: '#cccccc',
        paddingBottom: 20,
    },
    eachPanel: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    indicatorLayout: {
        position: 'absolute',
        bottom: 0,
        left: '50%',
        flex: -1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 15 * (2 + 1),
        height: 20,
        marginLeft: -(15 * (2 + 1)) / 2,
    },
    indicator: {
        marginHorizontal: 4.5,
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    indicatorTitle: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingLeft: 5,
        borderLeftWidth: 2,
        borderLeftColor: theme.theme,
        marginVertical: 5,
    },
};
const styles = StyleSheet.create(styleModule);

export default class ScrollPagerAndroid extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            pageNumber: 0,
        };
        this.handlePageSelected = this._handlePageSelected.bind(this);
    }

    _handlePageSelected(e) {
        const { position } = e.nativeEvent;
        this.setState({ pageNumber: position });
    }

    render() {
        const { boardHeight, items } = this.props;
        const { pageNumber } = this.state;
        return (
            <View style={[styles.container, { height: boardHeight }]}>
                <ViewPagerAndroid
                    style={{ flex: 1 }}
                    initialPage={0}
                    peekEnabled
                    onPageSelected={this.handlePageSelected}
                >
                    {
                        Array.isArray(items) && items.length > 0 && items.map(item => (
                            <View style={styles.eachPanel} key={item.key}>
                                {
                                    item.title &&
                                    <View style={styles.indicatorTitle}>
                                        <Text style={{ fontSize: 9 }}>{item.title}</Text>
                                    </View>
                                }
                                <View>
                                    {item.component}
                                </View>
                            </View>
                        ))
                    }
                </ViewPagerAndroid>
                <View style={styles.indicatorLayout}>
                    {
                        Array.isArray(items) && items.length > 0 && items.map((item, i) => (
                            <View
                                key={uuid()}
                                style={[
                                    styles.indicator,
                                    {
                                        backgroundColor: pageNumber === i ?
                                            'rgb(60, 63, 65)' :
                                            'rgba(60, 63, 65,0.5)',
                                    },
                                ]}
                            />
                        ))
                    }
                </View>
            </View>
        );
    }
}
ScrollPagerAndroid.propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string,
        component: PropTypes.element.isRequired,
    })).isRequired,
    boardHeight: PropTypes.number.isRequired,
};
