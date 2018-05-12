var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Category = require('../models/Category');

router.use(function (req,res,next) {
    if(!req.userInfo.isAdmin){
        res.send('对不起，只有管理员才可以进入后台管理');
        return;
    }
    next();
})

/**
 * 首页
 */
router.get('/',function (req,res,next){
    res.render('admin/index',{
        userInfo:req.userInfo
    });
});

/**
 * 用户管理
 */
router.get('/user',function (req,res) {
    /**
     * 读取数据库所有用户信息
     *
     * limit(number):限制条数
     *
     * skip(number):忽略数据条数
     *
     * 每页显示三条
     * 1：1-3 skip:0 (当前页-1）*page
     * 2: 4-6 skip:3
     */
    var page = Number(req.query.page || 1);
    var limit = 5;
    var skip = (page-1)*limit
    //数据库总条数
    User.count().then(function (count) {
        //计算总页数
        pages = Math.ceil(count/limit);
        //取值不能超过pages
        page = Math.min(page,pages);
        //取值不能小于1
        page = Math.max(page,1);
    
        User.find().limit(limit).skip(skip).then(function (users) {
            res.render('admin/user_index',{
                userInfo:req.userInfo,
                users:users,
                count:count,
                pages:pages,
                page:page,
                limit:limit
            });
        });
    });
    
    
});

/**
 * 分类首页
 */

router.get('/category',function (req,res) {
    res.render('admin/category_index',{
        userInfo : req.userInfo
        
    })
})

/**
 * 分类的添加
 */
router.get('/category/add',function (req,res) {
    res.render('admin/category_add',{
        userInfo : req.userInfo
    })
});

/**
 * 分类的保存
 */
router.post('/category/add',function (req,res) {
    console.log(req.body);
    var name = req.body.name || '';
    if(name == ''){
        res.render('admin/error',{
            userInfo : req.userInfo,
            message : '名称不能为空'
        });
        return;
    }
    
    //数据库是否已经存在相同类别
    Category.findOne({
        name:name
    }).then(function (rs) {
        if(rs){
            //数据库已经有该分类名
            res.render('admin/error',{
                userInfo : req.userInfo,
                message : '分类已经存在'
            });
            return Promise.reject();
        }else{
            return new Category({
                name:name
            }).save();
        }
    }).then(function (newCategory) {
        res.render('admin/success',{
            userInfo : req.userInfo,
            message : '分类保存成功',
            url : '/admin/category'
        })
    })
    
});

module.exports = router;