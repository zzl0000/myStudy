/*
 * @Author: your name
 * @Date: 2020-12-11 09:54:19
 * @LastEditTime: 2022-03-30 10:04:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \register-managef:\project\inquiry-wap\src\api\common.js
 */

import $request from './request'

class CommonClass {
  constructor() {}
  /**
   * @description: 获取我的问诊记录
   * @param {*}
   * @return {*}
   */

  getInquiryList(params: any) {
    let data = { ...params }
    return $request.post(`/wenzhen/order_list`, data, '')
  }
}

let common = new CommonClass()

export default common
