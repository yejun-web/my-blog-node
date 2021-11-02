const { DataTypes } = require('sequelize')
const sequelize = require('./database')

const User = sequelize.define(
    'user',
    {
        id: { // 用户id
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        username: DataTypes.STRING, // 用户名
        password: DataTypes.STRING, // 密码
        role: DataTypes.INTEGER, // 权限
    },
    { tableName: 'user' }
)

module.exports = User
