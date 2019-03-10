
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
    // 查询分类数据
    var  catelist = await DB.find('t_cata_list',{});
    console.log(catelist);
    await ctx.render('admin/article/add',{
        catelist: tools.cateToList(catelist)     // 拿到二级分类
    });
})


// 接收数据
router.post('/doAdd',upload.single('img_url'),async(ctx)=>{     // img_url封面图的name值
    // ctx.body = {
    //     filename:ctx.req.file.filename,       // 返回文件名
    //     body:ctx.req.body
    // }

    let pid = ctx.req.body.pid;
    let catename = ctx.req.body.catename.trim();
    let title = ctx.req.body.title.trim();
    let author = ctx.req.body.author.trim();
    let pic = ctx.req.body.img_url;
    let status = ctx.req.body.status;
    let is_best = ctx.req.body.is_best;
    let is_hot = ctx.req.body.is_hot;
    let is_new = ctx.req.body.is_new;
    let keywords = ctx.req.body.keywords;
    let description = ctx.req.body.description || '';
    let content = ctx.req.body.content || '';

    let img_url = ctx.req.file?ctx.req.file.path:'';
    let json = {
        pid,catename,title,author,status,is_best,is_hot,is_new,keywords,description,content,img_url
    }
    var result = DB.insert('t_article',json);

    ctx.redirect(ctx.state.__HOST__ + '/admin/article');
})

// 编辑
router.get('/edit',async(ctx)=>{
    ctx.body = '编辑页面';
    var id = ctx.query.id;
    //查询
    var catelist = await DB.find('t_cata_list',{});  
    // 要编辑的数据
    var articlelist = await DB.find('t_article',{'_id':DB.getObjectId(id)});

    await ctx.render('admin/article/edit',{
        catelist: tools.cateToList(catelist),
        list: articlelist[0]
    })
})

router.post('/doEdit',upload.single('img_url'), async(ctx)=>{
    let prevPage = ctx.req.body.prevPage || '';      // 上一页的地址
    let id =  ctx.req.body.id;
    let pid = ctx.req.body.pid;
    let catename = ctx.req.body.catename.trim();
    let title = ctx.req.body.title.trim();
    let author = ctx.req.body.author.trim();
    let pic = ctx.req.body.img_url;
    let status = ctx.req.body.status;
    let is_best = ctx.req.body.is_best;
    let is_hot = ctx.req.body.is_hot;
    let is_new = ctx.req.body.is_new;
    let keywords = ctx.req.body.keywords;
    let description = ctx.req.body.description || '';
    let content = ctx.req.body.content || '';

    let img_url = ctx.req.file?ctx.req.file.path : '';

    if(img_url){
        var json = {
            pid,catename,title,author,status,is_best,is_hot,is_new,keywords,description,content,img_url
        }
    } else {
        var json = {
            pid,catename,title,author,status,is_best,is_hot,is_new,keywords,description,content
        }
    }
   
    await DB.update('t_article',{"_id":DB.getObjectId(id)},json);

    // // 跳转
    if(prevPage){
        ctx.redirect(prevPage);
    }else{
        ctx.redirect(ctx.state.__HOST__ + '/admin/article');
    }
    

    ctx.body = '编辑页面';
    // ctx.redirect(ctx.state.__HOST__ + '/admin/article');
})  




module.exports = router.routes();