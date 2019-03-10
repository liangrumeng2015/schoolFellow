# schoolFellow
schoolFellow

public静态资源
views 静态模板
model模块
admin 后台文件

koa-art-templete 模板引擎


#mongodb
mongodb  #npm install mongodb --save

>(1)安装mongodb数据库<br>
>(2)设置path D:\Program Files\MongoDB\Server\4.0\bin<br>
>(3)运行启动mongodb ,命令行运行`mongo`, 在浏览器里面运行：`http://localhost:27017/` <br>
>(4)运行mongodb数据库：`mongo`
>(5)开启可视化界面：/e/adminMongo   `npm start`


#koa-router
>koa-router    # npm install koa-router --save


# 静态资源文件的存储
>koa-static # npm install koa-static --save

#session存储
>koa-session   # npm install koa-session --save

#koa-bodyparser  用于获取post请求提交的内容
>koa-bodyparser  #npm install koa-bodyparsre --save 

#md5 用于加密
>md5  # npm install md5

>(1)`启动文件`: node app.js

#生成验证码
svg-captcha  # npm install --save svg-captcha

#显示时间格式
>silly-datetime  # npm instal silly-datetime --save


schoolFellow
mongodb://127.0.0.1:27017
数据库连接：
http://localhost:1234/app/schoolFellow/schoolFellow/t_user_login/view/1

账号：
密码：


#mongodb数据的导入和导出
`导出`: mongodump -h dbhost -d dbname -o dbdirectory
-h 数据库地址
-d导出的数据库名称
-o 输出到哪儿？ 导出放在什么地方
eg: mongodump -h 127.0.0.1 -d koa D:\mydb

`导入`: mongorestore -h dbhost -d dbname <path>
	-h 


#实现图片的上传：
`koa-multer`:koa-multer是一个nodejs中间件，用于处理multipart/form-data类型的表单数据，它主要用于上传文件。
注：form表单加上，enctype="multipart/form-data"

（1）`安装koa-multer`:npm install koa-multer --save
（2）引入
（3）配置上传的目录及文件名称
`// 图片上传
const multer = require('koa-multer');
var storage = multer.diskStorage({
  destination:function(req,file,cb){
    cb(null,'public/upload')    // 注意文件路径必须存在,配置图片上传的目录
  },
  // 修改文件名称
  filename:function(req,file,cb){
    var fileFormat = (file.originalname).split('.');       //获取后缀名，分割数组 
    cb(null,Date.now()+'.'+fileFormat[fileFormat.length-1]); 
  }
})
var upload = multer({storage:storage})`

（4）接收数据  注：post、form表单必须加上  enctype="multipart/form-data" 
`router.post('/doAdd',upload.single('pic'),async(ctx)=>{
    ctx.body = {
        filename:ctx.req.file.filename,       // 返回文件名
        body:ctx.req.body
    }
})`



#富文本编辑器：
`百度富文本编辑器:ueditor`
`安装：`npm install koa2-ueditor --save