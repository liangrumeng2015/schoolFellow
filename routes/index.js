const router = require('koa-router')();

router.get('/', async(ctx)=>{
    ctx.body = 'index页面';
})

module.exports = router.routes();