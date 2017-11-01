import theme from '../theme';

export default {
    itemLayout: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 65,
    },
    itemSection1: {
        width: '20%',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    itemSection2: {
        width: '60%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingHorizontal: 5,
    },
    itemSection3: {
        width: '20%',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    itemText: {
        textAlign: 'left',
        fontSize: 15,
        fontWeight: 'bold',
        color: 'rgb(94, 94, 94)',
    },
    itemSubText: {
        textAlign: 'left',
        fontSize: 12,
        lineHeight: 20,
        color: 'rgba(94, 94, 94, 0.5)',
    },
    itemBadge: {
        position: 'absolute',
        top: -3,
        right: 0,
        backgroundColor: 'red',
        borderRadius: 9,
        width: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
    },
    itemAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    itemDefaultAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#ffffff',
    },
    modalContainer: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    popupMenuOption: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        textAlign: 'left',
        fontSize: 15,
    },
    popupMenuTrigger: {
        backgroundColor: '#ffffff',
        borderRadius: 25,
        height: 50,
        width: 50,
        flex: -1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    MenuTriggerText: {
        width: 40,
        color: theme.theme,
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
    },
};
