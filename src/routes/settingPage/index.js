import React from 'react';
import PropTypes from 'prop-types';
import { View, SectionList } from 'react-native';
import { connect } from 'react-redux';
import Loading from '../../components/Loading';
import SettingListOption from './SettingListOption';
import ItemSeparator from '../../components/ItemSeparator';
import { fetchSettingOptions } from '../../services/menuOptions';

const SettingPage = ({ user, dispatch }) => {
    const { loading, online } = user;

    const sectionListProps = {
        style: { marginVertical: 10 },
        sections: fetchSettingOptions(online),
        renderItem({ item }) {
            return <SettingListOption item={item} dispatch={dispatch} />;
        },
        SectionSeparatorComponent() {
            return <View style={{ height: 10 }} />;
        },
        ItemSeparatorComponent() {
            return (
                <ItemSeparator
                    backgroundColor="#ffffff"
                    border={1}
                    lineColor="rgba(139,139,139,0.3)"
                    marginHorizontal={15}
                />
            );
        },
    };

    return (
        <View style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'stretch',
        }}
        >
            <Loading loading={loading} />
            <SectionList {...sectionListProps} />
        </View>
    );
};
SettingPage.propTypes = {
    user: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
};
const mapStateToProps = state => ({
    user: state.user,
});

export default connect(mapStateToProps)(SettingPage);
