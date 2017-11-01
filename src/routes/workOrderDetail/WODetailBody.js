/** created by zhangqi on 2017-9-7 */
import React from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Text,
    FlatList,
} from 'react-native';
import ItemSeparator from '../../components/ItemSeparator';
import WODetailImageList from './WODetailImageList';
import Hyperlink from '../../components/Hyperlink';

const WODetailBody = ({ workOrderDetail, dispatch }) => {
    function handleStatus(status) {
        switch (status) {
            case 0:
                return '草稿箱';
            case 1:
                return '未处理';
            case 2:
                return '处理中';
            case 3:
                return '处理完';
            case 4:
                return '已关闭';
            default:
                return '未识别编码';
        }
    }

    function handleServerTime(serverTime) {
        switch (serverTime) {
            case '1':
                return '当天';
            case '2':
                return '3日内';
            case '3':
                return '1周内';
            case '4':
                return '一周以后';
            default:
                return '未识别编码';
        }
    }

    function filterHtmlTag(domStr) {
        if (domStr) {
            return domStr
                .replace(/<br>|<\/br>|<br\/>|<\/p>/gi, '\n')
                .replace(/&nbsp;/gi, ' ')
                .replace(/<([^>]*)>/g, '');
        }
        return null;
    }

    function imgHtmlTip(domStr) {
        const regexp = new RegExp('<(img|a)\\s.*?>', 'gi'); // 全文匹配(g)不区分大小写(i)
        if (regexp.test(domStr)) {
            return '文本包含未能显示的网页内容，点击查看';
        }
        return null;
    }

    const itemList = [
        {
            key: 1,
            title: '工单标题',
            text: workOrderDetail.title,
        },
        {
            key: 2,
            title: '工单编号',
            text: workOrderDetail.ordercode,
        },
        {
            key: 3,
            title: '产品名称',
            text: workOrderDetail.productname,
        },
        {
            key: 4,
            title: '工单类型',
            text: workOrderDetail.wstypename,
        },
        {
            key: 5,
            title: '服务种类',
            text: workOrderDetail.wskindname,
        },
        {
            key: 6,
            title: '期望时间',
            text: handleServerTime(workOrderDetail.servertime),
        },
        {
            key: 7,
            title: '工单状态',
            text: handleStatus(workOrderDetail.wstateclient),
        },
        {
            key: 8,
            title: '预计时间',
            text: workOrderDetail.finishtime,
        },
        {
            key: 9,
            title: '问题描述',
            text: filterHtmlTag(workOrderDetail.orderbody),
            link: imgHtmlTip(workOrderDetail.orderbody),
        },
        {
            key: 10,
            title: '终端',
            text: workOrderDetail.terminal,
        },
        {
            key: 11,
            title: '设备型号',
            text: workOrderDetail.device,
        },
        {
            key: 12,
            title: '创建时间',
            text: workOrderDetail.createtime,
        },
        {
            key: 13,
            title: '整体评分',
            text: workOrderDetail.wholescore,
        },
        {
            key: 14,
            title: '完成情况',
            text: workOrderDetail.finishscore,
        },
        {
            key: 15,
            title: '处理速度',
            text: workOrderDetail.speedscore,
        },
        {
            key: 16,
            title: '工单评价',
            text: workOrderDetail.appraise,
        },
    ];
    return (
        <View>
            <View style={{ marginTop: 20 }}>
                <ItemSeparator
                    backgroundColor="rgba(255,255,255,0.5)"
                    border={0.8}
                    lineColor="rgba(139,139,139,0.3)"
                    marginHorizontal={0}
                />
            </View>
            <View style={{ marginTop: 15 }}>
                <FlatList
                    data={itemList}
                    renderItem={({ item }) => (
                        item.text ?
                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    justifyContent: 'flex-start',
                                    alignItems: 'flex-start',
                                }}
                            >
                                <Text style={{ flex: 0.25 }}>{item.title}</Text>
                                <Text style={{ flex: 0.75 }}>
                                    <Text>
                                        {item.text}
                                    </Text>
                                    {
                                        item.link &&
                                        <Hyperlink
                                            route={{
                                                routeName: 'WebView',
                                                params: {
                                                    title: '跳转中...',
                                                    canShare: false,
                                                    source: {
                                                        html: workOrderDetail.orderbody,
                                                    },
                                                },
                                            }}
                                            dispatch={dispatch}
                                            text={item.link}
                                        />
                                    }
                                </Text>
                            </View> : null
                    )}
                />
                <WODetailImageList workOrderDetail={workOrderDetail} dispatch={dispatch} />
            </View>
        </View>
    );
};

WODetailBody.propTypes = {
    dispatch: PropTypes.func.isRequired,
    workOrderDetail: PropTypes.object.isRequired,
};

export default WODetailBody;
