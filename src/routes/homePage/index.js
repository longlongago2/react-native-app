import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, StatusBar, StyleSheet, ScrollView, FlatList, Dimensions } from 'react-native';
import CarouselImage from './SlideImages';
import HomeFlatSquaredItem from './HomeFlatSquaredItem';
import NoticeBoard from './NoticeBoard';
import Loading from '../../components/Loading';
import { fetchHomeOptions } from '../../services/menuOptions';
import styleModule from './indexStyle';
import theme from '../../theme';

const styles = StyleSheet.create(styleModule);

class Home extends PureComponent {
    constructor(props) {
        super(props);
        const { width } = Dimensions.get('window');
        this.state = {
            screenWidth: width,
            numColumns: 4,
        };
        this.handleLayoutChange = this._handleLayoutChange.bind(this);
    }

    _handleLayoutChange(e) {
        const { width } = e.nativeEvent.layout;
        this.setState({ screenWidth: width });
    }

    render() {
        const { dispatch, noticeList, noticeListLoading, online, loading } = this.props;
        const { screenWidth, numColumns } = this.state;
        const images = [
            'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1508819472188&di=bdebb8c243a13049a7a1df95c1cca35e&imgtype=0&src=http%3A%2F%2Fimg2.niutuku.com%2Fdesk%2F130220%2F37%2F37-niutuku.com-927.jpg',
            'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1508820299148&di=b6b396c534c7a29fcb6a82ee5c136577&imgtype=0&src=http%3A%2F%2Ft1.niutuku.com%2F960%2F42%2F42-207375.jpg',
            'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1508819737473&di=831d8a2eee59b1a71a2000df3392a3d4&imgtype=0&src=http%3A%2F%2Fdl.bizhi.sogou.com%2Fimages%2F2013%2F09%2F12%2F384461.jpg',
        ];
        return (
            <View style={{ flex: 1 }}>
                <StatusBar
                    translucent={false}
                    backgroundColor={theme.statusBarColor}
                />
                <Loading loading={loading} />
                <ScrollView>
                    <View style={styles.container}>
                        <CarouselImage images={images} />
                        <View onLayout={this.handleLayoutChange}>
                            <FlatList
                                horizontal={false}
                                columnWrapperStyle={{ height: 100, paddingVertical: 5, backgroundColor: '#fff' }}
                                numColumns={numColumns}
                                data={fetchHomeOptions()}
                                renderItem={({ item }) => (
                                    <HomeFlatSquaredItem
                                        item={item}
                                        dispatch={dispatch}
                                        width={screenWidth / numColumns}
                                    />
                                )}
                            />
                        </View>
                        {
                            online &&
                            <NoticeBoard
                                loading={noticeListLoading}
                                noticeList={noticeList}
                                dispatch={dispatch}
                            />
                        }
                    </View>
                </ScrollView>
            </View>
        );
    }
}

Home.propTypes = {
    dispatch: PropTypes.func.isRequired,
    noticeList: PropTypes.array.isRequired,
    noticeListLoading: PropTypes.bool.isRequired,
    online: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
};
const mapStateToProps = state => ({
    noticeList: state.notice.noticeList,       // 公告栏数据
    noticeListLoading: state.notice.loading,   // 公告栏loading
    online: state.user.online,                 // 登陆状态
    loading: state.user.loading,               // 正在登陆loading
});

export default connect(mapStateToProps)(Home);
