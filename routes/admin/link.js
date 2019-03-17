
const router = require('koa-router')();
const DB = require('../../model/db.js');
const tools = require('../../model/tools.js');

// 配置上传图片
const multer = require('koa-multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/upload')
  },
  // filename: function (req, file, cb) {
  //   cb(null, file.fieldname + '-' + Date.now())
  // }
  filename:function(req,file,cb){
  	var fileFormat = (file.originalname).split('.');   // 获取后缀名，分割数组
  	cb(null,Date.now() + '.' + fileFormat[fileFormat.length-1]);
  }
})
 
var upload = multer({ storage: storage })





router.get('/', async(ctx)=>{

   // ctx.body = '轮播图列表';
   var count = await DB.count('t_link',{})
    var result = await DB.find('t_link',{},{},{
    	sortJson: {
            'add_time': -1 
        }
    });
    
    await ctx.render('admin/link/list',{
        list: result
    });


})

router.get('/add', async(ctx)=>{
    ctx.body = '增加轮播图';
    await ctx.render('admin/link/add');
})

router.post('/doAdd', upload.single('pic'),async(ctx)=>{

	// 上传图片，注意在模板中配置  enctype = 'multipart/form-data'
	// ctx.body = {
	// 	filename:ctx.req.file ? ctx.req.file.filename : '',        // 返回文件名
	// 	body: ctx.req.body
	// }

	// 增加到数据库
	var title = ctx.req.body.title;
	var pic = ctx.req.file?ctx.req.file.path.substr(7) : '';
	var url = ctx.req.body.url;
	var sort = ctx.req.body.sort;
	var status = ctx.req.body.status;
	var add_time = tools.getTime();
    
	await DB.insert('t_link',{
		title,pic,url,sort,status,add_time
	})
	ctx.redirect(ctx.state.__HOST__ + '/admin/link');

})



// 编辑
router.get('/edit',async(ctx)=>{
	var id = ctx.query.id;
	var result = await DB.find('t_link',{"_id":DB.getObjectId(id)});
	console.log(result);

	await ctx.render('admin/link/edit',{
		list:result[0]
	});



})

// 去编辑
router.post('/doEdit', upload.single('pic'),async(ctx)=>{

	// 增加到数据库
	var id = ctx.req.body.id;
	var title = ctx.req.body.title;
	var pic = ctx.req.file?ctx.req.file.path.substr(7) : '';
	var url = ctx.req.body.url;
	var sort = ctx.req.body.sort;
	var status = ctx.req.body.status;
	var add_time = tools.getTime();
    
	if(pic){
		var json = {
			title,pic,url,sort,status,add_time
		}
	} else {
		var json = {
			title,url,sort,status,add_time
		}
	}

	await DB.update('t_link',{"_id":DB.getObjectId(id)},json);
	ctx.redirect(ctx.state.__HOST__ + '/admin/link');

})


module.exports = router.routes();