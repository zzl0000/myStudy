<template>
  <view class="container">
    <!-- 支付弹出层 -->
    <uni-popup ref="popup" type="bottom" @maskClick="close">
      <view class="popup-content">
        <view class="top">
          <view class="title">付款名称</view>
          <image class="icon" @click="close()" src="/static/img/wx-popup/icon-close.png" mode="" />
        </view>
        <view class="money">￥{{ dataRef.money }}</view>
        <view class="pay-way-group">
          <view class="pay-way-item" @click="changePayRadio(1)">
            <view class="pay-icon">
              <image class="img" src="/static/img/wx-popup/icon-01.png" />
            </view>
            <view class="text">
              <text>微信支付</text>
            </view>
            <view class="chosed-active" v-if="dataRef.radio == 1">
              <image class="img" src="/static/img/wx-popup/icon-04.png" />
            </view>
            <view v-else class="chosed"> </view>
          </view>
          <view class="pay-way-item" @click="changePayRadio(2)">
            <view class="pay-icon">
              <image class="img" src="/static/img/wx-popup/icon-02.png" />
            </view>
            <view class="text">
              <text>支付宝支付</text>
            </view>
            <view class="chosed-active" v-if="dataRef.radio == 2">
              <image class="img" src="/static/img/wx-popup/icon-04.png" />
            </view>
            <view v-else class="chosed"> </view>
          </view>
          <view class="pay-way-item" @click="changePayRadio(0)">
            <view class="pay-icon">
              <image class="img" src="/static/img/wx-popup/icon-03.png" />
            </view>
            <view class="text">
              <text>微信好友代付</text>
            </view>
            <view class="chosed-active" v-if="dataRef.radio == 0">
              <image class="img" src="/static/img/wx-popup/icon-04.png" />
            </view>
            <view v-else class="chosed"> </view>
          </view>
        </view>
        <view class="btn">
          <button
            class="btn-box"
            :disabled="dataRef.payDisabled"
            type="primary"
            @click="handleSubmit()"
          >
            确认支付
          </button>
        </view>
      </view>
    </uni-popup>

    <view class="phoneModel" v-if="dataRef.isShowPhone">
      <view class="allModel">
        <view class="section">
          <image class="moneyicon" :src="assetsLink + '/assets/money.png'" mode="" />
          <view class="secfont">
            因微信对支付宝屏蔽，我们已经给您的手机号：
            <text class="phone">{{ dataRef.phone }}</text>
            发送了支付短信 您可直接通过短信链接实现支付宝支付
          </view>
        </view>
        <button class="buttons" @click="sure">知道了</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, reactive, ref, nextTick } from 'vue'
import { onLoad, onResize, onShow, onUnload } from '@dcloudio/uni-app'
import Api from '@/api/index'
import cache from '@/utils/auth'
import { useStore } from 'vuex'
const store = useStore()
import config from '@/config/config'
import ap from '@/utils/alioss/ap.js'

// @ts-ignore
import wx from 'weixin-js-sdk'

const popup = ref()
const isSendPay = computed(() => store.getters.getIsSendPay)
const isWeChart = computed(() => store.getters.getWeChart) // 判断是否在微信内部
const assetsLink = config.assetsLink
const dataRef = <any>reactive({
  id: '', // 订单自增ID
  type: 1, // 订单类型，1.电话/图文/视频 2.处方
  order_sn: '', // 订单编号
  money: '0.00',
  disabled: true,
  scene: false,
  sceneArr: [],
  payer: 1,
  show: true,
  radio: 1,
  phone: '',
  isShowPhone: false,
  isWen: '',
  types: '',
  debounce_timeout: null,
  payid: '',
  paytype: '',
  wz: 0,
  isopen: false,
  payDisabled: false,
  vreson: '',
})

onLoad((option) => {
  console.log(wx)
  // console.log(option)
  dataRef.id = option.id
  dataRef.payid = option.id
  dataRef.type = option.type
  dataRef.order_sn = option.order_sn
  dataRef.paytype = option.paytype
  dataRef.phone = option.phone
  dataRef.money = option.money
  nextTick(() => {
    popup.value.open()
  })
})

onShow(() => {
  if (isSendPay.value) {
    uni.showModal({
      title: '提示',
      content: '支付是否完成',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          store.dispatch('setIsSendPay', false)
          if (dataRef.payer != 2) {
            if (dataRef.type == 1) {
              uni.redirectTo({
                url: `/pages/im-inquiry/im/index?order_sn=${dataRef.order_sn}`,
              })
            } else if (dataRef.type == 2) {
              // 处方
              uni.navigateBack({
                delta: 1,
              })
            }
          } else {
            dataRef.disabled = true
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
          store.dispatch('setIsSendPay', false)
          // uni.navigateBack({})
        }
      },
    })
  }
})

onUnload(() => {
  store.dispatch('setIsSendPay', false)
})

const changePayRadio = (val: any) => {
  dataRef.radio = val
}

const handleSubmit = () => {
  dataRef.payDisabled = true
  PayFn()
}

const PayFn = async () => {
  dataRef.show = false
  switch (dataRef.radio) {
    case 1: //微信
      wxPay()
      break
    case 2: //支付宝
      alipay()
      break
    case 0: //好友支付
      frpay()
      break
    default:
    // console.log(未选择支付方式)
  }
  store.dispatch('setIsSendPay', true)
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
        store.dispatch('setIsSendPay', false)
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
        // redirectUrl = dataRef.id ? redirectUrl : redirectUrl + `?order_sn=${dataRef.order_sn}`
        // console.log(redirectUrl)
        window.location.href = url + '&redirect_url=' + encodeURIComponent(redirectUrl)
      } else {
        uni.showToast({
          title: message,
          icon: 'none',
        })
        store.dispatch('setIsSendPay', false)
      }
    }
    dataRef.payDisabled = false
  } catch (error) {
    console.log(error)
    dataRef.payDisabled = false
    store.dispatch('setIsSendPay', false)
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
              if (dataRef.payer != 2) {
                if (dataRef.type == 1) {
                  uni.redirectTo({
                    url: `/pages/im-inquiry/im/index?order_sn=${dataRef.order_sn}`,
                  })
                } else if (dataRef.type == 2) {
                  // 处方
                  uni.navigateBack({
                    delta: 1,
                  })
                }
              } else {
                dataRef.disabled = true
              }
              store.dispatch('setIsSendPay', false)
            } else if (res.cancel) {
              // console.log('用户点击取消')
              store.dispatch('setIsSendPay', false)
              setTimeout(() => {
                uni.navigateBack({
                  delta: 1,
                })
              }, 300)
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
              store.dispatch('setIsSendPay', false)
              console.log('用户点击确定')
            } else if (res.cancel) {
              store.dispatch('setIsSendPay', false)
              console.log('用户点击取消')
              setTimeout(() => {
                uni.navigateBack({
                  delta: 1,
                })
              }, 300)
            }
          },
        })
      }
    }
  )
}

const alipay = async () => {
  let params = {
    order_sn: dataRef.order_sn,
    type: dataRef.type,
    id: dataRef.payid,
    isAliPay: true,
  }

  try {
    const { data, code, message } = await Api.pay.getAlipayWap(params)
    if (code == 200) {
      let divForm = document.getElementsByTagName('divs')
      if (divForm.length) {
        document.body.removeChild(divForm[0])
      }
      const div = document.createElement('divs')
      div.innerHTML = data.form
      document.body.appendChild(div)
      let alipay_submit: any = <HTMLElement>document.getElementById('alipay_submit')
      alipay_submit.submit()
      var queryParam = ''
      Array.prototype.slice
        .call(document.querySelectorAll('input[type=hidden]'))
        .forEach(function(ele) {
          queryParam += '&' + ele.name + '=' + encodeURIComponent(ele.value)
        })
      let _alipay_submit: any = <HTMLElement>document.querySelector('#alipay_submit')
      var gotoUrl = _alipay_submit.getAttribute('action') + queryParam
      ap.pay(gotoUrl)
      // store.dispatch('setIsSendPay', false)
    }
  } catch (error) {
    console.log(error)
    store.dispatch('setIsSendPay', false)
  }
}
const frpay = async () => {
  var d = new Date().getTime()
  let type = dataRef.types == '44' ? '44' : 1
  dataRef.payDisabled = false
  let userCf = cache.getUserCf()
  setTimeout(() => {
    store.dispatch('setIsSendPay', false)
    uni.redirectTo({
      url: `/pages/pay/friends-pay?order_money=${dataRef.money}&order_sn=${
        dataRef.order_sn
      }&type=${type}&id=${dataRef.payid}&time=${d}&userCf=${JSON.stringify(userCf)}`,
    })
  }, 300)
}

function close() {
  popup.value.close()
  store.dispatch('setIsSendPay', false)
  setTimeout(() => {
    uni.navigateBack({ delta: 1 })
  }, 300)
}

const sure = () => {
  // console.log(this.data.type)
  dataRef.isShowPhone = false
  if (dataRef.type == 1) {
    setTimeout(() => {
      uni.navigateBack({
        delta: 1,
      })
    }, 300)
  } else if (dataRef.type == 2) {
    setTimeout(() => {
      uni.navigateBack({
        delta: 1,
      })
    }, 300)
  }
}
</script>

<style lang="less">
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.popup-content {
  display: flex;
  flex-direction: column;
  width: 750rpx;
  height: 721rpx;
  background: #ffffff;
  border-radius: 20rpx;
  position: relative;
  .top {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100rpx;
    font-size: 28rpx;
    font-weight: 400;
    position: relative;
    border-bottom: 1px solid #dedede;
    .icon {
      position: absolute;
      width: 26rpx;
      height: 26rpx;
      right: 30rpx;
    }
  }
  .money {
    margin-top: 57rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 54rpx;
    font-weight: 600;
    color: #000000;
  }
  .pay-way-group {
    display: flex;
    flex-direction: column;
    margin-top: 57rpx;
    .pay-way-item {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      display: flex;
      padding: 0 30px;
      margin-bottom: 50rpx;
      .pay-icon {
        width: 57rpx;
        height: 57rpx;
      }
      .text {
        font-size: 28rpx;
        font-weight: 400;
        color: #000000;
        padding-left: 12rpx;
      }
      .chosed {
        position: absolute;
        right: 30rpx;
        width: 34rpx;
        height: 34rpx;
        border: 1rpx solid #979797;
        border-radius: 50%;
      }
      .chosed-active {
        position: absolute;
        right: 30rpx;
        width: 39rpx;
        height: 39rpx;
      }
    }
  }

  .btn {
    position: absolute;
    width: 100%;
    bottom: 0;
    .btn-box {
      border-radius: 0;
    }
  }
}

.phoneModel {
  width: 100%;
  height: 100%;
  background: rgb(73, 72, 72);
  opacity: 1;
  position: absolute;
  top: 0;
  margin: 0 auto;
}
.allModel {
  width: 100%;
  height: 600rpx;
  background: white;
  position: absolute;
  z-index: 999;
  bottom: 0;
  /* display: flex;
  justify-content: center;
  align-items: center; */
  /* margin:100rpx auto; */
  /* border-radius: 5rpx; */
}
.title-model {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 60%;
}
.section {
  width: 90%;
  height: 400rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
}
.moneyicon {
  width: 100rpx;
  height: 100rpx;
  margin-top: 80rpx;
}
.secfont {
  /* margin-top: 80rpx; */
}
.buttons {
  width: 100%;
  height: 100rpx;
  line-height: 100rpx;
  background: rgb(29, 100, 253);
  color: white;
  /* margin-top: 50rpx; */
  position: absolute;
  bottom: 40rpx;
  /* z-index: 999; */
}
.phone {
  color: skyblue;
}
.van-popup {
  height: 47% !important;
}
</style>
