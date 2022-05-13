/*
 * @Author: your name
 * @Date: 2020-12-11 09:54:19
 * @LastEditTime: 2022-03-31 16:14:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \register-managef:\project\inquiry-wap\src\api\common.js
 */

import $request from './request'
// import { AppId, appSecret } from ''

class CommonClass {
  constructor() {}

  /**
   * @description: 获取患者列表
   * @param {*}
   * @return {*}
   */

  getPatientList(params: any): any {
    let data = { ...params }
    return $request.post(`/wenzhen/patient_list`, data, '')
  }
}

let common = new CommonClass()

export default common
