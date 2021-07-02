const Router = require('koa-router')
const multer = require('koa-multer')
const { join } = require('path')

// 静态资源仓库链接地址
const serverip = 'http://localhost:8082/uploads/'

const router = new Router()

// 存放地址
const dirpath = join(process.cwd(), 'www/uploads/')

const storage = multer.diskStorage({
  destination: dirpath,
  filename (req, file, cb) {
    const filename = file.originalname.split('.')
    cb(null, `${Date.now()}.${filename[filename.length - 1]}`)
  }
})

// 文件限制 前端已做限制
// const limits = {
//   fields: 10,//非文件字段的数量
//   fileSize: 1000 * 1024,//文件大小 单位 b
//   files: 1//文件数量
// }

const upload = multer({ storage })

router.post('/api/upload', upload.single('file'), async ctx => {
  try {
    ctx.body = {
      code: 1,
      msg: '上传成功！',
      fileUrl: serverip + ctx.req.file.filename
    }
  } catch (err) {
    ctx.body = {
      code: 0,
      err,
      msg: '上传错误!'
    }
  }
})

router.get('/api/download', async ctx => {
  ctx.body = {
    msg: '下载成功！',
    code: 1,
  }
})

module.exports = router