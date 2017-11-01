import { ToastAndroid } from 'react-native';
import ACTIONS from '../actions';

const initialState = {
    woTypeItems: [],
    woKindItems: [],
    woProductItems: [],
};

export default function (state = initialState, action) {
    const { payload, type } = action;
    switch (type) {
        case ACTIONS.WO_TYPE.SUCCESS:
        case ACTIONS.WO_KIND.SUCCESS:
        case ACTIONS.WO_PRODUCT.SUCCESS:
            return { ...state, ...payload };
        case ACTIONS.WO_TYPE.FAILURE:
        case ACTIONS.WO_KIND.FAILURE:
        case ACTIONS.WO_PRODUCT.FAILURE:
            ToastAndroid.show(payload.message, 3000);
            return state;
        default:
            return state;
    }
}
