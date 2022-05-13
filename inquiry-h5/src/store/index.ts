import { createStore } from 'vuex'
import main from './modules/main'
import payStoreS from './modules/payStores'
export default createStore({
  modules: {
    main,
    payStoreS,
  },
})
