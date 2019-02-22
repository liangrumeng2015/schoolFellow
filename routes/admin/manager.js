
const router = require('koa-router')();
const DB = require('../../model/db.js');
const tools = require('../../model/tools.js');
router.get('/', async(ctx)=>{
    //ctx.body = '用户';
    var result = await DB.find('t_user_login',{});
   // console.log(result);
    await ctx.render('admin/manager/list',{
        list: result
    });
})

router.get('/add', async(ctx)=>{
    await ctx.render('admin/manager/add');
})

router.post('/doAdd',async (ctx)=>{
    // 1. 获取表单提交的数据 console.log(ctx.request.body);
    var username = ctx.request.body.username;
    var password = ctx.request.body.password;
    var rpassword = ctx.request.body.rpassword;
    // 2. 验证表单数据是否合法
    if(!/^\w{4,20}/.test(username)){
        await ctx.render('admin/error',{
            message:'用户名不合法，请输入4-20位的用户名',
            redirect: ctx.state.__HOST__ + '/admin/manager/add'
        })
    } else if(password.length < 6){
        await ctx.render('admin/error',{
            message: ' 密码不能少于6位',
            redirect: ctx.state.__HOST__ + '/admin/manager/add'
        })
    } else if(password != rpassword){
        await ctx.render('admin/error',{
            message: '密码和确认密码不一致',
            redirect: ctx.state.__HOST__ + '/admin/manager/add'
        })
    } else {
        // 3. 在数据库查询当前要增加的管理员是否存在
        var findResult = await DB.find('t_user_login',{"username": username});
        console.log(findResult);
        if(findResult.length > 0){
            await ctx.render('admin/error',{
                message: '该用户名已存在，请重新设置一个用户名',
                redirect: ctx.state.__HOST__ + '/admin/manager/add'
            })
        } else {
            // 增加管理员
            var addResult = await DB.insert('t_user_login',{"username": username, "password": tools.md5(password),"status":1,"lastTimeLogin":null})
            ctx.redirect(ctx.state.__HOST__ + '/admin/manager');
        }
    }
    

    // 4. 增加管理员
}) 

router.get('/edit', async(ctx)=>{
    // ctx.body = '编辑用户';
    var id = ctx.query.id;
    var result = await DB.find('t_user_login',{"_id": DB.getObjectId(id)});
    await ctx.render('admin/manager/editor.html',{
        list:result[0]
    });
})

router.post('/doEditor', async(ctx)=>{

    try{
        var id = ctx.request.body.id;
        console.log(id);
        var username = ctx.request.body.username;
        var password = ctx.request.body.password;
        var rpassword = ctx.request.body.rpassword;
        if(password != ''){
            if(password.length < 6){
                await ctx.render('admin/error',{
                    message: ' 密码不能少于6位',
                    redirect: ctx.state.__HOST__ + '/admin/manager/edit?id=' + id
                })
            } else if(password != rpassword){
                await ctx.render('admin/error',{
                    message: '密码和确认密码不一致',
                    redirect: ctx.state.__HOST__ + '/admin/manager/edit?id=' + id
                })
            } else {
                //更新密码
                var updateResult = await DB.update('t_user_login',{'_id':DB.getObjectId(id)},{"password":tools.md5(password)});
                ctx.redirect(ctx.state.__HOST__ + '/admin/manager');
            } 
        } else {
            ctx.redirect(ctx.state.__HOST__ + '/admin/manager');
        }
    } catch(err) {
        await ctx.render('admin/error',{
            message: err,
            redirect: ctx.state.__HOST__ + '/admin/manager/edit?id=' + id
        })
    }
    
   
})

router.get('/delete', async(ctx)=>{
    ctx.body = '删除用户';
})


module.exports = router.routes();