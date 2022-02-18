const express = require('express')
const router = express.Router()
const { Op } = require('sequelize')
const Article = require('../models/articleModel')
const Category = require('../models/categoryModel')

/**
 * 获取文章分页
 * @param current      [Number] 当前页数
 * @param pageSize     [Number] 分页大小
 * @param categoryName [Number] 分类名称
 * @param tagName      [Number] 标签名称
 */
router.post('/list', async (req, res) => {
    let { count, rows } = await Article.findAndCountAll({
        offset: (req.body.current - 1) * req.body.pageSize,
        limit: req.body.pageSize,
        where: {
            ...(req.body.categoryName
                ? {
                    categoryName: {
                          [Op.like]: `%${req.body.categoryName}%`,
                      },
                  }
                : ''),
            ...(req.body.tagName
                ? {
                      tags: {
                          [Op.like]: `%${req.body.tagName}%`,
                      },
                  }
                : ''),
        },
        order: [['id', 'DESC']],
    })
    // 获取标签名称
    let _rows = rows.map(item => {
        if (item['tags']) {
            item['tags'] = item['tags'].split(',')
        }
        return item
    })
    res.sendResult(200, {
        records: _rows,
        current: req.body.current,
        pageSize: req.body.pageSize,
        total: count,
    })
})

/**
 * 新增、编辑文章
 * @param id         [Number] 文章id
 * @param title      [String] 文章标题
 * @param desc       [String] 文章描述
 * @param content    [Text]   文章内容
 * @param createTime [Date]   创建时间
 * @param updateTime [Date]   更新时间
 * @param imgUrl     [String] 预览图
 * @param tags       [String] 标签
 * @param categoryId [Number] 分类
 */
router.post('/set', async (req, res) => {
    const { categoryName } = await Category.findOne({
        where: { categoryId: req.body.categoryId },
    })
    if (!req.body.id) {
        // 新增文章
        Article.create({
            title: req.body.title,
            desc: req.body.desc,
            content: req.body.content,
            createTime: req.body.createTime,
            updateTime: req.body.updateTime,
            imgUrl: req.body.imgUrl,
            tags: req.body.tags.join(','),
            categoryId: req.body.categoryId,
            categoryName,
        })
        .then(() => {
            res.sendResult(200, null, '新增成功')
        })
        .catch((error) => {
            res.sendResult(502, null, error.parent.sqlMessage || error)
        })
    } else {
        // 编辑文章
        Article.update(
            {
                title: req.body.title,
                desc: req.body.desc,
                content: req.body.content,
                createTime: req.body.createTime,
                updateTime: req.body.updateTime,
                imgUrl: req.body.imgUrl,
                tags: req.body.tags.join(','),
                categoryId: req.body.categoryId,
                categoryName,
            },
            {
                where: {
                    id: req.body.id,
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
 * 删除文章
 */
router.post('/delete/:id', (req, res) => {
    Article.destroy({
        where: {
            id: req.params.id,
        },
    })
    .then(() => {
        res.sendResult(200, null, '删除成功')
    })
    .catch((error) => {
        res.sendResult(502, null, error.parent.sqlMessage || error)
    })
})

module.exports = router
