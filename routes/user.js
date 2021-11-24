const express = require('express')
const router = express.Router()
const User = require('../models/userModel')
const Role = require('../models/roleModel')
const md5 = require('../utils/md5')

/**
 * 用户注册
 * @param username [String] 用户名
 * @param password [String] 用户密码
 * @param role     [Number] 用户角色
 */
router.post('/register', async (req, res) => {
    // 重复用户检查
    const { username, password, role } = req.body
    const result = await User.findAll({
        where: {
            username: username,
        },
    })
    if (result.length) return res.sendResult(201, null, '用户名重复')
    // 新增用户
    User.create({
        username,
        password: md5(password),
        role,
    })
    .then(() => {
        res.sendResult(200, null, '新增成功')
    })
    .catch((error) => {
        res.sendResult(502, null, error.parent && error.parent.sqlMessage || error)
    })
})

/**
 * 用户信息修改
 * @param id       [Number] 用户id
 * @param username [String] 用户名
 * @param password [String] 用户密码
 * @param role     [Number] 用户角色
 */
router.post('/setInfo', async (req, res) => {
    const { id, username, password, role } = req.body
    const result = await User.findOne({
        where: {
            username: username,
        },
    })
    if (result && result.id !== id) {
        return res.sendResult(201, null, '用户名重复')
    }
    User.update(
        {
            username,
            role,
            ... password && {
                password: md5(password),
            }
        },
        {
            where: {
                id,
            },
        }
    )
    .then(() => {
        res.sendResult(200, null, '修改成功')
    })
    .catch((error) => {
        res.sendResult(502, null, error.parent && error.parent.sqlMessage || error)
    })
})

/**
 * 获取用户信息
 */
router.post('/getInfo', async (req, res) => {
    const userDataResult = await User.findOne({
        where: {
            id: req.userInfo.uid,
        },
    })
    const { id, username, role } = userDataResult
    const roleDataResult = await Role.findOne({
        where: {
            roleId: role,
        }, 
    })
    const { roleName } = roleDataResult
    res.sendResult(200, {
        id,
        username,
        roleName
    })
})


/**
 * 获取用户列表
 * @param current    [Number] 当前页数
 * @param pageSize   [Number] 分页大小
 */
router.post('/list', (req, res) => {
    User.findAndCountAll({
        offset: (req.body.current - 1) * req.body.pageSize,
        limit: req.body.pageSize,
    })
    .then(async ({ count, rows }) => {
        // 获取所有角色
        let roleList = await Role.findAll()
        let roleMap = new Map()
        roleList.forEach((item) => {
            roleMap.set(item.roleId, item.roleName)
        })
        let _rows = []
        rows.forEach(item => {
            _rows.push({
                id: item.id,
                username: item.username,
                roleId: item.role,
                roleName: roleMap.get(item.role)
            })
        })
        res.sendResult(200, {
            records: _rows,
            current: req.body.current,
            pageSize: req.body.pageSize,
            total: count,
        })
    })
    .catch((error) => {
        res.sendResult(502, null, error.parent && error.parent.sqlMessage || error)
    })
})


/**
 * 删除用户
 */
router.post('/delete/:id', (req, res) => {
    User.destroy({
        where: {
            id: req.params.id,
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
