import config from '../config/config'
import cache from '../utils/auth'

class RequestClass {
  constructor() {}
  get(url: any, data: any, isBase: any) {
    return this.request(url, 'get', data, isBase)
  }
  post(url: any, data: any, isBase: any) {
    return this.request(url, 'post', data, isBase)
  }
  request(url: any, method: any, data: any, isBase: any) {
    const token =
      (isBase == 2
        ? cache.getUserAppToken()
        : isBase == 3
        ? cache.getUserMpvToken()
        : cache.getToken()) || ''

    let Accept = 'application/x.myzxxcx.v3+json'
    if (data.verson) {
      Accept = `application/x.myzxxcx.${data.verson}+json`
    }

    let header = {}
    if (isBase == 1) {
      header = {
        'content-type': 'application/x-www-form-urlencoded',
        'X-Requested-With': 'XMLHttpRequest',
        usertoken: cache.getUserAppToken(),
      }
    } else {
      header = {
        'content-type': 'application/x-www-form-urlencoded',
        'X-Requested-With': 'XMLHttpRequest',
        usertoken: token,
        Authorization: `bearer ${token}`,
        Accept: data.isAliPay ? '' : Accept,
      }
    }

    console.log(isBase, url)
    return new Promise((resolve, reject) => {
      uni.getNetworkType({
        success: function(res) {
          if (res.networkType === 'none' || res.networkType === '2g') {
            uni.showToast({
              duration: 1000,
              title: '当前网络不佳，请检查网络连接!',
              icon: 'none',
            })
          }

          uni.request({
            url: isBase == 2 ? url : isBase == 1 ? url : isBase == 3 ? url : config.BaseUrl + url,
            data: data,
            header: header,
            method: method,
            timeout: 3000000,
            success: (result: any) => {
              console.log(result, 'request')
              if (result.statusCode === 200) {
                if (result.data.code === 403 || result.data.code === 401) {
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
                    // uni.navigateTo({
                    //   url: '/pages/login/login',
                    // })
                    let pages = getCurrentPages()
                    let currentPage = pages[pages.length - 1]['$page']['fullPath']
                    window.location.href = `${config.reset_link}/user/login/index?type=1&reset_url=${currentPage}`
                  }, 2000)

                  reject(result.data)
                } else if (result.data.code === 400) {
                  uni.showToast({
                    title: result.data.message,
                    icon: 'none',
                    duration: 2000,
                  })
                  reject(result.data)
                } else {
                  resolve(result.data)
                }
              } else {
                if (result.statusCode === 400) {
                  uni.showToast({
                    title: result.data.message,
                    icon: 'none',
                    duration: 2000,
                  })
                }

                if (result.statusCode === 401) {
                  if (result.data.code === 401) {
                    uni.showToast({
                      title: result.data.message,
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
                  }
                }
                reject(result.data)
              }
            },
            fail: (err) => {
              console.log(res, 'request fail')
              uni.showToast({
                duration: 2000,
                title: '请重新刷新!',
                icon: 'none',
              })
              reject(res)
            },
          })
        },
      })
    })
  }
}

let $send = new RequestClass()

export default $send
