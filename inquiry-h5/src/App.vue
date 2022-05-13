<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import im from './utils/im'
import Api from './api/index'
import { useStore } from 'vuex'
const store = useStore()
onLaunch((option: any) => {
  console.log('App Launch', option.token)
  // console.log()
  // cache.setToken(option.token)
  // IM 初始化

  store.dispatch('setWeChart')
  im.init({
    message: (message: any) => {
      // console.log('app message========>', message)
      // 医生提醒患者填写咨询单
      if (message.messageType === 'MYZX:DefaultMsg' && message.content.type === 1) {
        cache.setShowWzList(message.content.order_sn, true)
      }
    },
  })
})
onShow(() => {
  console.log('App Show')
})
onHide(() => {
  console.log('App Hide')
})
</script>

<script lang="ts">
import cache from './utils/auth'

export default {
  globalData: {
    $cache: cache,
  },
}
</script>
<style lang="scss">
@import './common';
page {
  background-color: #f7f9fa;
}
</style>
