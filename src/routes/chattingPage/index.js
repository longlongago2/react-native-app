import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text } from 'react-native';
import uuid from 'uuid/v4';

class ChattingPage extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { userId } = this.props.navigation.state.params;
        const { chatList } = this.props;
        let log = [];
        if (Array.isArray(chatList) && chatList.length > 0) {
            chatList.forEach((item) => {
                if (item.userId === userId) {
                    log = item.log;
                    return false;
                }
                return true;
            });
        }
        return (
            <View>
                {
                    Array.isArray(log) && log.length > 0 ?
                        log.map(item => (
                            <View key={uuid()}>
                                <Text>
                                    {item.context}
                                </Text>
                            </View>
                        )) : null
                }
            </View>
        );
    }
}

ChattingPage.propTypes = {
    navigation: PropTypes.object.isRequired,
    chatList: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
    chatList: state.instantMessaging.chatList,
});

export default connect(mapStateToProps)(ChattingPage);

