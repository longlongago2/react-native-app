import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
    renderers,
} from 'react-native-popup-menu';
import HeaderTool from './HeaderTool';

const { SlideInMenu, ContextMenu } = renderers;

const HeaderPopupMenu = ({ menuOptions, children, display, customMenuTriggerStyle }) => (
    <Menu renderer={display === 'slide' ? SlideInMenu : ContextMenu}>
        <MenuTrigger
            customStyles={{
                triggerOuterWrapper: { flex: 1 },
                triggerWrapper: customMenuTriggerStyle,
                TriggerTouchableComponent: HeaderTool,
            }}
        >
            {children}
        </MenuTrigger>
        <MenuOptions
            optionsContainerStyle={
                display === 'popup' ?
                    { maxWidth: 150 }
                    :
                    { paddingVertical: 10 }
            }
        >
            {
                menuOptions &&
                menuOptions.map((item, i) => (
                    <MenuOption
                        key={item.key}
                        onSelect={item.handler}
                        disabled={item.disabled}
                    >
                        <Text
                            numberOfLines={1}
                            style={[
                                {
                                    paddingVertical: 5,
                                    paddingHorizontal: 15,
                                    fontSize: 16,
                                    textAlign: 'center',
                                },
                                item.disabled && { color: '#cccccc' },
                            ]}
                        >
                            {item.text}
                        </Text>
                    </MenuOption>
                ))
            }
        </MenuOptions>
    </Menu>
);
HeaderPopupMenu.propTypes = {
    menuOptions: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string.isRequired,
            text: PropTypes.string.isRequired,
            handler: PropTypes.func.isRequired,
            disabled: PropTypes.bool,
        }),
    ),
    children: PropTypes.object.isRequired,
    customMenuTriggerStyle: PropTypes.object,
    display: PropTypes.oneOf(['popup', 'slide']), // popup是弹出，slide是底部滑出
};

export default HeaderPopupMenu;
