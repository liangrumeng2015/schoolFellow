//封装md5

var md5 = require('md5');
let tools = {
    md5(){
        return md5(str);
    }
}
module.exports = tools;