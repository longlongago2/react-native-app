import def from './default';
import dark from './dark';

const theme = { def, dark };

export function rgba(rgb, transparency) {
    return `rgba(${rgb.match(/\d+/g)},${transparency})`;
}

export default theme.def;
