const { join } = require('path')

const fs = require('fs')

const koabody = require('koa-body')

// 检查上传路径是否存在 && 生成
const checkDirExist = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
}

// 生成文件目录 => 当天时间
const getUploadDirName = () => {
  const date = new Date()
  let month = Number.parseInt(date.getMonth() + 1)
  month = month.toString().length > 1 ? month : `0${month}`
  const dir = `${date.getFullYear()}${month}${date.getDate()}`
  return dir
}

// 获取文件格式后缀
const getUploadFileExt = (fileName) => {
  let ext = fileName.split('.')
  return ext[ext.length - 1]
}

// 生成随机文件名
const getUploadFileName = (ext) => {
  return `${Date.now()}${Number.parseInt(Math.random() * 10000)}.${ext}`
}

module.exports = koabody({
  multipart: true,
  formidable: {
    uploadDir: join(process.cwd(), 'www/uploads/'),
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024, // 2mb
    onFileBegin: (_name, file) => {
      try {
        // if (file.size > 5 * 1024 * 1024) {
        console.log(file)
        // }
        // 文件后缀
        const ext = getUploadFileExt(file.name)
        // 上传目标文件夹 && 检查是否存在
        const dirpath = `www/uploads/${getUploadDirName()}`
        // 目录名
        const folder = join(process.cwd(), dirpath)
        checkDirExist(folder)
        // 文件名
        const fileName = getUploadFileName(ext)
        // reset path
        file.path = `${folder}/${fileName}`
      } catch (err) {}
    },
  },
  onError: (err, ctx) => {
    ctx.body = {
      err: err.message,
    }
  },
})
