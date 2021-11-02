const { DataTypes } = require('sequelize')
const sequelize = require('./database')

const Category = sequelize.define(
    'category',
    {
        categoryId: DataTypes.INTEGER, // 分类id
        categoryName: DataTypes.STRING, // 分类名称
    },
    { tableName: 'category' }
)

module.exports = Category
