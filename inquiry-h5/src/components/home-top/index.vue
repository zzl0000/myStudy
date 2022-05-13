<template>
  <view class="top-search">
    <view class="top-logo">
      <view href="/" class="logoLeft">
        <img
          src="https://img.myzx.cn/video/mysource/image/20200407/5e8c40f38e4a2.png"
          alt="名医在线"
        />
      </view>
      <uni-search-bar
        @confirm="search"
        :focus="false"
        v-model="searchValue"
        maxlength="25"
        cancelButton="none"
        placeholder="搜疾病/症状/科室"
      >
      </uni-search-bar>
      <view class="userMC" @click="handleJump">
        <!-- <a href="" class="doctorMC"></a> -->
        <!-- <a href="/user/user/index"></a> -->
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const title = ref('Hello')
const searchValue = ref('')
const handleJump = () => {
  uni.switchTab({
    url: '/pages/my-center/index',
  })
}
</script>

<style>
.top-search {
  width: 100%;
  position: absolute;
  top: 0;
  z-index: 200;
}
.top-search form {
  width: 540rpx;
  position: relative;
}
.top-search .new-search-public {
  width: 100%;
  height: 76rpx;
  background: #fff;
  box-shadow: 0 8rpx 15rpx 0 rgba(0, 0, 0, 0.05);
  border-radius: 38rpx;
  font-size: 30rpx;
  padding: 0 70rpx 0 30rpx;
}
.top-search .new-search-public::-webkit-input-placeholder {
  color: #ccc;
}
.top-search .new-search-public:-moz-placeholder {
  color: #ccc;
}
.top-search .new-search-public:-ms-input-placeholder {
  color: #ccc;
}
.top-search .new-search-btn {
  background-image: url('https://img.myzx.cn/video/mysource/image/20200407/5e8c4a10ed5c7.png');
  background-repeat: no-repeat;
  background-size: contain;
  width: 40rpx;
  height: 40rpx;
  position: absolute;
  right: 20rpx;
  top: 18rpx;
  left: auto;
}
.top-logo {
  margin: 20rpx 30rpx;
  height: 76rpx;
  display: flex;
  display: -webkit-flex;
  display: -ms-flex;
  align-items: center;
  -webkit-align-items: center;
  justify-content: space-between;
  -webkit-justify-content: space-between;
}
.logoLeft {
  width: 52rpx;
  height: 52rpx;
  display: inline-block;
}
.logoLeft > img {
  width: 100%;
  height: 100%;
}
.top-logo > span {
  float: right;
}

.doctorMC {
  background-image: url('https://img.myzx.cn/video/mysource/image/20200407/5e8c44d6017b9.png');
  background-repeat: no-repeat;
  background-size: contain;
}
.userMC {
  background-image: url('https://img.myzx.cn/video/mysource/image/20200407/5e8c44e1b7ea3.png');
  background-repeat: no-repeat;
  background-size: contain;
  width: 50rpx;
  height: 50rpx;
}

.btn-disabled {
  color: #999 !important;
  background: #f3f3f3 !important;
}

.btn-disabled-2 {
  color: #999 !important;
  background: #fff !important;
  border-color: #999 !important;
}
</style>
