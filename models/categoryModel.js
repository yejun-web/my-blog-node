const { DataTypes } = require('sequelize')
const sequelize = require('./database')

const Category = sequelize.define(
    'category',
    {
        categoryId: { // 分类id
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        categoryName: DataTypes.STRING, // 分类名称
    },
    { tableName: 'category' }
)

module.exports = Category
