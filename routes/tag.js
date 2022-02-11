const express = require('express')
const router = express.Router()
const Tag = require('../models/tagModel')

/**
 * 获取标签列表
 * @param current    [Number] 当前页数
 * @param pageSize   [Number] 分页大小
 */
router.post('/list', (req, res) => {
    Tag.findAndCountAll({
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
        res.sendResult(502, null, error.parent.sqlMessage || error)
    })
})

/**
 * 新增、编辑标签
 * @param tagId   [Number] 标签id
 * @param tagName [String] 标签名称
 */
router.post('/set', async (req, res) => {
    const result = await Tag.findOne({
        where: {
            tagName: req.body.tagName,
        },
    })
    if (
        (result && !req.body.tagId) ||
        (result && req.body.tagId && result.tagId !== req.body.tagId)
    ) {
        return res.sendResult(201, null, '标签名称重复')
    }
    if (!req.body.tagId) {
        // 新增标签
        Tag.create({
            tagName: req.body.tagName,
        })
        .then(() => {
            res.sendResult(200, null, '新增成功')
        })
        .catch((error) => {
            res.sendResult(502, null, error.parent.sqlMessage || error)
        })
    } else {
        // 编辑标签
        Tag.update(
            {
                tagName: req.body.tagName,
            },
            {
                where: {
                    tagId: req.body.tagId,
                },
            }
        )
        .then(() => {
            res.sendResult(200, null, '修改成功')
        })
        .catch((error) => {
            res.sendResult(502, null, error.parent.sqlMessage || error)
        })
    }
})

/**
 * 删除标签
 */
router.post('/delete/:id', (req, res) => {
    Tag.destroy({
        where: {
            tagId: req.params.id,
        },
    })
    .then(() => {
        res.sendResult(200, null, '删除成功')
    })
    .catch((error) => {
        res.sendResult(502, null, error.parent && error.parent.sqlMessage || error)
    })
})

module.exports = router