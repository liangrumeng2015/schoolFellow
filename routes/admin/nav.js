
const router = require('koa-router')();
const DB = require('../../model/db.js');
const tools = require('../../model/tools.js');


router.get('/', async(ctx)=>{
	
	var result =await DB.find('t_nav',{});
	await ctx.render('admin/nav/list',{
		list: result
	})
})

router.get('/add',async(ctx)=>{
	await ctx.render('admin/nav/add')
})


// 执行增加操作
router.post('/doAdd',async(ctx)=>{
	// 接收数据
	console.log(ctx.request.body);
	// var title = ctx.request.body.title;
	// var url = ctx.request.body.url;
	// var sort = ctx.request.body.sort;
	// var status = ctx.request.body.status;
	// var add_time = tools.getTime(); 

	// await DB.insert('t_nav',{
	// 	title,url,sort,status,add_time
	// });
	// ctx.redirect(ctx.state.__HOST__+'/admin/nav');

})


module.exports = router.routes();