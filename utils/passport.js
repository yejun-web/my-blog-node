const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const BearerStrategy = require('passport-http-bearer').Strategy
const User = require('../models/userModel')
const md5 = require('../utils/md5')
const jwt = require('jsonwebtoken')
const CONFIG = require('../config/app.config')

/**
 * 用户名、密码数据库验证
 */
const loginVerify = async (username, password, callback) => {
    const result = await User.findOne({
        where: {
            username: username,
        },
    })
    if (!result) return callback('用户名不存在')
    if (result.password === md5(password)) {
        callback(null, result)
    } else {
        callback('密码错误')
    }
}

/**
 * 登录函数初始化
 */
module.exports.initialize = (app, callback) => {
    // 用户名、密码 登录策略
    passport.use(
        new LocalStrategy(
            {
                usernameField: 'username',
                passwordField: 'password',
            },
            function (username, password, done) {
                loginVerify(username, password, function (err, user) {
                    if (err) return done(err)
                    return done(null, user)
                })
            }
        )
    )
    // token 验证策略
    passport.use(
        new BearerStrategy(function (token, done) {
            jwt.verify(token, CONFIG.SECRECTKEY, function (err, decode) {
                if (err) {
                    return done('验证错误')
                }
                return done(null, decode)
            })
        })
    )
    app.use(passport.initialize())
    if (callback) callback()
}

/**
 * 登录验证逻辑
 */
module.exports.login = (req, res, next) => {
    passport.authenticate('local', function (err, user) {
        if (err) return res.sendResult(201, null, err)
        if (!user) return res.sendResult(201, null, '参数错误')
        const token = jwt.sign({ uid: user.id }, CONFIG.SECRECTKEY, { expiresIn: CONFIG.EXPRIESIN })
        return res.sendResult(200, 'Bearer ' + token, '登录成功')
    })(req, res, next)
}

/**
 * 接口请求拦截验证
 */
module.exports.tokenVerify = (req, res, next) => {
    passport.authenticate(
        'bearer',
        { session: false },
        function (err, tokenData) {
            if (err || !tokenData) return res.sendResult(201, null, '无效token')
            req.userInfo = {
                uid: tokenData['uid'],
            }
            next()
        }
    )(req, res, next)
}
