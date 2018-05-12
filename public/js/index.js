$(function () {
    var $loginBox = $('#loginbox');
    var $regiterBox = $('#registerbox');
    var $userInfo = $('#userinfo');
    
    //切换到注册面板
    $loginBox.find('a').on('click',function(){
        $regiterBox.show();
        $loginBox.hide();
    });
    
    //切换到登录面板
    $regiterBox.find('a').on('click',function(){
        $loginBox.show();
        $regiterBox.hide();
    });
    
    //注册
    $regiterBox.find('button').on('click',function(){
        //通过ajax提交请求
        $.ajax({
            type:'post',
            url:'/api/user/register',
            data:{
                username:$regiterBox.find('[name="username"]').val(),
                password:$regiterBox.find('[name="password"]').val(),
                repassword:$regiterBox.find('[name="repassword"]').val()
            },
            dataType:'json',
            success : function (result) {
                $regiterBox.find('.warning').html(result.message);
                if(!result.code){
                    setTimeout(function () {
                        $loginBox.show();
                        $regiterBox.hide();
                    },1000);
                }
            }
        })
    });
    
    //登录
    $loginBox.find('button').on('click',function(){
        //通过ajax提交请求
        $.ajax({
            type : 'post',
            url  : '/api/user/login',
            data :{
                username:$loginBox.find('[name="username"]').val(),
                password:$loginBox.find('[name="password"]').val()
            },
            dataType:'json',
            success : function (result) {
                $loginBox.find('.warning').html(result.message);
                if(!result.code){
                    //登陆成功
                    //重新刷新页面
                    window.location.reload();
                }
            }
        })
    });
    
    
    //退出按钮的事件
    $('#logout').on('click',function () {
        $.ajax({
            url : '/api/user/logout',
            success : function (result) {
                if(!result.code){
                    window.location.reload();
                }
            }
        })
    })
    
})