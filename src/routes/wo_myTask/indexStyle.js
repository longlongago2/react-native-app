import theme from '../../theme';

export default {
    container: {
        flex: 1,
        backgroundColor: theme.background,
    },
    modalContentTitleLayout: {
        width: '100%',
        flex: -1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: 25,
    },
    modalContentTitleText: {
        fontWeight: 'bold',
        fontSize: 13,
    },
};
