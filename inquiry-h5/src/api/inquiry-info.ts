/*
 * @Author: your name
 * @Date: 2020-12-11 09:54:19
 * @LastEditTime: 2022-04-11 17:22:20
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \register-managef:\project\inquiry-wap\src\api\common.js
 */

import $request from './request'
// import { AppId, appSecret } from ''

class CommonClass {
  constructor() {}

  /**
   * @description: 获取问诊患者信息
   * @param {*}
   * @return {*}
   */

  getWenZhenPatientInfo(param: any): any {
    return $request.post(`/wenzhen/patient_info`, param, '')
  }

  /**
   * @description: 获取图文问诊明细
   * @param {*}
   * @return {*}
   */

  getWenZhenAgainInfo(param: any): any {
    return $request.post(`/wenzhen/wz_again_info`, param, '')
  }

  /**
   * @description: 获取图文问诊明细
   * @param {*}
   * @return {*}
   */

  getWenZhenInfo(param: any): any {
    return $request.post(`/wenzhen/wz_info`, param, '')
  }

  /**
   * @description: 获取图文问诊明细
   * @param {*}
   * @return {*}
   */

  getWenZhenInfoSace(param: any): any {
    return $request.post(`/wenzhen/wz_info_save`, param, '')
  }

  /**
   * @description: 获取问诊单
   * @param {*}
   * @return {*}
   */

  getWenZhenDan(param: any): any {
    return $request.post(`/wenzhen/wz_dan`, param, '')
  }

  /**
   * @description: 保存问诊单
   * @param {*}
   * @return {*}
   */

  getWenZhenDanSave(param: any): any {
    return $request.post(`/wenzhen/wz_dan_save`, param, '')
  }
}

let common = new CommonClass()

export default common
