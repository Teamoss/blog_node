// 定义评论页面
var prepage = 5 //每页显示评论条数
var page = 1;    //当前页
var pages = 0;    //一共页数
var comments = []; //评论列表


$(function () {

    //发表评论
    $('#messageBtn').on('click', function () {
        $.ajax({
            type: 'post',
            url: '/api/comment',
            data: $('#commentInfo').serialize(),
            dataType: 'json',
            success: function (res) {
                if (res.code === 5) {
                    $('#messageContent').val('')
                    // window.location.reload()
                    commentList = res.data.comments
                    loadComments()
                }
            }
        })
    })

    //页面重载时候获取所有评论
    $.ajax({
        type: 'get',
        url: '/api/comment',
        data: {
            content: $('#contentId').val() || $('#contents').val()
        },
        dataType: 'json',
        success: function (res) {
            commentList = res.data.comments
            loadComments()
        }
    })

    //处理分页
    $('.pager').delegate('a','click',function () {
        if($(this).parent().hasClass('previous')){
            page--
        }else{
            page++
        }
        loadComments()
    })

    //加载评论
    function loadComments() {
        pages = Math.ceil(commentList.length / prepage)
        pages = Math.max(pages, 1)
        var start = Math.max(0, (page - 1) * prepage)
        var end = Math.min(start + prepage, commentList.length)

        var $lis = $('.pager li')
        $lis.eq(1).html(`${page}/${pages}`)
        $('#messageCount').html(commentList.length)
        if(page<=1){
            page=1
            $lis.eq(0).html('<span></span>');
        }else {
            $lis.eq(0).html('<a href="javascript:;">上一页</a>');
        }
        if(page>=pages){
            page=pages
            $lis.eq(2).html('<span></span>');
        }else {
            $lis.eq(2).html('<a href="javascript:;">下一页</a>');
        }
         if(commentList.length===0){
             $('.messageList').html('<div class="messageBox"><p>还没有评论</p></div>');
         }else{
             var html = ''
             for (let i = start; i < end; i++) {
                 html += `<div class="messageBox">
                <p class="name clear">
                <span class="fl" >用户: ${commentList[i].username}</span>
                <span class="fr">评论时间: ${commentList[i].postTime}</span>
                </p>
                <p style="color: lightseagreen">${commentList[i].comment}</p>
            </div>
             <hr/>`
             }
             $('.messageList').html(html)
         }
    }
})