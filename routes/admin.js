
const router = require('koa-router')();
const index = require('./admin/index.js');
const login = require('./admin/login.js');
const manager = require('./admin/manager.js');
const school_user = require('./admin/school_user.js');
const cate_manager = require('./admin/cate_manager.js');
const article = require('./admin/article.js');
const focus = require('./admin/focus.js');
const link = require('./admin/link.js');
const nav = require('./admin/nav.js');


const url = require('url');
const ueditor = require('koa2-ueditor');

// 获取url的地址
router.use(async(ctx,next)=>{
    //console.log(ctx.request.header.host);

    // 模板引擎配置全局的变量
    // console.log(ctx.request.url);
    ctx.state.__HOST__ = 'http://' + ctx.request.header.host;
    var pathname = url.parse(ctx.request.url).pathname.substring(1);  //  去掉了/, http://localhost:3000/admin/manager/add
    var splitUrl = pathname.split('/');   // 切分url    admin/manager/add

    // console.log(splitUrl);    // [ 'admin', 'manager', 'add' ]
    // 设置全局的userinfo
    ctx.state.G = {
        url: splitUrl,
        userinfo: ctx.session.userinfo ,
        prevPage: ctx.request.headers['referer']   // 返回上一页的地址
    }
    

    // 权限判断
    if(ctx.session.userinfo){       //登录的话继续向下匹配路由
        await next(); 
    }else{         // 没有登录
        if(pathname == 'admin/login' || pathname == 'admin/login/doLogin' || pathname == 'admin/login/code'){
            await next();
        }else{
            ctx.redirect('/admin/login');
        }
    }
})

router.get('/', async(ctx)=>{
    //ctx.body = '后台页面';
    await ctx.render('admin/index.html');
})

router.use(index);   // 后台首页
router.use('/login',login);
router.use('/manager',manager);  //管理员管理
router.use('/cate_manager',cate_manager);   // 分类管理
router.use('/article',article);  // 文章管理
router.use('/focus',focus);    // 轮播图界面
router.use('/link',link);    // 友情链接
router.use('/nav',nav);       // 导航管理
router.use('/school_user',school_user);   // 校友的信息管理

// 文本编辑器, 上传文件的路由，在ueditor.config.js里面配置serverUrl
router.all('/editor/controller',ueditor(['public',{
    "imageAllowFiles": ['.png','.jpg','.jpeg'],
    "imagePathFormat": "/upload/ueditor/image/{yyyy}{mm}{dd}/{filename}"   // 保存原文件名
}]))


module.exports = router.routes();