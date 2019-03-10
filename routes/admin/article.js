
const router = require('koa-router')();
const DB = require('../../model/db.js');
const tools = require('../../model/tools.js');

// 图片上传
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

var upload = multer({storage:storage})


// 分类列表 
router.get('/', async(ctx)=>{

	// ctx.body = '新闻页面';
	var page = ctx.query.page || 1;
	var pageSize = 5;   // 一屏显示几条

    // var result =await DB.find('t_article',{},{"title":1});

    // 查询总数量
    var count = await DB.count('t_article',{});
    console.log(count);
    var result = await DB.find('t_article',{},{},{
    	page:page,
    	pageSize:pageSize
    })
    console.log('分类列表的值:'+result);
    ctx.body = '分类列表';
     await ctx.render('admin/article/index',{
        list: result,
        page: page,               // 当前页数
        totalPage: Math.ceil(count/pageSize)      // 总页数 6.3    7页
    });
})

router.get('/add_article',async(ctx)=>{
	ctx.body = '增加新闻页面';
    await ctx.render('admin/article/add');
})


// 接收数据
router.post('/doAdd',upload.single('pic'),async(ctx)=>{
    ctx.body = {
        filename:ctx.req.file.filename,       // 返回文件名
        body:ctx.req.body
    }
})


module.exports = router.routes();