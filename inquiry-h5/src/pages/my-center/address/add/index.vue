<template>
  <view class="bg">
    <form class="form-box" @submit.stop.prevent="formSubmit">
      <view class="form-item border-1px">
        <view class="label">选择地区：</view>
        <view class="cont" @click="handleSelectArea">
          <input name="cities" placeholder="请选择省、市、区" :disabled="true" :value="cities" />
          <image class="icon" :src="assetsLink + '/assets/arrow-r@2x.png'"></image>
        </view>
      </view>
      <view class="form-item border-1px">
        <view class="label">详细地址：</view>
        <view class="cont">
          <textarea
            name="address"
            placeholder="请输入收货人详细地址"
            :auto-height="true"
            :value="address"
          />
        </view>
      </view>
      <view class="form-item border-1px">
        <view class="label">收货人：</view>
        <view class="cont">
          <input name="name" placeholder="请输入收货人姓名" :value="name" />
        </view>
      </view>
      <view class="form-item border-1px">
        <view class="label">收货人手机号：</view>
        <view class="cont">
          <input
            name="mobile"
            placeholder="请输入收货人手机号"
            placeholder-class="input-placeholder"
            :value="mobile"
          />
        </view>
      </view>
      <!-- <view class="form-radio">
    <checkbox-group name="is_default">
      <checkbox value="{{is_default}}" checked="{{is_default == 0 ? false : true}}" color="#1890ff">
        <text>存为默认收货地址</text>
      </checkbox>
    </checkbox-group>
  </view> -->

      <view class="form-switch border-1px">
        <text>存为默认收货地址</text>
        <switch
          :value="is_default"
          name="is_default"
          :checked="is_default == 0 ? false : true"
          @change="switchChange"
          class="switch"
        />
      </view>

      <view class="footer-box">
        <button type="primary" :disabled="disabled" formType="submit" class="btn">
          保存并使用
        </button>
      </view>
    </form>
  </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import config from '../../../../config/config'

const assetsLink = config.assetsLink
const data = ref({
  orderId: '',
  id: '',
  order_sn: '',
  isEditOrderAddress: 0,
  name: '',
  mobile: '',
  province: '',
  city: '',
  area: '',
  cities: '',
  address: '',
  is_default: 0,
  disabled: false,
})

/**
 * 生命周期函数--监听页面加载
 */
onLoad((options) => {
  console.log(options)
  // this.setData({
  //   orderId: options.orderId,
  //   order_sn: options.order_sn,
  //   isEditOrderAddress: options.isEditOrderAddress,
  //   id: options.id,
  // })
})
</script>

<style>
.bg {
  background: #fff;
  height: 100vh;
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
  font-size: 30rpx;
  color: #000000;
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
  font-size: 30rpx;
  /* line-height: 40rpx; */
}
.input-placeholder {
  color: #999;
  font-size: 30rpx;
}

.footer-box {
  /* position: fixed;
  bottom: 0;
  left: 0;
  right: 0; */
  margin-top: 30rpx;
  z-index: 10;
  padding: 60rpx;
}

.btn[type='primary'] {
  /* height: 100rpx;
  line-height: 100rpx; */
  background-color: #0052fe;
  border-radius: 100rpx;
  font-weight: 700;
  font-size: 30rpx;
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

.form-switch {
  background: #fff;
  padding: 23rpx 28rpx 22rpx 30rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.form-switch text {
  color: #000000;
  font-size: 30rpx;
}

.form-switch .switch {
  line-height: 10rpx;
  transform: scale(0.7);
}
</style>
