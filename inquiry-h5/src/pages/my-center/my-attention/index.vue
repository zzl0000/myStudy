<template>
  <view>
    <scroll-view
      class="scrollbar-page"
      style="height: 100vh"
      :scroll-y="true"
      @scrolltolower="nextPage"
      v-if="data.isLoading"
    >
      <view class="container" v-if="data.mySubscribeData.length > 0">
        <view class="item" v-for="(item, index) in data.mySubscribeData" :key="index">
          <view class="lf">
            <image
              :src="item.doctor.avatar_info.big || assetsLink + '/assets/avatar@2x.png'"
              mode="aspectFit|aspectFill|widthFix"
            />
            <view>
              <view class="wrap">
                <text class="name">{{ item.doctor.doctor_name }}</text>
                <text class="position">{{ item.doctor.doctor_title }}</text>
                <text class="label">{{ item.doctor.hospital_level }}</text>
              </view>
              <view class="wrap">
                <text class="hospital">{{ item.doctor.hospital_name }}</text>
                <text class="department">{{ item.doctor.dept_name }}</text>
              </view>
            </view>
          </view>

          <view class="rt" @click="handleSetSubscribeStatus(item.doctor.did)">已关注</view>
        </view>
      </view>
      <view class="blank-page" v-else>
        <image class="img" :src="data.blankSrc" />
        <view class="tips">{{ data.blankTips }}</view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import config from '../../../config/config'
import Api from '../../../api/index'

const assetsLink = config.assetsLink

const data = ref({
  queryData: {
    page: 1,
    limit: 100,
  },
  mySubscribeData: [],
  isLoading: false,
  blankSrc: 'https://csxcxapi.myzx.cn/assets/blank_page_bg.png',
  blankTips: '暂无关注',
})

/**
 * 生命周期函数--监听页面加载
 */
onLoad((options) => {
  getMySubscribeData(data.value.queryData)
})

async function getMySubscribeData(params: any) {
  params.verson = 'v3.2.0'
  await Api.request.post(`/user/mySubscribe`, params, '').then((res: any) => {
    if (res.code === 200) {
      data.value.isLoading = true
    }

    data.value.mySubscribeData = res.data.data
  })
}

function handleSetSubscribeStatus(did: any) {
  // let that = this
  uni.showModal({
    title: '确认取消关注吗？',
    confirmColor: '#0052FE',
    success(res) {
      if (res.confirm) {
        Api.request
          .post(`/user/subscribe`, { did, status: 2, verson: 'v3.2.0' }, '')
          .then((res: any) => {
            if (res.code === 200) {
              getMySubscribeData(data.value.queryData)
            }
          })
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    },
  })
}

function nextPage() {}
</script>

<style lang="scss" scoped>
.container {
  background: #fff;
  min-height: 100vh;
  padding: 40rpx 25rpx;
  box-sizing: border-box;
}

.item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 40rpx;
}

.item image {
  width: 87rpx;
  height: 87rpx;
  margin-right: 26rpx;
  border-radius: 50%;
  flex-shrink: 0;
}

.item .lf {
  display: flex;
  align-items: center;
}

.item .wrap {
  display: flex;
  align-items: center;
}

.item .name {
  font-size: 30rpx;
  color: #353535;
  font-weight: 600;
}

.item .position {
  font-size: 24rpx;
  color: #353535;
  margin: 0 10rpx;
}

.item .label {
  background: #0052fe;
  border-radius: 5rpx;
  padding: 1rpx 7rpx;
  box-sizing: border-box;
  font-size: 16rpx;
  color: #fff;
  font-weight: 600;
}

.item .hospital,
.item .department {
  font-size: 24rpx;
  color: #a4a3a7;
  margin-right: 10rpx;
}

.item .rt {
  width: 127rpx;
  height: 49rpx;
  font-size: 24rpx;
  color: #0052fe;
  border-radius: 25rpx;
  border: 1rpx solid #0052fe;
  display: flex;
  align-items: center;
  justify-content: center;
}

.blank-page {
  background: #fff;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.blank-page .img {
  width: 307rpx;
  height: 319rpx;
  margin: 200rpx 0 37rpx;
}

.blank-page .tips {
  font-size: 34rpx;
  color: #353535;
  font-weight: 600;
}
</style>
