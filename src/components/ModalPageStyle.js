import theme from '../theme';

export default {
    layout: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'rgb(255,255,255)',
    },
    headerContainer: {
        height: theme.header.height,
        width: '100%',
        flex: -1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: theme.header.backgroundColor,
    },
    headerTitleContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginHorizontal: 16,
    },
    headerTitleText: {
        fontSize: theme.header.fontSize,
        fontWeight: theme.header.fontWeight,
        color: theme.header.foregroundColor,
    },
    headerRightContainer: {
        flex: -1,
        height: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    bodyContainer: {
        padding: 10,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignSelf: 'stretch',
    },
    footerContainer: {
        flex: -1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'stretch',
        alignSelf: 'stretch',
        padding: 10,
    },
};
