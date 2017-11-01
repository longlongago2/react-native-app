/**
 * @description 即时通讯：聊天
 * @author 张广龙
 */
import createActionTypes from '../../utils/actionSpirit';

export const CHAT_LIST = createActionTypes('chat_list');        // 消息列表
export const ADDRESS_LIST = createActionTypes('address_list');  // 通讯录列表
export const SYS_LIST = createActionTypes('sys_list');          // 系统通知列表
