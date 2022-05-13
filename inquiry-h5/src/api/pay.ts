/*
 * @Author: your name
 * @Date: 2020-12-11 09:54:19
 * @LastEditTime: 2022-04-24 15:11:39
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
   * @description: 微信支付 处理订单是否过期
   * @param {*}
   * @return {*}
   */

  wxPaySelectOrderLock(params: any): any {
    return $request.post(`/pay/wxpay/selectorderlock`, params, '')
  }

  wxPayAddOrderLock(params: any): any {
    return $request.post(`/pay/wxpay/addorderlock`, params, '')
  }

  /**
   * @description: 微信支付
   * @param {*}
   * @return {*}
   */

  getWxPay(params: any): any {
    return $request.post(`/pay/wx/wap`, params, '')
  }

  /**
   * @description: 支付宝短信支付
   * @param {*}
   * @return {*}
   */

  getAlipay(params: any): any {
    return $request.post(`/pay/alipay/sms`, params, '')
  }

  /**
   * @description: 快速咨询支付
   * @param {*}
   * @return {*}
   */
  quickInquiryPay(params: any): any {
    let data = { ...params }
    return $request.post('/wz/v3/order/fast/create/pay', data, '')
  }

  getAlipayFucwap(params: any): any {
    return $request.post(`/pay/alipay/fucwap`, params, '')
  }

  getAlipayWap(params: any): any {
    return $request.post(`/pay/alipay/wap`, params, '')
  }
}

let common = new CommonClass()

export default common
