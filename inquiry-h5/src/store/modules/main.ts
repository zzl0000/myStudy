import cachel from '@/utils/auth'
import Api from '@/api/index'
import config from '@/config/config'
import IM from '@/utils/im'

import utils from '@/utils/util'

export interface State {
  userCf: any
  loginState: boolean
  weChart: boolean
  wxOpenId: any
}
export default {
  namespaced: false,
  state: {
    userCf: {},
    loginState: false,
    weChart: false,
    wxOpenId: '',
  },
  getters: {
    getUserCf: (state: { userCf: any }) => {
      return state.userCf
    },
    getLoginState: (state: { loginState: any }) => {
      return cachel.getToken() ? true : state.loginState
    },
    getWeChart: (state: { weChart: any }) => {
      return cachel.getWeChart() ? true : state.weChart
    },
    getWxOpenId: (state: { weChart: any }) => {
      return cachel.getWxOpenId() ? true : state.weChart
    },
  },
  mutations: {
    SET_USER_CF(state: { userCf: any }, store: any) {
      state.userCf = store
      cachel.setUserCf(store)
    },
    SET_LOGIN_STATE(state: { loginState: boolean }, token: any) {
      state.loginState = token ? true : false
      cachel.setToken(token)
    },
    SET_WECHART(state: { weChart: any }, val: any) {
      state.weChart = val
      cachel.setWeChart(val)
    },

    SET_WX_OPEN_ID(state: { wxOpenId: any }, val: any) {
      state.wxOpenId = val
      cachel.setWxOpenId(val)
    },
  },
  actions: {
    getUserCf({ commit }: any, token?: any) {
      return new Promise<void>((resolve) => {
        commit('SET_LOGIN_STATE', token)
        Api.common.getUserInfo().then((res: any) => {
          commit('SET_USER_CF', res.data)
          cachel.setOpenId(res.data.openid)
          cachel.setUserMpvToken(res.data.userapptoken)
          cachel.setUserAppToken(res.data.usermpvtoken)
          resolve()
        })
      })
    },
    loginOut() {
      cachel.removePhone()
      cachel.removeOpenId()
      cachel.removeToken()
      cachel.removeCode()
      cachel.removeUserAppToken()
      cachel.removeUserMpvToken()
      cachel.removeDoctorDid()
      cachel.removeUserCf()
    },
    /**
     * @description: 校验是否需要登录
     * @param {*token, url}
     * @return {*}
     */
    validateLogin(): any {
      return new Promise<void>((resolve) => {
        // let _phone = cachel.getPhone()
        let pages = getCurrentPages()
        let currentPage = pages[pages.length - 1]['$page']['fullPath']
        console.log(currentPage)
        // let token = cachel.getToken()
        console.log(cachel.getToken())
        if (!cachel.getToken()) {
          window.location.href = `${config.reset_link}/user/login/index?type=1&reset_url=${currentPage}`
        } else {
          resolve()
        }
      })
    },

    async setWeChart({ commit }) {
      let isWeChart = navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1
      const code = utils.GetUrlParam('code')
      // 如果在微信内部  通过网页授权code获取openid
      if (isWeChart) {
        const _local = window.location.href
        let local = config.authUrl
          ? encodeURIComponent(config.authUrl)
          : encodeURIComponent(`${_local}`)
        // let local = encodeURIComponent(config.authUrl)
        if (code == null || code === '') {
          window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${config.AppId}&redirect_uri=${local}&response_type=code&scope=snsapi_base&connect_redirect=1&state=1#wechat_redirect`
        } else {
          await Api.common.getWxOpenId(code).then((res: any) => {
            if (res.code === 200) {
              res && commit('SET_WX_OPEN_ID', res.data)
            }
          })
        }
      }
      commit('SET_WECHART', isWeChart)
    },
  },
}
