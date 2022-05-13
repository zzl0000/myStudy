<template>
  <view class="container">
    <!-- 问诊列表 -->
    <view class="inquiry-list">
      <view
        class="list-item card"
        v-for="(item, index) in data.list"
        :key="index"
        @click="handleJump(item, '/pages/im-inquiry/im/index')"
      >
        <view class="top-item">
          <view class="avatar">
            <image
              class="img"
              @error="errorImg(index)"
              :src="item.doctor_info.avatar || assetsLink + '/assets/def-header-icon.png'"
            />
          </view>
          <view class="info-group">
            <view class="doctor-name">{{ item.doctor_info.doctor_name || '暂无医生' }}</view>
            <view class="job">{{ item.doctor_info.ks2name || '暂无' }}</view>
          </view>
        </view>
        <view class="tag-group">
          <view class="order-status">{{ item.order_status }}</view>
          <view class="order-type">{{ item.type_name }}</view>
        </view>
        <view class="content-group">
          <view class="content-item">
            <view class="label">就诊人：</view>
            <view class="val">
              {{ item.patient_info.username }} {{ item.patient_info.sex }}
              {{ item.patient_info.age }}
            </view>
          </view>
          <view class="content-item">
            <view class="label">病情描述：</view>
            <view class="val  ellipsis-2">{{ item.desc }}</view>
          </view>
          <view v-if="item.dial_time" class="content-item">
            <view class="label">预约时间：</view>
            <view class="val active">{{ item.dial_time }}</view>
          </view>
          <view class="content-item">
            <view class="label">下单时间：</view>
            <view class="val">{{ item.created_time }}</view>
          </view>
        </view>
        <!-- <view class="footer-item">
        <view class="contact">客服电话：400-8007202</view>
      </view> -->
      </view>
      <load-more :isLoadConfig="data.isLoadConfig"></load-more>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onPullDownRefresh, onReachBottom, onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'
import config from '../../../config/config'
import Api from '../../../api/index'

const app = getApp()
const assetsLink = config.assetsLink
const data = ref({
  url: '',
  list: [],
  isLoadConfig: {
    show: false,
    noMore: false,
    noDate: false,
  },
  pageCf: {
    page: 1,
    limit: 10,
  },
})

/**
 * 生命周期函数--监听页面显示
 */
onShow(() => {
  uni.setNavigationBarTitle({
    title: '我的问诊',
  })
  handleInit()
})

/**
 * 页面相关事件处理函数--监听用户下拉动作
 */
onPullDownRefresh(() => {
  data.value.pageCf = {
    page: 1,
    limit: 10,
  }
  handleInit()
  setTimeout(function() {
    uni.stopPullDownRefresh()
  }, 1000)
})

/**
 * 页面上拉触底事件的处理函数
 */
onReachBottom(() => {
  if (data.value.isLoadConfig.show && data.value.isLoadConfig.noMore) {
    data.value.pageCf = {
      page: data.value.pageCf.page + 1,
      limit: 10,
    }

    handleInit()
  }
})

async function handleInit() {
  let {
    pageCf: { page, limit },
    list,
  } = data.value
  let params = {
    page,
    limit,
  }
  try {
    await Api.inquiryRecord.getInquiryList(params).then((res: any) => {
      if (res.code == 200) {
        let items = res.data.list || []
        if (page === 1) {
          list = items || []
        } else {
          list = list.concat(items || [])
        }
        let isLoadConfig = {
          show: !(page === 1 && items.length === 0),
          noMore: items.length === limit,
          noDate: page === 1 && items.length === 0,
        }

        data.value.list = list
        data.value.isLoadConfig = isLoadConfig
      } else {
        data.value.isLoadConfig = {
          show: false,
          noMore: false,
          noDate: true,
        }
      }
    })
  } catch (error) {
    console.log(error)
  }
}

function handleJump(item: any, url: string) {
  console.log(item)
  let status = item.order_status
  if (item.type == 1) {
    switch (status) {
      case '未支付':
        uni.navigateTo({
          url: `/pages/quick-inquiry/index?order_sn=${item.order_sn}&pay=${true}&order_oc=${
            item.ocid
          }`,
        })
        break
      case '已取消':
        uni.showToast({
          title: '订单已取消,请重新下单~',
          icon: 'none',
          duration: 2000,
        })
        break
      case '待接诊':
        uni.navigateTo({
          url: `/pages/quick-inquiry/index?order_sn=${item.order_sn}&order_oc=${item.ocid}`,
        })
        break
      case '退款中':
        if (item.doctor_info.doctor_id) {
          //判断有无医生接诊
          uni.navigateTo({
            url: `/pages/im-inquiry/im/index?order_sn=${item.order_sn}`,
          })
        } else {
          uni.navigateTo({
            url: `/pages/quick-inquiry/index?order_sn=${item.order_sn}&order_oc=${item.ocid}`,
          })
        }
        break
      case '已退款':
        if (item.doctor_info.doctor_id) {
          //判断有无医生接诊
          uni.navigateTo({
            url: `/pages/im-inquiry/im/index?order_sn=${item.order_sn}`,
          })
        } else {
          uni.navigateTo({
            url: `/pages/quick-inquiry/index?order_sn=${item.order_sn}&order_oc=${item.ocid}`,
          })
        }
        break

      default:
        //待就诊  已结束  问诊中
        uni.navigateTo({
          url: `/pages/im-inquiry/im/index?order_sn=${item.order_sn}`,
        })
        break
    }
  } else {
    switch (status) {
      case '未支付':
        uni.navigateTo({
          url: `/pages/pay/pay?type=1&id=${item.ocid}&order_sn=${item.order_sn}&money=${
            item.order_money
          }&wz=${1}`,
        })
        break
      case '已取消':
        uni.showToast({
          title: '订单已取消,请重新下单~',
          icon: 'none',
          duration: 2000,
        })
        break
      default:
        uni.navigateTo({
          url: `${url}?order_sn=${item.order_sn}`,
        })
        break
    }
  }
}

function errorImg(e: number) {
  var errorImgIndex = e //获取循环的下标
  var imgObject = 'list[' + errorImgIndex + '].doctor_info.avatar' //commentList为数据源，对象数组
  var errorImg = {}

  errorImg[imgObject] = config.assetsLink + '/assets/def-header-icon.png' //构建一个对象
  // this.setData(errorImg)
  // data.value.list[e].doctor_info = errorImg
}
</script>

<style lang="scss" scoped>
page {
  background: #f9fafc;
}
.ellipsis-2 {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* inquiry-list */
.inquiry-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 60rpx;
}

.inquiry-list .list-item {
  display: flex;
  flex-direction: column;
  margin-top: 20rpx;
  padding: 0;
  position: relative;
}

.top-item {
  display: flex;
  align-items: center;
  position: relative;
  padding: 0 30rpx;
  margin-top: 30rpx;
}
.top-item .avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  overflow: hidden;
}

.top-item .info-group {
  margin-left: 30rpx;
}

.list-item .tag-group {
  position: absolute;
  top: 30rpx;
  right: 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.list-item .tag-group .order-status {
  font-size: 26rpx;
  font-weight: 500;
  text-align: right;
  color: #1890ff;
  position: relative;
  padding-left: 20rpx;
}

.list-item .tag-group .order-status::after {
  clear: both;
  content: '';
  position: absolute;
  left: -10rpx;
  top: 10rpx;
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  border: 4rpx solid #1890ff;
}
.list-item .tag-group .order-type {
  font-size: 24rpx;
  font-weight: 500;
  text-align: right;
  color: #1890ff;
  padding: 11rpx 20rpx;
  background: rgba(231, 243, 255, 0.6);
  border-radius: 8rpx;
  margin-top: 15rpx;
}

.content-group {
  display: flex;
  flex-direction: column;
  padding: 0 30rpx;
  margin-bottom: 10rpx;
  margin-top: 25rpx;
}

.content-group .content-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 10rpx;
}

.content-group .content-item .label {
  min-width: 120rpx;
  height: 33rpx;
  font-size: 24rpx;
  font-weight: 400;
  text-align: justify;
  color: #333333;
}

.content-group .content-item .val {
  font-size: 24rpx;
  font-weight: 400;
  text-align: justify;
  color: #999999;
  word-break: break-all;
}

.content-group .content-item .val.active {
  color: #1890ff;
}

.footer-item {
  padding: 0 30rpx;
  border-top: 1px solid #eeeeee;
}

.footer-item .contact {
  font-size: 24rpx;
  font-weight: 400;
  text-align: justify;
  color: #999999;
  line-height: 33px;
  padding: 25rpx 0;
}

/* info-group */

.info-group .doctor-name {
  font-size: 36rpx;
  font-weight: 500;
  text-align: justify;
  color: #333333;
}
.info-group .job {
  font-size: 28rpx;
  font-weight: 500;
  text-align: justify;
  color: #999999;
}

/* public */
.card {
  width: 690rpx;
  opacity: 1;
  background: #ffffff;
  border-radius: 16rpx;
  padding: 30rpx;
  box-sizing: border-box;
}

.img {
  width: 100%;
  height: 100%;
}
</style>
