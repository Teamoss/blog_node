
const express = require('express')
const router = express.Router()
const User = require('../models/User')

//后台首页
router.get('/',function (req, res, next) {
    res.render('./admin/index.html',{
        userInfo: req.session.userInfo
    })
})

//用户管理
router.get('/user',function (req, res, next) {

      var limit = 4  //每页显示4条数据
      var pages = 0   //总页数

      User.find().then(userList=>{
          res.render('./admin/user_index.html',{
              userInfo: req.session.userInfo,
              userList : userList
          })
      })
})

module.exports = router