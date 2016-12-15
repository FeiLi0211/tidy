/**
 * Created by fei on 03/12/2016.
 */

function diff(x, y) {
    if (x.length === 0) {
        return y;
    } else if (y.length === 0) {
        return x;
    } else {
        if (x[0] < y[0]) {
            return append(diff(x.slice(1), y), x[0]);
        } else if (x[0] === y[0]) {
            return diff(x.slice(1), y.slice(1));
        } else {
            return append(diff(x, y.slice(1)), y[0]);
        }
    }
}

function append(arr, x) {
    arr.push(x);
    return arr;
}

console.log(diff([1,2,3,5], [1,2,3,4,5]));
