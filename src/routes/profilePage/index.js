import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, ScrollView, SectionList } from 'react-native';
import ItemSeparator from '../../components/ItemSeparator';
import ProfileOption from './ProfileOption';

const UserInfoPage = ({ userInfo }) => {
    const sections = [
        {
            data: [
                { title: '用户头像', image: userInfo.avatar, show: 'image', key: 'avatar', redirect: { routeName: 'AvatarPreview' } },
            ],
            key: 'user-info-group-1',
        },
        {
            data: [
                { title: '用户名', text: userInfo.username, show: 'text', key: 'username', redirect: false },
                { title: '个性签名', text: userInfo.description, show: 'text', key: 'description', redirect: { routeName: 'UpdateProfileOptions' } },
            ],
            key: 'user-info-group-2',
        },
        {
            data: [
                { title: '真实姓名', text: userInfo.personname, show: 'text', key: 'personname', redirect: { routeName: 'UpdateProfileOptions' } },
                { title: '部门', text: userInfo.groupname, show: 'text', key: 'groupname', redirect: false },
                { title: '手机', text: userInfo.mobile, show: 'text', key: 'mobile', redirect: { routeName: 'UpdateProfileOptions' } },
                { title: '电话', text: userInfo.telephone, show: 'text', key: 'telephone', redirect: { routeName: 'UpdateProfileOptions' } },
                { title: '邮箱', text: userInfo.email, show: 'text', key: 'email', redirect: false },
            ],
            key: 'user-info-group-3',
        },
    ];
    return (
        <ScrollView>
            <View>
                <SectionList
                    sections={sections}
                    renderItem={({ item }) => <ProfileOption item={item} />}
                    SectionSeparatorComponent={() => <View style={{ height: 10 }} />}
                    ItemSeparatorComponent={() => (
                        <ItemSeparator
                            backgroundColor="rgb(255,255,255)"
                            border={1}
                            lineColor="rgba(139,139,139,0.2)"
                            marginHorizontal={15}
                        />
                    )}
                />
            </View>
        </ScrollView>
    );
};
UserInfoPage.propTypes = {
    userInfo: PropTypes.object.isRequired,
};
const mapStateToProps = state => ({
    userInfo: state.user.userInfo,
});
export default connect(mapStateToProps)(UserInfoPage);
