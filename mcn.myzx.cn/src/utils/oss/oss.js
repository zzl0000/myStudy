import OSS from 'ali-oss';
import { formatToDate } from '/@/utils/dateUtil';

class OssClass {
  constructor() {
    this.client = null;
  }
  init (cf) {
    console.log(cf);
    this.client = new OSS({
      // yourRegion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
      region: cf.region,
      // 从STS服务获取的临时访问凭证。临时访问凭证包括临时访问密钥（AccessKeyId和AccessKeySecret）和安全令牌（SecurityToken）。
      accessKeyId: cf.access_key_id,
      accessKeySecret: cf.access_key_secret,
      stsToken: cf.security_token,
      // 填写Bucket名称。
      bucket: 'img-myzx-cn', // cf.endpoint,
      timeout: 24 * 60 * 1000, // 超时时间，默认 60s
    });
  }
  async put (file) {
    let that = this;
    const base64 = file.content.split(',').pop();
    const fileType = file.content.split(';').shift().split(':').pop();
    // base64转blob
    const blob = toBlob(base64, fileType);
    // blob转arrayBuffer
    const reader = new FileReader();
    reader.readAsArrayBuffer(blob);
    return new Promise((resolve, reject) => {
      reader.onload = function (event) {
        // 文件名
        const objectKey = `/video/aliyunoss/${formatToDate(new Date())}/${new Date().getTime()}.${fileType.split('/').pop()}`;
        // arrayBuffer转Buffer
        const buffer = new OSS.Buffer(event.target.result);
        // 上传
        that.client
          .put(objectKey, buffer)
          .then(function (result) {
            // console.log(result)
            resolve(result);
          })
          .catch(function (err) {
            // console.log(err);
            reject(err);
          });
      };
    });
  }

  async upload (file) {
    return new Promise((resolve, reject) => {
      let name = `/video/aliyunoss/${formatToDate(new Date())}/${new Date().getTime()}.${file.type.split('/').pop()}`
      this.client.put(name, file).then((res) => {
        resolve(res);
      }).catch((error) => {
        reject(error);
      })
    })
  }
}

function toBlob (urlData, fileType) {
  let bytes = window.atob(urlData);
  let n = bytes.length;
  let u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bytes.charCodeAt(n);
  }
  return new Blob([u8arr], { type: fileType });
}

let Oss = new OssClass();

export default Oss;
