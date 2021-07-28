const Router = require('koa-router')
const multer = require('koa-multer')
const { join } = require('path')
const { COPYFILE_EXCL } = require('constants')

// 静态资源仓库链接地址
const serverip = 'http://localhost:8088/uploads/'

const router = new Router()

// 存放地址
const dirpath = join(process.cwd(), 'www/uploads/')

const storage = multer.diskStorage({
  destination: dirpath,
  filename(req, file, cb) {
    const filename = file.originalname.split('.')
    cb(null, `${Date.now()}.${filename[filename.length - 1]}`)
  },
})

// 文件限制 前端已做限制
const limits = {
  fields: 10, //非文件字段的数量
  fileSize: 10000 * 1024, //文件大小 单位 kb || size < 10mb
  files: 1, //文件数量
}

const upload = multer({ storage, limits })

router.get('/api/upload', async (ctx) => {
  try {
    ctx.body = {
      code: 1,
      msg: '此接口为上传接口！请您使用POST请求~',
    }
  } catch (err) {
    ctx.body = {
      code: 0,
      err,
    }
  }
})

router.post('/api/upload', async (ctx) => {
  try {
    await upload.single('file')(ctx)
    ctx.body = {
      code: 1,
      msg: '上传成功！',
      fileUrl: serverip + ctx.req.file.filename,
    }
  } catch (err) {
    if (err.code == 'LIMIT_FILE_SIZE') {
      ctx.body = {
        code: 0,
        err: '文件大小超出限制！',
        msg: '上传错误!',
      }
      return
    }
    ctx.body = {
      code: 0,
      err,
      msg: '上传错误!',
    }
  }
})

router.get('/api/download', async (ctx) => {
  ctx.body = {
    msg: '下载成功！',
    code: 1,
  }
})

module.exports = router
