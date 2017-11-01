import theme, { rgba } from '../../theme/index';

export default {
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
    },
    layout: {
        paddingLeft: 40,
        paddingRight: 40,
        paddingTop: 20,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
    },
    item: {
        paddingTop: 15,
        paddingBottom: 15,
    },
    logoItem: {
        padding: 10,
        alignSelf: 'center',
    },
    bottomItem: {
        alignSelf: 'center',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: 10,
    },
    bottomItemText: {
        fontSize: 13,
        textAlign: 'center',
        color: rgba(theme.theme, 0.8),
    },
    loginItem: {
        height: 60,
        justifyContent: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: theme.theme,
    },
    textInput: {
        color: 'rgb(117, 117, 117)',
        fontSize: 15,
        height: 45,
        padding: 5,
    },
    dropDownContainer: {
        position: 'absolute',
        top: 48,
        zIndex: 999,
        width: '100%',
        paddingLeft: 5,
        paddingRight: 5,
    },
    dropDownLayout: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: 'center',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
};
