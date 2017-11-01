import { NavigationActions } from 'react-navigation';
import AppNavigator, { BottomNavigator } from '../../routes/AppNavigator';
import ACTIONS from '../actions';

const firstAction = BottomNavigator.router.getActionForPathAndParams('home');
const initialState = AppNavigator.router.getStateForAction(firstAction);

const navReducer = (state = initialState, action) => {
    let nextState;
    switch (action.type) {
        case ACTIONS.USER_LOGIN.SUCCESS:
            const { index, routes } = state;
            const currentRoute = routes[index].routeName;
            // 判断：如果当前处在 Login 登录页面，则按照之前的操作路径重置，重置是为了重新加载页面数据
            if (currentRoute === 'Login') {
                const nextRoutes = routes.concat();
                nextRoutes.pop(); // 继承之前的路径：排除 Login 页面
                const nextActions = nextRoutes.map(item => (
                    NavigationActions.navigate({
                        routeName: item.routeName,
                        params: item.params || null,
                    })
                ));
                nextState = AppNavigator.router.getStateForAction(
                    NavigationActions.reset({
                        index: nextActions.length - 1,
                        actions: nextActions,
                    }),
                    state,
                );
            }
            break;
        case ACTIONS.USER_LOGOUT.SUCCESS:
            // 登出成功：重置并导航至登录页
            nextState = AppNavigator.router.getStateForAction(
                NavigationActions.reset({
                    index: 1,
                    actions: [
                        NavigationActions.navigate({ routeName: 'Entry' }),
                        NavigationActions.navigate({ routeName: 'Login' }),
                    ],
                }),
                state,
            );
            break;
        default:
            nextState = AppNavigator.router.getStateForAction(action, state);
            break;
    }
    return nextState || state;
};

export default navReducer;
