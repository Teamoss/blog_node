const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Category = require('../models/category')

//渲染后台首页
router.get('/', function (req, res, next) {

    //通过session判断用户是否为管理员
    // if (!req.session.userInfo) {
    //     res.render('./404.html')
    //     return
    // }
    // if (!req.session.userInfo.isAdmin) {
    //     res.render('./404.html')
    //     return
    // }

    res.render('./admin/index.html', {
        userInfo: req.session.userInfo
    })
})

//渲染用户管理页面
router.get('/user', function (req, res, next) {


    //通过session判断用户是否为管理员
    // if (!req.session.userInfo) {
    //     res.render('./404.html')
    //     return
    // }
    // if (!req.session.userInfo.isAdmin) {
    //     res.render('./404.html')
    //     return
    // }

    var page = Number(req.query.page || 1)  //获取用户传递过来页数
    var limit = 10  //每页显示10条数据
    var pages = 0   //总页数

    User.find().count().then(count => {

        //获取总页数
        pages = Math.ceil(count / limit)
        //最大页码不能超过总页数
        page = Math.min(page, pages)
        //最小页码不能小于1
        page = Math.max(page, 1)
        //越过数据库条数
        var skip = (page - 1) * limit

        //查询数据库降序排序 sort({_id:-1})
        User.find().sort({_id: -1}).limit(limit).skip(skip).then(userList => {
            res.render('./admin/user_index.html', {
                userInfo: req.session.userInfo,
                userList: userList,
                count: count,
                pages: pages,
                limit: limit,
                page: page
            })
        })
    })

})

//渲染分类管理页面
router.get('/category', function (req, res, next) {
    //通过session判断用户是否为管理员
    // if(!req.session.userInfo) {
    //     res.render('./404.html')
    //     return
    // }
    // if(!req.session.userInfo.isAdmin ) {
    //     res.render('./404.html')
    //     return
    // }

    var page = Number(req.query.page || 1)  //获取页数
    var limit = 5  //每页显示10条数据
    var pages = 0   //总页数


    Category.find().count().then(count => {

        //获取总页数
        pages = Math.ceil(count / limit)
        //最大页码不能超过总页数
        page = Math.min(page, pages)
        //最小页码不能小于1
        page = Math.max(page, 1)
        //越过数据库条数
        var skip = (page - 1) * limit

        //查询数据库降序排序sort
        Category.find().sort({_id: -1}).limit(limit).skip(skip).then(categoryList => {
            res.render('./admin/category_index.html', {
                userInfo: req.session.userInfo,
                categoryList: categoryList,
                count: count,
                pages: pages,
                limit: limit,
                page: page
            })
        })
    })
})

//渲染分类添加页面
router.get('/category/add', function (req, res, next) {

    //通过session判断用户是否为管理员
    // if(!req.session.userInfo) {
    //     res.render('./404.html')
    //     return
    // }
    // if(!req.session.userInfo.isAdmin ) {
    //     res.render('./404.html')
    //     return
    // }

    res.render('./admin/category_add.html', {
        userInfo: req.session.userInfo
    })

})

//处理分类添加
router.post('/category/add', function (req, res, next) {

    var categoryName = req.body.name
    if (!categoryName) {
        res.render('./admin/submitError.html', {
            userInfo: req.session.userInfo,
            message: '分类名称不能为空'
        })
        return
    }

    //判断数据库中是否存在相同分类名称
    Category.findOne({
        categoryName: categoryName
    }).then(isHaveSameCategory => {
        if (isHaveSameCategory) {
            res.render('./admin/submitError.html', {
                userInfo: req.session.userInfo,
                message: '分类名称已存在'
            })
            return
        } else {
            //若不存在则保存数据
            return new Category({
                categoryName: categoryName
            }).save()
        }
    }).then(isAddSuccess => {
        if (isAddSuccess) {
            res.render('./admin/submitSuccess.html', {
                userInfo: req.session.userInfo,
                message: '添加成功',
                url: '/admin/category'
            })
        }
    })
})

//渲染分类编辑页面
router.get('/category/edit', function (req, res, next) {

    //通过session判断用户是否为管理员
    // if(!req.session.userInfo) {
    //     res.render('./404.html')
    //     return
    // }
    // if(!req.session.userInfo.isAdmin ) {
    //     res.render('./404.html')
    //     return
    // }

    var id = req.query.id

    Category.findOne({
        _id: id
    }).then(isCategory => {
        if (!isCategory) {
            res.render('./admin/submitError.html', {
                userInfo: req.session.userInfo,
                message: '分类信息不存在'
            })
            return
        } else {
            res.render('./admin/category_edit.html', {
                userInfo: req.session.userInfo,
                category: isCategory
            })
        }
    })
})

//处理分类名称修改
router.post('/category/edit', function (req, res, next) {

    //获取当前编辑分类名称
    var category = req.body.categoryname || ''
    //获取需要编辑分类ID
    var id = req.query.id || ''

    //是否存在该分类名称
    Category.findOne({
        _id: id
    }).then(isHaveCategory => {
        if (!isHaveCategory) {
            res.render('./admin/submitError.html', {
                userInfo: req.session.userInfo,
                message: '分类信息不存在'
            })
            return
        } else {
            //若用户没有修改分类名称
            if (category == isHaveCategory.categoryName) {
                res.render('./admin/submitSuccess.html', {
                    userInfo: req.session.userInfo,
                    message: '修改成功'
                })
                return
            }else {
                //若用户修改了分类名称,判断是否已存在相同分类名称
              return  Category.findOne({
                    _id : {$ne:id},
                    categoryName:category
                })
            }
        }
    }).then(hasSameCategory=>{
        //存在相同分类名称
        if(hasSameCategory) {
            res.render('./admin/submitError.html', {
                userInfo: req.session.userInfo,
                message: '分类名称已存在'
            })
            return
        } else {
            //不存在相同分类名称
            return Category.update({_id:id},{categoryName:category})
        }
    }).then(editCategorySuccess=>{
        if(!editCategorySuccess) {
            res.render('./admin/submitError.html', {
                userInfo: req.session.userInfo,
                message: '服务器繁忙，请稍后再试'
            })
            return
        }else {
            res.render('./admin/submitSuccess.html', {
                userInfo: req.session.userInfo,
                message: '修改成功',
                url: '/admin/category'
            })
        }
    })

})

//处理分类删除
router.get('/category/delete',function (req, res, next) {

    //获取需要删除分类ID
    var id = req.query.id || ''

    //判断是否存在该分类
    Category.findOne({
        _id:id
    }).then(isHaveCategory=>{
        //若不存在该分类
        if(!isHaveCategory) {
            res.render('./admin/submitError.html', {
                userInfo: req.session.userInfo,
                message: '分类信息不存在'
            })
        }else {
            //存在该分类则删除
            Category.remove({
                _id:id
            }).then(removeCaregorySuccess=>{
                //删除分类失败
                if(!removeCaregorySuccess){
                    res.render('./admin/submitError.html', {
                        userInfo: req.session.userInfo,
                        message: '服务器繁忙，请稍后重试。。'
                    })
                    return
                }else {
                    //删除成功
                    res.render('./admin/submitSuccess.html',{
                        userInfo: req.session.userInfo,
                        message: '删除成功',
                        url: '/admin/category'
                    })
                }
            })
        }
    })

})

module.exports = router