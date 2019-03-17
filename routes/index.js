const router = require('koa-router')();
const DB = require('../model/db.js');
const url = require('url');

// 配置中间件
router.use(async(ctx,next)=>{
	var pathname = url.parse(ctx.request.url).pathname;
	// console.log(pathname);

	ctx.state.pathname = pathname;          // 获取路径  /news   /service   /about  等

	await next();
})

router.get('/', async(ctx)=>{
    // ctx.body = 'index页面';

    var focusResult = await DB.find('t_focus',{$or:[{"status":1},{"status":'1'}]},{},{       // 状态来控制显示或不显示
    	sortJson: {
    		sort: 1
    	}
    })
    ctx.render('default/index',{
    	focus:focusResult
    });
})


router.get('/case', async(ctx)=>{
    // ctx.body = '案例页面';
    var pid = ctx.query.pid;
    var page = ctx.query.page || 1;
    var pageSize = 4;

    // 获取成功案例下面的分类
    var cateResult = await DB.find('t_cata_list',{'pid':'5c8cd283c270682d44125ab0'})

    if(pid){
        // 如果存在
        var articleList = await DB.find('t_article',{"pid":pid},{},{
            page,pageSize
        });

        // 获取总数量
        var articleNum = await DB.count('t_article',{'pid':pid});

    } else {
    // 循环子分类，获取内容
        var subCateArr = [];
        for(var i = 0;i < cateResult.length;i++){
            subCateArr.push(cateResult[i]._id.toString());
        }

        //获取所有子分类下面的数据
        var articleList = await DB.find('t_article',{"pid":{$in:subCateArr}});

         // 获取总数量
        var articleNum = await DB.count('t_article',{'pid':{$in:subCateArr}});
        console.log(articleList);
    }

    
    ctx.render('default/case',{
        catelist:cateResult,
        articlelist:articleList,
        pid:pid,
        page:page,
        totlePages:Math.ceil(articleNum/pageSize)
    });
})

router.get('/service', async(ctx)=>{
    // ctx.body = '服务页面';5c8cd2c3c270682d44125ab5

    // 查询
    var serviceList =await DB.find('t_article',{'pid':'5c8cd2c3c270682d44125ab5'})
    ctx.render('default/service',{
    	serviceList:serviceList
    });
})

router.get('/news', async(ctx)=>{
    // ctx.body = '新闻页面';
    var pid = ctx.query.pid;
    var page = ctx.query.page || 1;
    var pageSize = 4;
     // 获取新闻资讯下面的分类
    var cateResult = await DB.find('t_cata_list',{'pid':'5c8cd2e0c270682d44125ab6'})
    if(pid){
        var articleList = await DB.find('t_article',{"pid":pid},{},{
            page,pageSize
        });
        // 获取总数量
        var articleNum = await DB.count('t_article',{'pid':pid});
    } else {
        // 获取所有子分类的id
        var subCateArr = [];
        for(var i = 0;i < cateResult.length;i++){
            subCateArr.push(cateResult[i]._id.toString());
        }

        //获取所有子分类下面的数据
        var articleList = await DB.find('t_article',{"pid":{$in:subCateArr}});
        // 获取总数量
        var articleNum = await DB.count('t_article',{'pid':{$in:subCateArr}});
    }

    

    ctx.render('default/news',{
        catelist:cateResult,
        newslist:articleList,
        pid:pid,
         page:page,
        totlePages:Math.ceil(articleNum/pageSize)
    })

})

router.get('/content/:id',async(ctx)=>{
	console.log(ctx.params);        // 获取动态路由的传值

	var id = ctx.params.id;
	var content = await DB.find('t_article',{'_id':DB.getObjectId(id)});

	ctx.render('default/content',{
		list:content[0]
	});
})

router.get('/about', async(ctx)=>{
    // ctx.body = '关于我们';
    ctx.render('default/about');
})

router.get('/connect', async(ctx)=>{
    // ctx.body = '联系我们';
    ctx.render('default/connect');
})

module.exports = router.routes();