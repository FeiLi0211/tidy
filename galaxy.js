'use strict';

// 标准库导入
const fs = require('fs');
const util = require('util');

// 变量，关系记录
const memo = {};
// 输入文件路径
const filename = process.argv[2];
// 罗马数字-阿拉伯数字对照表
const romanBase = {
    'M': 1000,
    'D': 500,
    'C': 100,
    'L': 50,
    'X': 10,
    'V': 5,
    'I': 1
};
// 值表达式的判定
const valuePattern = /(\w+)\s+is\s+(\w+)/;
// 关系表达式的判定
const relationPattern = /(.*)\s+(Silver|Gold|Iron)\s+is\s+(\d+)\s+(\w+)\s*/;
// how much 格式的问题判定
const howMuchPattern = /is\s+(.*)\s+[?]?/;
// how many 格式的问题判定
const howManyPattern = /how many\s+(\w+)\s+is\s+(.*)\s+(Silver|Gold|Iron)\s+[?]?/;
// how much 问题的解答
const howMuchAnswerFormat = '%s is %d';
// how many 问题的解答
const howManyAnswerFormat = '%s %s is %d %s';

// 定义罗马数字类
var RomanNumber = {
    valueToRomanNumber: function(str) {
        var values = str.split(/\s+/);
        for (var i = 0; i < values.length; i++) {
            if (!memo[values[i]]) {
                throw new Error('未定义变量', values[i]);
            } else {
                values[i] = memo[values[i]];
            }
        }
        return values.join('');
    },
    validRomanStr: function(str) {
        // 1. 连续问题
        //    I, X, C, M 最多连续出现三次
        //    D, L, V 不可以连续出现
        if (/IIII|XXXX|CCCC|DD|LL|VV/.test(str)) {
            throw new Error('罗马数字非法', str);
        }

        // 2. 减法位问题
        //    I 只能出现在 V, X 前;
        //    X 只能出现 L, C 前;
        //    C 只能出现 D, M 前;
        //    V, L, D 不能出现在减法位
        var invalidGroup = ['IV', 'IX', 'XL', 'XC', 'CD', 'CM', 'VI', 'LX', 'LV', 'LI', 'DC', 'DL', 'DX', 'DV', 'DI'];
        var rule = /(I\w)|(X\w)|(C\w)|(V\w)|(L\w)|(D\w)/.exec(str);
        for (var i = 1; i < rule.index; i++) {
            if (invalidGroup.indexOf(rule[i]) === -1) {
                throw new Error('罗马数字非法', str);
            }
        };
    },
    New: function(str) {
        var romanStr = RomanNumber.valueToRomanNumber(str);
        RomanNumber.validRomanStr(romanStr);

        var romanNumber = {};
        romanNumber.str = romanStr;
        romanNumber.toArabic = function() {
            var t = 0, i = 0, len = romanStr.length;

            while (i < len - 1) {
                var x = romanBase[romanStr[i]];
                var y = romanBase[romanStr[i + 1]];
                if (x < y) {
                    t += y - x;
                    i += 2;
                } else {
                    t += x;
                    i += 1;
                }
            };
            if (i === len - 1) {
                t += romanBase[romanStr[romanStr.length - 1]];
            }
            return t;
        };

        return romanNumber;
    }
};

if (!filename) {
    console.error('error', '未指定文件');
}

fs.readFile(filename, 'utf8', function(err, data) {
    if (err) {
        console.error('error', err);
    } else {
        var lines = data.split('\n');

        for (var i = 0; i < lines.length; i++) {
            operate(lines[i]);
        }
    }
});

var operate = function(line) {
    if (/^\s.$/.test(line)) {                                          // 空行，忽略
        // do nothing
    } else if (/is\s+[I|V|X|L|C|D|M]+$/.test(line)) {                  // 值定义
        valueHandler(line);
    } else if (/is\s+\d+\s+Credits$/.test(line)) {                     // 关系定义
        relationHandler(line);
    } else if (/how\s+much/.test(line)) {                              // 问题
        howMuchHandler(line);
    } else if (/how\s+many/.test(line)) {
        howManyHandler(line);
    } else {
        unknown();
    }
};

var unknown = function() {
    console.log('I have no idea what you are talking about');
};

var valueHandler = function(line) {
    var ret = valuePattern.exec(line);
    var valueStr = ret[1], romanUnit = ret[2];
    if (!romanBase[romanUnit]) {
        return unknown();
    }
    memo[valueStr] = romanUnit;
};

var relationHandler = function(line) {
    var ret = relationPattern.exec(line);
    var x, valueStr = ret[1], relation = ret[3], bigUnit = ret[2], unit = ret[4];
    try {
        x = RomanNumber.New(valueStr).toArabic();
    } catch(err) {
        return unknown();
    }
    var y = parseInt(relation, 10);
    if (!memo[bigUnit]) {
        memo[bigUnit] = {};
    }
    memo[bigUnit][unit] = y / x;
};

var howMuchHandler = function(line) {
    var ret = howMuchPattern.exec(line);
    if (!ret) {
        return unknown();
    }
    var value, valueStr = ret[1];
    try {
        value = RomanNumber.New(ret[1]).toArabic();
    } catch (err) {
        return unknown();
    }
    console.log(util.format(howMuchAnswerFormat, valueStr, value));
};

var howManyHandler = function(line) {
    var ret = howManyPattern.exec(line);
    if (!ret) {
        return unknown();
    }
    var value, unit = ret[1], valueStr = ret[2], bigUnit = ret[3];
    try {
        value = RomanNumber.New(valueStr).toArabic();
    } catch(err) {
        return unknown();
    }
    var relation = memo[bigUnit][unit];
    console.log(util.format(howManyAnswerFormat, unit, valueStr, value * relation, unit));
};

