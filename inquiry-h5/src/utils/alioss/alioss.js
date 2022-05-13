import Base64 from './base64.js'
import Crypto from 'crypto-js'
import utils from '../util'

class MpUploadOssHelper {
  constructor(options) {
    ; (this.accessKeyId = options.access_key_id), (this.accessKeySecret = options.access_key_secret)
    this.endpoint = options.endpoint
    this.securityToken = options.security_token
    this.timeOut = options.timeout || 1 // 限制参数的生效时间(单位：小时)。
    this.maxSize = options.maxSize || 10 // 限制上传文件大小(单位：MB)。
    this.bucket = 'img-myzx-cn' // OSS存储空间名称
  }

  uploadFile (filePath) {
    return new Promise((resolve, reject) => {
      if (!filePath) {
        reject({
          status: false,
          err: '文件错误',
        })
        return
      }
      // 文件后缀
      let dotIndex = filePath.lastIndexOf('.')
      let filePathLength = filePath.length
      let suffix = filePath.substring(dotIndex, filePathLength)
      const url = `https://${this.bucket}.${this.endpoint}`
      const key = `yyzx-xcx/${utils.formatDate(
        new Date(),
        'YYYY-MM-DD'
      )}/${new Date().getTime()}${suffix}`
      const policy = this.getPolicyBase64()
      const signature = this.computeSignature(policy)

      wx.uploadFile({
        url,
        filePath,
        name: 'file',
        formData: {
          key,
          OSSAccessKeyId: this.accessKeyId,
          policy,
          signature,
          'x-oss-security-token': this.securityToken,
          success_action_status: '200',
        },
        success: (res) => {
          if (res.statusCode == 200) {
            resolve(`${url}/${key}`)
          } else {
            reject(res)
          }
        },
        fail: (err) => {
          reject(err)
        },
      })
    })
  }

  // 计算签名
  computeSignature (policy) {
    return Crypto.enc.Base64.stringify(Crypto.HmacSHA1(policy, this.accessKeySecret))
  }

  getPolicyBase64 () {
    let date = new Date()
    // 设置policy过期时间。
    date.setHours(date.getHours() + this.timeOut)
    let srcT = date.toISOString()
    const policyText = {
      expiration: srcT,
      conditions: [
        // 限制上传文件大小。
        ['content-length-range', 0, this.maxSize * 1024 * 1024],
      ],
    }
    return Base64.encode(JSON.stringify(policyText))
  }
}

export default MpUploadOssHelper
