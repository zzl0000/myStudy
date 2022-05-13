<template>
  <view class="container">
    <view class="set-group">
      <view class="set-item" @click="handleJumpBlank('/pages/my-center/privacy-agree/index')">
        <view class="label">隐私条款</view>
        <view class="val"></view>
        <view class="arrow-icon">
          <image class="img" :src="assetsLink + '/assets/arrow-right-icon.png'" />
        </view>
      </view>
      <view class="set-item" @click="handleJumpBlank('/pages/my-center/service-agree/index')">
        <view class="label">服务条款</view>
        <view class="val"></view>
        <view class="arrow-icon">
          <image class="img" :src="assetsLink + '/assets/arrow-right-icon.png'" />
        </view>
      </view>
      <view class="set-item" @click="handleJumpBlank('/pages/my-center/user-agree/index')">
        <view class="label">用户注册协议</view>
        <view class="val"></view>
        <view class="arrow-icon">
          <image class="img" :src="assetsLink + '/assets/arrow-right-icon.png'" />
        </view>
      </view>
      <view class="set-item" @click="handleServiceCall">
        <view class="label">客服电话</view>
        <view class="val">400-8007202</view>
      </view>
      <view class="set-item">
        <view class="label">版本号</view>
        <!-- <view class="val">小程序 v3.0.0</view> -->
      </view>
    </view>
    <view class="btn-group">
      <button class="btn" @click="handleLoginOut">退出登录</button>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import config from '../../../config/config'

const assetsLink = config.assetsLink
const data = ref({
  url: '',
  // assetsLink: app.globalData.assetsLink,
})

function handleJumpBlank(e: string) {
  let url = e
  uni.navigateTo({
    url,
  })
}

function handleServiceCall() {
  uni.makePhoneCall({
    phoneNumber: '400-8007202',
  })
}

function handleLoginOut() {
  // app.$wxApi.loginOut().then(() => {
  uni.switchTab({
    url: `/pages/index/index`,
  })
  // })
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  background: #fff;
}
.set-group {
  margin-top: 20rpx;
}
.set-item {
  display: flex;
  align-items: center;
  position: relative;
  padding: 30rpx;
  border-bottom: 1px solid #eeeeee;
}

.set-item .label {
  font-size: 28rpx;
  font-weight: 400;
  text-align: left;
  color: #333333;
}

.set-item .val {
  font-size: 28rpx;
  font-weight: 400;
  text-align: left;
  color: #999999;
  position: absolute;
  right: 30rpx;
}

.arrow-icon {
  width: 16rpx;
  height: 25rpx;
  position: absolute;
  right: 30rpx;
}

.btn-group {
  position: fixed;
  bottom: 70rpx;
  width: 100%;
}

.btn-group .btn {
  width: 690rpx;
  height: 100rpx;
  font-size: 38rpx;
  font-weight: 500;
  border-radius: 50rpx;
  color: #ff3b30;
  border: 1px solid #ff3b30;
}

.img {
  width: 100%;
  height: 100%;
}
</style>
