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
    res.header('Access-Control-Allow-Methods', '*')
    res.header('Access-Control-Allow-Headers', 'Content-Type')
    res.header('Content-Type', 'application/json;charset=utf-8')
    next()
})

/**
 * 路由加载
 */
const mount = require('mount-routes')
mount(app, path.join(process.cwd(), '/routes'), true)

module.exports = app
