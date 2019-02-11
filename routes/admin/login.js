
const router = require('koa-router')();
const tools = require('../../model/tools.js');    //加密

router.get('/', async(ctx)=>{
    //ctx.body = '登录页面';
    await ctx.render('./admin/login');
})

// post提交
router.post('/doLogin',async (ctx)=>{
    ctx.body = 'doLogin';
    console.log(ctx.request.body.username);
    // 去数据库匹配； 可以使用两次加密
    const username = ctx.request.body.username;

    /**
     * 1.验证用户名和密码是否合法
     * 
     * 2.去数据库匹配(用封装好的mongodb库)
     * 
     * 3.成功后，把用户信息写入session中
     */
    
    var result = await DB.find('admin',{"username":username,"password":tools.md5(password)}); 
    if(result.length > 0){
        ctx.session.userinfo = result[0];
        ctx.redirect(ctx.state.__HOST__ + '/admin');
    }else{
        console.log('失败');
    }


})

module.exports = router.routes();