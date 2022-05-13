import $request from '../api/request'
import config from '../config/config'
import WXBizDataCrypt from './RdWXBizDataCrypt'
import cache from '../utils/auth'

class CommonClass {
  constructor() {}

  request(parameter: any) {
    // Accept: 'application/vnd.adminapi.v1+json',
    // Authorization: token ? 'bearer ' + token : '',
    $request
      .request(parameter.url, parameter.method, parameter.data, 1)
      .then((res) => {
        console.log(res)
        parameter.callback instanceof Function && parameter.callback(res) //成功的函数，看自己项目传值
      })
      .catch((err) => {})
  }

  requestToken(parameter: any) {
    console.log(parameter) // 'X-Requested-With': 'XMLHttpRequest',

    let key = 0.38466596883098503,
      data = WXBizDataCrypt(JSON.stringify(parameter.data), key)
    $request
      .request(
        parameter.url,
        parameter.method,
        parameter.data
          ? {
              datas: data,
            }
          : parameter.data,
        1
      )
      .then((res: any) => {
        if (res.code == 403 || res.code == 401) {
          uni.showToast({
            title: '你已在其他端登录，如要继续使用请重新登录~~!',
            icon: 'none',
            duration: 2000,
          })
          cache.removePhone()
          cache.removeOpenId()
          cache.removeToken()
          cache.removeCode()
          cache.removeUserAppToken()
          cache.removeUserMpvToken()
          cache.removeDoctorDid()
          setTimeout(() => {
            let pages = getCurrentPages()
            let currentPage = pages[pages.length - 1]['$page']['fullPath']
            window.location.href = `${config.reset_link}/user/login/index?type=1&reset_url=${currentPage}`
          }, 2000)
        } else if (res.code === 400) {
          uni.showToast({
            title: res.message,
            icon: 'none',
            duration: 2000,
          })
        } else {
          parameter.callback instanceof Function && parameter.callback(res) //成功的函数，看自己项目传值
        }
      })
      .catch((err) => {})
  }
}

let common = new CommonClass()

export default common
