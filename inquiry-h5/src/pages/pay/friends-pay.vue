<template>
  <view class="container">
    <!-- 支付操作 -->
    <view class="pay-opt">
      <view class="price-item">
        <view class="tips">代付金额</view>
        <view class="num">
          <text class="badge">￥</text>
          {{ money }}
        </view>
      </view>
      <button class="btn" type="primary" @click="onShare">发送给朋友</button>
    </view>
    <!-- 支付明细 -->
    <view class="pay-detail">
      <view class="detail-item">
        <view class="label">申请人 </view>
        <view class="val">微信用户</view>
      </view>
      <view class="detail-item">
        <view class="label">支付说明 </view>
        <view class="val" v-if="type == '1'">医云在线互联网医院线上咨询服务</view>
        <view class="val" v-else>医云在线互联网医院整体治疗方案</view>
      </view>
      <view class="detail-item">
        <view class="label">开方时间 </view>
        <view class="val">{{ time }}</view>
      </view>
    </view>
    <view class="obscuration" v-if="obscuration">
      <view v-if="tips" class="tips">链接已经复制到输入文本框，发送给朋友</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import utils from '@/utils/util'
const title = ref('Hello')
const money = ref('0.00')
const time = ref('')
const d = ref('')
const type = ref('')
const order_sn = ref('')
const id = ref('')

const obscuration = ref(false)
const tips = ref(false)

onLoad((options) => {
  console.log(options)
  money.value = <string>options.order_money
  d.value = <string>options.time
  time.value = <string>options.time ? utils.formatTimeS(Number(options.time) / 1000, true) : ''
  type.value = <string>options.type
  order_sn.value = <string>options.order_sn
  id.value = <string>options.id
})

const onShare = () => {
  obscuration.value = true

  let data = {
    order_money: money.value,
    order_sn: order_sn.value,
    type: type.value,
    id: id.value,
    time: d.value,
  }

  let share_url = `https://wzh5.myzx.cn/#/pages/pay/friends-pay-c?encryptData=${window.btoa(
    window.encodeURIComponent(JSON.stringify(data))
  )}`

  console.log(share_url)

  // #ifndef H5
  uni.setClipboardData({
    data: share_url,
    success: function(res) {
      tips.value = true
    },
    fail: function(res) {
      tips.value = false
      obscuration.value = false
    },
  })
  // #endif

  // #ifdef H5
  let textarea: any = document.createElement('textarea')
  textarea.value = share_url
  textarea.readOnly = 'readOnly'
  document.body.appendChild(textarea)
  textarea.select() // 选中文本内容
  textarea.setSelectionRange(0, share_url.length)
  document.execCommand('copy')
  uni.showToast({
    title: '复制成功',
    icon: 'none',
  })
  textarea.remove()
  // #endif
}
</script>

<style lang="less">
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f5f6fa;
  height: calc(100vh - 88rpx);
  position: relative;
  .pay-opt {
    display: flex;
    width: 100%;
    height: 377rpx;
    background: #ffffff;
    flex-direction: column;
    align-items: center;
    padding: 45rpx;
    .price-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      .tips {
        font-size: 26rpx;
        font-weight: 400;
      }
      .num {
        font-size: 64rpx;
        font-weight: 600;
        color: #0052fe;
        .badge {
          font-size: 38rpx;
        }
      }
    }
    .btn {
      width: 592rpx;
      height: 99rpx;
      background: #0052fe;
      border-radius: 50rpx;
      margin-top: 58rpx;
    }
  }
  .pay-detail {
    margin-top: 30rpx;
    display: flex;
    width: 100%;
    height: 199rpx;
    background: #ffffff;
    flex-direction: column;
    align-items: center;
    padding: 25rpx;
    box-sizing: border-box;
    .detail-item {
      display: flex;
      justify-content: flex-start;
      width: 100%;
      margin-bottom: 25rpx;
      font-size: 24rpx;
      font-weight: 400;
      .label {
        width: 150rpx;
        color: #848494;
      }
      .val {
        color: #000000;
        padding-left: 25rpx;
      }
    }
  }

  .obscuration {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    .tips {
      color: #ffffff;
      font-size: 32rpx;
      margin-top: 300rpx;
    }
  }
}
</style>
