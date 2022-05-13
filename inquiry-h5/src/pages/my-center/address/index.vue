<template>
  <view class="container">
    <view class="list-box">
      <radio-group @change="radioChange">
        <view class="list-item" v-for="(item, index) in data.addressList" :key="index">
          <view class="info-box border-1px">
            <view class="list-cont" @click.stop.prevent="handleSelect(item.id)">
              <view class="desc">
                {{ item.name }}
                <text>{{ item.mobileStr }}</text>
                <view class="defaultaddress" v-if="item.is_default == 1 ? true : false"
                  >默认地址</view
                >
              </view>
              <view class="name"
                >{{ item.province }}{{ item.city }}{{ item.area }}{{ item.address }}
              </view>
            </view>
            <view class="list-right" @click.stop.prevent="handleEdit(item)">
              <image class="edit" :src="assetsLink + '/assets/physician/address.png'"></image>
            </view>
          </view>
        </view>
      </radio-group>
    </view>
    <view class="footer-box">
      <button type="primary" @click="handleAdd">添加收货地址</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onLoad, onPullDownRefresh, onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'
import config from '../../../config/config'
import common from '../../../utils/common'
import Api from '../../../api/index'

const app = getApp()
const assetsLink = config.assetsLink

const data = ref({
  orderId: '',
  order_sn: '',
  isEditOrderAddress: 0,
  addressList: [],
  currentId: '',
  isLoad: false,
  id: '',
  btn: 0,
})

/**
 * 生命周期函数--监听页面加载
 */
onLoad((options) => {
  console.log(options)

  data.value.orderId = options.orderId || ''
  data.value.order_sn = options.order_sn || ''
  data.value.isEditOrderAddress = <any>options.isEditOrderAddress
  data.value.id = options.id || ''
})

/**
 * 生命周期函数--监听页面显示
 */
onShow(() => {
  getAddressList()
})

/**
 * 页面相关事件处理函数--监听用户下拉动作
 */
onPullDownRefresh(() => {
  getAddressList()
})

function getAddressList() {
  uni.showLoading({
    title: '加载中',
  })
  // // request
  common.requestToken({
    method: 'post',
    url: `${config.BaseMpUrl}/apps/mpv1/user/getShippingAddressList`,
    data: {},
    callback: (res: any) => {
      uni.hideLoading()
      uni.stopPullDownRefresh()
      if (res.code == 200) {
        res.data.map((item: any) => {
          item.mobileStr = item.mobile.substr(0, 3) + '****' + item.mobile.substr(7)
        })
        data.value.addressList = res.data || []
      } else {
        uni.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000,
        })
      }
    },
  })
}

function handleAdd() {
  uni.navigateTo({
    url: `/pages/my-center/address/editAddress/index?orderId=${data.value.orderId}`,
    success: () => {
      app.globalData?.$cache.removeSelectedCity()
    },
  })
}

function handleEdit(e: any) {
  const id = e.id
  uni.navigateTo({
    url: `/pages/my-center/address/editAddress/index?id=${id}&orderId=${data.value.orderId}`,
    success: () => {
      app.globalData?.$cache.removeSelectedCity()
    },
  })
}

function handleSelect(id: any) {
  if (data.value.isEditOrderAddress == 1) {
    editOrderAddress(id)
  }
}

function handleDelete(e: any) {
  const id = e.currentTarget.dataset.id
  // deleteAddress(id)
}

function radioChange(e: any) {
  let value = e.detail.value
  let datas = data.value.addressList.find((item) => item.id == value)
  // console.log(value, data)
  // editAddress(value, data)
}

function editOrderAddress(id: any) {
  let { isLoad } = data.value
  if (isLoad) {
    return
  }
  uni.showLoading({
    title: '加载中',
  })

  data.value.isLoad = true

  const datas = {
    id: data.value.id,
    type: 1, // 类型，1处方，2视频问诊
    addr_id: id,
  }
  console.log(datas)
  // request
  common.requestToken({
    method: 'post',
    url: `${config.BaseMpUrl}/apps/mpv1/prescript/updateAddress`,
    data: datas,
    callback: (res: any) => {
      uni.hideLoading()
      if (res.code == 200) {
        updateExpressFee()
      } else {
        uni.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000,
        })

        data.value.isLoad = false
      }
    },
  })
}

// 计算顺丰邮费
function updateExpressFee() {
  let params = {
    id: data.value.id,
    verson: 'v3.0.2',
  }
  Api.request
    .post('/wz/v3/express/sf/postage/findnew', params, '')
    .then((res: any) => {
      if (res.code == 200) {
        uni.navigateBack({})
        data.value.isLoad = true
      } else {
        uni.showToast({
          title: res.message,
          icon: 'none',
        })
        data.value.isLoad = true
      }
    })
    .catch((res: any) => {
      uni.showToast({
        title: res.message,
        icon: 'none',
      })

      data.value.isLoad = true
    })
}

function deleteAddress(id: any) {
  uni.showLoading({
    title: '加载中',
  })
  // request
  common.requestToken({
    method: 'post',
    url: `${config.BaseMpUrl}/apps/mpv1/user/delShippingAddress`,
    data: {
      id,
    },
    callback: (res: any) => {
      uni.hideLoading()
      if (res.code == 200) {
        uni.showToast({
          title: '删除成功',
          icon: 'success',
          duration: 2000,
        })
        getAddressList()
      } else {
        uni.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000,
        })
      }
    },
  })
}

function editAddress(id: any, data: any) {
  // request
  common.requestToken({
    method: 'post',
    url: `${config.BaseMpUrl}/apps/mpv1/user/saveShippingAddress`,
    data: {
      id,
      province: data.province,
      city: data.city,
      area: data.area,
      address: data.address,
      name: data.name,
      mobile: data.mobile,
      is_default: 1,
    },
    callback: (res: any) => {
      if (res.code == 200) {
        getAddressList()
      } else {
        uni.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000,
        })
      }
    },
  })
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  position: relative;
  background: #f7f9fa;
  height: 100vh;
}

.list-box {
  padding: 0 30rpx 180rpx 30rpx;
}
.list-item {
  background: #fff;
  margin-bottom: 15rpx;
  border-radius: 8px;
}
.list-item:first-child {
  margin-top: 30rpx;
}
.info-box {
  display: flex;
  padding: 30rpx 30rpx;
}
.list-cont {
  flex: 1;
  margin-right: 30rpx;
  font-size: 28rpx;
  text-align: justify;
  line-height: 40rpx;
}
.list-cont .name {
  color: #000000;
  margin-top: 10rpx;
}
.list-cont .desc {
  color: #000000;
  font-size: 30rpx;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.defaultaddress {
  font-weight: normal;
  background: #d2e1ff;
  font-size: 18rpx;
  border-radius: 50rpx;
  width: 114rpx;
  height: 30rpx;
  line-height: 30rpx;
  text-align: center;
  margin-left: 20rpx;
  color: #0052fe;
}

.list-cont .desc text {
  color: #939393;
  font-size: 26rpx;
  font-weight: 500;
  margin-left: 10rpx;
}

.list-right .edit {
  width: 32rpx;
  height: 32rpx;
  margin-top: 20rpx;
}
.bottom-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 90rpx;
  padding: 0 30rpx;
  color: #666;
  font-size: 28rpx;
}

.footer-box {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  padding: 30rpx 60rpx;
  background: #fff;
}

button[type='primary'] {
  height: 88rpx;
  line-height: 88rpx;
  background-color: #0052fe;
  border-radius: 45rpx;
  font-weight: 700;
  font-size: 32rpx;
}
.button-hover[type='primary'] {
  background-color: #047eef;
}
button[disabled][type='primary'] {
  background-color: #e7f3ff;
  border: 0;
  color: #b8cfe6;
}
button[disabled][type='primary']::after {
  border: 0;
}
</style>
