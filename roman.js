/**
 * Created by fei on 03/12/2016.
 */

function convert(num) {
    let x = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
    let y = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
    let arr = [];
    for (let i = 0; i < x.length; i++) {
        arr.push(repeat(y[i], Math.floor(num / x[i])));
        num = num % x[i];
    }
    return arr.join('');
}

function repeat(str, num) {
    let s = '';
    for (let i = 0; i < num; i++) {
        s += str;
    }
    return s;
}

console.log(convert(36));