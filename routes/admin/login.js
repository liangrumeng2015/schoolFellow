
const router = require('koa-router')();
const tools = require('../../model/tools.js');    //加密
const DB = require('../../model/db.js');       //引入数据库
const svgCaptcha = require('svg-captcha');   // 验证码

router.get('/', async(ctx)=>{
    // ctx.body = '登录页面';
    await ctx.render('./admin/login');
})

// post提交
router.post('/doLogin',async (ctx)=>{
    // ctx.body = 'doLogin';
    // console.log(ctx.request.body);

    // 去数据库匹配   [可以使用两次加密]
    const username = ctx.request.body.username;
    const password = ctx.request.body.password;
    const code = ctx.request.body.code;

    /**
     * 1.验证用户名和密码是否合法 (前台也得验证)
     * 
     * 2.去数据库匹配(用封装好的mongodb库)
     * 
     * 3.成功后，把用户信息写入session中
     */

    if(code.toLocaleLowerCase() == ctx.session.code.toLocaleLowerCase()){
        var result = await DB.find('t_user_login',{ 
            "username":username, 
            "password":tools.md5(password)
        }); 
        if(result.length > 0){
            console.log('登录成功');
            ctx.session.userinfo = result[0];
            // 更新用户表里面   用户的登录时间
            DB.update('t_user_login',{
                "_id":DB.getObjectId(result[0]._id)
            },{
                lastTimeLogin: new Date()
            })
            ctx.redirect(ctx.state.__HOST__ + '/admin');   // 成功就跳转到/admin欢迎首页
        }else{
            // console.log('失败');
            ctx.render('admin/error',{
                message: '用户名或密码错误',
                redirect:  ctx.state.__HOST__ + '/admin/login'
            })
        }
    }else{
        // console.log('验证码失败');
        ctx.render('admin/error',{
            message: '验证码错误',
            redirect:  ctx.state.__HOST__ + '/admin/login'
        })
    }
    
})

// 验证码
router.get('/code',async(ctx)=>{
    //加法运算验证码
    // var captcha = svgCaptcha.createMathExpr({
    //     size: 4,
    //     fontSize: 50,
    //     width: 100,
    //     height: 40,
    //     background: "#cc9966"
    // });

    var captcha = svgCaptcha.create({
        size: 4,
        fontSize: 50,
        width: 120,
        height: 34,
        background: "#cc9966"
    });
    // console.log(captcha.text);  //验证码
    // 保存生成的验证码
    ctx.session.code = captcha.text;

    //设置响应头
    ctx.response.type = 'image/svg+xml';

    ctx.body = captcha.data;
})

// 退出登录
router.get('/loginOut',async(ctx)=>{
    ctx.session.userinfo = null;
    ctx.redirect(ctx.state.__HOST__ + '/admin/login');
});

module.exports = router.routes();