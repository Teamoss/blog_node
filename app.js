//项目入口文件

//加载express模块
const express = require('express')
//加载文件路径模块
const path = require('path')
//加载body-parser，处理post提交
const bodyParser = require('body-parser')
//加载session模块
const session = require('express-session')
//加载数据库模块
const mongoose= require('mongoose')
//创建app应用
const app = express()


//配置静态托管文件
app.use('/public/',express.static(path.join(__dirname, '/public/')))
app.use('/node_modules/',express.static(path.join(__dirname,'./node_modules/')))

//配置express-art-template模板引擎
app.engine('html', require('express-art-template'))

//设置模板文件存放目录
app.set('views', path.join(__dirname, 'views'))

//配置表单post请求 parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//配置session
app.use(session({
    secret: 'wonderful',
    resave: false,
    saveUninitialized: false
}))



//挂载路由
app.use('/admin', require('./routers/admin'));
app.use('/api', require('./routers/api'));
app.use('/', require('./routers/main'));


//连接数据库
mongoose.connect('mongodb://localhost/blog', function(err) {
    if (err) {
        console.log('数据库连接失败');
    } else {
        console.log('数据库连接成功');

        //启动服务器
        app.listen(3000,function () {
            console.log('server is running。。。。')
        })
    }
})



