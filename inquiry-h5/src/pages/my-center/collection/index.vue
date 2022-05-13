<template>
  <view class="container" style="background: #fff; height: 100vh">
    <view class="like-list" v-for="(item, index) in data.collectList" :key="index">
      <view class="like-item" v-if="item.type != 1">
        <view class="item-title" v-if="item.type != 9">{{ item.data.title }}</view>
        <!-- 文章 -->
        <view
          class="item-text ellipsis-3"
          v-if="item.type == 8"
          @click="goToDesc('文章', item.data.aid)"
        >
          {{ item.data.description || '暂无内容' }}
        </view>
        <!-- 问答 -->
        <view v-if="item.type == 9" @click="goToDesc('问答', item.data.qid)">
          <view class="queretion" v-if="item.type == 9">
            <text class="qus-icon">问</text>
            <text class="qus-text item-title">{{ item.data.title }}</text>
          </view>
          <view class="answer" style="display: flex; margin: 15rpx 0rpx">
            <text class="qus-icon ans-icon">答</text>
            <text class="ans-text ellipsis-3">{{ item.data.answer.content || '暂无内容' }}</text>
          </view>
        </view>
        <!-- 音频 -->
        <view v-if="item.type == 7" @click="goToDesc('音频', item.data.vid)">
          <view class="vedio">
            <image class="vedio-img" :src="assetsLink + '/assets/IM/micro-open.png'" />
            <text class="vedio-text">语音时长</text>
            <text class="vedio-time">{{ item.data.vod.duration_format }}</text>
          </view>
        </view>
        <!-- 个人信息 -->
        <view class="item-info">
          <image
            class="item-img"
            :src="item.data.v7_doctor.avatar_info.big || assetsLink + '/assets/avatar@2x.png'"
          />
          <text class="item-name">{{ item.data.v7_doctor.doctor_name }}</text>
          <text class="item-name" style="margin: 0rpx 15rpx">{{
            item.data.v7_doctor.doctor_title
          }}</text>
          <text class="item-name">{{ item.data.v7_doctor.hospital_name }}</text>
        </view>
      </view>

      <!-- 视频 -->

      <view
        class="like-item like-item-spc"
        v-if="item.type == 1"
        @click="goToDesc('视频', item.data.id)"
      >
        <view style="margin-right: 70rpx">
          <view class="item-title" style="margin-bottom: 31rpx">{{ item.data.title }}</view>
          <view class="item-info ellipsis">
            <image
              class="item-img item-img-spc"
              :src="item.data.v7_doctor.avatar_info.big || assetsLink + '/assets/avatar@2x.png'"
            />
            <text class="item-name item-name-long">{{ item.data.v7_doctor.doctor_name }}</text>
            <text class="item-name item-name-long" style="margin: 0rpx 15rpx">{{
              item.data.v7_doctor.doctor_title
            }}</text>
            <text class="item-name item-name-long">{{ item.data.v7_doctor.hospital_name }}</text>
          </view>
        </view>
        <view>
          <!-- <video id="myVideo" src="{{videoDetail.url}}" poster="{{videoDetail.pic}}" controls enable-progress-gesture='false' custom-cache="false" autoplay="{{autoplayFlag}}" bindfullscreenchange="compatiForIos" bindended="fullScreenFail" style="height:{{videoHeight}}px;width:{{videoWidth}}px;"></video> -->
          <!-- <videoPlay videoDetail="{{item.data.img.id}}"> -->
          <image class="adios" :src="item.data.img.big || assetsLink + '/assets/avatar@2x.png'" />
        </view>
      </view>
    </view>
    <view v-if="data.isLoadConfig.show" class="load-more">
      <view class="load-img" />
      <view v-if="data.isLoadConfig.noMore" class="load-text">--下拉加载更多--</view>
      <view v-if="!data.isLoadConfig.noMore" class="no-text">--我们是有底线的--</view>
    </view>
    <view v-if="data.isLoadConfig.noDate" class="no-data">
      <image
        class="img icon"
        :src="assetsLink + '/assets/blank_page_bg.png' + ' '"
        mode="aspectFill"
      />
      <text class="text">暂无收藏</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onLoad, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
import { ref } from 'vue'
import config from '../../../config/config'
import Api from '../../../api/index'

const app = getApp()
const assetsLink = config.assetsLink

const data = ref({
  page: 1,
  limit: 20,
  collectList: [],
  isLoadConfig: {
    show: false,
    noMore: false,
    noDate: false,
  },
})

/**
 * 生命周期函数--监听页面加载
 */
onLoad((options) => {
  getMyLike()
  // videoContext = uni.createVideoContext('myVideo')
})

/**
 * 页面相关事件处理函数--监听用户下拉动作
 */
onPullDownRefresh(() => {
  data.value.page = 1
  getMyLike()
})
/**
 * 页面上拉触底事件的处理函数
 */
onReachBottom(() => {
  // if (data.value.isLoadMore && data.value.isLoadConfig.show) {
  if (data.value.isLoadConfig.show) {
    data.value.page = data.value.page + 1
    getMyLike()
  }
})

function getMyLike() {
  uni.showLoading({})
  Api.request
    .post(
      `/user/myCollect`,
      {
        verson: 'v3.2.0',
        page: data.value.page,
        limit: data.value.limit,
      },
      ''
    )
    .then((res: any) => {
      uni.hideLoading()
      uni.stopPullDownRefresh()
      if (res.code === 200) {
        data.value.collectList = res.data || []

        if (res.data.length === 0) {
          data.value.isLoadConfig = {
            show: false,
            noMore: false,
            noDate: true,
          }
        } else {
          data.value.isLoadConfig = {
            show: false,
            noMore: false,
            noDate: false,
          }
        }
      } else {
        if (data.value.page === 1) {
          data.value.isLoadConfig = {
            show: false,
            noMore: false,
            noDate: true,
          }
        }
      }
    })
}

function goToDesc(val: string, e: any) {
  // uni.navigateTo({
  //   url: '/pages/inquiry/science/video-details?data=' + val + '&id=' + e,
  // })
  window.location.href = `https://m.myzx.cn/video/${e}.html`
}
</script>

<style lang="scss" scoped>
.container {
  padding: 25rpx;
  box-sizing: border-box;
}
.like-item {
  border-bottom: 2rpx solid #d6d6d6;
  padding-bottom: 24rpx;
  margin-top: 25rpx;
}
.item-title {
  font-size: 32rpx;
  font-weight: 700;
}
.item-text {
  margin: 25rpx 0rpx;
  font-size: 28rpx;
  color: #6d6e70;
}
.item-img {
  width: 54rpx;
  height: 54rpx;
  margin-right: 15rpx;
  border-radius: 50%;
}
.item-img-spc {
  vertical-align: -15rpx;
}
.item-name {
  vertical-align: 16rpx;
  font-size: 24rpx;
}
.item-name-long {
  vertical-align: 0rpx;
}
.qus-icon {
  padding: 6rpx 9rpx;
  background-color: #0052fe;
  color: #fff;
  font-size: 20rpx;
  margin-right: 25rpx;
  border-radius: 10rpx;
}
.ans-icon {
  background-color: #fe8f4c;
  height: 32rpx;
}
.ans-text {
  color: #6d6e70;
  font-size: 28rpx;
}
.vedio {
  width: 261rpx;
  height: 63rpx;
  background: linear-gradient(90deg, #1386ff 0%, #5bbdff 100%);
  border-radius: 32rpx;
  margin: 25rpx 0rpx;
  display: flex;
  justify-content: space-around;
  padding: 0rpx 25rpx 0rpx 18rpx;
  box-sizing: border-box;
  font-size: 22rpx;
  color: #fff;
  line-height: 63rpx;
}
.vedio-img {
  width: 16rpx;
  height: 24rpx;
  /* vertical-align: middle; */
  margin-top: 20rpx;
}
.like-item-spc {
  display: flex;
  justify-content: space-around;
}
.adios {
  width: 215rpx;
  height: 124rpx;
}
.load-more {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  text-align: center;
  color: #999999;
  line-height: 40rpx;
  padding: 10rpx 0;
}

.no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 150rpx;
}

.no-data .icon {
  width: 500rpx;
  height: 422rpx;
}

.no-data .text {
  min-width: 224rpx;
  height: 40rpx;
  font-size: 28rpx;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  text-align: center;
  color: #999999;
  line-height: 40rpx;
}
</style>
