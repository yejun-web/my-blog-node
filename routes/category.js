const express = require('express')
const router = express.Router()
const Category = require('../models/categoryModel')

/**
 * 获取分类列表
 * @param current    [Number] 当前页数
 * @param pageSize   [Number] 分页大小
 */
router.post('/list', (req, res) => {
    Category.findAll({
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

/**
 * 新增、编辑分类
 * @param categoryId   [Number] 分类id
 * @param categoryName [String] 分类名称
 */
router.post('/set', async (req, res) => {
    const result = await Category.findOne({
        where: {
            categoryName: req.body.categoryName,
        },
    })
    if (
        (result && !req.body.categoryId) ||
        (result && req.body.categoryId && result.categoryId !== req.body.categoryId)
    ) {
        return res.sendResult(201, null, '分类名称重复')
    }
    if (!req.body.categoryId) {
        // 新增分类
        Category.create({
            categoryName: req.body.categoryName,
        })
        .then(() => {
            res.sendResult(200, null, '新增成功')
        })
        .catch((error) => {
            res.sendResult(502, null, error.parent.sqlMessage || error)
        })
    } else {
        // 编辑分类
        Category.update(
            {
                categoryName: req.body.categoryName,
            },
            {
                where: {
                    categoryId: req.body.categoryId,
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
 * 删除分类
 */
router.post('/delete/:id', (req, res) => {
    Category.destroy({
        where: {
            categoryId: req.params.id,
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