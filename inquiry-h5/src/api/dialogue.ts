/*
 * @Author: your name
 * @Date: 2020-12-11 09:54:19
 * @LastEditTime: 2022-03-30 13:57:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \register-managef:\project\inquiry-wap\src\api\common.js
 */

import $request from './request'
// import { AppId, appSecret } from ''

class CommonClass {
  constructor() {}

  /**
   * @description: 获取对话列表患者
   * @param {*}
   * @return {*}
   */

  getPatientList(params: any): any {
    let data = { ...params }
    return $request.post('/wz/v3/order/patientList', data, '')
  }

  /**
   * @description: 获取对话列表
   * @param {*}
   * @return {*}
   */

  getSessionList(params: any) {
    let data = { ...params }
    return $request.post('/wz/v3/order/sessionList', data, '')
  }
}

let common = new CommonClass()

export default common
