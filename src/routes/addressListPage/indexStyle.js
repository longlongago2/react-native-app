import theme from '../../theme/index';

export default {
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        backgroundColor: theme.background,
        padding: 10,
    },
    text: {
        color: theme.textColor,
        fontSize: 12,
        textAlign: 'center',
        lineHeight: 20,
    },
};
