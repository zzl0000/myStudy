<template>
  <view class="container">
    <view class="group1">
      <view class="layer3">
        <view class="mod1">
          <text lines="1" class="txt1">你的好友向你发起代付申请</text>
          <view class="outer1"></view>
          <text lines="1" class="word2">代付金额</text>
          <view class="outer2">
            <text lines="1" class="txt2">￥</text>
            <text lines="1" class="info1">{{ money }}</text>
          </view>
          <view class="outer3" @click="PayFn">
            微信支付
          </view>
        </view>
      </view>
      <view class="layer4">
        <view class="layer5">
          <view class="layer6">
            <text lines="1" class="word3">申请人</text>
            <text lines="1" decode="true" class="info2"
              >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</text
            >
            <text lines="1" class="info3">微信用户</text>
          </view>
          <view class="layer7">
            <text lines="1" class="txt4">支付说明</text>
            <text lines="1" decode="true" class="info4">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</text>
            <text lines="1" class="word4"
              >医云在线互联网医院{{ typeleixing == 1 ? '线上咨询服务' : '整体治疗方案' }}</text
            >
          </view>
          <view class="layer8">
            <text lines="1" class="word5">创建时间</text>
            <text lines="1" decode="true" class="txt5">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</text>
            <text lines="1" class="txt6">{{ time }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { reactive, ref, toRefs, computed } from 'vue'
import Api from '@/api/index'
import cache from '@/utils/auth'
import { useStore } from 'vuex'
const store = useStore()
import config from '@/config/config'
// @ts-ignore
import wx from 'weixin-js-sdk'
import utils from '@/utils/util'
import common from '@/utils/common'

const isWeChart = computed(() => store.getters.getWeChart) // 判断是否在微信内部
const assetsLink = config.assetsLink

const dataRef: any = reactive({
  money: '0.00',
  id: '', // 订单自增ID
  type: 1, // 订单类型，1.电话/图文/视频 2.处方
  order_sn: '', // 订单编号
  disabled: true,
  payer: 1,
  isWen: '',
  types: '',
  debounce_timeout: null,
  payid: '',
  time: '',
  typeleixing: '',
})

onLoad((options) => {
  console.log(options)

  if (options.encryptData) {
    let datas = JSON.parse(window.decodeURIComponent(window.atob(options.encryptData)))
    console.log(datas)
    dataRef.type = datas.type
    time.value = <string>datas.time ? utils.formatTimeS(Number(datas.time) / 1000, true) : ''
    dataRef.typeleixing = datas.typeleixing
    dataRef.order_sn = datas.order_sn
    dataRef.payid = datas.id
    dataRef.money = datas.order_money
  }
})

const PayFn = async () => {
  console.log(dataRef.order_sn)
  dataRef.show = false
  wxPay()
  // try {
  //   let params = {
  //     id: dataRef.payid,
  //     order_no: dataRef.order_sn,
  //     type: dataRef.types == '44' ? '44' : 1,
  //     verson: 'v1',
  //     openid: cache.getOpenId(),
  //   }

  //   const { code } = await Api.pay.wxPaySelectOrderLock(params)
  //   if (code == 200) {
  //     const { code } = await Api.pay.wxPayAddOrderLock(params)
  //     if (code == 200) {
  //       dataRef.show = false
  //       wxPay()
  //     }
  //   }
  // } catch (error) {
  //   console.log(error)
  //   let res: any = error
  //   dataRef.payDisabled = false
  //   uni.showToast({
  //     title: res.message,
  //     icon: 'none',
  //   })
  //   if (res.message == '当前订单已修改，请确认后在支付...') {
  //     setTimeout(() => {
  //       uni.navigateBack({
  //         delta: 1,
  //       })
  //     }, 700)
  //   }
  // }
}

const wxPay = async () => {
  console.log(isWeChart.value)
  let params: any = {
    order_sn: dataRef.order_sn,
    type: dataRef.type,
    verson: 'v3.0.3',
    id: dataRef.payid,
  }
  try {
    if (isWeChart.value) {
      params.pay_method = 2
      params.openid = cache.getWxOpenId()
      const { data, code, message } = await Api.pay.getWxPay(params)
      console.log(data)
      if (code == 200) {
        // @ts-ignore
        if (typeof WeixinJSBridge == 'undefined') {
          if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false)
            // @ts-ignore
          } else if (document.attachEvent) {
            // @ts-ignore
            document.attachEvent('WeixinJSBridgeReady', onBridgeReady())
            // @ts-ignore
            document.attachEvent('onWeixinJSBridgeReady', onBridgeReady)
          }
        } else {
          // console.log(2222)
          onBridgeReady(data)
        }
      } else {
        uni.showToast({
          title: message,
          icon: 'none',
        })
      }
    } else {
      params.pay_method = 1
      params.openid = ''
      const { data, code, message } = await Api.pay.getWxPay(params)
      // 在微信外部浏览器支付
      // 微信外支付
      let url = data.mweb_url
      if (url) {
        let redirectUrl = window.location.href
        redirectUrl = dataRef.order_sn ? redirectUrl : redirectUrl + `?order_sn=${dataRef.order_sn}`
        // console.log(redirectUrl)
        window.location.href = url + '&redirect_url=' + encodeURIComponent(redirectUrl)
      } else {
        // this.$u.toast(data.pay.return_msg)
        uni.showToast({
          title: message,
          icon: 'none',
        })
      }
    }
    dataRef.payDisabled = false
  } catch (error) {
    console.log(error)
    dataRef.payDisabled = false
  }
}

const onBridgeReady = (resData: any) => {
  // let payer = dataRef
  // @ts-ignore
  WeixinJSBridge.invoke(
    'getBrandWCPayRequest',
    {
      appId: resData.appId,
      timeStamp: resData.timeStamp,
      nonceStr: resData.nonceStr,
      package: resData.package,
      signType: 'MD5',
      paySign: resData.paySign,
    },
    function(res) {
      if (res.err_msg == 'get_brand_wcpay_request:ok') {
        // 支付成功
        uni.showModal({
          title: '提示',
          content: '是否已经完成支付？',
          cancelText: '未完成',
          confirmColor: '##007CFF',
          confirmText: '已完成',
          success: function(res) {
            if (res.confirm) {
              dataRef.disabled = true
            } else if (res.cancel) {
              console.log('用户点击取消')
              dataRef.disabled = true
            }
          },
        })
      } else if (res.err_msg === 'get_brand_wcpay_request:fail') {
        // 支付失败
        uni.showModal({
          title: '',
          content: '支付失败',
          confirmText: '重新支付',
          confirmColor: '##007CFF',
          cancelText: '返回首页',
          success: function(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
              dataRef.disabled = true
            }
          },
        })
      }
    }
  )
}

const { typeleixing, time, money } = toRefs(dataRef)
</script>

<style lang="less">
.container {
  position: relative;
  width: 750rpx;
  height: 1460rpx;
  background-color: rgba(244, 245, 250, 1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .group1 {
    width: 750rpx;
    height: 1014rpx;
    display: flex;
    flex-direction: column;
  }
  .layer1 {
    height: 176rpx;
    background-color: rgba(255, 255, 255, 1);
    display: flex;
    flex-direction: column;
    width: 750rpx;
    padding: 26rpx 0 0 27rpx;
  }
  .box1 {
    width: 686rpx;
    height: 118rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .img1 {
    width: 653rpx;
    height: 30rpx;
    margin-left: 33rpx;
  }
  .layer2 {
    width: 416rpx;
    height: 48rpx;
    margin-top: 40rpx;
    flex-direction: row;
    display: flex;
    justify-content: space-between;
  }
  .group2 {
    width: 40rpx;
    height: 40rpx;
    background: url(https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPngc248e9ebb3951c2ff7fc01615d7af75e5ad982b2040170313294fa9d4ff2390a) -1rpx
      0rpx no-repeat;
    background-size: 41rpx 40rpx;
    margin-top: 4rpx;
    display: flex;
    flex-direction: column;
  }
  .word1 {
    width: 136rpx;
    height: 48rpx;
    display: block;
    overflow-wrap: break-word;
    color: rgba(53, 53, 53, 1);
    font-size: 34rpx;
    font-family: PingFangSC-Medium;
    white-space: nowrap;
    line-height: 48rpx;
    text-align: center;
  }
  .layer3 {
    height: 518rpx;
    background-color: rgba(255, 255, 255, 1);
    /* margin-top: 91rpx; */
    display: flex;
    flex-direction: column;
    padding-top: 82rpx;
    width: 750rpx;
  }
  .mod1 {
    width: 750rpx;
    height: 386rpx;
    display: flex;
    flex-direction: column;
  }
  .txt1 {
    width: 336rpx;
    height: 40rpx;
    display: block;
    overflow-wrap: break-word;
    color: rgba(0, 0, 0, 1);
    font-size: 28rpx;
    font-family: PingFangSC-Medium;
    white-space: nowrap;
    line-height: 40rpx;
    text-align: left;
    margin-left: 207rpx;
  }
  .outer1 {
    width: 750rpx;
    height: 1rpx;
    background: url(https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng6751c3e0bea308755b94f94a93788d63f0d5a4ab78f30d4d1056e3c4a4795374)
      0rpx 0rpx no-repeat;
    background-size: 750rpx 2rpx;
    margin-top: 40rpx;
    display: flex;
    flex-direction: column;
  }
  .word2 {
    width: 104rpx;
    height: 37rpx;
    display: block;
    overflow-wrap: break-word;
    color: rgba(0, 0, 0, 1);
    font-size: 35rpx;
    font-family: PingFangSC-Regular;
    white-space: nowrap;
    line-height: 37rpx;
    text-align: left;
    margin: 39rpx 0 0 323rpx;
  }
  .outer2 {
    height: 90rpx;
    /* width: 100%; */
    overflow-wrap: break-word;
    text-align: center;
    /* margin-left: 213rpx; */
    font-size: 0rpx;
    margin-top: 15px;
  }
  .txt2 {
    font-size: 38rpx;
    font-family: PingFangSC-Semibold;
    color: rgba(0, 82, 254, 1);
    line-height: 53rpx;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .info1 {
    font-size: 70rpx;
    font-family: PingFangSC-Semibold;
    color: rgba(0, 82, 254, 1);
    line-height: 53rpx;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .outer3 {
    height: 90rpx;
    border-radius: 95px;
    background-color: rgba(0, 82, 254, 1);
    display: flex;
    flex-direction: column;
    /* padding-top: 29rpx; */
    width: 592rpx;
    align-items: center;
    margin: 40rpx 0 0 79rpx;
    color: white;
    line-height: 90rpx;
  }
  .txt3 {
    width: 112rpx;
    height: 40rpx;
    display: block;
    overflow-wrap: break-word;
    color: rgba(255, 255, 255, 1);
    font-size: 28rpx;
    font-family: PingFangSC-Medium;
    white-space: nowrap;
    line-height: 40rpx;
    text-align: left;
  }
  .layer4 {
    height: 199rpx;
    background-color: rgba(255, 255, 255, 1);
    margin-top: 30rpx;
    display: flex;
    flex-direction: column;
    padding-left: 25rpx;
    width: 750rpx;
    justify-content: center;
  }
  .layer5 {
    min-width: 464rpx;
    height: 149rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .layer6 {
    width: 248rpx;
    height: 33rpx;
    overflow-wrap: break-word;
    text-align: left;
    white-space: nowrap;
    font-size: 0rpx;
  }
  .word3 {
    font-size: 24rpx;
    font-family: PingFangSC-Regular;
    color: rgba(132, 132, 148, 1);
    line-height: 33rpx;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .info2 {
    font-size: 24rpx;
    font-family: PingFangSC-Regular;
    color: rgba(137, 137, 137, 1);
    line-height: 33rpx;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .info3 {
    font-size: 24rpx;
    font-family: PingFangSC-Regular;
    color: rgba(0, 0, 0, 1);
    line-height: 33rpx;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .layer7 {
    min-width: 464rpx;
    height: 33rpx;
    overflow-wrap: break-word;
    text-align: left;
    white-space: nowrap;
    margin-top: 25rpx;
    font-size: 0rpx;
  }
  .txt4 {
    font-size: 24rpx;
    font-family: PingFangSC-Regular;
    color: rgba(132, 132, 148, 1);
    line-height: 33rpx;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .info4 {
    font-size: 24rpx;
    font-family: PingFangSC-Regular;
    color: rgba(137, 137, 137, 1);
    line-height: 33rpx;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .word4 {
    font-size: 24rpx;
    font-family: PingFangSC-Regular;
    color: rgba(0, 0, 0, 1);
    line-height: 33rpx;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .layer8 {
    min-width: 423rpx;
    height: 33rpx;
    overflow-wrap: break-word;
    text-align: left;
    white-space: nowrap;
    margin-top: 25rpx;
    font-size: 0rpx;
  }
  .word5 {
    font-size: 24rpx;
    font-family: PingFangSC-Regular;
    color: rgba(132, 132, 148, 1);
    line-height: 33rpx;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .txt5 {
    font-size: 24rpx;
    font-family: PingFangSC-Regular;
    color: rgba(137, 137, 137, 1);
    line-height: 33rpx;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .txt6 {
    font-size: 24rpx;
    font-family: PingFangSC-Regular;
    color: rgba(0, 0, 0, 1);
    line-height: 33rpx;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .group3 {
    z-index: 18;
    height: 115rpx;
    border-radius: 50%;
    background: url(https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng492ffbfd72e029450bc42549bba74003121ff87760f85103fd5bf398f5cb6198)
      100% no-repeat;
    display: flex;
    flex-direction: column;
    width: 115rpx;
    position: absolute;
    left: 318rpx;
    top: 209rpx;
    padding: 25rpx 0 0 31rpx;
  }
  .img2 {
    width: 54rpx;
    height: 66rpx;
  }
}
</style>
