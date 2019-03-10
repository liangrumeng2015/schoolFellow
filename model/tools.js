//封装md5
var md5 = require('md5');
let tools = {
    md5(str){
        return md5(str);
    },
    cateToList(data){
    	//1.获取一级分类
    	var firstCate = [];
    	for(var i = 0;i<data.length;i++){
    		if(data[i].pid == '0'){
    			firstCate.push(data[i]);
    		}
    	}
    	// console.log(firstCate);
    	// 获取二级分类
    	for(var i = 0;i<firstCate.length;i++){
    		firstCate[i].list = [];
    		for(var j = 0;j<data.length;j++){
    			if(firstCate[i]._id == data[j].pid){
    				firstCate[i].list.push(data[j]);
    			}
    		}
    	}
    	return firstCate;
    }
}
module.exports = tools;