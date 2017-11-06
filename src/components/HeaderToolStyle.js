import theme from '../theme';

const layoutSize = theme.header.height;
export default {
    menuLayout: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginHorizontal: 5,
    },
    menu: {
        width: layoutSize,
        height: layoutSize,
        alignItems: 'center',
        justifyContent: 'center',
    },
};
