import React, { PureComponent } from 'react';
import { View, TextInput } from 'react-native';
import PropTypes from 'prop-types';
import theme from '../../theme';


export default class UpdateProfileOptions extends PureComponent {
    constructor(props) {
        super(props);
        const { state } = this.props.navigation;
        this.state = {
            text: state.params.item.text,
        };
    }

    render() {
        const { setParams, state } = this.props.navigation;
        return (
            <View style={{ padding: 5 }}>
                <TextInput
                    style={{ paddingHorizontal: 10 }}
                    onChangeText={(text) => {
                        this.setState({ text });
                        setParams({ item: { ...state.params.item, text } });
                    }}
                    value={this.state.text}
                    autoFocus
                    selectionColor={theme.theme}
                    underlineColorAndroid={theme.theme}
                />
            </View>
        );
    }
}

UpdateProfileOptions.propTypes = {
    navigation: PropTypes.object.isRequired,
};

