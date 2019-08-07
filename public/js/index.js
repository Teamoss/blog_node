$(function () {


    //切换到注册面板
    $('#loginBox a').on('click', function () {
        $('#loginBox').hide()
        $('#registerBox').show()
    })

    //切换到登录面板
    $('#registerBox a').on('click', function () {
        $('#loginBox').show()
        $('#registerBox').hide()
    })

    //用户注册
    $('#registerBox').find('[type="button"]').on('click', function () {
        $.ajax({
            type: 'post',
            url: '/api/user/register',
            //获取表单数据
            // data: {
            //     username: $('#registerBox').find('[name="username"]').val(),
            //     password: $('#registerBox').find('[name="password"]').val(),
            //     repassword: $('#registerBox').find('[name="repassword"]').val(),
            //
            // },
            data: $('#register_form').serialize() ,
            dataType: 'json',
            success: function (res) {

                $('#registerBox').find('.colWarning').html(res.message)
                if (res.code === 5) {
                    setTimeout(function () {
                        $('#loginBox').show()
                        $('#registerBox').hide()
                    }, 1000)
                }
            }
        })
    })

    //用户登录
    $('#loginBox').find('[type="button"]').on('click', function () {
        $.ajax({
            type: 'post',
            url: '/api/user/login',
            // data: {
            //     username: $('#loginBox').find('[name="username"]').val(),
            //     password: $('#loginBox').find('[name="password"]').val(),
            // },
            //获取表单数据
            data:$('#login_form').serialize(),
            dataType: 'json',
            success: function (res) {
                $('#loginBox').find('.colWarning').html(res.message)
                if (res.code === 5) {
                    setTimeout(function () {
                    window.location.reload('/')
                    }, 500)
                }
            }
        })
    })

    //用户退出登录
    $('#logout').on('click',function () {
        console.log(11)
        $.ajax({
            url: '/api/user/logout',
            success: function (res) {
                if(res.code === 6){
                    window.location.reload('/')
                }
            }
        })
    })


})