var express = require('express');
var router = express.Router();

router.get('/',function (req,res,next){
    //render的第二个参数是传入到main/index.html里面,可以根据这个来渲染index.html页面
    res.render('main/index',{
        userInfo : req.userInfo
    });
    
    
});

module.exports = router;