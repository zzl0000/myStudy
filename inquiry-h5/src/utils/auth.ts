const YYZX_MP_CODE = 'yyzx_mp_code' // 小程序code
const YYZX_MP_TOKEN = 'yyzx_mp_token' // 用户token
const YYZX_MP_PHONE = 'yyzx_mp_phone' // 用户手机号
const YYZX_MP_OPENID = 'yyzx_mp_openid' // 用户openid
const YYZX_WX_MP_OPENID = 'yyzx_WX_mp_openid' // 用户微信公众号openid

const YYZX_MP_USER_CF = 'yyzx_mp_user_cf' // 用户配置信息
const YYZX_MP_UID = 'yyzx_mp_uid' // 用户Uid
const YYZX_IM_CONNECT = 'yyzx_im_connect' // im是否链接
const YYZX_SHOW_WZ_LIST = 'yyzx_show_wz_list' // 是否提示及时填写问诊单
const YYZX_SELECTED_CITY = 'yyzx_selected_city'
const YYZX_SELECTED_PATIENT = 'yyzx_selected_patient'
const YYZX_MESSAGE_USER = 'yyzx_message_user'
const YYZX_USER_APP_TOKEN = 'yyzx_user_app_token'
const YYZX_USER_MPV_TOKEN = 'yyzx_user_mpv_token'

const YYZX_DOCTOR_DID = 'yyzx_doctor_did' // 医生cpid
const YYZX_BIND_STATE = 'yyzx_bind_state' // 医生cpid

const YYZX_NET_WORKE_STATE = 'yyzx_net_worke_state' // 网络状态
const YYZX_TRTC_KEY = 'yyzx_trtc_key' // 腾讯云视频 key

const INQUIRY_WE_CHART = 'inquiry_we_chart'
class CacheClass {
  constructor() {}

  set(key: any, val: any) {
    return uni.setStorageSync(key, val)
  }

  get(key: string) {
    return uni.getStorageSync(key)
  }

  remove(key: string) {
    return uni.removeStorageSync(key)
  }

  clear() {
    return uni.clearStorageSync()
  }

  setCode(val: any) {
    this.set(YYZX_MP_CODE, val)
  }

  getCode() {
    return this.get(YYZX_MP_CODE)
  }

  removeCode() {
    this.remove(YYZX_MP_CODE)
  }
  // token

  setToken(val: any) {
    this.set(YYZX_MP_TOKEN, val)
  }

  getToken() {
    return this.get(YYZX_MP_TOKEN)
  }

  removeToken() {
    this.remove(YYZX_MP_TOKEN)
  }

  // openid

  setOpenId(val: any) {
    this.set(YYZX_MP_OPENID, val)
  }

  getOpenId() {
    return this.get(YYZX_MP_OPENID)
  }

  // openid

  setWxOpenId(val: any) {
    this.set(YYZX_WX_MP_OPENID, val)
  }

  getWxOpenId() {
    return this.get(YYZX_WX_MP_OPENID)
  }

  removeOpenId() {
    this.remove(YYZX_MP_OPENID)
  }

  //YYZX_MP_PHONE

  setPhone(val: any) {
    this.set(YYZX_MP_PHONE, val)
  }

  getPhone() {
    return this.get(YYZX_MP_PHONE)
  }

  removePhone() {
    this.remove(YYZX_MP_PHONE)
  }

  // userCf
  setUserCf(val: any) {
    this.set(YYZX_MP_USER_CF, JSON.stringify(val))
  }

  getUserCf() {
    return this.get(YYZX_MP_USER_CF) ? JSON.parse(this.get(YYZX_MP_USER_CF)) : null
  }

  removeUserCf() {
    this.remove(YYZX_MP_USER_CF)
  }

  //UID

  setUid(val: any) {
    this.set(YYZX_MP_UID, val)
  }

  getUid() {
    return this.get(YYZX_MP_UID)
  }

  removeUid() {
    this.remove(YYZX_MP_UID)
  }

  getConnect() {
    return this.get(YYZX_IM_CONNECT)
  }

  setConnect(val: any) {
    this.set(YYZX_IM_CONNECT, val)
  }

  removeConnect() {
    this.remove(YYZX_IM_CONNECT)
  }

  getShowWzList() {
    return this.get(YYZX_SHOW_WZ_LIST) ? JSON.parse(this.get(YYZX_SHOW_WZ_LIST)) : null
  }

  setShowWzList(order_sn: any, val: any) {
    let data = this.getShowWzList()
    if (data) {
      for (const key in data) {
        data[order_sn] = val
      }
    } else {
      data = {
        [order_sn]: val,
      }
    }
    this.set(YYZX_SHOW_WZ_LIST, JSON.stringify(data))
  }

  getSelectedCity() {
    return this.get(YYZX_SELECTED_CITY) ? JSON.parse(this.get(YYZX_SELECTED_CITY)) : null
  }

  setSelectedCity(val: any) {
    this.set(YYZX_SELECTED_CITY, JSON.stringify(val))
  }

  removeSelectedCity() {
    this.remove(YYZX_SELECTED_CITY)
  }

  getSelectedPatient() {
    return this.get(YYZX_SELECTED_PATIENT) ? JSON.parse(this.get(YYZX_SELECTED_PATIENT)) : null
  }

  setSelectedPatient(val: any) {
    this.set(YYZX_SELECTED_PATIENT, JSON.stringify(val))
  }

  removeSelectedPatient() {
    this.remove(YYZX_SELECTED_PATIENT)
  }

  getMessageUser() {
    return this.get(YYZX_MESSAGE_USER) ? JSON.parse(this.get(YYZX_MESSAGE_USER)) : null
  }

  setMessageUser(val: any) {
    this.set(YYZX_MESSAGE_USER, JSON.stringify(val))
  }

  removeMessageUser() {
    this.remove(YYZX_MESSAGE_USER)
  }

  getUserAppToken() {
    return this.get(YYZX_USER_APP_TOKEN)
  }

  setUserAppToken(val: any) {
    this.set(YYZX_USER_APP_TOKEN, val)
  }

  removeUserAppToken() {
    this.remove(YYZX_USER_APP_TOKEN)
  }

  getUserMpvToken() {
    return this.get(YYZX_USER_MPV_TOKEN)
  }

  setUserMpvToken(val: any) {
    this.set(YYZX_USER_MPV_TOKEN, val)
  }

  removeUserMpvToken() {
    this.remove(YYZX_USER_MPV_TOKEN)
  }

  //YYZX_DOCTOR_DID

  getDoctorDid() {
    return this.get(YYZX_DOCTOR_DID)
  }

  setDoctorDid(val: any) {
    this.set(YYZX_DOCTOR_DID, val)
  }

  removeDoctorDid() {
    this.remove(YYZX_DOCTOR_DID)
  }

  //YYZX_DOCTOR_DID

  getIsBind() {
    return this.get(YYZX_BIND_STATE)
  }

  setIsBind(val: any) {
    this.set(YYZX_BIND_STATE, val)
  }

  removeIsBind() {
    this.remove(YYZX_BIND_STATE)
  }

  // networkState

  getNetworkState() {
    let state = true
    if (this.get(YYZX_NET_WORKE_STATE) !== '') {
      state = this.get(YYZX_NET_WORKE_STATE)
    }
    return state
  }

  setNetworkState(val: any) {
    this.set(YYZX_NET_WORKE_STATE, val)
  }

  removeNetworkState() {
    this.remove(YYZX_NET_WORKE_STATE)
  }

  // YYZX_TRTC_KEY
  getTrtcKey() {
    return this.get(YYZX_TRTC_KEY) || false
  }

  setTrtcKey(val: any) {
    this.set(YYZX_TRTC_KEY, val)
  }

  removeTrtcKey() {
    this.remove(YYZX_TRTC_KEY)
  }

  /**
   * 本地存储中的 wx 浏览器状态
   * @return {undefined} 无返回值
   */

  setWeChart(v: any): any {
    this.set(INQUIRY_WE_CHART, v)
  }

  getWeChart() {
    return this.get(INQUIRY_WE_CHART) || false
  }
}

let cachel = new CacheClass()

export default cachel
