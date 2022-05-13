/**

 */
// 引入CryptoJS
import CryptoJS from 'crypto-js'

function RdWXBizDataCrypt(message: any, key: any) {
  var keyHex = CryptoJS.enc.Utf8.parse(key)
  var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  })
  return encrypted.ciphertext.toString()
}

export default RdWXBizDataCrypt
