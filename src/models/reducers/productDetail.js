/** created by zhangqi on 2017-9-15 */
const initialState = {
    loading: false,        // 正在加载
    productDetail: {},      // 单条产品详情对象
};

export default function (state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        default:
            return state;
    }
}

