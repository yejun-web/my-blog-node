const { Sequelize } = require('sequelize')
const CONFIG = require('../config/app.config')

const sequelize = new Sequelize(
    CONFIG.DATABASE,
    CONFIG.USERNAME,
    CONFIG.PASSWORD,
    {
        host: CONFIG.HOST,
        port: CONFIG.PORT,
        dialect: 'mysql',
        timezone: '+08:00',
        logging: false,
        pool: {
            max: 5,
            min: 0,
            idle: 10000,
        },
        define: {
            freezeTableName: true, // 禁止自动修改表名
            timestamps: false, // 不需要添加 createdAt 和 updatedAt 两个时间戳字段
        },
    }
)

module.exports = sequelize
