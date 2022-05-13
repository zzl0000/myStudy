<template>
  <view class="container">
    <view class="list-wraper">
      <view
        class="list-item"
        v-for="(item, index) in data.orderList"
        :key="index"
        @click="handleListClick(item)"
      >
        <view
          :class="
            item.is_withdraw == 1 || item.pay_status == 3 || item.pay_status == 4
              ? 'status-box info'
              : 'status-box'
          "
        >
          <text>{{ item.statusText }}</text>
        </view>
        <view class="status-boxs"> </view>
        <view class="list-cont title  border-1px">
          <text class="value">{{ item.created_at }} </text>
        </view>
        <view class="list-cont">
          <text class="label">医生：</text>
          <text class="value">{{ item.doctor_name }}</text>
        </view>
        <view class="list-cont">
          <text class="label">患者：</text>
          <text class="value"
            >{{ item.patient_name }} {{ item.patient_sex == 1 ? '男' : '女' }}
            {{ item.patient_age }}岁</text
          >
        </view>
        <view class="list-cont">
          <text class="label">开方剂型：</text>
          <text class="value">{{ item.dosage_form }}</text>
        </view>
        <block v-if="item.pay_status == 1">
          <view class="list-cont desc" v-if="item.desc">
            <text class="value">{{ item.desc }}</text>
          </view>
        </block>
        <view class="list-cont images" v-if="item.photos && item.photos[0]">
          <image
            :src="data.image"
            v-for="(i, index) in item.photos"
            :key="index"
            @click.stop="handlePreview(i.photos)"
          ></image>
        </view>
        <view class="list-bottom border-1px">
          <view class="total-box" v-if="item.pay_status == 1">
            <text class="label">合计(不含运费)：</text>
            <text class="value">￥{{ item.total_fee_no_express }}</text>
          </view>
          <view class="total-box" v-else>
            <text class="label">合计：</text>
            <text class="value">￥{{ item.total_fee }}</text>
          </view>
          <view class="btn-box" v-if="item.statusText == '待付款'">
            <view class="btn" @click.stop="handlePay(item.id)">去付款</view>
          </view>
          <view class="btn-box-font" v-if="item.refund_type == '2'" style="color: #898989;">
            已退款￥{{ item.refund_amount }}
            <!-- <view class="btn" data-id="{{item.id}}" catchtap="handlePay">去付款</view> -->
          </view>
        </view>
      </view>
      <load-more v-if="data.isLoadMore" :isLoadConfig="data.isLoadConfig"></load-more>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onPullDownRefresh, onReachBottom, onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'
import Api from '../../../../api/index'
import config from '../../../../config/config'
import common from '../../../../utils/common'
import { useStore } from 'vuex'
const store = useStore()

const app = getApp()
const data = ref({
  status: 0,
  page: 1,
  limit: 5,
  total: 0,
  orderList: [],
  isLoadMore: false,
  isLoadConfig: {
    show: false,
    noMore: false,
    noDate: false,
  },
  image: '',
})

/**
 * 生命周期函数--监听页面显示
 */
onShow(() => {
  store.dispatch('validateLogin').then(() => {
    getOrderList()
  })
})

/**
 * 页面相关事件处理函数--监听用户下拉动作
 */
onPullDownRefresh(() => {
  data.value.page = 1
  getOrderList()
})
/**
 * 页面上拉触底事件的处理函数
 */
onReachBottom(() => {
  if (data.value.isLoadMore && data.value.isLoadConfig.show) {
    data.value.page = data.value.page + 1
    getOrderList()
  }
})

function handleListClick(item: any) {
  const id = item.id
  const pay_status = item.pay_status
  const is_withdraw = item.is_withdraw
  const status = item.status
  if (pay_status == 1 && status != 9 && is_withdraw != 1) {
    uni.navigateTo({
      url: `/pages/my-center/drug-orders/newdetail/index?id=${id}`,
    })
  } else {
    uni.navigateTo({
      url: `/pages/my-center/drug-orders/detail/index?id=${id}`,
    })
  }
}

function handlePay(ids: string) {
  const id = ids
  uni.navigateTo({
    url: `/pages/my-center/drug-orders/newdetail/index?id=${id}`,
  })
}

function handlePreview(item: any) {
  const current = item.src
  const urls = item.item
  uni.previewImage({
    current,
    urls,
  })
}

function getOrderList() {
  // request
  common.requestToken({
    method: 'post',
    url: `${config.BaseMpUrl}/apps/mpv2/prescript/getList`,
    data: {
      status: data.value.status,
      page: data.value.page,
      limit: data.value.limit,
      debug: 3,
    },
    callback: (res: any) => {
      console.log(res)
      uni.stopPullDownRefresh()
      if (res.code == 200) {
        let items = res.data.items || []
        items = items.map((item: any) => {
          item.statusText = getStatusText(item.pay_status, item.is_withdraw, item.refund_type)
          item.desc = getDescByCreateTime(item.created_at)
          return item
        })
        let isLoadMore = true
        let isLoadConfig = {
          show: true,
          noMore: false,
          noDate: false,
        }
        let list = []
        if (data.value.page === 1) {
          if (items.length === 0) {
            isLoadConfig = {
              show: false,
              noMore: false,
              noDate: true,
            }
          } else if (items.length < data.value.limit) {
            isLoadConfig = {
              show: true,
              noMore: false,
              noDate: false,
            }
          } else {
            isLoadConfig = {
              show: true,
              noMore: true,
              noDate: false,
            }
          }
          list = items || []
        } else {
          if (items.length < data.value.limit) {
            isLoadConfig = {
              show: true,
              noMore: false,
              noDate: false,
            }
          } else {
            isLoadConfig = {
              show: true,
              noMore: true,
              noDate: false,
            }
          }
          list = data.value.orderList.concat(items || [])
        }
        list.filter((item: any, index: any) => {
          if (item.patient_age.lastIndexOf('岁') > -1) {
            item.patient_age = item.patient_age.substring(0, item.patient_age.length - 1)
          }
        })
        data.value.orderList = list
        data.value.isLoadMore = isLoadMore
        data.value.isLoadConfig = isLoadConfig
      } else {
        if (data.value.page === 1) {
          data.value.isLoadMore = true
          data.value.isLoadConfig = {
            show: false,
            noMore: false,
            noDate: true,
          }
        }
      }
    },
  })
}

function getStatusText(val: any, is_withdraw: any, type: any) {
  let text = ''
  if (is_withdraw == 1) {
    text = '已失效'
  } else if (val == 1) {
    text = '待付款'
  } else if (val == 2) {
    text = '待收货'
  } else if (val == 3 || val == 4) {
    if (type == 2) {
      text = '部分退款'
    } else {
      text = '已退款'
    }
  } else if (val == 5) {
    text = '已完成'
  } else if (is_withdraw == 1) {
  }
  return text
}

function getDescByCreateTime(date: string) {
  let text = ''
  // if (date) {
  //   let hours = new Date(date).getHours()
  //   console.log(hours)
  //   if (hours >= 0 && hours < 9) {
  //     text = `您的照片方将在9:00之后进行处理`
  //   } else if (hours >= 18 && hours < 24) {
  //     text = `您的照片方将在次日9:00之后进行处理`
  //   }
  // }
  return text
}
</script>

<style scoped lang="scss">
.border-1px {
  position: relative;
}

.border-1px::after {
  position: absolute;
  content: '';
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 1px;
  transform: scaleY(0.5);
  background: #eee;
}
.container {
  position: relative;
  background: #f7f9fa;
  // height: 100vh;
}
/* 
.tabbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  height: 90rpx;
  z-index: 100;
} */
.tabbar-item {
  flex: 1;
  text-align: center;
  padding: 22rpx 0;
  font-size: 32rpx;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  color: #666;
  transition: all 0.3s linear;
}
.tabbar-item.active {
  position: relative;
  color: #1890ff;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 500;
}
.tabbar-item.active::after {
  position: absolute;
  left: 50%;
  margin-left: -32rpx;
  bottom: -0;
  content: '';
  width: 64rpx;
  height: 4rpx;
  background: #1890ff;
  border-radius: 2px;
}

.list-wraper {
  padding: 30rpx;
  /* margin-top: 90rpx; */
}
.list-item {
  position: relative;
  padding: 30rpx 30rpx 0 30rpx;
  margin-bottom: 30rpx;
  background: #fff;
  border-radius: 8rpx;
  font-size: 28rpx;
}
.status-box {
  position: absolute;
  right: 30rpx;
  top: 30rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  color: #ff6633;
}
.status-boxs {
  height: 25px;
  position: absolute;
  left: 0px;
  top: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  color: #007cff;
  width: 4.5px;
  background: #0052fe;
  border-radius: 0px 100px 100px 0px;
}

.invalid-status-box {
  position: absolute;
  right: 30rpx;
  top: 30rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  color: #cccccc;
}

.status-box .circle {
  width: 10rpx;
  height: 10rpx;
  margin-right: 10rpx;
  border: 2rpx solid #007cff;
  border-radius: 50%;
}
.status-box.info {
  color: #999;
}
.status-box.info .circle {
  border-color: #999;
}
.list-cont {
  display: flex;
  align-items: center;
  justify-content: space-between;
  line-height: 40rpx;
  margin-bottom: 10rpx;
}
.list-cont.title {
  margin-bottom: 20rpx;
}
.list-cont.title .value {
  color: #333;
  /* font-weight: 600; */
  margin-bottom: 10px;
}
.list-cont.desc .value {
  color: #999;
}
.list-cont .label {
  width: 140rpx;
  color: #999;
}
.list-cont .value {
  flex: 1;
  text-align: justify;
  /* color: #666; */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.list-cont.images {
  margin-top: 20rpx;
  justify-content: flex-start;
}
.list-cont.images image {
  width: 100rpx;
  height: 100rpx;
  border-radius: 8rpx;
  margin-right: 20rpx;
  background: #eee;
}
.list-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 30rpx;
  padding: 35rpx 0;
}
.list-bottom::after {
  top: 0;
}
.list-bottom .total-box {
  display: flex;
  align-items: center;
}
.list-bottom .label {
  color: #0052fe;
}
.list-bottom .value {
  color: #0052fe;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 144rpx;
  height: 50rpx;
  background: #0052fe;
  border-radius: 10px;
  color: #fff;
  font-family: PingFangSC, PingFangSC-Medium;
  font-size: 28rpx;
  font-weight: 500;
  line-height: 40rpx;
}
</style>
