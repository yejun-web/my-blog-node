const express = require('express')
const router = express.Router()
const Role = require('../models/roleModel')

/**
 * 获取权限列表
 */
router.post('/list', (req, res) => {
    Role.findAll()
    .then((data) => {
        res.sendResult(null, 200, data)
    })
    .catch((error) => {
        res.sendResult(502, null, error.parent.sqlMessage || error)
    })
})

module.exports = router