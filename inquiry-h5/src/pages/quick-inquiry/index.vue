<template>
  <view v-if="dataRef.isLoading" class="container">
    <!-- 顶部导航 -->
    <view class="top-group">
      <view class="top-item ">
        <text class="active">病情信息</text>
        <text> ></text>
      </view>
      <view class="top-item ">
        <text>医生诊断开方</text>
        <text> ></text>
      </view>
      <view class="top-item">送药到家</view>
    </view>
    <!-- <image class="logo" src="/static/logo.png" /> -->
    <view class="content">
      <view class="dialogue-list">
        <!-- 系统 -->
        <view class="list-item">
          <view class="avatar">
            <image class="img" src="https://csxcxapi.myzx.cn/assets/ban.png" />
          </view>
          <view class="detail">您好，请详细描述您的病情，我们将会安排合适的医生为您服务。</view>
        </view>
        <view class="list-item">
          <view class="avatar">
            <image class="img" src="https://csxcxapi.myzx.cn/assets/ban.png" />
          </view>
          <view class="detail">请选择您要为谁问诊？</view>
        </view>
        <view class="line"></view>
        <!-- 操作 -->
        <view class="btn-group" v-if="State == 0">
          <view class="btn-item">
            <view class="btn active" type="primary" size="mini" @click="createPeople">
              新建就诊人
            </view>
          </view>
          <view class="btn-item" v-for="(item, index) in dataRef?.patientList" :key="index">
            <view type="default" class="btn" @click="handleChoosePatient(item)">
              {{ item.uname + ' ' }}{{ item.age + ' ' }}
              {{ item.sex == 1 ? '男' : item.sex == 0 ? '女' : '' }}
            </view>
          </view>
        </view>
        <!-- 用户 -->
        <view v-if="State == 1 || State == 2" class="list-item user-list">
          <view class="detaill">{{ dataRef.patientText }}</view>
          <view class="avatar">
            <image class="img" :src="userCf.avatar || '/static/img/avatar.png'" />
          </view>
        </view>
        <!-- 系统 -->
        <view v-if="State == 1 || State == 2" class="list-item">
          <view class="avatar">
            <image class="img" src="https://csxcxapi.myzx.cn/assets/ban.png" />
          </view>
          <view class="detail">请描述就诊人的<text style="color:#0052fe">症状</text></view>
        </view>
        <!-- 用户 -->
        <view v-if="State == 2" class="list-item user-list">
          <view class="detaill">{{ dataRef.userReplyTetx }}</view>
          <view class="avatar">
            <image class="img" :src="userCf.avatar || '/static/img/avatar.png'" />
          </view>
        </view>
        <!-- 系统 -->
        <view v-if="State == 2" class="list-item">
          <view class="avatar">
            <image class="img" src="https://csxcxapi.myzx.cn/assets/ban.png" />
          </view>

          <view class="detail"
            >好的，已大概了解您的病情，请先<text style="color:#0052fe">支付挂号费</text
            >，我们即将为您分配合适的医生接诊。</view
          >
        </view>
        <!-- 系统 -->
        <view v-if="dataRef.isPay" class="list-item">
          <view
            v-if="dataRef.order_status != 4"
            class="detail"
            style="width:750rpx;max-width:750rpx;border-radius:32rpx;background: rgba(0,0,0,0.05);"
          >
            您已成功购买快速图文问诊服务，医生将在48h内接诊，
            <text style="color:#0052fe">
              还剩{{ dataRef.hours }}小时{{ dataRef.minutes }}分医生未接诊，系统自动退款。
            </text>
          </view>

          <view
            class="remind detail"
            style="width:750rpx;max-width:750rpx;border-radius:32rpx;background: rgba(0,0,0,0.05);"
            v-else
          >
            <view v-if="dataRef.isPay == 2" class="remind-item">
              医生在48小时内没有接诊，系统<text>已自动退款</text>
            </view>
            <view v-else-if="dataRef.isPay == 3" class="remind-item">
              退款申请已审核通过，挂号费将原路返还，本次问诊结束
            </view>
            <view v-else-if="dataRef.isPay == 4" class="remind-item">
              退款申请已提交，我们将在3个工作日左右审核完毕，请耐心等待
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- 输入框 -->
    <view v-if="State == 1" class="text-group">
      <textarea
        v-model="dataRef.userReplyTetx"
        name=""
        id=""
        :maxlength="300"
        @confirm="send()"
        @focus="dataRef.positionType = 2"
        @blur="dataRef.positionType = 1"
        placeholder="请输入您的症状，300字以内"
        confirm-type="send"
        class="textarea"
        :adjust-position="false"
      ></textarea>
    </view>
    <!-- 支付 -->
    <view v-if="State == 2 && !dataRef.isPay" class="pay-group">
      <view class="price-item">
        <text>实付金额</text>
        <text class="price">￥19.9</text>
      </view>
      <view class="btn" @click="goPay()">去支付</view>
    </view>
    <!-- 支付弹出层 -->
    <uni-popup ref="popup" type="bottom">
      <view class="popup-content">
        <view class="top">
          <view class="title">付款名称</view>
          <image
            class="icon"
            @click="handleClose"
            src="/static/img/wx-popup/icon-close.png"
            mode=""
          />
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
          <button type="primary" @click="handleSubmit()">确认支付</button>
        </view>
      </view>
    </uni-popup>
  </view>
  <ls-loading text="loading..." :animation="'twinkle'" v-if="!dataRef.isLoading"></ls-loading>
</template>

<script setup lang="ts">
import { computed, nextTick, reactive, ref } from 'vue'
import { onLoad, onShow, onUnload, onBackPress } from '@dcloudio/uni-app'
import Api from '@/api/index'
import cache from '@/utils/auth'
import { useStore } from 'vuex'
import ap from '@/utils/alioss/ap.js'
import lsLoading from '@/components/ls-loading/ls-loading.vue'
const store = useStore()
// @ts-ignore
import wx from 'weixin-js-sdk'
const State = ref(0) // 0未选择就诊人 1选这就诊人 2发送消息
const popup = ref()
const isWeChart = computed(() => store.getters.getWeChart) // 判断是否在微信内部
const dataRef = <any>reactive({
  patientList: [],
  patientText: '',
  userReplyTetx: '',
  money: '0.00',
  radio: 1,
  paid: '',
  hours: '00',
  minutes: '00',
  positionType: 1,
  isLoading: false,
})
const order_sn = ref() //问诊列表 快速问诊跳转
const paid = ref() //新建联系人
const timeout = <any>ref(null)
const userCf = computed(() => cache.getUserCf())

const isSendPay = computed(() => store.getters.getIsSendPay)

onLoad((option) => {
  // console.log(option)
  let token = option.token || ''
  if (token) {
    store.dispatch('getUserCf', token).then(() => {})
  } else {
    store.dispatch('validateLogin').then(() => {
      if (option.order_sn) {
        order_sn.value = option.order_sn
        dataRef.order_sn = option.order_sn
        dataRef.payid = option.order_oc
      }
    })
  }
})

/**
 * 生命周期函数--监听页面显示
 */
onShow(async () => {
  let quick_patient = cache.get('quick_patient')
  let patientRow: any = {}
  dataRef.isLoading = false
  console.log(quick_patient)
  await handleInit()
  if (quick_patient) {
    patientRow = JSON.parse(quick_patient)
    paid.value = patientRow.paid
    await handleChoosePatient(patientRow)
  } else {
    let _dataRef = cache.get('quick_dataRef')
    if (_dataRef && _dataRef.State != 0) {
      dataRef.patientList = _dataRef.patientList
      dataRef.patientText = _dataRef.patientText
      dataRef.userReplyTetx = _dataRef.userReplyTetx
      dataRef.radio = _dataRef.radio
      dataRef.paid = _dataRef.paid
      State.value = _dataRef.State
      dataRef.order_sn = _dataRef.order_sn ? _dataRef.order_sn : ''
      dataRef.payid = _dataRef.payid ? _dataRef.payid : ''
      order_sn.value = _dataRef.order_sn ? _dataRef.order_sn : ''
    } else {
      State.value = 0
    }
  }

  if (isSendPay.value) {
    uni.showModal({
      title: '提示',
      content: '支付是否完成',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          store.dispatch('setIsSendPay', false)
          uni.redirectTo({
            url: `/pages/quick-inquiry/index?order_sn=${dataRef.order_sn}&order_oc=${dataRef.payid}`,
          })
          handleInit()
        } else if (res.cancel) {
          console.log('用户点击取消')
          store.dispatch('setIsSendPay', false)
        }
      },
    })
  }
})

/**
 * 生命周期函数--监听页面卸载
 */
onUnload(() => {
  handleCancel()
})

function handleCancel() {
  cache.remove('quick_patient')
  cache.remove('quick_dataRef')
  dataRef.patientList = []
  dataRef.patientText = ''
  dataRef.userReplyTetx = ''
  State.value = 0
  clearInterval(timeout.value)
  store.dispatch('setIsSendPay', false)
}

const handleInit = async () => {
  const { data } = await Api.patient.getPatientList({})
  dataRef.patientList = data
  if (order_sn.value) {
    Api.request
      .post(
        `/wz/v3/order/detail`,
        {
          // order_sn: order_sn.value,
          order_id: dataRef.payid,
        },
        {}
      )
      .then((res: any) => {
        console.log(res)
        dataRef.userReplyTetx = res.data.patient_infos.content
        paid.value = res.data.patient_infos.patient_id
        dataRef.paytime = res.data.pay_infos.pay_time
        dataRef.order_status = res.data.order_infos.order_status
        dataRef.refund_status = res.data.order_infos.refund_status
        timeout.value = setInterval(() => {
          TimeDown()
        }, 1000)
        handleChoosePatient('')
      })
  }
  setTimeout(() => {
    dataRef.isLoading = true
    if (State.value != 0) {
      nextTick(() => {
        uni.pageScrollTo({ scrollTop: 99999, duration: 0 })
      })
    }
  }, 1200)
}

const TimeDown = () => {
  let paydate = new Date(dataRef.paytime.replace(/-/g, '/')).getTime()
  let date = new Date().getTime()
  let rangetime = 48 * 60 * 60
  let times = rangetime - (date / 1000 - paydate / 1000)

  let hours = Math.floor(times / 60 / 60)
  let minutes = Math.floor((times - hours * 60 * 60) / 60)

  if (times <= 0) {
    dataRef.isPay = dataRef.refund_status == 1 ? 4 : 2
    dataRef.minutes = '00'
    dataRef.minutes = '00'
    clearInterval(timeout.value)
    return
  }
  if (dataRef.order_status == 4) {
    if (times > 0) {
      dataRef.isPay = dataRef.refund_status == 1 ? 4 : 3
    } else {
      dataRef.isPay = dataRef.refund_status == 1 ? 4 : 2
    }
    console.log(dataRef.isPay)
    clearInterval(timeout.value)
    return
  }

  if (dataRef.order_status == -1) {
    dataRef.isPay = ''
    clearInterval(timeout.value)
    return
  }

  dataRef.isPay = 1
  dataRef.hours = hours
  dataRef.minutes = minutes

  console.log(dataRef.isPay)
}

// 选择就诊人

const handleChoosePatient = (item: any) => {
  dataRef.paid = item ? item.paid : paid.value
  State.value = 1
  if (order_sn.value) {
    dataRef.patientList.filter((res: any) => {
      if (res.paid == dataRef.paid) {
        dataRef.patientText = `${res.uname} ${res.age} ${
          res.sex == 1 ? '男' : res.sex == 0 ? '女' : ''
        }`
      }
      State.value = 2
    })
  } else if (paid.value) {
    dataRef.patientList.filter((res: any) => {
      if (res.paid == dataRef.paid) {
        dataRef.patientText = `${res.uname} ${res.age} ${
          res.sex == 1 ? '男' : res.sex == 0 ? '女' : ''
        }`
      }
    })
  } else {
    // console.log(item)
    // cache.set('quick_patient', JSON.stringify(item))
    if (!item.idcard) {
      State.value = 0
      return uni.navigateTo({
        url: `/pages/my-center/patient-manage/index?paid=${item.paid}&isbuy=1`,
      })
    } else {
      dataRef.patientText = `${item.uname} ${item.age} ${
        item.sex == 1 ? '男' : item.sex == 0 ? '女' : ''
      }`
    }
  }
  dataRef.State = State.value
  cache.set('quick_dataRef', dataRef)
  nextTick(() => {
    uni.pageScrollTo({ scrollTop: 99999, duration: 0 })
  })
}

const handleJump = () => {
  uni.navigateTo({
    url: `/pages/my-center/patient-manage/index?isbuy=1`,
  })
  State.value = 1
}

// 用户回复信息
const send = () => {
  if (!dataRef.userReplyTetx) {
    return uni.showModal({
      content: '请输入您的症状！',
    })
  }
  State.value = 2
  dataRef.State = State.value
  cache.set('quick_dataRef', dataRef)
  nextTick(() => {
    uni.pageScrollTo({ scrollTop: 99999, duration: 0 })
  })
}

const goPay = () => {
  popup.value.open()
  dataRef.money = 19.9

  // console.log(paid.value)
}

const handleClose = () => {
  popup.value.close()
  store.dispatch('setIsSendPay', false)
}

const changePayRadio = (val: any) => {
  dataRef.radio = val
}

const handleSubmit = async () => {
  let openid = cache.getOpenId()
  console.log(dataRef.paid)
  try {
    if (order_sn.value) {
      PayFn()
    } else {
      let params = { patient_id: dataRef.paid, openid, content: dataRef.userReplyTetx }
      const { code, data, message } = await Api.pay.quickInquiryPay(params)
      if (code === 200) {
        // this.handleOrderPay(data.order_sn) //  type = 1 快速咨询 默认为图文咨询
        dataRef.order_sn = data.order_sn
        dataRef.payid = data.id
        cache.set('quick_dataRef', dataRef)
        PayFn()
      }
    }
  } catch (error) {
    console.log(error)
    popup.value.close()
  }
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
  // console.log(isWeChart.value)
  let params: any = {
    order_sn: dataRef.order_sn,
    type: dataRef.type || 1,
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
        redirectUrl = order_sn.value
          ? redirectUrl
          : redirectUrl + `?order_sn=${dataRef.order_sn}&order_oc=${dataRef.payid}`
        // console.log(redirectUrl)
        window.location.href = url + '&redirect_url=' + encodeURIComponent(redirectUrl)
      } else {
        // this.$u.toast(data.pay.return_msg)
        uni.showToast({
          title: message,
          icon: 'none',
        })
        store.dispatch('setIsSendPay', false)
      }
    }
  } catch (error) {
    console.log(error)
    uni.showToast({
      title: error.message || '服务器开小差了,请稍等...',
      icon: 'none',
    })
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
              dataRef.isPay = 1
              popup.value.close()
            } else if (res.cancel) {
              console.log('用户点击取消')
              dataRef.isPay = 0
              popup.value.close()
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
            popup.value.close()
            store.dispatch('setIsSendPay', false)
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
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
    type: dataRef.type || 1,
    id: dataRef.payid,
    isAliPay: true,
  }

  try {
    const { data, code, message } = await Api.pay.getAlipayWap(params)
    if (code == 200) {
      const div = document.createElement('divs')
      div.innerHTML = data.form
      document.body.appendChild(div)
      let alipay_submit: any = <HTMLElement>document.getElementById('alipay_submit')
      alipay_submit.submit()
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

const createPeople = () => {
  uni.navigateTo({
    url: '/pages/my-center/patient-manage/index?type=1&isbuy=1',
  })
}
</script>

<style lang="less" scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.top-group {
  display: flex;
  padding: 24rpx 0;
  font-size: 28rpx;
  font-weight: 400;
  color: #6a6a6a;
  .top-item {
    margin-right: 30rpx;
  }
  .active {
    color: #0052fe;
  }
}
.content {
  display: flex;
  flex-direction: column;
  background: #f5f6fa;
  width: 100%;
  min-height: calc(100vh - 150rpx);
  padding-bottom: 150rpx;
  .dialogue-list {
    padding: 30rpx;
    .list-item {
      display: flex;
      margin-top: 25rpx;
      .avatar {
        width: 74rpx;
        height: 74rpx;
        border-radius: 50%;
        overflow: hidden;
      }
      .detail {
        padding: 20rpx;
        background: #ffffff;
        border-radius: 0px 32rpx 32rpx 32rpx;
        margin-top: 32rpx;
        margin-left: 15rpx;
        max-width: 516rpx;
        font-size: 28rpx;
        font-weight: 400;
        word-break: break-all;
      }
    }
    .user-list {
      display: flex;
      justify-content: flex-end;
      .detaill {
        padding: 20rpx;
        background: #ffffff;
        border-radius: 32rpx 0rpx 32rpx 32rpx;
        margin-top: 32rpx;
        margin-right: 15rpx;
        max-width: 516rpx;
        font-size: 28rpx;
        font-weight: 400;
        word-break: break-all;
      }
    }
    .line {
      display: flex;
      height: 25rpx;
    }
    .btn-group {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      .btn-item {
        margin-right: 25rpx;
        margin-top: 10rpx;
        .btn {
          width: 220rpx;
          height: 70rpx;
          font-size: 26rpx;
          background: #fff;
          border-radius: 80rpx;
          color: #000000;
          text-align: center;
          line-height: 70rpx;
          margin: 0 90rpx 40rpx 0;
        }
        .active {
          background: #0052fe;
          font-size: 24rpx;
          line-height: 60rpx;
          width: 220rpx;
          height: 70rpx;
          font-size: 26rpx;
          border-radius: 80rpx;
          color: #fff;
          text-align: center;
          line-height: 70rpx;
          margin: 0 90rpx 40rpx 0;
        }
      }
    }
  }
}

.text-group {
  min-height: 143rpx;
  position: fixed;
  bottom: 0;
  display: flex;
  width: 100%;
  background: #ffffff;
  padding: 30rpx;
  .textarea {
    width: 100%;
    padding: 0 30rpx;
    height: 150rpx;
  }
}

.pay-group {
  position: fixed;
  bottom: 0;
  display: flex;
  width: 100%;
  height: 150rpx;
  padding: 0 30rpx;
  background: #ffffff;
  align-items: center;
  .price-item {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50%;
    font-size: 32rpx;
    font-weight: 500;
    .price {
      color: #0052fe;
    }
  }
  .btn {
    width: 354rpx;
    height: 92rpx;
    background: #0052fe;
    border-radius: 46rpx;
    font-size: 28rpx;
    font-weight: 400;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
  }
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
  }
}
.remind-item {
  display: flex;
  justify-content: center;
}
</style>
