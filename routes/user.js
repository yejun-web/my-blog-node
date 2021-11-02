const express = require('express')
const router = express.Router()
const User = require('../models/userModel')

/**
 * 获取用户列表
 */
router.get('/list', async (req, res) => {
    User.findAll().then((data) => {
        res.sendResult(null, 200, data)
    })
})

module.exports = router
