import $request from './request'

class CommonClass {
  constructor() {}

  /**
   * @description: 修改快递支付方式
   * @param {*}
   * @return {*}
   */

  setpay(params: any) {
    let data = { ...params }
    return $request.post(`/wz/v3/express/sf/postage/paySetting`, data, {})
  }
}

let common = new CommonClass()

export default common
