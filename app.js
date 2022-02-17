const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

/**
 * 测试连接
 */
const sequelize = require('./models/database')
sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.')
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err)
    })

/**
 * 初始化响应机制
 */
const response = require('./utils/response')
app.use(response)

/**
 * 开放目录
 */
app.use('/', express.static('./'))

/**
 * 设置请求头
 */
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Content-Type', 'application/json;charset=utf-8')
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Token')
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Authorization')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With, X_Requested_With')
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
    if (req.method == 'OPTIONS') res.send(200)
    /* 设置options请求快速返回 */ next()
})

/**
 * passport 验证策略
 */
var admin_passport = require('./utils/passport')
admin_passport.initialize(app)
app.use('/login', admin_passport.login)
// 去除部分接口验证
app.use(/^(?!.*(list|register|upload)).*$/, admin_passport.tokenVerify)

/**
 * 路由加载
 */
const mount = require('mount-routes')
mount(app, path.join(process.cwd(), '/routes'), true)

module.exports = app
