/*
 * @Author: your name
 * @Date: 2020-12-11 09:54:19
 * @LastEditTime: 2022-04-19 11:43:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \register-managef:\project\inquiry-wap\src\api\common.js
 */

import $request from './request'
// import { AppId, appSecret } from ''

class CommonClass {
  constructor() {}

  /**
   * @description: 获取电话问诊明细
   * @param {*}
   * @return {*}
   */

  getCallWenZhenInfo(param: any): any {
    return $request.post(`/wenzhen/getCallWenZhenInfo`, param, '')
  }

  /**
   * @description: 获取图文问诊明细
   * @param {*}
   * @return {*}
   */

  getViewWenZhenInfo(param: any): any {
    return $request.post(`/wenzhen/getViewWenZhenInfo`, param, '')
  }

  /**
   * @description: 获取视频问诊明细
   * @param {*}
   * @return {*}
   */

  getVideoWenZhenInfo(param: any): any {
    return $request.post(`/wenzhen/getVideoWenZhenInfo`, param, '')
  }

  /**
   * @description: 获取IM问诊订单详情
   * @param {*}
   * @return {*}
   */

  getWzOrderDetail(param: any): any {
    return $request.post(`/wz/v3/order/detail`, param, '')
  }

  /**
   * @description: 医生第一次发送消息给患者 0.医生未发消息 1.医生已发消息患者未读 2.医生已发消息患者已读
   * @param {*}
   * @return {*}
   */

  updateWzStatus(param: any): any {
    return $request.post(`/wz/v3/order/update/msg/status`, param, '')
  }

  /**
   * @description: 获取IM房间状态
   * @param {*}
   * @return {*}
   */
  getRoomStatus(param: any): any {
    return $request.post(`/wz/v3/order/room/status`, param, '')
  }

  /**
   * @description: 融云用户信息
   * @param {*}
   * @return {*}
   */

  getRyUserInfo(param: any): any {
    return $request.post(`/ry/user/info`, param, '')
  }

  /**
   * @description: 问诊下单
   * @param {*}
   * @return {*}
   */

  createWzPayOrder(param: any): any {
    return $request.post(`/wz/v3/order/create/pay`, param, '')
  }

  /**
   * @description: visitOper
   * @param {*}
   * @return {*}
   */

  visitOper(param: any): any {
    return $request.post(`/wz/v3/order/visitOper`, param, '')
  }

  /**
   * @description: 申请退款
   * @param {*}
   * @return {*}
   */

  getWzRefund(param: any): any {
    return $request.post(`/wz/v3/refund/detail`, param, '')
  }

  // 进入视频会话之前判断患者能否进入
  getCanYouEnterRoom(params: any): any {
    let data = { ...params }
    return $request.post(`/wenzhen/canYouEnterRoom`, data, '')
  }
}

let common = new CommonClass()

export default common
