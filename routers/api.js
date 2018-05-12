var express = require('express');
var router = express.Router();
var User = require('../models/User.js');

//统一返回格式
var responseData;
router.use(function (req,res,next) {
    responseData={
        code:0,
        message:''
    }
    next();
})
/**
 * 用户注册
 * 注册逻辑
 *  1，用户名不为空
 *  2，密码不为空
 *  3，两次输入密码一致
 * 数据库查询
 *  1，用户名是否已经
 */
router.post('/user/register',function (req,res,next) {
    
    var username = req.body.username;
    var password = req.body.password;
    var repassword = req.body.repassword;
    
    //用户名是否为空
    if(username == '') {
        responseData.code = 1;
        responseData.message = '用户名不能为空';
        res.json(responseData);
        return;
    }
   
    //密码不能为空
    if (password == '') {
        responseData.code = 2;
        responseData.message = '密码不能为空';
        res.json(responseData);
        return;
    }
    console.log('2'+ req.body);
    if (password != repassword) {
        responseData.code = 3;
        responseData.message = '两次输入密码不一致';
        res.json(responseData);
        return;
    }
    
    User.findOne({
        username: username
    }).then(function (userInfo) {
        // console.log(userInfo);
        if (userInfo) {
            // console.log(userInfo);
            //表示数据库有记录
            responseData.code = 4;
            responseData.message = '用户名已经被注册';
            res.json(responseData);
            return ;
        }
        
        var user = new User({
            username: username,
            password: password
        });
        return user.save();
        
    }).then(function (newuserInfo) {
        responseData.message = '注册成功';
        res.json(responseData);
    });
    // next();
});

router.post('/user/login',function (req,res) {
    var username = req.body.username;
    var password = req.body.password;
    if(username == '' ||password == ''){
        responseData.code = 1;
        responseData.message = '用户名或密码不能为空';
        res.json(responseData);
        return;
    }
    
    //查询数据库相同用户名和密码相同的用户是否存在
    User.findOne({
        username:username,
        password:password
    }).then(function (userInfo) {
        if(!userInfo){
            responseData.code = 2;
            responseData.message = '用户名或者密码错误';
            res.json(responseData);
            return;
        }
        
        responseData.message = '登录成功';
        responseData.userinfo = {
            _id:userInfo._id,
            username:userInfo.username
        }
        
        req.cookies.set('userInfo',JSON.stringify({
            _id:userInfo._id,
            username:userInfo.username
        }));
        
        res.json(responseData);
        return;
        
    })
});

/**
 * 退出
 */
router.get('/user/logout',function (req,res) {
    req.cookies.set('userInfo',null);
    res.json(responseData);
    
})

module.exports = router;