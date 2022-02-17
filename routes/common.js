const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')

/**
 * https://github.com/expressjs/multer/blob/master/doc/README-zh-cn.md
 */
const SAVEPATH = './uploads/'
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, SAVEPATH)
        },
        filename: function (req, file, cb) {
            const suffix = file.originalname.split('.')[file.originalname.split('.').length - 1]
            cb(null, `${new Date().getTime()}.${suffix}`)
        },
    }),
})

/**
 * 单文件上传
 * @param file [File] 文件
 */
router.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file
    res.sendResult(200, {
        file_name: file.originalname,
        file_url: `/${path.join(SAVEPATH, file.filename).replace(/\\/g, '/')}`
    }, '上传成功')
})

/**
 * 多文件上传
 * @param files [Array] 文件数组
 */
 router.post('/upload/multiple ', upload.array('files'), (req, res) => {
    let fileList = []
    req.files.forEach(item => {
        fileList.push({
            file_name: item.originalname,
            file_url: `/${path.join(SAVEPATH, item.filename).replace(/\\/g, '/')}`
        })
    })
    res.sendResult(200, fileList, '上传成功')
})

module.exports = router
