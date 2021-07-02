
###  记录一下 koa 配合 koa-multer 上传图片操作实现


#### Koa 配置

```js
const Router = require('koa-router')
const multer = require('koa-multer')
const { join } = require('path')

const router = new Router()

// 静态资源仓库地址 
const folder = 'http://www.xxx.com/uploads/'

// 文件限制
const limits = {
  fields: 10,//非文件字段的数量
  fileSize: 1000 * 1024,//文件大小 单位b
  files: 1//文件数量
}

// 存放地址
const destination = join(process.cwd(), 'www/uploads/')

const storage = multer.diskStorage({
  destination, // 存放位置 
  filename (req, file, cb) {
    // 这里给存放文件做 rename
    const filename = file.originalname.split('.')
    cb(null, `${Date.now()}.${filename[filename.length - 1]}`)
  }
})

const upload = multer({ storage,limits })

router.post('/api/upload', upload.single('file'), async ctx => {
  ctx.body = {
    code: 1,
    fileUrl: folder + ctx.req.file.filename
  }

  注意！！！ 返回的内容在前端上传需要用到
  
})

module.exports = router
    
```
#### 后端 react + antd :

```js

  import React, {  useState } from 'react'

  import { Upload, UploadProps} from 'antd'

  const [previewImage, setPreviewImage] = useState('');

  const upload = () => {

  const uploadParam: UploadProps = {
    accept: '.jpeg,.gif,.png,.jpg', 
    // 接受的文件类型 这里只接受图片
    action: '/api/upload',  
    // 上传地址 由于做了跨域处理  其实就是向这个链接发送 Post请求
    // 完整链接 : http:www.xxx.com/api/uplod
    headers: {
      authorization: 'authorization-text',
    },
    showUploadList: false,
    beforeUpload: handleBeforeUpload,
    onChange: handleChange
  };

  // 限制图片的格式，size，分辨率
  const handleBeforeUpload = (file: RcFile) => {
    const isJPG = file.type === 'image/jpeg';
    const isJPEG = file.type === 'image/jpeg';
    const isGIF = file.type === 'image/gif';
    const isPNG = file.type === 'image/png';
    if (!(isJPG || isJPEG || isGIF || isPNG)) {
      Modal.error({
        title: '只能上传JPG 、JPEG 、GIF、 PNG格式的图片~'
      });
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 5; //小于5M
    if (!isLt2M) {
      Modal.error({
        title: '图片超过5M限制，不允许上传~'
      });
      return false;
    }
    return (isJPG || isJPEG || isGIF || isPNG) && isLt2M 
  };

  const handleChange = (info: UploadChangeParam) => {
    let { file } = info
    switch (file.status) {
      case 'uploading':
        // 正在上传中 可以做一下loding处理
        break;
      case 'done':
        // 上传完成 此处 response 是后端API返回的结果
        // 由于我只反回了 { code ,fileUrl } 两个字段
        if (file.response && file.response.code) {
          let { response } = file
          message.success('上传成功！');
          setPreviewImage(response.fileUrl); 
          // 展示图片 此为API返回的图片线上地址
        } else {
          // 若有错误检查是否有返回对象，没有就是本地错误
          message.error(response ? response.msg: '上传失败！');
        }
        break;
    }
  }

  return (
    <Upload {...uploadParam}>
      <Avatar src={previewImage} size={120} />
    </Upload>
  )

}
```


