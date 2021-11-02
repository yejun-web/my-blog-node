const express = require('express')
const router = express.Router()
const { Op } = require('sequelize')
const Article = require('../models/articleModel')
const Tag = require('../models/tagModel')

/**
 * 获取文章分页
 * @param current    [Number] 当前页数
 * @param pageSize   [Number] 分页大小
 * @param categoryId [Number] 文章分类id
 * @param tagId      [Number] 文章标签id
 */
router.post('/list', async (req, res) => {
    let { count, rows } = await Article.findAndCountAll({
        offset: (req.body.current - 1) * req.body.pageSize,
        limit: req.body.pageSize,
        where: {
            ...(req.body.categoryId ? { categoryId: req.body.categoryId } : ''),
            ...(req.body.tagId
                ? {
                      tags: {
                          [Op.like]: `%${req.body.tagId}%`,
                      },
                  }
                : ''),
        },
        order: [['id', 'DESC']],
    })
    // 获取标签名称
    let _rows = JSON.parse(JSON.stringify(rows))
    let tagList = await Tag.findAll()
    let tagMap = new Map()
    tagList.forEach((item) => {
        tagMap.set(item.tagId, item.tagName)
    })
    _rows.forEach((item) => {
        item['tagsName'] = new Array()
        if (item.tags) {
            item.tags.split(',').forEach((item2) => {
                if (tagMap.get(parseInt(item2))) {
                    item['tagsName'].push(tagMap.get(parseInt(item2)))
                }
            })
        }
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
router.post('/set', (req, res) => {
    if (!req.body.id) {
        // 新增文章
        Article.create({
            title: req.body.title,
            desc: req.body.desc,
            content: req.body.content,
            createTime: req.body.createTime,
            updateTime: req.body.updateTime,
            imgUrl: req.body.imgUrl,
            tags: req.body.tags,
            categoryId: req.body.categoryId,
        })
        .then(() => {
            res.sendResult(200, null, 'add success')
        })
        .catch((error) => {
            res.sendResult(502, null, error.parent.sqlMessage)
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
                tags: req.body.tags,
                categoryId: req.body.categoryId,
            },
            {
                where: {
                    id: req.body.id,
                },
            }
        )
        .then(() => {
            res.sendResult(200, null, 'edit success')
        })
        .catch((error) => {
            res.sendResult(502, null, error.parent.sqlMessage)
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
        res.sendResult(200, null, 'delete success')
    })
    .catch((error) => {
        res.sendResult(502, null, error.parent.sqlMessage)
    })
})

module.exports = router
