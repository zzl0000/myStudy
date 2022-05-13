<template>
  <view class="container" style="padding-bottom: 100rpx">
    <view class="title-msg" v-if="data.num > 1">
      <image :src="assetsLink + '/assets/ys.jpg'"></image>
      {{ data.data[0].doctor_name }}医生给您开了{{ data.num }}个药方，您可一起支付
    </view>
    <view class="address_box" v-if="data.address">
      <view class="addressUp">
        <view class="icon">
          <image :src="assetsLink + '/assets/dz.png'"></image>
        </view>
        <view class="address">
          <view class="warps">
            <view class="users">
              <view class="useername">
                {{ data.address.express_name }}
              </view>
              <view class="useriphone">
                {{ data.address.express_mobile }}
              </view>
            </view>
            <view class="user-address">
              {{ data.address.express_province }}
              {{ data.address.express_city }}
              {{ data.address.express_area }}
              {{ data.address.express_address }}
            </view>
          </view>
        </view>
        <view class="updateadress" @click="handleEditAddress">
          <image :src="assetsLink + '/assets/arrow-r@2x.png'"></image>
        </view>
      </view>
    </view>
    <!-- 完善收货信息 -->
    <view class="address-box" v-else @click="handleEditAddress">
      <view class="icon-left">
        <image class="img" :src="assetsLink + '/assets/address-icon-01@2x.png'"></image>
      </view>
      <view class="tit">添加收货信息</view>
      <view class="icon-right">
        <image class="img" :src="assetsLink + '/assets/address-icon-02@2x.png'"></image>
      </view>
    </view>
    <view class="warp">
      <view class="forBox" v-for="(itemName, idx) in data.data" :key="idx">
        <view class="info-box">
          <view class="title-box border-1px">
            <view class="lefta">
              <!-- <view>药房{{ idx + 1 }}:</view> -->
              <view>药方:</view>
              <view>{{ itemName.dosage_form }}</view>
            </view>
            <view class="check" v-if="data.num > 1">
              <checkbox-group @change="checkboxChange(idx)">
                <view class="weui-cell__hd">
                  <checkbox :value="idx" :checked="itemName.is_check" />
                </view>
              </checkbox-group>
            </view>
          </view>
          <view class="info-list">
            <view class="info-item">
              <view class="label">患者信息：</view>
              <view class="value"
                >{{ itemName.patient_name }} {{ itemName.patient_sex == 1 ? '男' : '女' }}
                {{ itemName.patient_age }}岁</view
              >
            </view>
            <view class="info-item">
              <view class="label">处方编号：</view>
              <view class="value">{{ itemName.prescript_no }}</view>
            </view>
            <view class="info-item">
              <view class="label">开方时间：</view>
              <view class="value">{{ itemName.created_at }}</view>
            </view>
            <view class="info-items">
              <view class="label">药品明细：</view>
              <view class="value">
                <view class="ls">共{{ itemName.drugs.length }}种药</view>
                <view class="jt" @click="btnClick(idx)" v-if="itemName.isShow">
                  <image :src="assetsLink + '/assets/doctor-home/arrows@2x.png'"></image>
                </view>
                <view class="jt" @click="btnClick(idx)" v-else>
                  <image :src="assetsLink + '/assets/arrow-r@2x.png'"></image>
                </view>
              </view>
            </view>
          </view>
        </view>

        <view
          class="klj"
          v-if="itemName.dosage_form == '颗粒剂' || itemName.dosage_form == '中药饮片'"
        >
          <view class="drugMsg" v-if="itemName.isShow">
            <!-- <view class="bkj" wx:if="{{itemName.pres_visible === '2'}}">
            <view class="bkj-title">
              {{itemName.drug_str}}
            </view>
            <view class="usage">
              {{itemName.usage}}
            </view>
            <view class="usage" wx:if="{{itemName.matter}}">
              医嘱:{{itemName.matter}}
            </view>
          </view> -->
            <view class="kj" v-if="itemName.pres_visible === '1' || itemName.pres_visible === '3'">
              <view class="yp">
                <view class="drugsmsg" v-for="(itemNames, idx) in itemName.drugs" :key="idx">
                  {{ itemNames.drug_name }}{{ itemName.pres_visible === '3' ? '' : itemNames.number
                  }}{{ itemName.pres_visible === '3' ? '' : itemNames.unit }}
                  {{ itemNames.usage ? '(' + itemNames.usage + ')' : '' }}
                </view>
              </view>

              <view class="line"></view>
              <view class="usage">
                {{ itemName.usage }}
              </view>
              <view class="usage" v-if="itemName.matter">医嘱:{{ itemName.matter }}</view>
            </view>
            <view
              class="bkj"
              v-if="
                itemName.pres_visible === '2' ||
                  itemName.pres_visible === '4' ||
                  itemName.pres_visible === '5' ||
                  itemName.pres_visible === '6'
              "
            >
              <view class="bkj-title">
                {{ itemName.drug_str }}
              </view>
              <view class="usage">
                {{ itemName.usage }}
              </view>
              <view class="usage" v-if="itemName.matter">医嘱:{{ itemName.matter }}</view>
            </view>
          </view>
        </view>

        <view class="xy" v-if="itemName.dosage_form == '西药与中成药'">
          <view class="drugMsg" v-if="itemName.isShow">
            <view class="bkj" v-if="itemName.pres_visible === '2'">
              <view class="bkj-title">
                {{ itemName.drug_str }}
              </view>
            </view>
            <view class="kjs" v-if="itemName.pres_visible === '1'">
              <view class="drugsmsg" v-for="(itemNames, idx) in itemName.drugs" :key="idx">
                <view class="xylist border-1px">
                  <view class="xyname">
                    <view class="name">{{ itemNames.drug_name }}</view>
                    <view class="num">{{ itemNames.quantity }}盒</view>
                  </view>
                  <view class="gg">
                    {{ itemNames.specs }}
                  </view>
                  <view class="yf"
                    >用法:{{ itemNames.usage }} {{ itemNames.number }}。 x{{
                      itemNames.medication_days
                    }}天</view
                  >
                </view>
              </view>
            </view>
            <view class="bkj" v-if="itemName.pres_visible === '6'">
              <view class="bkj-title">
                {{ itemName.drug_str }}
              </view>
            </view>
            <view class="bkj" v-if="itemName.pres_visible === '3'">
              <view class="bkj-title">
                {{ itemName.drug_str }}
              </view>
            </view>
            <view class="bkj" v-if="itemName.pres_visible === '4'">
              <view class="bkj-title">
                {{ itemName.drug_str }}
              </view>
            </view>
            <view class="bkj" v-if="itemName.pres_visible === '5'">
              <view class="bkj-title">
                {{ itemName.drug_str }}
              </view>
            </view>
          </view>
        </view>

        <!-- </view> -->

        <view class="info-box">
          <view class="title-box">
            <view>快递设置</view>
          </view>
          <view class="info-lists">
            <view class="info-item">
              <view class="label">快递支付：</view>
              <view class="value border-1px">
                <view class="express" v-if="itemName.show_fee == 2">
                  <text class="express-type">快递包邮</text>
                </view>

                <view class="express" v-else>
                  <picker
                    class="pickers"
                    @change="bindPickerChange($event, idx)"
                    :value="itemName.order.express_pay_type - 1"
                    :range="data.array"
                    v-if="itemName.order.pay_status == 1 && itemName.order.doctor_express_type == 0"
                  >
                    <view class="picker"
                      >{{ data.array[itemName.order.express_pay_type - 1] }}></view
                    >
                  </picker>
                  <view
                    class="pickers"
                    :value="Number(itemName.order.express_pay_type) - 1"
                    :range="data.array"
                    v-else
                  >
                    <view class="picker">
                      {{ data.array[itemName.order.express_pay_type - 1] }}
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>

        <view class="info-box">
          <view class="info-list-price">
            <view class="info-item-price">
              <!-- <view class="label-price">药方{{ idx + 1 }}金额:</view> -->
              <view class="label-price">药方金额:</view>
              <view class="value-price">
                ￥{{ itemName.sumorder }}
                <view class="jt" @click="btnClicks(idx)" v-if="itemName.isprice">
                  <image :src="assetsLink + '/assets/doctor-home/arrows@2x.png'"></image>
                </view>
                <view class="jt" @click="btnClicks(idx)" v-else>
                  <image :src="assetsLink + '/assets/arrow-r@2x.png'"></image>
                </view>
              </view>
            </view>
          </view>
        </view>

        <view class="showmoney" v-if="itemName.isprice">
          <view class="yprice">
            <view class="label">药费</view>
            <view class="value">￥{{ itemName.medical_service_fee }}</view>
          </view>
          <view class="zj">
            <view class="label">诊金</view>
            <view class="value">￥{{ itemName.consultation_fee }}</view>
          </view>
          <view class="jgf">
            <view class="label">加工费</view>
            <view class="value">￥{{ itemName.process_fee }}</view>
          </view>

          <view class="yh">
            <view class="label">优惠</view>
            <view class="value">￥{{ itemName.service_discount }}</view>
          </view>
        </view>

        <view class="info-box">
          <view class="info-list-total">
            <view class="info-item-total">
              <!-- <view class="label-total">药方{{ idx + 1 }}运费：</view> -->
              <view class="label-total">药方运费：</view>
              <view class="value-total">￥{{ itemName.order.express_total }}</view>
            </view>
          </view>
        </view>
      </view>
      <view class="pay-status">
        <radio-group @change="onChange">
          <view class="wechat">
            <view class="wechat-left">
              <image class="wxicon" :src="assetsLink + '/assets/wx.png'" mode="" />
              <view class="wxfont">微信支付</view>
            </view>
            <radio value="1" :checked="data.radio == '1'" />
          </view>
          <view class="wechatfirend">
            <view class="wechat-left">
              <image class="wxicon" :src="assetsLink + '/assets/wx.png'" mode="" />
              <view class="wxfont">微信好友代付</view>
            </view>
            <radio value="0" />
          </view>
          <view class="ali">
            <view class="ali-left">
              <image class="wxicon" :src="assetsLink + '/assets/zfb.png'" mode="" />
              <view class="zfbfont">支付宝支付</view>
            </view>
            <radio value="2" />
          </view>
        </radio-group>
      </view>
    </view>
    <view class="footer-box">
      <view class="left-box">
        实付:
        <text>￥</text>
        <text>{{ data.allPrice }}</text>
      </view>
      <view class="right-box">
        <view class="btn" v-if="disabledPay" @click="topay">去支付</view>
        <view class="btn btn1" v-else>支付中..</view>
        <!-- <button :class="disabledPay ? 'btn btn1' : 'btn'" :disabled="disabledPay" @click="topay">
          {{ disabledTitle }}
        </button> -->
      </view>
    </view>
    <view class="sms-model" v-if="data.isShowPhone"></view>
    <view class="allModel" v-if="data.isShowPhone">
      <view class="sectionss">
        <image class="moneyicon" :src="assetsLink + '/assets/money.png'" mode="" />
        <view class="secfont">
          因微信对支付宝屏蔽，我们已经给您的手机号：
          <text class="phone">{{ data.phone }}</text>
          发送了支付短信 您可直接通过短信链接实现支付宝支付
        </view>
        <button class="buttons" @click="sure">知道了，去查看短信</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onLoad, onPullDownRefresh, onShow, onUnload } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'
import config from '@/config/config'
import common from '@/utils/common'
import Api from '@/api/index'
import { useStore } from 'vuex'
const store = useStore()
// @ts-ignore
import wx from 'weixin-js-sdk'
// @ts-ignore
import ap from '@/utils/alioss/ap.js'

const isSendPay = computed(() => store.getters.getIsSendPay)
const isWeChart = computed(() => store.getters.getWeChart) // 判断是否在微信内部

const app = getApp()
const assetsLink = config.assetsLink

const data = ref({
  id: '',
  data: [],
  address: {},
  pay_status: 0,
  express_total: 0,
  express_pay_type: 1,
  array: ['在线支付', '到付'],
  index: 1, //默认显示位置,
  steps: [],
  show: false,
  activeNames: ['1'],
  animation: '',
  arr: [],
  arrs: [],
  allPrice: '',
  num: null,
  ishow: false,
  isprice: false,
  isexpress: [],
  isjt: true,
  showpay: false,
  ps: 2,
  ishowModel: false,
  showdata: [],
  jg: false,
  sceneid: 0,

  palyer: 0,
  radio: '1',
  ordersn: '',
  types: '44',
  moneys: '',
  isShowPhone: false,
  phone: '',
  debounce_timeout: null,
  ispay: true,
})

const disabledPay = ref(true)

/**
 * 生命周期函数--监听页面加载
 */
onLoad((options) => {
  data.value.id = <any>options.id
  // getpayStatus()
  uni.closeSocket({ complete: () => {} })

  const pages = getCurrentPages()
  console.log(pages, '000000000000')
})

/**
 * 生命周期函数--监听页面显示
 */
onShow(() => {
  store.dispatch('validateLogin').then(() => {
    uni.startPullDownRefresh({})
  })

  if (isSendPay.value) {
    uni.showModal({
      title: '提示',
      content: '支付是否完成',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          store.dispatch('setIsSendPay', false)
          getpayStatus()
        } else if (res.cancel) {
          console.log('用户点击取消')
          store.dispatch('setIsSendPay', false)
        }
      },
    })
  }
})

/**
 * 页面相关事件处理函数--监听用户下拉动作
 */
onPullDownRefresh(() => {
  getpayStatus()
  disabledPay.value = true
})

onUnload(() => {
  store.dispatch('setIsSendPay', false)
})

function onChange(event: any) {
  data.value.radio = event.detail.value
}

function getpayStatus() {
  // request
  common.requestToken({
    method: 'post',
    url: `${config.BaseMpUrl}/apps/mpv2/Prescript/selectStatus`,
    data: {
      id: data.value.id,
    },
    callback: (res: any) => {
      if (res.code == 200) {
        if (res.data.status != 2) {
          uni.navigateTo({
            url: `/pages/my-center/drug-orders/detail/index?id=${data.value.id}&goBack=1`,
          })
        } else {
          if (res.data.is_withdraw == 1) {
            uni.navigateTo({
              url: `/pages/my-center/drug-orders/detail/index?id=${data.value.id}&goBack=1`,
            })
          } else {
            getOrderDetail()
          }
        }
      }
    },
  })
}

function getOrderDetail() {
  // request
  common.requestToken({
    method: 'post',
    url: `${config.BaseMpUrl}/apps/mpv2/Prescript/checkPres
      `,
    data: {
      id: data.value.id,
      type: 1, //去除合并支付 1
    },
    callback: (res: any) => {
      uni.stopPullDownRefresh()

      data.value.address = res.data.address || null
      data.value.data = res.data.data

      if (res.data.address) {
        editOrderAddress(res.data.address, res.data.data)
        getALLprice()
        data.value.num = <any>data.value.data.length

        data.value.data.map((item: any, index) => {
          if (item.patient_age.lastIndexOf('岁') > -1) {
            data.value['data[' + index + '].patient_age'] = item.patient_age.substring(
              0,
              item.patient_age.length - 1
            )
          }

          data.value.data[index]['isShow'] = false
          data.value.data[index][' isprice'] = false
          data.value.data[index]['medical_service_fee'] = (
            Number(item.medical_service_fee) + Number(item.service_discount)
          ).toFixed(2)

          return data.value.data
        })

        data.value.data = data.value.data
      } else {
        updateExpressFee()
        getALLprice()

        data.value.num = <any>data.value.data.length

        data.value.data.map((item: any, index) => {
          data.value.data[index]['isShow'] = false
          data.value.data[index][' isprice'] = false
          data.value.data[index]['medical_service_fee'] = (
            Number(item.medical_service_fee) + Number(item.service_discount)
          ).toFixed(2)

          return data.value.arrs
        })
        data.value.arr = data.value.arrs
      }
    },
  })
}

function editOrderAddress(obj: any, datas: any) {
  const id = datas.map((item: any) => {
    return item.id
  })
  id.toString()
  const dx = {
    id: id.toString(),
    type: 1, // 类型，1处方，2视频问诊
    province: obj.express_province,
    address: obj.express_address,
    uname: obj.express_name,
    area: obj.express_area,
    city: obj.express_city,
    mobile: obj.express_mobile,
  }
  // request
  common.requestToken({
    method: 'post',
    url: `${config.BaseMpUrl}/apps/mpv2/prescript/updateAddress`,
    data: dx,
    callback: (res: any) => {
      updateExpressFee()
    },
  })

  // this.updateExpressFee()
}

function getALLprice() {
  // this.setData({
  //   allPrice: '---'
  // })
  let check = data.value.data.filter((item) => {
    return item.is_check == true
  })
  let z = 0
  let o = 0
  check.filter((item) => {
    o += Number(item.sumorder) + Number(item.order.express_total)
    return o
  })
  const a = z.toFixed(2)
  const b = o.toFixed(2)

  data.value.allPrice = b
}

function updateExpressFee() {
  // const id = this.data.data.map(item => {
  //   return item.id
  // })
  // this.setData({
  //   allPrice: '---'
  // })
  const datas = data.value.data
  const check = datas.filter((item) => {
    return item.is_check == true
  })
  const id = check.map((item) => {
    return item.id
  })
  const priceId = id.toString()
  let params = {
    id: id.toString(),
    verson: 'v3.0.2',
  }
  Api.request
    .post('/wz/v3/express/sf/postage/findnew', params, '')
    .then((res: any) => {
      if (res.code == 200) {
        var copy = data.value.data
        var arr = res.data
        copy.map((item: any) => {
          for (var i = 0; i < arr.length; i++) {
            if (item.id === arr[i].id) {
              item.show_fee = arr[i].show_fee
              item.order.express_total = arr[i].fee
              // item.total_fee = arr[i].total_fee
            }
          }
        })

        data.value.data = copy

        getALLprice()
      } else {
        uni.showToast({
          title: res.message,
          icon: 'none',
        })
      }
    })
    .catch((res: any) => {
      uni.showToast({
        title: res.message,
        icon: 'none',
      })
    })
}

function open() {
  data.value.indshowex = true
}

function btnClick(e: any) {
  let index = e
  if (!data.value.data[index].isShow) {
    data.value.data[index]['isShow'] = true
  } else {
    data.value.data[index]['isShow'] = false
  }
}
function btnClicks(e: any) {
  let index = e
  if (!data.value.data[index].isprice) {
    data.value.data[index]['isprice'] = true
  } else {
    data.value.data[index]['isprice'] = false
  }
}
function checkboxChange(e: any) {
  let ischeck = e.detail.value.length
  let index = e.target.dataset.check
  //未选择
  if (ischeck == 0) {
    // this.setData({
    //   allPrice: '---'
    // })

    data.value.data[index]['is_check'] = false
    data.value.data[index].order['express_total'] = 0

    updateExpressFee()
    getALLprice()
  } else {
    data.value.data[index]['is_check'] = true

    updateExpressFee()
  }
}
function bindPickerChange(e: any, idx: any) {
  const index = idx
  const type = e.detail.value
  if (data.value.data[index].is_check) {
    let params = {
      order_sn: data.value.data[index].order.order_no,
      pay_type: Number(type) + 1,
    }
    Api.myCenter.setpay(params).then((res: any) => {
      if (res.code == 200) {
        data.value.data[index].order['express_pay_type'] = res.data.pay_type

        getALLprice()
        updateExpressFee()
      }
    })
  } else {
    let params = {
      order_sn: data.value.data[index].order.order_no,
      pay_type: Number(type) + 1,
    }
    Api.myCenter.setpay(params).then((res: any) => {
      if (res.code == 200) {
        data.value.data[index].order['express_pay_type'] = res.data.pay_type
        data.value.data[index].order['express_total'] = 0

        getALLprice()
        updateExpressFee()
      }
    })
  }
}

function handleEditAddress() {
  const datas = data.value.data
  const check = datas.filter((item) => {
    return item.is_check == true
  })
  const id = check.map((item) => {
    return item.id
  })
  const priceId = id.toString()
  if (priceId.length === 0) {
    uni.showToast({
      title: '请最少选择一笔处方进行修改哦~',
      icon: 'none',
    })
  } else {
    if (data.value.data.address_count == 0) {
      uni.navigateTo({
        url: `/pages/my-center/address/editAddress/index?orderId=${data.value.id}&order_sn=&isEditOrderAddress=1&id=${priceId}`,
        success: () => {
          app.globalData?.$cache.removeSelectedCity()
        },
      })
    } else {
      uni.navigateTo({
        url: `/pages/my-center/address/index?orderId=${data.value.id}&order_sn=&isEditOrderAddress=1&id=${priceId}&btn=1`,
      })
    }
  }
}

function debounce(fn: any, wait: any) {
  let timeout = data.value.debounce_timeout //定义一个定时器
  return function() {
    if (timeout !== null) clearTimeout(data.value.debounce_timeout) //清除这个定时器
    data.value.debounce_timeout = <any>setTimeout(fn, wait)
  }
}

function topay() {
  // data.value.ispay = false
  // debounce(function() {
  disabledPay.value = false
  handlePay()
  // }, 2000)()
}

function handlePay() {
  let getdata = data.value.data
  const datas = getdata.filter((item: any) => {
    return item.is_check == true
  })

  data.value.showdata = datas
  if (getdata.every((values) => values.is_check == false)) {
    uni.showToast({
      title: '请最少选择一笔处方进行支付哦~',
      icon: 'none',
    })

    data.value.ps = 2
  } else {
    const datas = getdata.filter((item) => {
      return item.is_check == true
    })
    const id = datas.map((item) => {
      return item.id
    })
    let pm = {
      id: id.toString(),
      verson: 'v3',
    }
    let pms = {
      id: id.toString(),
      verson: 'v1',
    }

    // disabledPay.value = false
    Api.request
      .post(`/wz/v3/express/sf/check/addressnew`, pm, '')
      .then((respon: any) => {
        if (respon.code === 200) {
          Api.request
            .post(`/pay/wxpay/makeorder`, pms, '')
            .then((res: any) => {
              if (res.code == 200) {
                data.value.ordersn = res.data.order_no
                data.value.ids = res.data.id
                data.value.moneys = res.data.pay_money

                PayFn()
              }
            })
            .catch((err: any) => {
              uni.showToast({
                title: err.message,
                icon: 'none',
              })
              setTimeout(() => {
                uni.startPullDownRefresh({})
              }, 1000)
            })
        }
      })
      .catch((res) => {
        disabledPay.value = true
        // this.setData({
        //   ps: 2,
        //   ishowModel: false
        // })
      })
  }
  // }
}

const PayFn = async () => {
  console.log(data.value)
  // data.value.show = false
  switch (data.value.radio) {
    case '1': //微信
      wxPay()
      break
    case '2': //支付宝
      alipay()
      break
    case '0': //好友支付
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
    order_sn: data.value.ordersn,
    type: data.value.types,
    verson: 'v3.0.3',
    id: data.value.ids,
  }
  try {
    if (isWeChart.value) {
      params.pay_method = 2
      params.openid = app.globalData?.$cache.getWxOpenId()
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

    disabledPay.value = true
  } catch (error) {
    disabledPay.value = true
    uni.showToast({
      title: '服务器开小差了,请稍等...',
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
        disabledPay.value = true
        // 支付成功
        uni.showModal({
          content: '支付成功',
          showCancel: false,
          confirmText: '知道了',
          success: function(res) {
            store.dispatch('setIsSendPay', false)

            // 处方
            uni.navigateBack({
              delta: 1,
            })
          },
        })
      } else if (res.err_msg === 'get_brand_wcpay_request:fail') {
        disabledPay.value = true
        // 支付失败
        uni.showModal({
          title: '',
          content: '支付失败',
          confirmText: '重新支付',
          confirmColor: '##007CFF',
          cancelText: '返回首页',
          success: function(res) {
            store.dispatch('setIsSendPay', false)

            if (res.confirm) {
              wxPay()
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
    order_sn: data.value.ordersn,
    type: data.value.types,
    id: data.value.ids,
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
    disabledPay.value = true
    store.dispatch('setIsSendPay', false)

    console.log(error)
  }
}
const frpay = async () => {
  var d = new Date().getTime()

  let type = data.value.types == '44' ? '44' : 1
  // dataRef.payDisabled = false
  let userCf = app.globalData?.$cache.getUserCf()
  disabledPay.value = true
  setTimeout(() => {
    store.dispatch('setIsSendPay', false)
    console.log(data, 'datattatatatattatata')
    uni.navigateTo({
      url: `/pages/pay/friends-pay?order_money=${data.value.moneys}&order_sn=${
        data.value.ordersn
      }&type=${type}&id=${data.value.ids}&time=${d}&userCf=${JSON.stringify(userCf)}`,
    })
  }, 300)
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  position: relative;
  background: #f7f9fa;
}

.audio-container {
  width: 100%;
  height: 100vh;
}

.top-box {
  display: flex;
  align-items: center;
  height: 200rpx;
  margin-top: 30rpx;
  background: #fff;
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
  width: 100%;
  /* margin-top: 30rpx;
  background: #fff; */
}

.info-box-price {
  width: 100%;
  /* margin-top: 30rpx;
  background: #fff; */
}

.info-box-total {
  width: 100%;
  /* margin-top: 30rpx;
  background: #fff; */
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
  padding: 20rpx 30rpx;
}

.info-box .info-lists {
  padding: 0 30rpx;
}

.info-box .info-list-price {
  padding: 0 30rpx;
}

.info-box .info-list-total {
  padding: 0 30rpx;
}

.info-box .info-lists .info-item .value {
  height: 25px;
}

.info-box .info-item {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30rpx;
  color: #666;
  line-height: 50rpx;
}

.info-box .info-item-total {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 28rpx;
  color: #666;
  line-height: 50rpx;
}

.info-box .info-item-price {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 30rpx;
  color: #666;
  line-height: 50rpx;
}

.info-box .info-item-price .jt {
  /* flex: 0.1; */
  margin-left: 5px;
  z-index: 999;
}

.info-box .info-item-price .jt image {
  width: 10px;
  height: 10px;
}

.info-box .info-item .label {
  width: 160rpx;
}

.info-box .info-item .value {
  flex: 1;
}

.value-price {
  display: flex;
}

.info-box .info-items {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30rpx;
  color: #666;
  line-height: 50rpx;
}

.info-box .info-items .label {
  width: 200rpx;
}

.info-box .info-items .value {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.info-box .info-items .value .ls {
  flex: 1;
}

.info-box .info-items .value .jt {
  flex: 0.1;
  margin-left: 150px;
}

.info-box .info-items .value .jt image {
  width: 10px;
  height: 10px;
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

.footer-box .btn1 {
  background: #a8a8a8;
}

.line {
  border-top: 1rpx dashed #ccc;
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
  /* width: 80px; */
  height: 55px;
  line-height: 8px;
  color: black;
  position: absolute;
  right: 0px;
  margin-right: 15px;
  /* left: 210px; */
}

.pickers {
  height: 50px;
  width: 100px;
  /* line-height: 50px; */
  position: absolute;
  right: 30px;
}

.picker {
  position: absolute;
  right: -30px;
}

.express {
  /* margin-top: 30rpx; */
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

.forBox {
  width: 100%;
  /* height: 200px; */
  display: flex;
  margin-top: 10px;
  background: white;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.section {
  display: flex;
  width: 90%;
  height: 30px;
  border-bottom: 2px solid #ccc;
  margin-top: 15px;
}

.title {
  width: 100%;
  display: flex;
}

.user {
  width: 90%;
  display: flex;
  flex-direction: column;
  font-size: 13px;
  margin-top: 10px;
}

.usermsg {
  width: 100%;
  display: flex;
}

.orderOn {
  width: 100%;
  display: flex;
}

.time {
  width: 100%;
  display: flex;
}

.size {
  width: 100%;
  display: flex;
}

.drugs {
  width: 80%;
  display: flex;
  justify-content: space-between;
}

.checks {
  height: 40px;
}

.checkkk {
  height: 40px;
}

.ccc {
  height: 40px;
  /* position: absolute;
  right:10px;
  top: 80px; */
}

.drugMsg {
  width: 100%;
  /* height: 100px; */
  display: flex;
  flex-wrap: wrap;
  /* justify-content: center; */
  background-color: rgba(242, 242, 242, 1);
}

.xy {
  width: 92%;
  /* height: 100px; */
  display: flex;
  flex-wrap: wrap;
  /* justify-content: center; */
  background-color: rgba(242, 242, 242, 1);
}

.klj {
  width: 92%;
  /* height: 100px; */
  display: flex;
  flex-wrap: wrap;
  /* justify-content: center; */
  background-color: rgba(242, 242, 242, 1);
}

/* .drugsmsg {
  padding: 5px;
  font-size: 14px;
  color: rgba(51, 51, 51, 0.87843137254902);
} */

.line {
  width: 98%;
  height: 2px;
  text-align: center;
  border: none;
  /* background: inherit; */
  background-color: rgba(121, 121, 121, 0.164705882352941);
}

.usage {
  width: 100%;
  padding: 5px;
  font-size: 12px;
  color: #ff6633;
}

.check {
  /* position: absolute;
  left: 30rpx;
  top: 70rpx;
  width: 37rpx;
  height: 37rpx; */
}

.lefta {
  width: 180px;
  display: flex;
  margin-right: 4px;
}

.title-msg {
  height: 40px;
  line-height: 40px;
  font-size: 26rpx;
  text-align: center;
  background: white;
  display: flex;
  color: #00459d;
  justify-content: center;
  align-items: center;
}

.title-msg image {
  width: 15px;
  height: 15px;
  margin-right: 8px;
}

.zz {
  height: 100vh;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 999;
  background: #ccc;
  opacity: 0.7;
}

.hd {
  width: 100%;
  background: white;
  /* height: 150px; */
  position: absolute;
  bottom: 0;
}

.title-hd {
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.if {
  /* width: 92%; */
  /* height: 100px; */
  display: flex;
  flex-wrap: wrap;
  background-color: rgba(242, 242, 242, 1);
}

.bkj {
  width: 100%;
}

.bkj-title {
  color: rgba(51, 51, 51, 0.87843137254902);
  width: 100%;
  font-size: 15px;
  font-weight: 500;
  /* 5: 500; */
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.kj {
  display: flex;
  flex-wrap: wrap;
  background-color: rgba(242, 242, 242, 1);
  /* justify-content: center; */
}

.kj .drugsmsg {
  padding-top: 10px;
  padding-left: 5px;
  font-size: 14px;
}

.kj .line {
  width: 95%;
  height: 2px;
  text-align: center;
  border: none;
  background-color: rgba(121, 121, 121, 0.164705882352941);
}

.yp {
  width: 95%;
  display: flex;
  flex-wrap: wrap;
}

.kj .usage {
  padding: 5px;
  font-size: 12px;
  color: #ff6633;
}

checkbox .wx-checkbox-input {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

checkbox .wx-checkbox-input.wx-checkbox-input-checked {
  /* background: #FF525C; */
  width: 20px;
  height: 20px;
}

/* checkbox .wx-checkbox-input.wx-checkbox-input-checked::before {
  width: 10px;
  height: 10px;
  line-height: 10px;
  text-align: center;
} */
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

.useername {
}

.useriphone {
  margin-left: 10px;
  color: #5d5d6c;
}

.user-address {
  font-weight: 430;
}

.showmoney {
  width: 92%;
  display: flex;
  flex-wrap: wrap;
  font-size: 14px;

  /* background-color: rgba(242, 242, 242, 1); */
}

.yprice {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 5px;
  color: #5d5d6c;
  background-color: rgba(242, 242, 242, 1);
  font-size: 14px;
}

.zj {
  display: flex;
  width: 100%;
  justify-content: space-between;
  color: #5d5d6c;
  padding: 5px;
  background-color: rgba(242, 242, 242, 1);
}

.jgf {
  display: flex;
  width: 100%;
  justify-content: space-between;
  color: #5d5d6c;
  padding: 5px;
  background-color: rgba(242, 242, 242, 1);
}

.yh {
  display: flex;
  width: 100%;
  justify-content: space-between;
  color: #5d5d6c;
  padding: 5px;
  background-color: rgba(242, 242, 242, 1);
}

.xy .drugMsg {
}

.xy .drugMsg .kjs {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.xy .drugMsg .kjs .drugsmsg {
  width: 100%;
  display: flex;
  justify-content: center;
}

.xy .drugMsg .kjs .drugsmsg .xylist {
  display: flex;
  flex-direction: column;
  width: 94%;
  margin: 10px;
}
.xyname {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
.xyname .name {
  font-size: 14px;
  font-weight: 500;
}
.gg {
  color: #5d5d6c;
  font-size: 13px;
}
.yf {
  color: #5d5d6c;
  font-size: 13px;
}
.model {
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  position: fixed;
  top: 0;
  z-index: 999;
}
.sections {
  width: 100%;
  height: 60vh;
  background: #ffffff;
  position: absolute;
  bottom: 0;
  border-radius: 20px 20px 0px 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.box {
  width: 100%;
  display: flex;
  justify-content: center;
}
.box-title {
  width: 90%;
  display: flex;
  margin-top: 10px;
  justify-content: space-between;
}
.font {
  font-size: 20px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #000000;
}
.close image {
  width: 30px;
  height: 30px;
}
.address-sure {
  width: 100%;
  margin-top: 20px;
}
.ypmsg {
  width: 100%;
  margin-top: 20px;
}
.sureBtn {
  width: 270px;
  height: 40px;
  background: #0052ff;
  /* border-radius: 50px; */
  text-align: center;
  line-height: 40px;
  color: white;
  margin: 10px;
}
.ypwrap {
  width: 90%;
  height: 70%;
  overflow-y: auto;
}
.btnbox {
  width: 90%;
  height: 25%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.dz-sure {
  font-size: 30rpx;
  color: #000000;
}
.user {
  color: #5d5d6c;
  font-size: 30rpx;
}
.yfmc {
  font-size: 30rpx;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #000000;
}
.kd {
  display: flex;
  color: #5d5d6c;
}
.akd {
  color: #ff6633;
}
.jixing {
  display: flex;
}
.yfjxh {
  color: #5d5d6c;
}
.xy {
  width: 95%;
}
.xy .xybox {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.pay-status {
  /* margin: 0 30rpx 40rpx; */
  padding: 0 43rpx;
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 20rpx;
  width: 100%;
  // display: flex;
  margin-top: 10px;
  justify-content: center;
  align-items: center;
}

.wechat {
  width: 100%;
  flex: 1;
  height: 100rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.wechatfirend {
  width: 100%;
  flex: 1;
  height: 100rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.ali {
  width: 100%;
  flex: 1;
  height: 100rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.wxicon {
  width: 50rpx;
  height: 50rpx;
}

.wechat-left {
  flex: 9;
  display: flex;
  /* justify-content: center; */
  align-items: center;
}

.ali-left {
  flex: 9;
  display: flex;
  /* justify-content: center; */
  align-items: center;
}

.zfbfont {
  margin-left: 7rpx;
}

.wechat-right {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.wxfont {
  margin-left: 10rpx;
}

.section {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  margin-bottom: 276rpx;
}

checkbox .wx-checkbox-input {
  width: 45rpx;
  height: 45rpx;
  border-radius: 50%;
}

.van-popup {
  height: 43% !important;
  width: 100%;
}

/* .sms-model {
  width: 100%;
  height: 115vh;
  background: rgb(73, 72, 72);
  opacity: .7;
  position: absolute;
  top: 0;
  margin: 0 auto;
} */

.moneyicon {
  width: 100rpx;
  height: 100rpx;
  margin-top: 80rpx;
  margin-bottom: 20rpx;
  /* margin-left: 220rpx; */
}
.allModel {
  width: 90%;
  /* height: 500rpx; */
  background: #ffffff !important;
  margin: 500rpx auto;
  position: absolute;
  top: 0rpx;
  left: 40rpx;
  border-radius: 15rpx;
  /* opacity: .7; */
  /* z-index: 999; */
}
.buttons {
  width: 100%;
  color: white;
  background: #007cff;
}
.sections {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}
.secfont {
  width: 80%;
  margin-bottom: 20rpx;
}
.phone {
  color: #007cff;
}
van-radio-group {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.van-radio-group {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
.sms-model {
  width: 100%;
  height: 100%;
  background: rgb(73, 72, 72);
  opacity: 0.7;
  position: fixed;
  top: 0;
  margin: 0 auto;
  z-index: 99;
}

.moneyicon {
  width: 100rpx;
  height: 100rpx;
  margin-top: 80rpx;
  margin-bottom: 20rpx;
  /* margin-left: 220rpx; */
}
.allModel {
  width: 90%;
  /* height: 500rpx; */
  background: #ffffff !important;
  /* margin: 500rpx auto; */
  position: fixed;
  margin: 500rpx auto;
  top: 0rpx;
  left: 40rpx;
  border-radius: 15rpx;
  /* opacity: .7; */
  z-index: 999;
}
.buttons {
  width: 100%;
  color: white;
  background: #007cff;
}
.sectionss {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}
.secfont {
  width: 80%;
  margin-bottom: 20rpx;
}
.phone {
  color: #007cff;
}
</style>
