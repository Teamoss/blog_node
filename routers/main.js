const express = require('express')
const router = express.Router()

router.get('/', function (req, res, next) {
    res.render('./main/index.html', {
        userInfo: req.session.userInfo
    })
})

module.exports = router