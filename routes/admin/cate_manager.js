
const router = require('koa-router')();
const DB = require('../../model/db.js');
const tools = require('../../model/tools.js');


// 分类列表 
router.get('/', async(ctx)=>{
    var result =await DB.find('t_cata_list',{});
    console.log('分类列表的值:'+result);
    ctx.body = '分类列表';
     await ctx.render('admin/cate_manager/index',{
        list: tools.cateToList(result)
    });
})

// 增加分类 add
router.get('/add_cate', async(ctx)=>{
	// ctx.body = '增加分类';
	// 拿到顶级分类
	var result =await DB.find('t_cata_list',{pid:'0'});
	await ctx.render('admin/cate_manager/add_cate',{
		catelist:result
	});
	console.log('拿到顶级分类'+result);
	
})

// 提交
router.post('/doAdd',async(ctx)=>{
	console.log(ctx.request.body);
	var addData = ctx.request.body;
	var result = await DB.insert('t_cata_list',addData);
	ctx.redirect(ctx.state.__HOST__+'/admin/cate_manager')
})

// 编辑页面
router.get('/edit',async(ctx)=>{
	ctx.body = '编辑页面';
	var id = ctx.query.id;
	var result = await DB.find('t_cata_list',{"_id":DB.getObjectId(id)});
	//顶级
	var articlecate = await DB.find('t_cata_list',{'pid':'0'});

	console.log('拿到的数据是：'+result);
	await ctx.render('admin/cate_manager/edit',{
		list:result[0],
		catelist:articlecate
	})
})

router.post('/doEdit',async(ctx)=>{
	var editData = ctx.request.body;
	var id = editData.id;      // 在隐藏表单域传
	var title = editData.title;
	var keywords = editData.keywords;
	var pid = editData.pid;
	var status = editData.status;
	var description = editData.description;

	var result = await DB.update('t_cata_list',{'_id':DB.getObjectId(id)},{
		title:title,
		keywords:keywords,
		pid:pid,
		status:status,
		description:description
	});

	ctx.redirect(ctx.state.__HOST__+'/admin/cate_manager')
})
module.exports = router.routes();