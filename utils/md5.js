/**
 * 对字符串进行加密
 */
const crypto = require('crypto')

module.exports = (message) => {
    const md5 = crypto.createHash('md5')
    const _message = md5.update(message).digest('hex')
    return _message
}