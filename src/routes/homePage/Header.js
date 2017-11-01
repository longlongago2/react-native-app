import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text, StatusBar, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

class Header extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <View
                style={{
                    position: 'absolute',
                    top: StatusBar.currentHeight + 10,
                    left: '50%',
                    marginLeft: -125,
                    flex: -1,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 250,
                    height: 30,
                    borderRadius: 15,
                    borderWidth: 0.5,
                    borderColor: '#ffffff',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                }}
            >
                <TouchableOpacity onPress={() => alert('搜索')}>
                    <View
                        style={{
                            flex: -1,
                            width: 250,
                            height: '100%',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Icon name="search" size={20} color="#ffffff" style={{ position: 'absolute', left: 10 }} />
                        <Text style={{ color: '#fff', fontSize: 13 }}>
                            搜索
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

Header.propTypes = {
    dispatch: PropTypes.func.isRequired,
};
export default connect()(Header);
