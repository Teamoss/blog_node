

$(function () {

    //发表评论
    $('#messageBtn').on('click',function () {

        $.ajax({
            type:'post',
            url:'/api/comment',
            data: $('#commentInfo').serialize(),
            dataType:'json',
            success:function (res) {
               if(res.code === 5) {
                   $('#messageContent').val('')
                   window.location.reload()
               }
            }
        })
    })
})