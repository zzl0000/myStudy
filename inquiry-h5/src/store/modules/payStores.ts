import cachel from '@/utils/auth'

export interface state {
  isSendPay: boolean
}

export default {
  namespaced: false,
  state: {
    isSendPay: false,
  },
  getters: {
    getIsSendPay: (state) => {
      return state.isSendPay || cachel.get('isSendPay')
    },
  },
  mutations: {
    SET_IS_SEND_PAY(state, val) {
      state.isSendPay = val
      cachel.set('isSendPay', state.isSendPay)
    },
  },
  actions: {
    setIsSendPay({ commit }, val) {
      commit('SET_IS_SEND_PAY', val)
    },
  },
}
