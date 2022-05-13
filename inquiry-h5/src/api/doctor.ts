import $request from './request'

class CommonClass {
  constructor() {}

  /**
   * @description
   * @param {*}
   * @return {*}
   */
  getDoctorList(params: any): any {
    let patientId = 0
    return $request.get(`/patients/${patientId}/doctors`, {}, '')
  }
}

let common = new CommonClass()

export default common
