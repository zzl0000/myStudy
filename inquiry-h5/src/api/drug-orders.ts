/*
 * @Author: your name
 * @Date: 2020-12-11 09:54:19
 * @LastEditTime: 2022-03-30 10:59:42
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

  getOrderList(params: any) {
    return $request.post(`/apps/mpv2/prescript/getList`, params, '')
  }
}

let common = new CommonClass()

export default common
