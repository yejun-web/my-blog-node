const { DataTypes } = require('sequelize')
const sequelize = require('./database')

const Role = sequelize.define(
    'role',
    {
        roleId: { // 角色id
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        roleName: DataTypes.STRING, // 角色名称
    },
    { tableName: 'role' }
)

module.exports = Role
