<template>
  <view class="container">
    <!-- 医生卡片信息 -->
    <uni-card class="card-box">
      <view class="doctor-group">
        <view class="avatar">
          <image
            class="img"
            :src="doctorInfoRef?.avatar_url || assetsLink + '/assets/avatar@2x.png'"
            mode=""
          />
        </view>
        <view class="doctor-info">
          <view class="doctor-item">
            <text class="name">{{ doctorInfoRef?.name }}</text>
            <text class="job">{{ doctorInfoRef?.tid_name }}</text>
          </view>
          <view class="doctor-item">
            <text class="ks"
              >{{ doctorInfoRef?.kid2_name }} | {{ doctorInfoRef?.hospital_name }}</text
            >
          </view>
        </view>
      </view>
      <view class="doctor-label">
        <view class="label-item">
          <image src="/static/img/im/icon-01.png" class="icon" mode="" />
          <text>100%医生本人</text>
        </view>
        <view class="label-item">
          <image src="/static/img/im/icon-01.png" class="icon" mode="" />
          <text>未回复随时退</text>
        </view>
        <view class="label-item">
          <image src="/static/img/im/icon-01.png" class="icon" mode="" />
          <text>不满意可投诉</text>
        </view>
      </view>
    </uni-card>

    <!-- 问诊类型 卡片信息 -->
    <uni-card class="card-box">
      <!-- 视频 -->
      <view v-if="type == 4" class="im-group">
        <view class="im-top">
          <view class="im-type">
            <image :src="assetsLink + '/assets/physician/video.png'" class="icon" mode="" />
            <text>视频咨询</text>
          </view>
          <view class="price"> ￥{{ doctorInfoRef?.price }}/次 </view>
        </view>
        <view class="im-tips">
          <view class="im-tips-item">
            <image :src="assetsLink + '/assets/physician/message.png'" class="icon" mode="" />
            <view class="text">不限时长 面对面交流</view>
          </view>
          <view class="im-tips-item">
            <image :src="assetsLink + '/assets/physician/document.png'" class="icon" mode="" />
            <view class="text">医生在线 辩证开方</view>
          </view>
          <view class="im-tips-item">
            <image :src="assetsLink + '/assets/physician/house.png'" class="icon" mode="" />
            <view class="text">线下调剂 快递到家</view>
          </view>
        </view>
      </view>
      <!-- 电话 -->
      <view v-if="type == 2" class="im-group">
        <view class="im-top">
          <view class="im-type">
            <image :src="assetsLink + '/assets/physician/graphic.png'" class="icon" mode="" />
            <text>图文咨询</text>
          </view>
          <view class="price"> ￥{{ doctorInfoRef?.price }}/次 </view>
        </view>
        <view class="im-tips">
          <view class="im-tips-item">
            <image :src="assetsLink + '/assets/physician/document.png'" class="icon" mode="" />
            <view class="text">不限句数 在线交流</view>
          </view>
          <view class="im-tips-item">
            <image :src="assetsLink + '/assets/physician/document.png'" class="icon" mode="" />
            <view class="text">医生在线 辩证开方</view>
          </view>
          <view class="im-tips-item">
            <image :src="assetsLink + '/assets/physician/house.png'" class="icon" mode="" />
            <view class="text">线下调剂 快递到家</view>
          </view>
        </view>
      </view>
      <!-- 电话 -->
      <view v-if="type == 3" class="im-group">
        <view class="im-top">
          <view class="im-type">
            <image :src="assetsLink + '/assets/physician/iphone.png'" class="icon" mode="" />
            <text>电话咨询</text>
          </view>
          <view class="price"> ￥{{ doctorInfoRef?.price }}/次 </view>
        </view>
        <view class="im-tips">
          <view class="im-tips-item">
            <image :src="assetsLink + '/assets/physician/document.png'" class="icon" mode="" />
            <view class="text">不限时长 面对面交流</view>
          </view>
          <view class="im-tips-item">
            <image :src="assetsLink + '/assets/physician/document.png'" class="icon" mode="" />
            <view class="text">医生在线 辩证开方</view>
          </view>
          <view class="im-tips-item">
            <image :src="assetsLink + '/assets/physician/house.png'" class="icon" mode="" />
            <view class="text">线下调剂 快递到家</view>
          </view>
        </view>
      </view>
    </uni-card>
    <!-- 号源模块 只有视频和电话 显示  -->
    <view v-if="type != 2" class="source-no-group">
      <!-- 号源日期组 -->
      <view class="source-no-date">
        <view class="result">
          <text>请选择预约时间</text>
          <text class="tips">({{ checkText }} {{ _times }})</text>
        </view>
        <view class="date-group">
          <!-- 星期 -->
          <view class="week-list">
            <view class="week-item" v-for="w in weekList" :key="w">{{ w }}</view>
          </view>
          <!-- 日期  -->
          <view class="date-list">
            <view class="date-item" v-for="d in dateList" :key="d.val">
              <view class="val" :class="d.isChecked ? 'active' : ''" @click="handleChecked(d)">{{
                d.val
              }}</view>
              <view class="label">{{ d.num_status }}</view>
            </view>
          </view>
        </view>
      </view>
      <!-- 号源列表 -->
      <view class="source-no-list" v-if="regList.length > 0">
        <view
          class="list-item"
          v-for="(item, index) in regList"
          :key="index"
          @click="handleDisClick(item)"
          v-show="checkTime(item)"
        >
          <view class="time">{{ item.start_time }} - {{ item.end_time }} </view>
          <view class="num">剩余：{{ item.surplus_num }}</view>
          <uni-icons
            class="icon"
            :type="item.id != activeReg ? 'circle' : 'checkbox-filled'"
            :color="item.id != activeReg ? '' : '#0052FE'"
            size="30"
          ></uni-icons>
        </view>
      </view>
    </view>

    <!-- 服务协议 -->

    <view class="service-info">
      <view class="title">服务说明</view>
      <view class="text">{{ typeText }}服务须知（预约即代表同意以下规则）</view>
      <view
        >1.互联网诊疗仅适用常见病、慢性病复诊患者,急重症患者、首诊患者请前往实体医疗机构就诊。</view
      >
      <view>2.复诊时必须提供包含诊断的实体医疗机构的病历资料，针对同诊断复诊。</view>
      <block v-if="type == 2">
        <view>3.医生在48小时（非工作时间不计入）内回复您，如未按时回复您可申请退款。</view>
        <view>4.医生将与您通过图片，文字进行交流。</view>
      </block>
      <block v-if="type == 3">
        <view>3.预约后请按要求填写病情描述与咨询单，并在预约时间段注意接听来电提醒。</view>
        <view
          >4.医生将在您预约的时间段，向您发起通话进行电话看诊；如果医生超过预约时间还未与您沟通，可随时申请退款。</view
        >
      </block>
      <block v-if="type == 4">
        <view
          >3.预约后请按要求填写病情描述与咨询单，并按照预约时间段提前半小时进入名医在线小程序候诊。</view
        >
        <view
          >4.医生将在您预约的时间段，呼叫您进行视频看诊，如果医生超过预约时间还未与您沟通，可随时申请退款。</view
        >
      </block>
      <view>5.医生将根据患者实际情况辨证开方、给出调理建议。</view>
      <view>6.咨询过程中请避免向医生咨询非患者本人的问题，否则医生有权提前结束咨询。</view>
      <view
        >7.在线复诊过程中，若由于您无法提供实体医疗机构的诊断证明，或医生无法在线得出和您之前线下实体机构相同的诊断而无法为您开出处方和诊断的情况，将不会退还复诊费用。</view
      >
      <view>
        8.购买即同意名医在线相关条款
      </view>
      <view style="margin-top: 10rpx;">
        <!-- <radio :checked="radioChecked" @click="userRadioChange" class="redioC" /> -->
        <text class="active" @click="onUserAgreementTap"
          >《用户注册协议》(包含互联网诊疗风险告知及知情同意书)</text
        >
        、
        <text class="active" @click="onPrivacyPolicyTap">《隐私条款》</text>
      </view>
    </view>

    <!-- 悬浮层 -->
    <view class="suspend-popup">
      <!-- 就诊人 -->
      <view class="chose-patient" @click="onPatientTap">
        <view v-if="patientInfo" class="patient-info">
          <!-- 嘻嘻 女 28岁 -->
          <text class="active">{{ patientInfo?.name }}</text>
          <text class="active">{{ patientInfo?.sex }}</text>
          <text class="active">{{ patientInfo?.age }}</text>
        </view>
        <view v-else class="patient-info">
          请问您要为谁问诊
        </view>
        <view class="more">
          <text>{{ patientInfo ? '更换' : '请选择就诊人' }}</text>
          <image class="icon" src="/static/img/im/icon-06.png" mode="" />
        </view>
      </view>
      <!-- 支付 -->
      <view class="pay-group">
        <view class="price">
          <text> 实付金额：</text>
          <text class="num">￥{{ doctorInfoRef?.price }}</text>
        </view>
        <view class="btn" @click="goPay()">去支付</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onLoad, onResize, onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'
import Api from '../../api/index'
import cache from '../../utils/auth'
import config from '../../config/config'
import { useStore } from 'vuex'
const store = useStore()

const assetsLink = config.assetsLink
const title = ref('Hello')
const type = ref()
const doctorInfoRef = ref()
const typeText = ref('')
const weekList = <any>ref([])
const showPopup = ref()
const dateList = <any>ref([])
const regList = <any>ref([])
const patientInfo = <any>ref()
const radioChecked = ref(true)
const disabled = ref(false)
const activeReg = <any>ref(0)
const checkText = ref('请选择号源')
const _times = ref()

const did = <any>ref()

onLoad((option) => {
  // let extConfig = uni.getExtConfigSync ? uni.getExtConfigSync() : {}
  console.log(option)
  if (option && option.type) {
    type.value = option.type
    did.value = option.id
  }
  // uni.getSystemInfo({
  //   success: (res: any) => {
  //     console.log(res)
  //     statusBarHeight.value = res.statusBarHeight
  //     navHeight.value = res.statusBarHeight + 46
  //     srcollHeight.value = res.screenHeight - navHeight.value
  //   },
  // })
  let token = option.token || ''
  // console.log(token, token != 'null')
  if (token && token != 'null') {
    store.dispatch('getUserCf', token).then(() => {
      getData(option.cpdid)
    })
  } else {
    getData(option.cpdid)
  }
})

onShow(() => {
  patientInfo.value = cache.getSelectedPatient()
})

const getData = async (cpdid: any) => {
  let params = {
    did: cpdid,
  }
  let doctorInfo = <any>{}
  let scheduleList = <any>[]
  if (type.value == 3) {
    const { data } = await Api.inquiry.getCallWenZhenInfo(params)
    scheduleList = data.list
    doctorInfo = data.info
    doctorInfo.price =
      doctorInfo.wz_setting && doctorInfo.wz_setting.price ? doctorInfo.wz_setting.price : 0
  }
  if (type.value == 2) {
    const { data } = await Api.inquiry.getViewWenZhenInfo(params)
    doctorInfo = data.info
    doctorInfo.price =
      doctorInfo.view_setting && doctorInfo.view_setting.price ? doctorInfo.view_setting.price : 0
  }
  if (type.value == 4) {
    const { data } = await Api.inquiry.getVideoWenZhenInfo(params)
    scheduleList = data.list
    doctorInfo = data.info
    doctorInfo.price =
      doctorInfo.wz_setting && doctorInfo.wz_setting.price ? doctorInfo.wz_setting.price : 0
  }
  console.log(doctorInfo)
  doctorInfoRef.value = doctorInfo
  if (scheduleList.length > 0) {
    scheduleList.map((m: any, i) => {
      if (i < 7) {
        weekList.value.push(m.week)
      }
      m.isChecked = false
      m.val = m.schema_date.substr(-2)
      dateList.value.push(m)
    })
    // console.log(scheduleList[0].week)
    // weekList.value
  }

  // console.log(dateList.value)
  // dateList.value.map((m) => {
  //   if (m.num_status == '有号') {
  //     handleChecked(m)
  //   }
  // })

  let _index = dateList.value.findIndex((v) => {
    return v.num_status == '有号'
  })
  console.log(_index)
  if (_index != -1) {
    handleChecked(dateList.value[_index])
  }
}

const handleChecked = (d) => {
  checkText.value = `已选中${d.date}`
  regList.value = d.details
  _times.value = ''
  dateList.value.map((m) => {
    if (m.date === d.date) {
      m.isChecked = true
    } else {
      m.isChecked = false
    }
  })
}

const handleDisClick = (item) => {
  // const item = e.currentTarget.dataset.item
  console.log(item)
  activeReg.value = item.id
  uni.hideLoading()
  if (item.active == 0) {
    uni.showToast({
      title: '就诊时间已过，无法挂号',
      icon: 'none',
    })
  } else {
    _times.value = item.id == activeReg.value ? `${item.start_time}-${item.end_time}` : ''
  }
}

const goPay = async () => {
  if (type.value != 2 && !activeReg.value) {
    uni.showToast({
      title: '请选择号源信息',
      icon: 'none',
    })
    return
  }
  if (!patientInfo.value) {
    uni.showToast({
      title: '请选择就诊人',
      icon: 'none',
    })
    return
  }
  // if (!radioChecked.value) {
  //   uni.showToast({
  //     title: '必须同意用户注册协议',
  //     icon: 'none',
  //   })
  //   return
  // }
  if (disabled.value) {
    return
  }
  uni.showLoading({
    title: '加载中',
  })
  disabled.value = true
  let params: any = {
    type: type.value, // 咨询订单类型 2：定向图文；3：定向电话；4：定向视频；
    openid: cache.getOpenId(),
    doctor_id: did.value,
    // is_visit: 0, // 是否复诊 0.初诊 1.复诊
  }
  const regData = regList.value.find((item) => item.id == activeReg.value)
  if (regData) {
    params.dial_time = `${regData.schema_date} ${regData.start_time}-${regData.end_time}`
    params.p_id = activeReg.value
  }
  if (patientInfo.value) {
    params.patient_id = patientInfo.value.id
  }

  try {
    const { data, code, message } = await Api.inquiry.createWzPayOrder(params)
    uni.hideLoading()
    disabled.value = false
    if (code == 200) {
      if (data.money === '0.00') {
        uni.redirectTo({
          url: `/pages/im-inquiry/im/index?order_sn=${data.order_sn}`,
        })
      } else {
        let userCf = cache.getUserCf()
        console.log(userCf.phone)
        uni.navigateTo({
          url: `/pages/pay/pay?type=1&id=${data.id}&money=${data.money}&order_sn=${data.order_sn}&phone=${userCf.phone}&paytype=${typeText.value}`,
        })
      }
    } else {
      uni.showToast({
        title: message,
        icon: 'none',
      })
    }
  } catch (error) {
    uni.hideLoading()
    disabled.value = false
    console.log(error)
    let res: any = error
    if (res.code == 200) {
      uni.navigateTo({
        url: `/pages/pay/pay?type=1&id=${res.data.id}&money=${res.data.money}&order_sn=${res.data.order_sn}&phone=${res.data.patient_mobile}`,
      })
    } else {
      console.log(res.message, params)
      if (res.message == '请先完善患者身份证信息') {
        uni.showToast({
          title: res.message,
          icon: 'none',
        })
        uni.navigateTo({
          url: `/pages/my-center/patient-manage/index?pid=${params.patient_id}&isbuy=${1}`,
        })
      } else {
        uni.showToast({
          title: res.message,
          icon: 'none',
        })
      }
    }
  }
}

const userRadioChange = () => {
  radioChecked.value = !radioChecked.value
  if (!radioChecked.value) {
    uni.showToast({
      title: '必须同意用户注册协议',
      icon: 'none',
    })
  }
}

const checkTime = (item: any) => {
  // console.log(item)
  const timeStr = `${item.schema_date.replace(/\-/g, '/')} ${item.end_time}`
  let oldTime = new Date(timeStr).getTime()
  let nowTime = new Date().getTime()
  let state = false
  // console.log(timeStr, nowTime, oldTime)
  let res = oldTime - nowTime
  if (res > 0) {
    state = true
  }
  console.log(state)
  return state
}

const onUserAgreementTap = () => {
  uni.navigateTo({
    url: '/pages/my-center/user-agree/index',
  })
}
const onPrivacyPolicyTap = () => {
  uni.navigateTo({
    url: '/pages/my-center/privacy-agree/index',
  })
}

const onPatientTap = async () => {
  try {
    const { data, code } = await Api.patient.getPatientList({})
    if (code == 200 && data && data.length == 0) {
      showPopup.value = true
    } else {
      uni.navigateTo({
        url: '/pages/my-center/patient-manage/index?type=2',
      })
    }
  } catch (error) {
    uni.navigateTo({
      url: '/pages/my-center/patient-manage/index?type=2',
    })
  }
}
</script>

<style lang="less">
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f5f6fa;
}
.card-box {
  width: 690rpx;
  box-sizing: border-box;
  border-radius: 12rpx;
  box-shadow: none !important;
  border: none !important;
}
.doctor-group {
  display: flex;
  align-items: center;
  .avatar {
    width: 118rpx;
    height: 118rpx;
    border-radius: 50%;
    overflow: hidden;
  }
  .doctor-item {
    margin-left: 30rpx;
    .name {
      font-size: 44rpx;
      font-weight: 500;
      color: #000000;
    }
    .job {
      font-size: 30rpx;
      font-weight: 400;
      color: #6a6a6a;
      padding-left: 30rpx;
    }
    .ks {
      font-size: 30rpx;
      font-weight: 400;
      color: #6a6a6a;
      padding-top: 10rpx;
    }
  }
}

.doctor-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 30rpx;
  .label-item {
    display: flex;
    align-items: center;
    font-size: 24rpx;
    font-weight: 400;
    color: #6a6a6a;
    .icon {
      width: 24rpx;
      height: 24rpx;
      margin-right: 10rpx;
    }
  }
}

.im-group {
  display: flex;
  flex-direction: column;
  .im-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 30rpx;
    font-weight: 500;
    color: #000000;
    padding-bottom: 30rpx;
    border-bottom: 1px solid #dfdde9;
    .im-type {
      display: flex;
      align-items: center;
      .icon {
        width: 72rpx;
        height: 72rpx;
        margin-right: 30rpx;
      }
    }
  }
  .im-tips {
    display: flex;
    padding-top: 30rpx;
    justify-content: space-between;
    .im-tips-item {
      display: flex;
      flex-direction: column;
      font-size: 22rpx;
      font-weight: 400;
      color: #150e0e;
      align-items: center;
      width: 33%;
      .icon {
        width: 72rpx;
        height: 72rpx;
      }
      .text {
        width: 100rpx;
        margin-top: 20rpx;
      }
    }
  }
}
.service-info {
  // display: flex;
  padding: 30rpx 30rpx 290rpx 30rpx;
  font-size: 24rpx;
  color: #999999;
  line-height: 38rpx;
  .title {
    margin-bottom: 10rpx;
  }
  .text {
    margin-bottom: 30rpx;
    color: #666666;
  }
  .active {
    color: #1890ff;
  }
}

.source-no-group {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  .source-no-date {
    display: flex;
    flex-direction: column;
    width: 690rpx;
    min-height: 386rpx;
    background: #ffffff;
    border-radius: 12rpx;
    padding: 20rpx;
    box-sizing: border-box;
    .result {
      font-size: 28rpx;
      font-weight: 400;
      color: #000000;
      .tips {
        color: #0052fe;
        padding-left: 12rpx;
      }
    }
    .date-group {
      display: flex;
      flex-direction: column;
      .week-list {
        display: flex;
        justify-content: space-between;

        .week-item {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 82rpx;
          height: 61rpx;
          font-size: 26rpx;
          font-weight: 400;
          color: #939393;
          margin-top: 15rpx;
        }
      }
      .date-list {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        .date-item {
          display: flex;
          align-items: center;
          flex-direction: column;
          justify-content: center;
          width: 82rpx;
          font-size: 28rpx;
          font-weight: 400;
          color: #000000;
          margin-top: 15rpx;
          .label {
            margin-top: 10rpx;
          }
          .val {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 61rpx;
            height: 61rpx;
          }
          .val.active {
            background: #0052fe;
            border-radius: 50%;
            color: #ffffff;
          }
        }
      }
    }
  }
  .source-no-list {
    display: flex;
    flex-direction: column;
    .list-item {
      display: flex;
      align-items: center;
      width: 690rpx;
      height: 118rpx;
      background: #ffffff;
      border-radius: 12rpx;
      margin-top: 15rpx;
      padding: 0 20rpx;
      position: relative;
      box-sizing: border-box;
      .num {
        padding-left: 60rpx;
      }
      .icon {
        position: absolute;
        right: 20rpx;
      }
    }
  }
}

.suspend-popup {
  position: fixed;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.chose-patient {
  width: 690rpx;
  height: 150rpx;
  background: linear-gradient(90deg, #fbe6c3 0%, #ebc187 100%);
  box-shadow: 0rpx -1rpx 9rx 1rpx rgba(163, 137, 101, 0.5);
  border-radius: 12rpx;
  margin-bottom: -30rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30rpx;
  box-sizing: border-box;
  .patient-info {
    font-size: 30rpx;
    font-weight: 500;
    color: #8e5a26;
    padding-bottom: 20rpx;
    .active {
      padding-right: 10rpx;
    }
  }
  .more {
    font-size: 30rpx;
    font-weight: 500;
    color: #8e5a26;
    padding-bottom: 20rpx;
    .icon {
      width: 14rpx;
      height: 24rpx;
      margin-left: 15rpx;
    }
  }
}

.pay-group {
  width: 750rpx;
  height: 150rpx;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30rpx;
  box-sizing: border-box;
  .price {
    font-size: 30rpx;
    font-weight: 500;
    color: #000000;
    .num {
      font-size: 40rpx;
      color: #0052fe;
    }
  }
  .btn {
    width: 354rpx;
    height: 92rpx;
    background: #0052fe;
    border-radius: 46rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36rpx;
    font-weight: 400;
    color: #fff;
    letter-spacing: 1px;
  }
}
.redioC {
  transform: scale(0.7);
}
</style>
