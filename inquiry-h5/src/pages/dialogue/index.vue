<template>
  <view class="container">
    <!-- 多就诊人 -->
    <view class="multi-user" v-if="patientList.length > 1">
      <view class="multi-user-item" :class="!paid ? 'active' : ''" @click="handleChangePatient('')"
        >全部</view
      >
      <view
        v-for="(item, index) in patientList"
        :key="index"
        class="multi-user-item"
        :class="item.paid == paid ? 'active' : ''"
        @click="handleChangePatient(item.paid)"
      >
        <view>{{ item.uname }}</view>
        <view class="age">{{ item.sex }} · {{ item.age }}{{ item.age_type }}</view>
      </view>
    </view>

    <uni-list :border="true">
      <uni-list-chat
        v-for="item in dialogueList"
        :key="item.id"
        :title="`${item.doctor_name} ${item.dtname}`"
        :avatar="item.small"
        :note="item.content"
        time="2020-02-02 20:20"
        badge-positon="left"
        :badge-text="item.unreadMessageCount < 99 ? item.unreadMessageCount : '99+'"
        :avatar-circle="true"
        :clickable="true"
        @click="handleJump(item.order_sn, item.ry_room)"
      >
        <view class="chat-custom-right">
          <view class="time">{{ item.time }}</view>
          <view class="name">{{ item.patient_name }}</view>
        </view>
      </uni-list-chat>
    </uni-list>
  </view>
  <!-- <load-more isLoadConfig="{{isLoadConfig}}" /> -->
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import {
  onLoad,
  onResize,
  onShow,
  onUnload,
  onPullDownRefresh,
  onReachBottom,
} from '@dcloudio/uni-app'
import Api from '../../api/index'
import im from '../../utils/im'
import utils from '../../utils/util'
import { useStore } from 'vuex'
const store = useStore()
import events from '@/utils/events'
import cache from '@/utils/auth'
const title = ref('Hello')
const patientList = ref([])
const dialogueList = ref()
const imDialogueList = <any>ref()
const paid = ref()
const pageCf = reactive({
  page: 1,
  limit: 10,
})
const isLoadConfig = reactive({
  show: false,
  noMore: false,
  noDate: false,
})
const token = ref('')

onLoad((option) => {
  // console.log(option)
  token.value = option.token || ''
})

onShow(() => {
  // console.log(token.value)
  pageCf.page = 1
  pageCf.limit = 10
  if (token.value) {
    store.dispatch('getUserCf', token.value).then(async () => {
      if (cache.getConnect()) {
        await im.getTotalUnreadCountSync()
        await handleInit()
      } else {
        events.listen('connect', () => {
          handleInit()
          // this.onReceiveVideo()
        })
      }
      events.listen('message', (message) => {
        // this.receiveMessage(message)
        handleInit()
      })
    })
  } else {
    store.dispatch('validateLogin').then(async () => {
      if (cache.getConnect()) {
        await im.getTotalUnreadCountSync()
        await handleInit()
      } else {
        events.listen('connect', () => {
          handleInit()
          // this.onReceiveVideo()
        })
      }
      events.listen('message', (message) => {
        // this.receiveMessage(message)
        handleInit()
      })
    })
  }
})

onUnload(() => {
  events.remove('message', '')
})

/**
 * 页面相关事件处理函数--监听用户下拉动作
 */
onPullDownRefresh(() => {
  pageCf.page = 1
  pageCf.limit = 10
  handleGetSessionList()
  setTimeout(function() {
    uni.stopPullDownRefresh()
  }, 1000)
})

/**
 * 页面上拉触底事件的处理函数
 */
onReachBottom(() => {
  if (isLoadConfig.show && isLoadConfig.noMore) {
    pageCf.page = pageCf.page + 1
    pageCf.limit = 10
    handleGetSessionList()
  }
})

const handleInit = async () => {
  await handleGetPatientList()
  await hendelIMDialogueList()
  await handleGetSessionList()
}

const handleGetPatientList = async () => {
  try {
    const { data } = await Api.dialogue.getPatientList({})
    patientList.value = data
  } catch (error) {
    console.log(error)
  }
}

const hendelIMDialogueList = async () => {
  let that = this
  const data = await im.getList()
  imDialogueList.value = data
}

const handleGetSessionList = async () => {
  try {
    let params = {
      paid: paid.value || '',
      page: pageCf.page,
      limit: pageCf.limit,
    }
    const { code, data } = await Api.dialogue.getSessionList(params)

    if (code === 200) {
      let _arr = data.items
      let items = _arr || []
      let list = []
      if (pageCf.page === 1) {
        list = _arr || []
      } else {
        list = utils.unique(dialogueList.value.concat(items || []))
      }

      console.log(list)

      list.map((m) => {
        imDialogueList.value.map((j) => {
          if (m.ry_room === j.targetId) {
            switch (j.latestMessage.messageType) {
              case 'MYZX:DefaultMsg':
                m.content = j.latestMessage.content.title_user
                break
              case 'RC:TxtMsg':
                m.content = j.latestMessage.content.content
                break
              case 'RC:VcMsg':
                m.content = '语音'
                break
              case 'RC:ImgMsg':
                m.content = '图片'
                break
              case 'MYZX:UpdateMsg':
                m.content = j.latestMessage.content.title_user
                break
              case 'MYZX:CureMsg':
                m.content = j.latestMessage.content.title_user
                break
              case 'RC:HQVCMsg':
                m.content = '语音'
                break
              case 'MYZX:WzOrderMsg':
                m.content = j.latestMessage.content.title_user
                break
              default:
                m.content = j.latestMessage.content.title
                break
            }
            m.unreadMessageCount = j.unreadMessageCount
            m.time = utils.formatDate(j.latestMessage.sentTime, '')
            m.sentTime = j.latestMessage.sentTime
          }
        })
      })

      list.sort(function(a, b) {
        return b.sentTime < a.sentTime ? -1 : 1
      })

      // console.log(list, page)

      dialogueList.value = list
      isLoadConfig.show = !(pageCf.page === 1 && items.length === 0)
      isLoadConfig.noMore = items.length === pageCf.limit
      isLoadConfig.noDate = pageCf.page === 1 && items.length === 0
    } else {
      isLoadConfig.show = false
      isLoadConfig.noMore = false
      isLoadConfig.noDate = true
    }
  } catch (error) {
    console.log(error)
  }
}
const handleChangePatient = (id: any) => {
  paid.value = id
  pageCf.page = 1
  pageCf.limit = 10
  dialogueList.value = []
  handleGetSessionList()
}

const handleJump = (ordersn: any, ryroom: any) => {
  let url = '/pages/im-inquiry/im/index'
  im.ReqMsgSync(ryroom).then(() => {
    uni.navigateTo({
      url: `${url}?order_sn=${ordersn}`,
    })
  })
}
</script>

<style>
.container {
  /* height: 100vh; */
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

/* multi-user */

.multi-user {
  display: flex;
  align-items: center;
  height: 138rpx;
  background-color: white;
  padding: 0 30rpx;
  overflow-x: scroll;
}

.multi-user-item {
  min-width: 216rpx;
  height: 98rpx;
  opacity: 1;
  background: #f3f3f3;
  border-radius: 16rpx;
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  justify-content: center;
  margin-right: 20rpx;
  font-size: 32rpx;
  font-weight: 500;
  text-align: left;
  color: #999999;
  padding: 0 20rpx;
  /* box-sizing: border-box; */
}

.multi-user-item.active {
  background: #e7f3ff;
  color: #1890ff;
}

.multi-user-item:last-child {
  margin-right: 0rpx;
}
.multi-user-item:first-child {
  text-align: center;
}

.multi-user-item .age {
  font-size: 24rpx;
  font-weight: 400;
  color: #999999;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}

.chat-custom-right {
  display: flex;
  flex-direction: column;
}
.chat-custom-right .time {
  font-size: 28rpx;
  font-weight: 400;
  text-align: right;
  color: #999999;
}
.chat-custom-right .name {
  font-size: 28rpx;
  font-weight: 400;
  text-align: right;
  color: #999999;
  margin-top: 7rpx;
}
</style>
