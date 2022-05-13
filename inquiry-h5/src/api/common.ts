/*
 * @Author: your name
 * @Date: 2020-12-11 09:54:19
 * @LastEditTime: 2022-04-13 16:16:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \register-managef:\project\inquiry-wap\src\api\common.js
 */

import $request from './request'
import config from '../config/config'
// import { AppId, appSecret } from ''

class CommonClass {
  constructor() {}

  /**
   * @description:处方支付 获取微信 openId
   * @param {*}
   * @return {*}
   */
  getWxOpenId(code: any) {
    let data = {
      code,
      debug: 1,
    }
    // https://cswzapi.myzx.cn/wxpay/orderpay?order_id=210307103410389544
    return $request.get(`/wzapi/wxpay/openid`, data, 3)
  }

  /**
   * @description: 通过M端回传的token 获取用户信息
   * @param {*}
   * @return {*}
   */

  getUserInfo(): any {
    return $request.get(`/auth/wx/me`, {}, '')
  }

  /**
   * @description: 获取首页数据
   * @param {*}
   * @return {*}
   */

  getHomeInfo(): any {
    return $request.get(`${config.BaseMpUrl}/index/indexJson`, {}, 3)
  }

  // /**
  //  * @description: 通过code换取小程序openID
  //  * @param {*}
  //  * @return {*}
  //  */

  // getOpenId(code) {
  //   return $request.post(`/auth/wx/code2Session`, { code }, '')
  // }
}

let common = new CommonClass()

export default common
