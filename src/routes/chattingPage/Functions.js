import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, FlatList, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import FlatSquaredItem from '../../components/FlatSquaredItem';
import { fetchFunctionOptions } from '../../services/menuOptions';

const FunctionItem = ({ dispatch, item, width }) => {
    function handlePress(value) {
        alert(value.type);
    }

    return (
        <FlatSquaredItem item={item} onPress={handlePress} width={width} />
    );
};
FunctionItem.propTypes = {
    dispatch: PropTypes.func,
    item: PropTypes.object.isRequired,
    width: PropTypes.number.isRequired,
};

class Functions extends PureComponent {
    constructor(props) {
        super(props);
        const { width } = Dimensions.get('window');
        this.state = {
            screenWidth: width,
            numColumns: 4,
        };
        this.handleLayout = this._handleLayout.bind(this);
    }

    _handleLayout(e) {
        const { width } = e.nativeEvent.layout;
        this.setState({ screenWidth: width });
    }

    render() {
        const { dispatch } = this.props;
        const { numColumns, screenWidth } = this.state;
        return (
            <View style={{ paddingTop: 20 }} onLayout={this.handleLayout}>
                <FlatList
                    columnWrapperStyle={{
                        height: 100,
                        paddingVertical: 5,
                    }}
                    horizontal={false}
                    numColumns={numColumns}
                    data={fetchFunctionOptions()}
                    renderItem={({ item }) => (
                        <FunctionItem
                            item={item}
                            dispatch={dispatch}
                            width={screenWidth / numColumns}
                        />
                    )}
                />
            </View>
        );
    }
}

Functions.propTypes = {
    dispatch: PropTypes.func.isRequired,
};
export default connect()(Functions);
