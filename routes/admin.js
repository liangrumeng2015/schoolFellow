
const router = require('koa-router')();

const login = require('./admin/login.js');
const user = require('./admin/user.js');

// 获取url的地址
router.use(async(ctx,next)=>{
    //console.log(ctx.request.header.host);

    // 模板引擎配置全局的变量
    ctx.state.__HOST__ = 'http://' + ctx.request.header.host;


    // 权限判断
    if(ctx.session.userinfo){       //登录的话继续向下匹配路由
        await next(); 
    }else{         // 没有登录
        if(ctx.url == '/admin/login' || ctx.url == '/admin/login/doLogin'){
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

router.use('/login',login);
router.use('/user',user);

module.exports = router.routes();