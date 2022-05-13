<template>
  <view class="container">
    <!-- top -->
    <view class="top-group">
      <view class="top-bg">
        <!-- <image class="img" :src="assetsLink+'/assets/top-bg.png'"></image> -->
        <image class="img" :src="assetsLink + '/assets/mine/bj.png'"></image>
      </view>
      <view class="header-icon">
        <image class="img" :src="images"></image>
      </view>
      <view
        class="user-item"
        v-if="!data.isLogin"
        @click="handleJump(reset_link + '/user/login/index')"
      >
        点击登录/注册
        <image class="arrow-icon" :src="assetsLink + '/assets/arrow-right-icon.png'"></image>
      </view>
      <view class="user-item" v-else @click="handleJump(reset_link + '/user/user/edit')">
        <view class="name">{{ data.userCf.nickname }}</view>
        <image class="arrow-icon" :src="assetsLink + '/assets/arrow-right-icon.png'"></image>
      </view>
      <view class="right-icon" @click="handleJump(reset_link + '/user/user/set_up')">
        <image :src="assetsLink + '/assets/set-icon.png'" class="img"></image>
      </view>
    </view>
    <!-- 列表入口 -->
    <view class="list_box">
      <view
        class="item"
        v-for="(item, index) in data.linkList"
        :key="index"
        @click="handleJump(item.url)"
      >
        <!-- data-url="{{item.url}}" -->
        <view>
          <image :src="assetsLink + '/assets/mine/' + item.icon + '.png'"></image>
          <text>{{ item.name }}</text>
        </view>
        <image class="arrow-icon" :src="assetsLink + '/assets/arrow-right-icon.png'"></image>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import config from '../../config/config'
import cache from '@/utils/auth'
import { useStore } from 'vuex'
const store = useStore()

const app = getApp()
const assetsLink = config.assetsLink
const reset_link = config.reset_link

const data = ref({
  isLogin: false,
  userCf: {
    avatar_wap: '',
    nickname: '',
  },
  linkList: [
    {
      icon: 'myService',
      url: 'my-service-menu',
      name: '在线客服 400-8007202',
    },
    {
      icon: 'doctor',
      url: '/pages/my-center/my-doctor/index',
      name: '我的医生',
    },
    {
      icon: 'consultation',
      url: '/pages/my-center/inquiry-record/index',
      name: '问诊记录',
    },
    {
      icon: 'drugs',
      url: '/pages/my-center/drug-orders/index/index',
      name: '药品订单',
    },
    {
      icon: 'thePatient',
      url: '/pages/my-center/patient-manage/index',
      name: '就诊人管理',
    },
    {
      icon: 'address',
      url: '/pages/my-center/address/index',
      name: '地址管理',
    },
    {
      icon: 'myCollection',
      url: reset_link + '/user/user/collect',
      name: '我的收藏',
    },
    {
      icon: 'myAttention',
      url: reset_link + '/user/user/mydoctor',
      name: '我的关注',
    },
  ],
})

const images = computed(() => {
  if (data.value.isLogin) {
    return data.value.userCf.avatar_wap
  } else {
    return assetsLink + '/assets/def-header-icon.png'
  }
})

onLoad((options) => {
  let token = options.token || ''
  let editor = options.editor == 'true' ? true : false

  if (token || editor) {
    store.dispatch('getUserCf', token).then(() => {
      data.value.isLogin = cache.getToken() ? true : false
      data.value.userCf = cache.getUserCf()
    })
  }
})

// const userCfWatch = computed(() => {
//   return store.state.main.userCf
// })

// watch(userCfWatch.value, (newVal) => {
//   if (newVal) {
//     data.value.userCf = cache.getUserCf()
//   }
// })

/**
 * 生命周期函数--监听页面显示
 */
onShow(() => {
  data.value.isLogin = cache.getToken() ? true : false
  data.value.userCf = cache.getUserCf()
})

function handleJump(e: string) {
  let url = e

  if (url === 'my-service-menu') {
    uni.makePhoneCall({
      phoneNumber: '400-8007202',
    })
  } else {
    let pages = getCurrentPages()
    let currentPage = pages[pages.length - 1]['$page']['fullPath']
    store.dispatch('validateLogin').then(() => {
      switch (url) {
        case reset_link + '/user/user/collect':
          window.location.href = reset_link + `/user/user/collect?type=1&reset_url=${currentPage}`
          break
        case reset_link + '/user/user/mydoctor':
          window.location.href = reset_link + `/user/user/mydoctor?type=1&reset_url=${currentPage}`
          break
        case reset_link + '/user/user/edit':
          window.location.href = reset_link + `/user/user/edit?type=1&reset_url=${currentPage}`
          break
        case reset_link + '/user/user/set_up':
          window.location.href = reset_link + `/user/user/set_up?type=1&reset_url=${currentPage}`
          break

        default:
          uni.navigateTo({
            url: url,
          })
          break
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
}

.top-group {
  display: flex;
  height: 240rpx;
  align-items: center;
  position: relative;
}

.top-bg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  // z-index: -1;
  margin-top: -5rpx;
}

.header-icon {
  width: 100rpx;
  height: 100rpx;
  margin-left: 30rpx;
  border-radius: 50%;
  overflow: hidden;
}

.user-item {
  display: flex;
  font-size: 40rpx;
  font-weight: 500;
  text-align: left;
  color: #333333;
  margin-left: 20rpx;
  align-items: center;
  z-index: 10;
}

.user-item .name {
  font-size: 40rpx;
  color: #333333;
  font-weight: 500;
}

.user-item .tips {
  display: flex;
  align-items: center;
  font-size: 28rpx;
  color: #999999;
  margin-left: 20rpx;
}

.arrow-icon {
  width: 16rpx;
  height: 25rpx;
  margin-left: 20rpx;
}

.right-icon {
  position: absolute;
  right: 30rpx;
  width: 40rpx;
  height: 40rpx;
}

.img {
  width: 100%;
  height: 100%;
}

.list_box {
  background-color: #fff;
  border-radius: 62rpx 62rpx 0px 0px;
  /* height: calc(100vh - 220rpx); */
  margin-top: -30rpx;
  padding: 0 20rpx 0 30rpx;
  padding-top: 10rpx;
  z-index: 10;
}

.list_box .item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 40rpx 0;
  border-bottom: 1rpx solid #d6d6d650;
}

.list_box .item view {
  display: flex;
  align-items: center;
  font-size: 28rpx;
}

.list_box .item view image {
  width: 35rpx;
  height: 35rpx;
  margin-right: 15rpx;
}
</style>
