const Koa = require('koa');
const serve = require('koa-static'); 
const router = require('koa-router')();
//const router = require('koa-simple-router');
const render = require('koa-art-template');
const path = require('path');
const session = require('koa-session');
const bodyParser = require('koa-bodyparser');
const md5 = require('md5');
const app = new Koa();

//配置post提交的中间件
app.use(bodyParser());

// session中间件的配置：
app.keys = ['some secret hurr'];
 
const CONFIG = {
  key: 'koa:sess',
  maxAge: 86400000,
  autoCommit: true, 
  overwrite: true,
  httpOnly: true, 
  signed: true, 
  rolling: true,    // 每次请求都重新设置session
  renew: false, 
};
 
app.use(session(CONFIG, app));

// 模板引擎
render(app, {
    root: path.join(__dirname, '/views'),
    extname: '.html',
    debug: process.env.NODE_ENV !== 'production'
});

//引入模块
const index = require('./routes/index.js');
const api = require('./routes/api.js');
const admin = require('./routes/admin.js');

router.use(index);
router.use('/api',api);
router.use('/admin',admin);

// 静态资源
app.use(serve(__dirname + '/public'));

//启动路由
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000,()=>{
    console.log('server is running')
});