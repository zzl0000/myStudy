<template>
  <view class="container">
    <view class="status-box" v-if="status != 1">
      退款状态：<text class="high">{{ statusText }}</text>
    </view>
    <view class="textarea-box">
      <textarea
        maxlength="100"
        placeholder="请输入退款原因"
        placeholder-style="placeholder-style"
        data-size="100"
        @input="onInput"
        :value="reason"
      ></textarea>
      <view class="limit">{{ reasonSize }}/100</view>
    </view>

    <view class="btn-box">
      <button type="primary" class="button" @click="formSubmit" :disabled="disabled">
        {{ btnText }}
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import config from '@/config/config'
import { reactive, ref, toRefs } from 'vue'
import { onLoad, onShow, onResize } from '@dcloudio/uni-app'
import { useStore } from 'vuex'
const store = useStore()
import Api from '@/api'
import cachel from '@/utils/auth'
import events from '@/utils/events'
import $send from '@/api/request'

//
const dataRef = <any>reactive({
  order_sn: '',
  status: 1, // 状态 1.正常订单未退过款 2.退款中订单 3.已退款订单 4.退款已拒绝订单 5.订单未支付
  statusText: '',
  reason: '',
  reasonSize: 0,
  disabled: false,
  btnText: '申请退款',
})

onLoad((option) => {
  dataRef.order_sn = option.order_sn
  getData()
})

const getData = () => {
  uni.showLoading({ title: '加载中' })
  $send
    .post('/wz/v3/refund/detail', { order_sn: dataRef.order_sn }, '')
    .then((res: any) => {
      uni.hideLoading()
      if (res.code == 200) {
        const { status, refund_reason } = res.data
        dataRef.status = status
        dataRef.statusText =
          status == 2
            ? '退款中'
            : status == 3
            ? '已退款'
            : status == 4
            ? '退款已拒绝'
            : status == 5
            ? '未支付'
            : ''
        dataRef.disabled = !(status == 1 || status == 2)
        dataRef.btnText = status == 1 ? '申请退款' : '取消退款'
        dataRef.reason = refund_reason
        dataRef.reasonSize = refund_reason ? refund_reason.length : 0
      }
    })
    .catch(() => {
      uni.hideLoading()
    })
}

const formSubmit = (e) => {
  if (dataRef.disabled) {
    return
  }
  if (!dataRef.reason) {
    uni.showToast({
      title: '请输入退款原因',
      icon: 'none',
    })
    return
  }
  uni.showLoading({ title: '加载中' })
  dataRef.disabled = true

  let params = {
    order_sn: dataRef.order_sn,
    reason: dataRef.reason,
  }
  const api = dataRef.status == 1 ? '/wz/v3/refund/apply' : '/wz/v3/refund/cancel'
  $send
    .post(api, params, '')
    .then((res: any) => {
      uni.hideLoading()
      dataRef.disabled = false

      if (res.code == 200) {
        uni.showToast({
          title: `${dataRef.status == 1 ? '退款申请' : '取消退款'}成功！`,
          icon: 'none',
          duration: 2000,
        })
        setTimeout(() => {
          uni.navigateBack({})
        }, 1000)
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

const onInput = (e) => {
  const size = e.currentTarget.dataset.size
  const value = e.detail.value
  setTimeout(() => {
    reason.value = value.substring(0, size)
    reasonSize.value = reason.value.length
  }, 0)
}
const {
  order_sn,
  status, // 状态 1.正常订单未退过款 2.退款中订单 3.已退款订单 4.退款已拒绝订单 5.订单未支付
  statusText,
  reason,
  reasonSize,
  disabled,
  btnText,
} = toRefs(dataRef)
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  padding: 0 30rpx;
}

.status-box {
  margin-top: 24rpx;
  font-size: 30rpx;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 600;
  text-align: left;
  color: #000000;
  line-height: 42rpx;
}

.status-box .high {
  color: #007cff;
}

.textarea-box {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 579rpx;
  padding: 30rpx;
  margin-top: 24rpx;
  background: #fff;
  border-radius: 20rpx;
}

.textarea-box textarea {
  width: 100%;
}

.textarea-box .limit {
  text-align: right;
  font-size: 24rpx;
  color: #999999;
  line-height: 33rpx;
  transition: all 0.3s linear;
}

.placeholder-style {
  font-size: 30rpx;
  color: #999999;
}

.btn-box {
  position: fixed;
  right: 0;
  bottom: 0;
  padding: 20rpx 0rpx;
  z-index: 10;
  width: 95%;
  display: flex;
  justify-content: center;
}
.btn-box .button {
  border-radius: 8rpx;
  font-weight: 500;
  width: 90%;
}
</style>
