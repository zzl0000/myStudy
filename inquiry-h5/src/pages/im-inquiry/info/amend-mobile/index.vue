<template>
  <view class="container">
    <view class="form-box">
      <view class="form-item">
        <view class="label">原手机</view>
        <view class="cont border-1px">{{ patient_phone }}</view>
      </view>
      <view class="form-item">
        <view class="label">新手机</view>
        <view class="cont border-1px">
          <input
            v-model="phone"
            type="number"
            placeholder="请填写手机号"
            @input="onInput('phone', phone)"
          />
          <button
            class="button code"
            type="primary"
            plain
            size="mini"
            :disabled="codeDisabled"
            @click="sendCode"
          >
            {{ codeText }}
          </button>
        </view>
      </view>
      <view class="form-item">
        <view class="label">验证码</view>
        <view class="cont border-1px">
          <input
            v-model="code"
            type="number"
            placeholder="输入验证码"
            @input="onInput('code', code)"
          />
        </view>
      </view>
    </view>

    <view class="btn-box">
      <button class="button" type="primary" :disabled="disabled" @click="onSubmit">
        完成
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { reactive, ref, toRefs } from 'vue'
import { validMobile } from '@/utils/validate'
import $send from '@/api/request'
import { onLoad, onShow, onResize } from '@dcloudio/uni-app'
const dataRef = <any>reactive({
  order_sn: '',
  patient_id: '',
  patient_phone: '',
  phone: '',
  code: '',
  codeText: '验证码',
  codeDisabled: true,
  wait: 60,
  disabled: true,
})

onLoad((option) => {
  dataRef.order_sn = option.order_sn
  dataRef.patient_id = option.patient_id
  dataRef.patient_phone = option.patient_phone
})

const onInput = (name: string, value: any) => {
  console.log(name, value)
  dataRef[name] = value
  if (name == 'phone') {
    if (dataRef.wait == 60) {
      dataRef.codeDisabled = !(dataRef.phone && validMobile(dataRef.phone))
    }
  } else if (name == 'code') {
    dataRef.disabled = !(dataRef.code && dataRef.code.length == 6 && validMobile(dataRef.phone))
  }
}

const onSubmit = () => {
  if (dataRef.disabled) {
    return
  }
  uni.showLoading({ title: '加载中' })
  dataRef.disabled = true

  let params = {
    order_sn: dataRef.order_sn,
    patient_id: dataRef.patient_id,
    phone: dataRef.phone,
    code: dataRef.code,
  }
  $send
    .post('/wenzhen/verify_phone', params, '')
    .then((res: any) => {
      uni.hideLoading()
      dataRef.disabled = false
      if (res.code == 200) {
        uni.navigateBack({})
      } else {
        uni.showToast({
          title: res.message,
          icon: 'none',
        })
      }
    })
    .catch((res) => {
      uni.hideLoading()
      dataRef.disabled = false
      uni.showToast({
        title: res.message,
        icon: 'none',
      })
    })
}

const sendCode = () => {
  $send.post('/wenzhen/update_phone', { phone: dataRef.phone }, '').then((res: any) => {
    if (res.code == 200) {
      timer()
    } else {
      uni.showToast({
        title: res.message,
      })
    }
  })
}

const timer = () => {
  if (dataRef.wait === 0) {
    dataRef.wait = 60
    dataRef.codeText = '验证码'
    dataRef.codeDisabled = false
  } else {
    dataRef.wait = dataRef.wait - 1
    dataRef.codeText = `${dataRef.wait}s重发`
    dataRef.codeDisabled = true
    setTimeout(() => {
      timer()
    }, 1000)
  }
}

const {
  order_sn,
  patient_id,
  patient_phone,
  phone,
  code,
  codeText,
  codeDisabled,
  wait,
  disabled,
} = toRefs(dataRef)
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.form-box {
  display: flex;
  flex-direction: column;
  padding: 100rpx;
}

.form-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 46rpx;
}

.form-item:last-child {
  margin-bottom: 0;
}

.form-item .label {
  flex: none;
  margin-right: 30rpx;
  font-size: 32rpx;
  color: #333333;
  line-height: 45rpx;
  letter-spacing: 3px;
  padding-bottom: 10rpx;
}

.form-item .cont {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 10rpx;
}

.form-item input {
  flex: 1;
  /* font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 600;
  text-align: justify;
  color: #333333;
  line-height: 45rpx; */
  letter-spacing: 3px;
}

.form-item .code {
  border-radius: 8rpx;
  padding-left: 16rpx;
  padding-right: 16rpx;
}

.btn-box {
  padding: 0 30rpx;
  display: flex;
}

.btn-box .button {
  border-radius: 45rpx;
  font-size: 36rpx;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 600;
  text-align: center;
  color: #fff;
  width: 690rpx;
}

button[type='primary'][plain][disabled] {
  color: #999;
  border-color: #ccc;
}
</style>
