const express = require('express')
const router = express.Router()
const Category = require('../models/category')
const Content = require('../models/Content')

//定义统一返回对象
var data = {}

router.use(function (req, res, next) {
    data = {
        userInfo: req.session.userInfo,
        categoryList: []
    }
    Category.find().then(categoryList => {
        data.categoryList = categoryList
        next()
    })
})

//渲染主页
router.get('/', function (req, res, next) {

    //获取分类
    data.category = req.query.category || ''
    //总页数
    data.pages = 0
    //当前页
    data.page = Number(req.query.page || 1)
    //每页显示数据
    data.limit = 2
    //数据总条数
    data.count = 0

    var where = {}
    if (data.category) {
        where.category = data.category
    }
    Content.where(where).countDocuments().then(count => {

        data.count = count
        data.pages = Math.ceil(data.count / data.limit)
        data.page = Math.min(data.page, data.pages)
        data.page = Math.max(data.page, 1)
        var skip = (data.page - 1) * data.limit

        return Content.where(where).limit(data.limit).skip(skip).populate(['category','user']).sort({addTime:-1})
    }).then(contentList=>{
        data.contentList = contentList
        res.render('./main/index.html',data)
    })
})

//渲染文章内容页面
router.get('/view',function (req,res,next) {

    //获取内容ID
    var contentID = req.query.content || ''
    Content.findOne({
        _id:contentID
    }).populate('user').then(content=>{

        data.content=content
        data.comments = content.comments
        content.views++
        content.save()
        res.render('./main/view.html',data)
    })

})

module.exports = router