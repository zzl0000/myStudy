<template>
  <view class="container">
    <view
      class="item"
      v-for="(item, index) in data.list"
      :key="index"
      @click="handleJump(item.did, '/pages/inquiry/inquiry/inquiry')"
    >
      <view class="item-doc">
        <image :src="item.avatar" />
        <view class="content">
          <view class="doctorName">
            <text>{{ item.doctorName }}</text>
            {{ item.doctorTitle }}
          </view>
          <view class="cooperation">
            <view v-if="item.deptName">{{ item.deptName }}</view>
            名医在线合作医生
          </view>
        </view>
      </view>

      <view class="count" v-if="item.consultationNum || item.prescriptNum">
        <view v-if="item.consultationNum">
          问诊
          <text>{{ item.consultationNum }}</text>
          次
        </view>
        <view v-if="item.consultationNum && item.prescriptNum">，</view>
        <view v-if="item.prescriptNum">
          购药
          <text>{{ item.prescriptNum }}</text>
          次
        </view>
      </view>
    </view>
    <load-more :isLoadConfig="data.isLoadConfig" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
import config from '../../../config/config'
import Api from '../../../api/index'

const assetsLink = config.assetsLink
const data = ref({
  list: <Array<any>>[],
  isLoadConfig: {
    show: false,
    noMore: false,
    noDate: false,
  },
  params: {
    page: 1,
    limit: 20,
  },
})

function handleJump(id, url) {}

function init() {
  return new Promise<void>((resolve, reject) => {
    let { params, list } = data.value
    let isLoadConfig = {
      show: true,
      noMore: false,
      noDate: false,
    }
    Api.doctor
      .getDoctorList({})
      .then((res: any) => {
        if (res.code == 200) {
          const isHasData = params.page == 1 && (!res.data || res.data.length === 0)
          if (params.page == 1) list = []
          list = res.data
          isLoadConfig = {
            show: !isHasData,
            noMore: false,
            noDate: isHasData,
          }
        }

        data.value.isLoadConfig = isLoadConfig
        data.value.list = list
        resolve()
      })
      .catch((err: any) => {
        reject(err)
      })
  })
}

/**
 * 生命周期函数--监听页面加载
 */
onLoad(() => {
  init()
})
/**
 * 页面相关事件处理函数--监听用户下拉动作
 */
onPullDownRefresh(() => {
  data.value.params = { page: 1, limit: 10 }
  init().then(() => {
    uni.stopPullDownRefresh()
  })
})
/**
 * 页面上拉触底事件的处理函数
 */
onReachBottom(() => {
  if (data.value.isLoadConfig.show && data.value.isLoadConfig.noMore) {
    data.value.params = {
      page: data.value.params.page + 1,
      limit: 10,
    }

    init()
  }
})
</script>

<style lang="scss" scoped>
.container {
  margin: 0rpx 25rpx;
  padding: 20rpx 0;
}

.item {
  // margin-top: 8rpx;
  background-color: #fff;
  border-radius: 20rpx;
  margin-bottom: 16rpx;
  padding: 20rpx;
  // display: flex;
}
.item-doc {
  display: flex;
  padding-bottom: 20rpx;
}
.item image {
  height: 100rpx;
  width: 100rpx;
  background-color: #d9d9d9;
  border-radius: 50%;
}

.content {
  margin-left: 40rpx;
  flex: 1;
  font-size: 24rpx;
  color: #353535;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.doctorName text {
  font-size: 30rpx;
  font-weight: 600;
  margin-right: 10rpx;
}

.cooperation {
  display: flex;
  align-items: center;
}

.cooperation view {
  // background: linear-gradient(270deg, rgba(224, 239, 255, 0.85), #b5d9ff);
  border-radius: 4rpx;
  // margin-left: 10rpx;
  padding: 0 20rpx 0 0;
  font-size: 20rpx;
}

.count {
  border-top: 1px solid #d9d9d93b;
  color: #6767679d;
  font-size: 22rpx;
  display: flex;
  align-items: center;
  padding: 10rpx 0 0 0;
}

.count text {
  color: #007cff;
}
</style>

function reject(err: any) { throw new Error("Function not implemented.") } function reject(err: any)
{ throw new Error("Function not implemented.") }
