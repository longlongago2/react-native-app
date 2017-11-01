/** created by zhangqi on 2017-9-7 */
import React from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Text,
    FlatList,
} from 'react-native';
import Hyperlink from '../../components/Hyperlink';
import hanZiLetter from '../../utils/hanZiLetter';
import englishLetter from '../../utils/englishLetter';
import TagBoard from '../../components/TagBoard';
import theme, { rgba } from '../../theme';

const WorkOrderReply = ({ workOrderReply, dispatch }) => {
    function handleRandomColor(text) {
        // 根据字母生成颜色
        const arrLetter = hanZiLetter(text)[0].split('');
        const r = arrLetter[0] ? englishLetter(arrLetter[0]) * 5 : 0;
        const g = arrLetter[1] ? englishLetter(arrLetter[1]) * 8 : 0;
        const b = arrLetter[2] ? englishLetter(arrLetter[2]) * 10 : 0;
        return `rgb(${r},${g},${b})`;
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
            return '文本包含网页内容，点击查看';
        }
        return '';
    }

    return (
        <TagBoard title="操作记录" loading={false}>
            <FlatList
                data={workOrderReply}
                keyExtractor={(item, index) => item.replycode}
                renderItem={({ item, index }) => (
                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                        paddingHorizontal: 20,
                    }}
                    >
                        <View
                            style={{
                                width: 40,
                                minHeight: 30,
                                flex: -1,
                                flexDirection: 'column',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                            }}
                        >
                            <View
                                style={[
                                    {
                                        width: 30,
                                        height: 30,
                                        flex: -1,
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderRadius: 22,
                                        marginVertical: 10,
                                    },
                                    item.replerpersonname ?
                                        {
                                            backgroundColor:
                                                handleRandomColor(item.replerpersonname),
                                        } :
                                        {
                                            backgroundColor:
                                                handleRandomColor('无名氏'),
                                        },
                                ]}
                            >
                                <Text style={{ color: '#ffffff', fontSize: 10 }}>
                                    {item.replerpersonname ? item.replerpersonname.slice(-2) : '无名'}
                                </Text>
                            </View>
                            {
                                index !== workOrderReply.length - 1 &&
                                <View
                                    style={{
                                        flex: 1,
                                        width: 1,
                                        flexDirection: 'row',
                                        alignItems: 'stretch',
                                        backgroundColor: '#cccccc',
                                    }}
                                />
                            }
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View
                                style={{
                                    flex: -1,
                                    flexDirection: 'row',
                                    justifyContent: 'flex-end',
                                    width: 15,
                                    paddingTop: 20,
                                }}
                            >
                                <View
                                    style={{
                                        height: 0,
                                        width: 0,
                                        borderBottomWidth: 10,
                                        borderBottomColor: rgba(theme.theme, 0.2),
                                        borderLeftWidth: 5,
                                        borderLeftColor: 'transparent',
                                        borderRightWidth: 5,
                                        borderRightColor: 'transparent',
                                        transform: [{ rotate: '-90deg' }],
                                    }}
                                />
                            </View>
                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'stretch',
                                    padding: 15,
                                    marginVertical: 10,
                                    borderRadius: 5,
                                    backgroundColor: rgba(theme.theme, 0.2),
                                }}
                            >
                                <View
                                    style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        justifyContent: 'flex-start',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Text style={{ fontSize: 12, color: '#00688B' }}>
                                        {item.replerpersonname ? item.replerpersonname : '无名氏'}
                                    </Text>
                                    <Text style={{ fontSize: 12, marginHorizontal: 5 }}>
                                        |
                                    </Text>
                                    <Text style={{ fontSize: 12 }}>
                                        {item.createtime}
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        width: '100%',
                                        flex: 1,
                                        flexDirection: 'column',
                                        alignItems: 'stretch',
                                        paddingVertical: 10,
                                    }}
                                >
                                    <View>
                                        {
                                            item.isinside.toString() === '1' &&
                                            <View
                                                style={{
                                                    flex: 1,
                                                    flexDirection: 'row',
                                                    justifyContent: 'flex-start',
                                                    alignItems: 'flex-start',
                                                    paddingVertical: 5,
                                                }}
                                            >
                                                <Text style={{ flex: -1, fontSize: 12, fontWeight: 'bold' }}>
                                                    操作：
                                                </Text>
                                                <Text style={{ flex: 1, fontSize: 12 }}>
                                                    {
                                                        filterHtmlTag(item.operation)
                                                    }
                                                </Text>
                                            </View>
                                        }
                                        <View
                                            style={{
                                                flex: 1,
                                                flexDirection: 'row',
                                                justifyContent: 'flex-start',
                                                alignItems: 'flex-start',
                                            }}
                                        >
                                            <Text style={{ flex: -1, fontSize: 12, fontWeight: 'bold' }}>
                                                {item.isinside.toString() === '1' ? '描述：' : '留言：'}
                                            </Text>
                                            <View
                                                style={{
                                                    flex: 1,
                                                    flexDirection: 'column',
                                                    justifyContent: 'flex-start',
                                                    alignItems: 'flex-start',
                                                }}
                                            >
                                                <Text style={{ fontSize: 12 }}>
                                                    {
                                                        filterHtmlTag(item.replyinfo)
                                                    }
                                                </Text>
                                                <Hyperlink
                                                    route={{
                                                        routeName: 'WebView',
                                                        params: {
                                                            title: '跳转中...',
                                                            canShare: false,
                                                            source: {
                                                                html: item.replyinfo,
                                                            },
                                                        },
                                                    }}
                                                    dispatch={dispatch}
                                                    text={imgHtmlTip(item.replyinfo)}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                )}
            />
        </TagBoard>
    );
};

WorkOrderReply.propTypes = {
    workOrderReply: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired,
};

export default WorkOrderReply;

