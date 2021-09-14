const { join } = require('path')

const fs = require('fs')

const koabody = require('koa-body')

const mapParams = require('./custom')



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

module.exports = (app) => {
  app.use(
    koabody({
      multipart: true,
      formidable: {
        uploadDir: join(process.cwd(), 'www/uploads'),
        keepExtensions: true,
        maxFileSize: 15 * 1024 * 1024, // 2mb
        onFileBegin: (name, file) => {
          try {
            // if (file.size > 5 * 1024 * 1024) {
            // console.log(file)
            // }
            // 文件后缀
            const ext = getUploadFileExt(file.name)
            // 上传目标文件夹 && 检查是否存在
            // const dirpath = `www/uploads/${getUploadDirName()}`
            const dirpath = `www/uploads`
            // 目录名
            const folder = join(process.cwd(), dirpath)
            checkDirExist(folder)
            // 文件名
            const fileName = getUploadFileName(ext)
            // reset path
            file.path = `${folder}/${fileName}`
            app.context.uploadpath = app.context.uploadpath
              ? app.context.uploadpath
              : {}
            // app.context.uploadpath[name] = `${dirpath}/${fileName}`
            app.context.uploadpath[name] = `${fileName}`
          } catch (err) {}
        },
      },
      onError: (err, ctx) => {
        console.log(err)
        ctx.body = {
          err: err.message,
        }
      },
    })
    ).use(mapParams)
}
