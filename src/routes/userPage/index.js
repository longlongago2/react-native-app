import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StyleSheet, View, SectionList, ScrollView } from 'react-native';
import userStyle from './indexStyle';
import Loading from '../../components/Loading';
import Banner from './Banner';
import ItemSeparator from '../../components/ItemSeparator';
import SectionListOption from './SectionListOption';
import { fetchUserOptions } from '../../services/menuOptions';


const styles = StyleSheet.create(userStyle);

const User = ({ dispatch, user }) => {
    function redirect(routeName) {
        dispatch({
            type: 'Navigation/NAVIGATE',
            routeName,
            params: null,
        });
    }

    const { userInfo, online, loading } = user;

    const bannerProps = {
        userInfo,
        online,
        onPress(routeName) {
            redirect(routeName);
        },
    };

    const sectionListProps = {
        style: { marginVertical: 10 },
        sections: fetchUserOptions(),
        renderItem({ item }) {
            return <SectionListOption item={item} />;
        },
        SectionSeparatorComponent() {
            return <View style={{ height: 10 }} />;
        },
        ItemSeparatorComponent() {
            return (
                <ItemSeparator
                    backgroundColor="#ffffff"
                    border={0.5}
                    lineColor="rgba(139,139,139,0.3)"
                    marginHorizontal={15}
                />
            );
        },
    };

    return (
        <View style={{ flex: 1 }}>
            <Loading loading={loading} />
            <ScrollView style={styles.container}>
                <Banner {...bannerProps} />
                <SectionList {...sectionListProps} />
            </ScrollView>
        </View>
    );
};

User.propTypes = {
    dispatch: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    user: state.user,
});

export default connect(mapStateToProps)(User);
