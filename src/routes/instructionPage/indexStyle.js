import theme from '../../theme';

export default {
    container: {
        flex: 1,
        backgroundColor: theme.background,
    },
    body: {
        flex: 1,
    },
    logo: {
        flex: -1,
        height: 120,
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        flex: -1,
        height: 80,
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingVertical: 10,
    },
    footerText: {
        fontSize: 11,
        color: '#AAAAAA',
        lineHeight: 20,
    },
};
