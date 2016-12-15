// 输出所有合法IPv4地址
function ips(str) {
	// 存储IP地址
	  let ret = [];
    let helper = function(s, t, level) {
        if (level == 4 && valid(s)) {
            ret.push(t + s);
            return;
        }

        for (let i = 1; i < 4 && i < s.length; i++) {
            let p = s.substring(0, i);
            if (valid(p)) {
                helper(s.substring(i), t + p + '.', level+1);
            }
        }
    };
    let valid = function(s) {
        if (s[0] === '0') {
            return s === '0';
        }

        var n = parseInt(s, 10);
        return 0 < n && n <= 255;
    };

    helper(str, '', 1);
	  return ret;
}

console.log(ips('25525511135'));
console.log(ips('0001'));
console.log(ips('127001'));
