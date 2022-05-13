<template>
  <view class="container" style="padding-bottom: 100rpx">
    <!-- 待收货 -->
    <view class="top-box" v-if="data.pay_status == 2">
      <view class="status-box">
        <image class="image" :src="assetsLink + '/assets/receiving@2x.png'"></image>
        <view class="status-cont">
          <image class="image-name" :src="assetsLink + '/assets/receiving_text@2x.png'"></image>
          <view class="text">快递单号：{{ data.logistics && data.logistics.logistics_no }}</view>
        </view>
      </view>
    </view>
    <!-- 已完成 -->
    <view class="top-box" v-if="data.pay_status == 5">
      <view class="status-box">
        <image class="image" :src="assetsLink + '/assets/finished@2x.png'"></image>
        <view class="status-cont">
          <image class="image-name" :src="assetsLink + '/assets/finished_text@2x.png'"></image>
          <view class="text">快递单号：{{ data.logistics && data.logistics.logistics_no }}</view>
        </view>
      </view>
    </view>
    <!-- 已取消 -->
    <view class="top-box" v-if="data.pay_status == 3 || data.pay_status == 4">
      <view class="status-box">
        <image class="image" :src="assetsLink + '/assets/receiving@2x.png'"></image>

        <view class="status-cont">
          <image
            class="image-name"
            :src="assetsLink + '/assets/已退款@2x.png'"
            v-if="data.refund_type == 1"
          ></image>
          <image
            class="image-name"
            :src="assetsLink + '/assets/部分退款@2x.png'"
            v-if="data.refund_type == 2"
          ></image>
          <view class="text" v-if="data.logistics && data.logistics.logistics_no"
            >快递单号：{{ data.logistics && data.logistics.logistics_no }}</view
          >
          <view class="text" v-else>快递单号：暂无</view>
        </view>
      </view>
    </view>

    <view class="info-box">
      <view class="addressUp">
        <view class="icon">
          <image :src="assetsLink + '/assets/dz.png'"></image>
        </view>
        <view class="address">
          <view class="warps">
            <view class="users">
              <view class="useername">
                {{ data.order.express_name }}
              </view>
              <view class="useriphone">
                {{ data.order.express_mobile }}
              </view>
            </view>
            <view class="user-address">
              {{ data.order.express_province }}
              {{ data.order.express_city }}
              {{ data.order.express_area }}
              {{ data.order.express_address }}
            </view>
          </view>
        </view>
        <view class="updateadress" @click="handleEditAddress">
          <!-- <image src="{{assetsLink+'/assets/arrow-r@2x.png'}}"></image> -->
        </view>
      </view>
    </view>

    <view class="info-box">
      <view class="title-box border-1px">
        <text class="title">药方：{{ data.dosage_form }}</text>
      </view>
      <view class="info-list">
        <view class="info-item">
          <view class="label">患者信息：</view>
          <view class="value"
            >{{ data.patient_name }} {{ data.patient_sex == 1 ? '男' : '女' }}
            {{ data.patient_age }}岁</view
          >
        </view>
        <view class="info-item">
          <view class="label">处方编号：</view>
          <view class="value">{{ data.prescript_no }}</view>
        </view>
        <view class="info-item">
          <view class="label">开方时间：</view>
          <view class="value">
            {{ data.created_at }}
            <!-- {{data.patient_name}} {{data.patient_sex == 1 ? '男' : '女'}} {{data.patient_age}} -->
          </view>
        </view>
        <view class="info-item">
          <view class="label">支付时间：</view>
          <view class="value">{{ data.order.pay_time }}</view>
        </view>
        <view class="info-item">
          <view class="label">支付方式：</view>
          <view class="value" v-if="data.order.order_channel == 3">支付宝支付</view>
          <view class="value" v-else>微信支付</view>
        </view>
        <view class="info-items">
          <view class="label">药品明细：</view>
          <view class="value">
            <view class="ls">共{{ data.drugs.length }}种药</view>
            <view class="jt" @click="btnClick(2)" v-if="data.showyao">
              <image :src="assetsLink + '/assets/doctor-home/arrows@2x.png'"></image>
            </view>
            <view class="jt" @click="btnClick(1)" v-else>
              <image :src="assetsLink + '/assets/arrow-r@2x.png'"></image>
            </view>
          </view>
        </view>
        <view class="klj" v-if="data.showyao">
          <view
            class="kljmsg"
            v-if="data.dosage_form == '颗粒剂' || data.dosage_form == '中药饮片'"
          >
            <view
              class="wrap"
              v-if="
                data.pres_visible === '1' ||
                  data.pres_visible === '3' ||
                  data.pres_visible === '4' ||
                  data.pres_visible === '5' ||
                  data.pres_visible === '6'
              "
            >
              <view class="ypitems" v-for="(itemNames, idx) in data.drugs" :key="idx">
                {{ itemNames.drug_name
                }}{{ data.pres_visible === '3' || data.pres_visible === '4' ? '' : itemNames.number
                }}{{ data.pres_visible === '3' || data.pres_visible === '4' ? '' : itemNames.unit
                }}{{ itemNames.usage ? '(' + itemNames.usage + ')' : '' }}

                <!-- {{itemNames.drug_name}} -->
              </view>
              <view class="line"></view>
              <view class="usage">
                {{ data.usage }}
              </view>
              <view class="usages" v-if="data.matter">医嘱:{{ data.matter }}</view>
            </view>
            <view class="wrap" v-if="data.pres_visible === '2'">
              <view class="bkj-title">
                {{ data.drug_str }}
              </view>
              <view class="line"></view>
              <view class="usage">
                {{ data.usage }}
              </view>
              <view class="usages" v-if="data.matter">医嘱:{{ data.matter }}</view>
            </view>
          </view>
          <view class="xy" v-if="data.dosage_form == '西药与中成药'">
            <template
              v-if="
                data.pres_visible === '1' ||
                  data.pres_visible === '3' ||
                  data.pres_visible === '4' ||
                  data.pres_visible === '5' ||
                  data.pres_visible === '6'
              "
            >
              <view class="xybox" v-for="(xyitem, idx) in data.drugs" :key="idx">
                <view class="boxtitle">
                  <view class="xyname">
                    {{ xyitem.drug_name }}
                  </view>
                  <view class="xysum">{{ xyitem.quantity }}盒</view>
                </view>

                <view class="jl">
                  {{ xyitem.specs }}
                </view>

                <view class="yf"
                  >用法：{{ xyitem.usage }} {{ xyitem.number }}。 x{{
                    xyitem.medication_days
                  }}天</view
                >
              </view>
            </template>
            <view class="xybj" v-if="data.pres_visible === '2'">
              {{ data.drug_str }}
            </view>
          </view>
        </view>

        <view class="line"></view>
        <view class="kd">快递设置</view>
        <view class="info-itemss">
          <view class="label">快递支付</view>
          <view
            class="value"
            v-if="
              data.order.express_total == 0 &&
                data.order.isexpress == '1' &&
                data.order.express_pay_type == '1'
            "
          >
            快递包邮
          </view>
          <view class="value" v-else>
            {{ data.order.express_pay_type == '2' ? '到付' : '在线支付' }}
          </view>
        </view>
        <view class="line"></view>
        <view class="info-itemss">
          <view class="label">药方金额</view>
          <view class="values">
            ￥{{ data.total_fee_no_express }}
            <view class="jt" @click="btnClicks(2)" v-if="data.showprice">
              <image :src="assetsLink + '/assets/doctor-home/arrows@2x.png'"></image>
            </view>
            <view class="jt" @click="btnClicks(1)" v-else>
              <image :src="assetsLink + '/assets/arrow-r@2x.png'"></image>
            </view>
          </view>
        </view>
        <view class="info-lists right" v-if="data.showprice">
          <view class="info-item">
            <view class="labels">药费</view>
            <view class="values">￥{{ data.medical_service_fee }}</view>
          </view>
          <view class="info-item">
            <view class="labels">诊金</view>
            <view class="values">￥{{ data.consultation_fee }}</view>
          </view>
          <view class="info-item">
            <view class="labels">加工费</view>
            <view class="values">￥{{ data.process_fee }}</view>
          </view>
          <view class="info-item">
            <view class="labels">优惠</view>
            <view class="values">￥{{ data.service_discount }}</view>
          </view>
        </view>
        <view class="info-itemss">
          <view class="label">药方运费</view>
          <view class="value">￥{{ data.express_fee }}</view>
        </view>
      </view>
    </view>

    <view class="express">
      <view class="express-box border-1px">
        <text class="express-title">物流信息</text>
        <view class="express-list" v-if="data.steps">
          <van-steps direction="vertical" :steps="data.steps" :active="data.active" />
        </view>
        <view class="noexpress" v-else>
          <text>暂时没有物流信息,请稍后再来~</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onBackPress, onLoad, onPullDownRefresh, onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'
import config from '../../../../config/config'
import common from '../../../../utils/common'
import { useStore } from 'vuex'
const store = useStore()

const app = getApp()
const assetsLink = config.assetsLink

const data = ref({
  id: '',

  express_fee: '',
  total_fee: '',
  order_fee: '',

  logistics: {
    logistics_no: '',
  },

  order: {
    express_name: '',
    express_mobile: '',
    express_province: '',
    express_city: '',
    express_area: '',
    express_address: '',
    pay_time: '',
    order_channel: 0,
    express_total: 0,
    isexpress: '',
    express_pay_type: '',
  },

  dosage_form: '',
  patient_name: '',
  patient_sex: 0,
  prescript_no: '',
  drugs: [],
  pres_visible: '',
  usage: '',
  matter: '',
  drug_str: '',
  medical_service_fee: '',
  consultation_fee: '',
  process_fee: '',
  service_discount: '',

  pay_status: 0,
  refund_type: 0,
  express_total: 0,
  express_pay_type: 1,
  array: ['', '在线支付', '到付'],
  index: 1,

  //默认显示位置,
  steps: [],

  show: false,
  showprice: false,
  showyao: false,
  age: 0,
  indshowex: false,

  xyitem: {
    drug_name: '',
    quantity: '',
    specs: '',
    usage: '',
    number: '',
    medication_days: '',
  },

  active: '',
})

const goBack = ref('0')

/**
 * 生命周期函数--监听页面加载
 */
onLoad((options) => {
  console.log(options)
  if (options.scene) {
    let id = decodeURIComponent(options.scene)

    data.value.id = id
  } else {
    data.value.id = <any>options.id
  }

  goBack.value = options.goBack || '0'
})

/**
 * 生命周期函数--监听页面显示
 */
onShow(() => {
  store.dispatch('validateLogin').then(() => {
    uni.startPullDownRefresh({})
  })
})

/**
 * 页面相关事件处理函数--监听用户下拉动作
 */
onPullDownRefresh(() => {
  getOrderDetail()
})

onBackPress((e) => {
  if (goBack.value == '1') {
    goBack.value = '0'

    uni.switchTab({
      url: '/pages/my-center/index',
    })
    return true
  } else {
    return false
  }
})

function btnClicks(e: number) {
  let index = e
  if (index == 1) {
    data.value.showprice = true
  } else {
    data.value.showprice = false
  }
}

function btnClick(e: number) {
  let index = e
  if (index == 1) {
    data.value.showyao = true
  } else {
    data.value.showyao = false
  }
}

// function open() {
//   data.value.indshowex = true
// }

function bindPickerChange(e) {
  // this.setData({
  //   index: e.detail.value,
  // })
  // console.log(e.detail.value)
  // if (e.detail.value == 1) {
  //   console.log(this)
  //   let params = {
  //     order_sn: this.data.order.order_no,
  //     pay_type: '1',
  //   }
  //   app.globalData.$api.myCenter.setpay(params).then((res) => {
  //     if (res.code == 200) {
  //       this.setData({
  //         'data.express_fee': res.data.express_total,
  //         'data.total_fee': res.data.total_fee,
  //         'data.order_fee': res.data.order_fee,
  //       })
  //     }
  //   })
  // if (e.detail.value == 2) {
  //   let params = {
  //     order_sn: this.data.order.order_no,
  //     pay_type: '2',
  //   }
  //   app.globalData.$api.myCenter.setpay(params).then((res) => {
  //     if (res.code == 200) {
  //       this.setData({
  //         'data.express_fee': res.data.express_total,
  //         'data.total_fee': res.data.total_fee,
  //         'data.order_fee': res.data.order_fee,
  //       })
  //     }
  //   })
  // } // }
  // }
}

function getOrderDetail() {
  // request
  common.requestToken({
    method: 'post',
    url: `${config.BaseMpUrl}/apps/mpv1/prescript/detail`,
    data: {
      id: data.value.id,
    },
    callback: (res: any) => {
      uni.stopPullDownRefresh()
      if (res.code == 200) {
        // if (res.data.patient_age.lastIndexOf('岁') > -1) {
        //   data.value.age = res.data.patient_age.substring(0, res.data.patient_age.length - 1)

        //   res.data.patient_age.substring(0, res.data.patient_age.length - 1)
        // }
        res.data.medical_service_fee =
          Number(res.data.medical_service_fee) + Number(res.data.service_discount)

        data.value = {
          ...data.value,
          ...res.data,
        }
        data.value.steps = res.data.express || null
        data.value.pay_status = res.data.order ? res.data.order.pay_status : 0
        data.value.refund_type = res.data.order ? res.data.order.refund_type : 0
        data.value.express_pay_type = res.data.order.express_pay_type
        data.value.index = res.data.order.express_pay_type
      } else {
      }
    },
  })
}

function handleEditAddress() {
  if (data.value.address_count == 0) {
    uni.navigateTo({
      url: `/pages/my-center/address/editAddress/index?orderId=${data.value.id}&order_sn=${data.value.order.order_no}&isEditOrderAddress=1`,
      success: () => {
        app.globalData?.$cache.removeSelectedCity()
      },
    })
  } else {
    uni.navigateTo({
      url: `/pages/my-center/address/index?orderId=${data.value.id}&order_sn=${data.value.order.order_no}&isEditOrderAddress=1`,
    })
  }
}

function handlePay() {
  // let parmas = {
  //   order_sn: this.data.order.order_no,
  // } // if (Number(this.data.data.set_express_total) < 0) {
  //   if (this.data.data.is_set_address == 0) {
  //     wx.showToast({
  //       title: '请设置收货地址~',
  //       icon: 'error'
  //     })
  //     return
  //   } else {
  //     wx.navigateTo({
  //       url: `/pages/pay/pay?order_sn=${this.data.data.order.order_no}&type=2&money=${this.data.data.total_fee}&phone=${this.data.data.patient_mobile}`,
  //     })
  //   }
  // } else {
  //   app.$api.myCenter.getExpressCheckAddress(parmas).then(res => {
  //     console.log(res)
  //   })
  //   // wx.navigateTo({
  //   //   url: `/pages/pay/pay?order_sn=${this.data.data.order.order_no}&type=2&money=${this.data.data.total_fee}&phone=${this.data.data.patient_mobile}`,
  //   // })
  // }
  // app.globalData.$api.myCenter.getExpressCheckAddress(parmas).then((res) => {
  //   // console.log(res)
  //   if (res.code === 200) {
  //     uni.navigateTo({
  //       url: `/pages/pay/pay?order_sn=${this.data.order.order_no}&type=2&money=${this.data.total_fee}&phone=${this.data.patient_mobile}`,
  //     })
  //   }
  // })
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  position: relative;
  background: #f7f9fa;
}

.top-box {
  display: flex;
  align-items: center;
  height: 200rpx;
  margin-top: 30rpx;
  background: #fff;
  position: relative;
}

.top-box .address-image {
  width: 574rpx;
  height: 144rpx;
}

.address-box {
  display: flex;
  align-items: center;
  position: relative;
  background: #fff;
  margin-top: 20rpx;
  padding: 0 28rpx;
  min-height: 108rpx;
}

.address-box .icon-left {
  width: 38rpx;
  height: 38rpx;
}

.address-box .tit {
  font-size: 30rpx;
  font-weight: 500;
  text-align: left;
  color: #007cff;
  padding-left: 18rpx;
}

.address-box .icon-right {
  position: absolute;
  right: 28rpx;
  width: 40rpx;
  height: 40rpx;
}

.status-box {
  display: flex;
  flex: 1;
  padding: 0 30rpx;
}

.status-box .image {
  width: 247rpx;
  height: 173rpx;
  margin-right: 26rpx;
}

.status-box .image-name {
  width: 147rpx;
  height: 65rpx;
  margin-top: 28rpx;
}

.status-box .text {
  font-size: 28rpx;
  color: #333;
  line-height: 40rpx;
}

.info-box {
  margin-top: 30rpx;
  background: #fff;
}

.info-box:last-of-type {
  margin-bottom: 60rpx;
}

.info-box .title-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 0 19rpx 30rpx;
}

.info-box .title-box .title {
  flex: 1;
  font-size: 36rpx;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 700;
  color: #333;
  line-height: 50rpx;
}

.info-box .title-box .right {
  text-align: right;
  width: 120rpx;
  margin-right: 30rpx;
  font-size: 28rpx;
  color: #666666;
  line-height: 40rpx;
}

.info-box .title-box .right image {
  width: 16rpx;
  height: 25rpx;
  margin-left: 20rpx;
  vertical-align: -2rpx;
}

.info-box .info-list {
  padding: 30rpx;
}

.info-box .info-item {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30rpx;
  color: #666;
  line-height: 50rpx;
}

.info-box .info-item .label {
  width: 160rpx;
}

.info-box .info-item .value {
  flex: 1;
}

.info-list.right .value {
  text-align: right;
}

.info-list.address .label {
  width: 220rpx;
}

.info-list.border {
  padding: 0;
  padding-left: 30rpx;
}

.info-list.border .info-item {
  font-size: 32rpx;
  line-height: 45rpx;
  padding: 23rpx 0;
}

.info-list.border .label {
  width: 270rpx;
}

.info-list.border .value {
  color: #333;
  padding-right: 30rpx;
}

.footer-box {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30rpx;
  background: #fff;
  z-index: 10;
}

.footer-box .left-box {
  display: flex;
  align-items: center;
  font-size: 32rpx;
  color: #666;
  line-height: 45rpx;
}

.footer-box .left-box text {
  color: #333;
  font-weight: 700;
  line-height: 56rpx;
}

.footer-box .left-box text:last-child {
  font-size: 40rpx;
}

.footer-box .btn {
  width: 196rpx;
  height: 80rpx;
  border-radius: 40rpx;
  background: #1890ff;
  color: #fff;
  font-size: 36rpx;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 700;
  text-align: center;
  line-height: 80rpx;
}

.line {
  border-top: 1px solid #eaeaea;
  margin: 20rpx 0;
}

.weight {
  color: #333;
  font-weight: 700;
  font-family: PingFangSC, PingFangSC-Medium;
}

.highlight {
  color: #1890ff;
}

.img {
  width: 100%;
  height: 100%;
}

.info-boxs {
  width: 100%;
  height: 100%;
  display: flex;
  margin-top: 30px;
  background: #fff;
  position: relative;
}

.express {
  width: 100%;
  height: 50px;
  display: flex;
}
.express-price {
  width: 50%;
  margin-left: 10px;
  line-height: 50px;
}
.express-type {
  width: 80px;
  height: 55px;
  line-height: 17px;
  color: black;
  position: absolute;
  right: 0;
}

.pickers {
  height: 50px;
  width: 100px;
  line-height: 50px;
  position: absolute;
  right: 50px;
}
.picker {
  position: absolute;
  right: -30px;
}

.express {
  margin-top: 30rpx;
  background: #fff;
  width: 100%;
  height: 100%;
}
.express-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 0 19rpx 30rpx;
  flex-direction: column;
}
.express-title {
  width: 100%;
  flex: 1;
  font-size: 36rpx;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 700;
  color: #333;
  line-height: 50rpx;
}

.express-list {
  width: 100%;
  display: flex;
  flex-direction: column;
}
/* 
.logisit{
  width: 100%;
  margin-left: 10rpx;
  margin-top: 60rpx;
  display: flex;
}
.noexpress{
  font-size: 30rpx;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 400;
  color: #333;
  margin-top: 40rpx;
}
.express-right {
  width:90%;
  height: 170rpx;
  color: orange;  
  margin-left: 20rpx;
  margin-right: 40rpx;
  height: auto;
  }
.line{
  height: 180rpx;
}
.express-status-address{
  font-size: 26rpx;
  color: orange;
}
.express-statusing{
  font-size: 22rpx;
  color: #999
}
.dot-shou {
   width: 30rpx;
  height: 30rpx;
  border-radius: 50%;
  border:1rpx  solid #fff;
  background: orange;

  margin-left: 3rpx;
  margin-top: 6rpx;
}
.dot_two{
   width: 30rpx;
  height: 30rpx;
  border-radius: 50%;
  border:1rpx  solid #d7d7d7;
  background: #d7d7d7;

  margin-left: 3rpx;
  margin-top: 6rpx;
}
.express-middle-axis {
  width: 48rpx;
  position: relative;
  top: -218rpx;
  left: -1rpx;
}
.dot-closing {
  width: 30rpx;
  height: 30rpx;
  border-radius: 50%;
  margin-top: 50rpx;
  border:1rpx  solid #d7d7d7;
  text-align:center;
  line-height:30rpx;
  font-size:30rpx;
  color:#d7d7d7;
  animation:myfirst;
  animation-fill-mode:forwards;
  position:absolute;
  top:175rpx;
  left:4rpx;
 
}
.dot-closing_two {
  width: 30rpx;
  height: 30rpx;
  border-radius: 50%;
  margin-top: 50rpx;
  border:1rpx  solid #000;
  background: #d7d7d7;

  animation:myfirst;
  animation-fill-mode:forwards;
  position:absolute;
  top:175rpx;
  left:4rpx;
 
}
@keyframes myfirst
{
	to {
      font-weight: bold;
      transform: rotate(270deg);
    }
}

.express-right {
  width:90%;
  color: #666;  
  margin-left: 20rpx;
  margin-right: 40rpx;
  }
.line{
  height: 180rpx;
}
.online-top-closing {
  width: 1rpx;
  height: 180rpx;
  background: black;
  position:absolute;
  top:40rpx;
  left:21rpx;
}
.color{
  color: orange;
  font-weight: bold;
}
.color_second{
  color: #999;
} */

.lopages {
  background: #fff;
  overflow-x: hidden;
  /* position: absolute; */
  margin: auto;
  top: 20rpx;
  width: 710rpx;
  padding-bottom: 30rpx;
  left: 2%;
  border-radius: 8rpx;
  box-shadow: 0px 4px 8px 0px rgba(219, 219, 219, 0.5);
}

.head {
  height: 52rpx;
  display: flex;
  background: rgba(245, 247, 250, 1);
  border-radius: 8px 8px 0px 0px;
  padding-left: 20rpx;
  padding-right: 20rpx;
}
.wuliuinfo {
  padding-left: 20rpx;
  padding-right: 20rpx;
}
.tabulate {
  display: flex;
  align-items: center;
}

/* 收货图片 */
.head_img {
  width: 160rpx;
  height: 160rpx;
  margin: auto 20rpx;
}

/* 快递状态 */
.head_name {
  font-size: 26rpx;
  color: #666;
}

/* 快递编号 */
.head_title {
  font-size: 26rpx;
  color: #666;
}

.head_tel_name {
  font-size: 22rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  color: #666;
}

/* 追踪 */
.logisit {
  width: 100%;
  margin-left: 5rpx;
  margin-top: 5rpx;
  display: flex;
}

.express-middle-axis {
  width: 48rpx;
  position: relative;
  top: -195rpx;
  left: -5rpx;
}

.color {
  color: #000000 !important;
}

.color_second {
  color: rgba(153, 153, 153, 1);
}

.express-status-address {
  font-size: 26rpx;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
}

.express-time {
  font-size: 24rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(102, 102, 102, 1);
  padding-top: 20rpx;
}

.express-left-date {
  display: flex;
  width: 300rpx;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}

.online-top-closing {
  width: 2rpx;
  height: 160rpx;
  background: #999999;
  position: absolute;
  top: 42rpx;
  left: 21rpx;
}

.express-text {
  font-size: 26rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(153, 153, 153, 1);
  padding-top: 20rpx;
}

.dot-closing {
  width: 30rpx;
  height: 30rpx;
  border-radius: 50%;
  margin-top: 50rpx;
  /* margin-bottom:-45rpx; */
  border: 1rpx solid #d7d7d7;
  text-align: center;
  line-height: 30rpx;
  font-size: 30rpx;
  color: #d7d7d7;
  animation: myfirst;
  animation-fill-mode: forwards;
  position: absolute;
  top: 150rpx;
  left: 4rpx;
}

.dot-closing_two {
  width: 30rpx;
  height: 30rpx;
  border-radius: 50%;
  margin-top: 50rpx;
  /* margin-bottom:-45rpx; */
  border: 1rpx solid #000;
  background: white;
  animation: myfirst;
  animation-fill-mode: forwards;
  position: absolute;
  top: 175rpx;
  left: 4rpx;
}

@keyframes myfirst {
  to {
    font-weight: bold;
    transform: rotate(270deg);
  }
}

.dot-shou {
  width: 30rpx;
  height: 30rpx;
  border-radius: 50%;
  border: 1rpx solid #000;
  background: #000;
  margin-left: 3rpx;
  margin-top: 6rpx;
  margin-right: 10rpx;
}

.dot_two {
  width: 30rpx;
  height: 30rpx;
  border-radius: 50%;
  border: 1rpx solid #d7d7d7;
  background: #d7d7d7;
  margin-left: 3rpx;
  margin-top: 6rpx;
}

.express-right {
  width: 90%;
  min-height: 150rpx;
  color: #666;
}

.line {
  height: 10rpx;
}

.buttom {
  width: 100%;
  height: 400rpx;
  line-height: 400rpx;
  text-align: center;
  color: #999;
}
.address_box {
  width: 100%;
  background: white;
  margin-top: 10px;
}

.addressUp {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 0px;
}

.icon {
  width: 10%;
  text-align: center;
}

.icon image {
  width: 20px;
  height: 20px;
}

.updateadress {
  width: 10%;
  text-align: center;
}

.updateadress image {
  width: 10px;
  height: 15px;
}

.address {
  width: 80%;
  padding: 15rpx 0rpx;
}

.wraps {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.users {
  display: flex;
}

.address-box {
  width: 100%;
  background: white;
}

.useriphone {
  margin-left: 10px;
  color: #5d5d6c;
}

.user-address {
  font-weight: 430;
}

.info-box .info-items {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30rpx;
  color: #666;
  line-height: 50rpx;
}
.info-list .info-items .value {
  flex: 1;
  display: flex;
  justify-content: space-between;
}
.info-list .info-items .value .ls {
  /* flex: 0.1; */
  margin-left: 4px;
}
.info-list .info-items .value .jt {
  flex: 0.01;
  text-align: center;
  /* margin-left: 150px; */
}

.info-list .info-items .value .jt image {
  width: 10px;
  height: 10px;
}
.info-lists .info-item .value {
}
.info-box .info-list .info-lists {
  color: #5d5d6c;
  /* line-height: 50rpx; */
  background: #f4f4f4;
}
.info-box .info-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 28rpx;
  color: #5d5d6c;
  line-height: 50rpx;
  /* background: #F4F4F4; */
}
.info-box .info-item .labels {
  padding-left: 10px;
  padding-top: 5px;
}
.info-box .info-item .values {
  padding-right: 5px;
}
.kd {
  color: #000000;
  font-size: 28rpx;
}
.info-itemss {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 30rpx;
  color: #666;
  line-height: 50rpx;
}
.jt image {
  width: 10px;
  height: 10px;
  padding-left: 5px;
}
.info-itemss .values {
  display: flex;
  padding-right: 5px;
}
.klj {
  background: #f4f4f4;
}
.kljmsg {
  display: flex;
  justify-content: center;
  flex-direction: column;
}
.wrap {
  width: 95%;
  display: flex;
  flex-wrap: wrap;
  padding-top: 9px;
}
.ypitems {
  /* width: 33%; */
  /* padding-top: 10px; */
  padding-left: 10rpx;
  padding-top: 10rpx;
  font-size: 26rpx;
}
.usage {
  width: 95%;
  font-size: 25rpx;
  margin-left: 5px;
  color: #ff6633;
}
.usages {
  width: 95%;
  margin-left: 5px;
  font-size: 25rpx;
  /* color:#FF6633; */
}
.tk {
  position: absolute;
  left: 40%;
  color: blue;
}
.bftk {
  position: absolute;
  left: 40%;
  color: blue;
}
.bkj-title {
  width: 100%;
  text-align: center;
  padding: 30rpx;
}
.jixing {
  display: flex;
}
.yfjxh {
  color: #5d5d6c;
}
.xy {
  width: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
.xy .xybox {
  width: 95%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 20rpx 20rpx 20rpx 20rpx;
  flex-wrap: wrap;
  border-bottom: 1px solid #eaeaea;
}
.boxtitle {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.xyname {
  font-size: 28rpx;
  color: #000000;
}
.xysum {
  font-size: 28rpx;
  color: #000000;
}
.jl {
  width: 100%;
  color: #5d5d6c;
  font-size: 24rpx;
}
.yf {
  width: 100%;
  color: #5d5d6c;
  font-size: 24rpx;
}
.lines {
  width: 100%;
  border-bottom: 1px solid #eaeaea;
}
.xybj {
  width: 100%;
  text-align: center;
  padding: 30rpx;
}
</style>
