import ACTIONS from '../actions';

const initialState = {
    pageNumber: 0,
    pageLoading: false,
    trackingWOList: [],
    loading: false,
    loaded: false,
};

export default function (state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case ACTIONS.TRACKINGWORKORDER.LOADING:
            return {
                ...state,
                loading: true,
            };
        case ACTIONS.TRACKINGWORKORDER.SUCCESS:
            return {
                ...state,
                ...payload,
                loading: false,
            };
        case ACTIONS.TRACKINGWORKORDER.FAILURE:
            return {
                ...state,
                loading: false,
            };
        default:
            return state;
    }
}
