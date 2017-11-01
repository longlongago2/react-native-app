import theme from '../../theme';

export default {
    container: {
        backgroundColor: theme.background,
        paddingVertical: 10,
    },
    banner: {
        width: '100%',
        height: 170,
        backgroundColor: 'rgb(139, 139, 139)',
    },
    avatar: {
        width: 50,
        height: 50,
        borderColor: '#ffffff',
        borderWidth: 1,
        borderRadius: 25,
    },
    layout: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    username: {
        textAlign: 'center',
        lineHeight: 30,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
        width: 150,
        padding: 5,
    },
    motto: {
        textAlign: 'center',
        lineHeight: 25,
        fontSize: 10,
        color: '#ffffff',
        width: 250,
    },
    text: {
        textAlign: 'center',
        lineHeight: 25,
        fontSize: 12,
        padding: 10,
    },
};
