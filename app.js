/*
* Created by Murphy on 2018/5/2
* 应用程序入口文件*/

//加载express模块
var express = require('express');
//加载模版处理模块
var swig = require('swig');
//加载数据库模块
var mongoose = require('mongoose');
//加载body-parser,用来处理post提交的数据
var bodyParser = require('body-parser');
//加载cookies模块，用来记住登录状态
var Cookies = require('cookies');

//创建APP应用=》 nodejs Http.createServer();
var app = express();

var User = require('./models/User.js')

//设置静态文件托管
app.use('/public',express.static(__dirname+'/public'));


//配置应用模版
//定义当前应用所使用的模版引擎
//第一个参数：模版引擎的名称，同时也是模版文件的后缀
app.engine('html',swig.renderFile);
app.set('views','./views');
app.set('view engine','html');

//开发过程先清除缓存
swig.setDefaults({cache:false})

//bodyparser设置
app.use(bodyParser.urlencoded({extended:true}));

//设置cookies
app.use(function (req,res,next) {
    req.cookies = new Cookies(req,res);

    //解析登录用户的cookies信息,保存在req.userInfo这个全局对象中
    req.userInfo = {};
    if(req.cookies.get('userInfo')){
        try{
            req.userInfo = JSON.parse(req.cookies.get('userInfo'));
            //获取当前登录用户是否是管理员
            User.findById(req.userInfo._id).then(function (userInfo) {
                req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
                next();
            })
        }catch(e){}
    }else{
        next();
    }
    
});

//根据不同的功能划分模块
app.use('/admin',require('./routers/admin'));
app.use('/api',require('./routers/api'));
app.use('/',require('./routers/main'));

//监听http请求
mongoose.connect('mongodb://localhost:27018/blog',function(err){
    if(err){
        console.log('数据库连接失败');
    }
    else{
        console.log('数据库连接成功');
        app.listen(8081);
    }
});

