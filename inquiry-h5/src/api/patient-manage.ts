import $request from './request'

class CommonClass {
  constructor() {}

  /**
   * @description 获取患者列表
   * @param {*}
   * @return {*}
   */
  getPatientList(params: any): any {
    let data = { ...params }
    return $request.post(`/wenzhen/patient_list`, data, '')
  }

  /**
   * @description: 添加患者
   * @param {*}
   * @return {*}
   */

  addPatient(params: any) {
    let data = { ...params }
    return $request.post('/wenzhen/patient_edit', data, '')
  }

  updatePatient(params: any) {
    let data = { ...params }
    return $request.post('/wenzhen/patient/xcx/update', data, '')
  }
  /**
   * @description 验证身份证
   * @param {name}
   * @param {idCard}
   * */
  verifyIdCard(params: any) {
    return $request.post('/wenzhen/patient/verify', params, '')
  }
}

let common = new CommonClass()

export default common
