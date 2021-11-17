const express = require('express')
const router = express.Router()
const Role = require('../models/roleModel')

/**
 * 获取权限列表
 * @param current    [Number] 当前页数
 * @param pageSize   [Number] 分页大小
 */
router.post('/list', (req, res) => {
    Role.findAll({
        offset: (req.body.current - 1) * req.body.pageSize,
        limit: req.body.pageSize,
    })
    .then((data) => {
        res.sendResult(null, 200, data)
    })
    .catch((error) => {
        res.sendResult(502, null, error.parent.sqlMessage || error)
    })
})

module.exports = router