
const router = require('koa-router')();
const index = require('./admin/index.js');
const login = require('./admin/login.js');
const manager = require('./admin/manager.js');
const url = require('url');

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
        userinfo: ctx.session.userinfo 
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
router.use('/manager',manager);

module.exports = router.routes();