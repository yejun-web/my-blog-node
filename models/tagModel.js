const { DataTypes } = require('sequelize')
const sequelize = require('./database')

const Tag = sequelize.define(
    'tag',
    {
        tagId: { // 标签id
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        tagName: DataTypes.STRING, // 标签名称
    },
    { tableName: 'tag' }
)

module.exports = Tag