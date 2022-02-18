const { DataTypes } = require('sequelize')
const sequelize = require('./database')

const Article = sequelize.define(
    'article',
    {
        id: { // 文章id
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        title: DataTypes.STRING, // 标题
        desc: DataTypes.STRING, // 简介
        content: DataTypes.TEXT, // 内容
        createTime: DataTypes.DATE, // 创建日期
        updateTime: DataTypes.DATE, // 更新日期
        imgUrl: DataTypes.STRING, // 预览图片
        tags: DataTypes.STRING, // 文章标签
        categoryId: DataTypes.INTEGER, // 分类id
        categoryName: DataTypes.STRING, // 分类名称
    },
    { tableName: 'article' }
)

module.exports = Article
