<template>
  <form class="form-box" @submit="formSubmit">
    <view class="form-item border-1px">
      <view class="label">选择地区</view>
      <view class="cont" @click="handleSelectArea">
        <input name="cities" placeholder="请选择省、市、区" :disabled="true" :value="data.cities" />
        <image class="icon" :src="assetsLink + '/assets/arrow-r@2x.png'"></image>
      </view>
    </view>
    <view class="form-item border-1px">
      <view class="label">详细地址</view>
      <view class="cont">
        <textarea
          name="address"
          placeholder="请输入收货人详细地址"
          :auto-height="true"
          :value="data.address"
          @focus="handleFocus"
          :focus="focus"
        />
      </view>
    </view>
    <!-- <view class="form-item border-1px">
      <view class="label">门牌号</view>
      <view class="cont">
        <textarea
          name="house_number"
          placeholder="请输入门牌号"
          :auto-height="true"
          :value="data.house_number"
        />
      </view>
    </view> -->
    <view class="form-item border-1px">
      <view class="label">收货人</view>
      <view class="cont">
        <input name="name" placeholder="请输入收货人姓名" :value="data.name" maxlength="10" />
      </view>
    </view>
    <view class="form-item border-1px">
      <view class="label">手机号</view>
      <view class="cont">
        <input
          type="number"
          name="mobile"
          placeholder="请输入手机号"
          placeholder-class="input-placeholder"
          :value="data.mobile"
          maxlength="11"
        />
      </view>
    </view>
    <!-- <view class="form-radio">
      <checkbox-group name="is_default">
        <checkbox
          :value="data.is_default"
          :checked="data.is_default == 0 ? false : true"
          color="#1890ff"
        >
          <text>存为默认收货地址</text>
        </checkbox>
      </checkbox-group>
    </view> -->

    <view class="form-item border-1px ">
      <view class="label">存为默认地址</view>
      <view class="cont1 form-switch">
        <switch
          name="is_default"
          :checked="data.is_default == '0' ? false : true"
          color="#0052FE"
        />
      </view>
    </view>
    <view class="footer-box">
      <button type="primary" :disabled="data.disabled" form-type="submit" class="btn">
        保存并使用
      </button>
    </view>
  </form>

  <AddPopup
    :show="data.showPopup"
    :city="data.city"
    :address="data.address"
    class="addPopup"
    @cancel="handleCancel"
    @confirm="handleConfrim"
  />

  <selectArea
    :show="data.selectPopup"
    class="addPopup"
    @onCancel="handleSelectCancel"
    @onSelect="handleSelectConfrim"
  />
</template>

<script setup lang="ts">
import { onHide, onLoad, onShow, onUnload } from '@dcloudio/uni-app'
import { ref, watch } from 'vue'
import config from '../../../../config/config'
import Api from '../../../../api/index'
import common from '../../../../utils/common'
import AddPopup from './add-popup/add-popup.vue'
import selectArea from './select-area/select-area.vue'

const app = getApp()

const assetsLink = config.assetsLink
const focus = ref(false)
const data = ref({
  selectPopup: false,
  showPopup: false,
  orderId: '',
  id: '',
  order_sn: '',
  isEditOrderAddress: 0,
  name: '',
  mobile: '',
  house_number: '',
  province: '',
  city: '',
  area: '',
  cities: '',
  address: '',
  is_default: '0',
  disabled: false,
})

/**
 * 生命周期函数--监听页面加载
 */
onLoad((options) => {
  console.log(options)
  data.value.orderId = options.orderId || ''
  data.value.id = options.id || ''
  data.value.order_sn = options.order_sn || ''
  data.value.isEditOrderAddress = <any>options.isEditOrderAddress

  if (data.value.id) {
    getAddressDetail()
  }
  // getCities()
})

/**
 * 生命周期函数--监听页面显示
 */
onShow(() => {
  const selectedCity = app.globalData?.$cache.getSelectedCity()
  if (selectedCity) {
    let params = {
      ...data.value,
      ...selectedCity,
      cities: `${selectedCity.province} ${selectedCity.city} ${selectedCity.area}`,
    }
    data.value = params
  }
})

/**
 * 生命周期函数--监听页面隐藏
 */
onHide(() => {
  app.globalData?.$cache.removeSelectedCity()
})

/**
 * 生命周期函数--监听页面卸载
 */
onUnload(() => {
  app.globalData?.$cache.removeSelectedCity()
})

function handleSelectArea(e: any) {
  data.value.selectPopup = true
}

function handleFocus() {
  data.value.showPopup = true
}

function getAddressDetail() {
  // request
  common.requestToken({
    method: 'post',
    url: `${config.BaseMpUrl}/apps/mpv1/user/getShippingAddress`,
    data: {
      id: data.value.id,
    },
    callback: (res: any) => {
      console.log(res)
      if (res.code == 200) {
        let datas = res.data
        let params = {
          // ...data.value,
          ...datas,
          cities: `${datas.province || ''} ${datas.city || ''} ${datas.area || ''}`,
        }
        console.log(params)

        data.value = params
        // this.setData({
        //   ...data,
        //   cities: `${data.province || ''} ${data.city || ''} ${data.area || ''}`,
        // })
        app.globalData?.$cache.setSelectedCity({
          province: data.value.province,
          city: data.value.city,
          area: data.value.area,
        })
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

function handleCancel() {
  data.value.showPopup = false
}

function handleConfrim(detail: any, val: number) {
  data.value.showPopup = false

  if (val == 0) {
    data.value.address = detail
  }

  if (val == 1) {
    data.value.address = detail.name + (detail.address ? ' - ' + detail.address : '')
  }
}

function formSubmit(e: any) {
  console.log('form发生了submit事件，携带数据为：', e.detail.value)
  let value = e.detail.value
  if (value.cities == '') {
    uni.showToast({
      title: '请选择省、市、区、街道',
      icon: 'none',
    })
    return
  }
  if (value.address == '') {
    uni.showToast({
      title: '请输入收货人详细地址',
      icon: 'none',
    })
    return
  }
  // if (value.house_number == '') {
  //   uni.showToast({
  //     title: '请输入门牌号',
  //     icon: 'none',
  //   })
  //   return
  // }
  if (value.name == '') {
    uni.showToast({
      title: '请输入收货人姓名',
      icon: 'none',
    })
    return
  }
  if (value.mobile == '') {
    uni.showToast({
      title: '请输入收货人手机号',
      icon: 'none',
    })
    return
  }
  if (data.value.disabled) {
    return
  }
  if (data.value.id) {
    editAddress(value)
  } else {
    addAddress(value)
  }
}

function editAddress(value: any) {
  uni.showLoading({
    title: '加载中',
  })

  data.value.disabled = true

  // request
  common.requestToken({
    method: 'post',
    url: `${config.BaseMpUrl}/apps/mpv1/user/saveShippingAddress`,
    data: {
      id: data.value.id,
      province: data.value.province,
      city: data.value.city,
      area: data.value.area,
      address: value.address,
      name: value.name,
      mobile: value.mobile,
      house_number: value.house_number,
      is_default: value.is_default ? '1' : '0',
      // is_default: value.is_default,
    },
    callback: (res: any) => {
      uni.hideLoading()
      data.value.disabled = false
      if (res.code == 200) {
        uni.showToast({
          title: '修改成功',
          icon: 'success',
          duration: 2000,
        })
        setTimeout(() => {
          uni.navigateBack({})
        }, 500)
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

function addAddress(value: any) {
  uni.showLoading({
    title: '加载中',
  })
  data.value.disabled = true
  // request
  common.requestToken({
    method: 'post',
    url: `${config.BaseMpUrl}/apps/mpv1/user/addShippingAddress`,
    data: {
      province: data.value.province,
      city: data.value.city,
      area: data.value.area,
      address: value.address,
      name: value.name,
      mobile: value.mobile,
      house_number: value.house_number,
      is_default: value.is_default ? '1' : '0',
      // is_default: value.is_default,
    },
    callback: (res: any) => {
      if (res.code == 200) {
        if (data.value.isEditOrderAddress == 1) {
          editOrderAddress(res.data.id)
        } else {
          data.value.disabled = false
          uni.hideLoading()
          uni.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 500,
          })
          setTimeout(() => {
            uni.navigateBack({})
          }, 1000)
        }
      } else {
        data.value.disabled = false
        uni.hideLoading()
        uni.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000,
        })
      }
    },
  })
}

/**
 * 修改药品订单收货信息
 * @param {*} value
 */
function editOrderAddress(id: any) {
  // request
  common.requestToken({
    method: 'post',
    url: `${config.BaseMpUrl}/apps/mpv1/prescript/updateAddress`,
    data: {
      id: data.value.orderId,
      type: 1, // 类型，1处方，2视频问诊
      addr_id: id,
    },
    callback: (res: any) => {
      uni.hideLoading()
      data.value.disabled = false
      if (res.code == 200) {
        updateExpressFee()
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

// 计算顺丰邮费
function updateExpressFee() {
  let params = {
    order_sn: data.value.order_sn,
    verson: 'v3.0.2',
  }
  Api.request
    .post('/wz/v3/express/sf/postage/find', params, '')
    .then((res: any) => {
      if (res.code == 200) {
        uni.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 2000,
        })
        setTimeout(() => {
          uni.redirectTo({
            url: `/pages/my-center/drug-orders/detail/index?id=${data.value.orderId}`,
          })
        }, 500)
      } else {
        uni.showToast({
          title: res.message,
          icon: 'none',
        })
      }
    })
    .catch((res) => {
      uni.showToast({
        title: res.message,
        icon: 'none',
      })
    })
}

function handleSelectCancel() {
  data.value.selectPopup = false
}

function handleSelectConfrim(e: any) {
  let params = {
    ...data.value,
    ...e,
    cities: `${e.province} ${e.city} ${e.area}`,
  }
  data.value = params
}
</script>

<style lang="scss" scoped>
.form-switch {
  flex: 1;
  text-align: right;
  margin-right: 40rpx;
}
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
.form-item {
  display: flex;
  align-items: center;
  padding: 23rpx 0 22rpx 30rpx;
  background: #fff;
}
.form-radio {
  margin-top: 30rpx;
  padding-left: 30rpx;
}
.form-radio text {
  color: #666;
  font-size: 28rpx;
  padding-left: 10rpx;
}
.form-item .label {
  width: 270rpx;
  font-size: 32rpx;
  color: #666666;
  line-height: 45rpx;
}
.form-item .cont {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 30rpx;
}
.form-item .icon {
  width: 16rpx;
  height: 25rpx;
}
.form-item input,
.form-item textarea {
  width: 100%;
  color: #333;
  font-size: 26rpx;
  /* line-height: 40rpx; */
}
.input-placeholder {
  color: #999;
  // font-size: 28rpx;
}

.footer-box {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  padding: 30rpx;
}

.btn[type='primary'] {
  height: 100rpx;
  line-height: 100rpx;
  background-color: #1890ff;
  border-radius: 45rpx;
  font-weight: 700;
  font-size: 36rpx;
}
.button-hover[type='primary'] {
  background-color: #047eef;
}
.btn[disabled][type='primary'] {
  background-color: #e7f3ff;
  border: 0;
  color: #b8cfe6;
}
.btn[disabled][type='primary']::after {
  border: 0;
}

.addPopup {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 800;
}
</style>
