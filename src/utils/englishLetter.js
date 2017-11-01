/**
 * 查询英文字母所处位置
 * @param char
 * @return number 返回数字
 */
export default function (char) {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // 26个英文字母：位置0-25
    let location = 0;
    letters.split('').forEach((letter, i) => {
        if (letter === char.toUpperCase()) {
            location = i;
        }
    });
    return location;
}
