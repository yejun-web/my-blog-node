const express = require('express')
const router = express.Router()
const Role = require('../models/roleModel')

/**
 * 获取权限列表
 * @param current    [Number] 当前页数
 * @param pageSize   [Number] 分页大小
 */
router.post('/list', (req, res) => {
    Role.findAndCountAll({
        offset: (req.body.current - 1) * req.body.pageSize,
        limit: req.body.pageSize,
    })
    .then(({ count, rows }) => {
        res.sendResult(200, {
            records: rows,
            current: req.body.current,
            pageSize: req.body.pageSize,
            total: count,
        })
    })
    .catch((error) => {
        res.sendResult(502, null, error.parent && error.parent.sqlMessage || error)
    })
})

module.exports = router