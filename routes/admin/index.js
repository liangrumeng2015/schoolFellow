
const router = require('koa-router')();
const DB = require('../../model/db.js');

router.get('/', async(ctx)=>{
    //ctx.body = '用户';
    var result = await DB.find('t_user_login',{});
   // console.log(result);
    await ctx.render('admin/manager/list',{
        list: result
    });
})

router.get('/', async(ctx)=>{
    await ctx.render('admin/index');
})

// 改变状态的路由
router.get('/changeStatus', async(ctx)=>{
   // console.log(ctx.query);
   var collectionName = ctx.query.collectionName;   // 数据库
   var attr = ctx.query.attr;   // 属性
   var id = ctx.query.id;   // 更新id
   var data = await DB.find(collectionName,{"_id":DB.getObjectId(id)});
    // console.log(data);
   if(data.length > 0){
        if(data[0][attr] == 1){
            var json = {
                [attr]:0
            };
        }else{
            var json = {
                [attr]:1
            };
        }
        let updateResult = await DB.update(collectionName,{
            "_id":DB.getObjectId(id)
        },json);
        if(updateResult){
            ctx.body = {"message":'更新成功',"success":true};
        }else{
            ctx.body = {"message":'更新失败',"success":false}
        }
   }else{
       ctx.body = {"message":'更新失败，参数错误',"success":false};
   }
    
//    ctx.body = {"message":"更新成功","success":true}
})



//删除的路由(common)
router.get('/remove', async(ctx)=>{
  try{
    var collection = ctx.query.collection;  // 获取到数据库中的表
    var id = ctx.query.id;   // 要删除的id
    var result = DB.remove(collection,{'_id':DB.getObjectId(id)});

    // 返回的地方？
    ctx.redirect(ctx.state.G.prevPage);
  }catch(error){
    ctx.redirect(ctx.state.G.prevPage);
  }
})


module.exports = router.routes();