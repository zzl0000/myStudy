<template>
  <view class="container">
    <view class="navbar-box" v-if="(dataRef.type == 3 || dataRef.type == 4) && dataRef.status == 2">
      <view class="tag">未开始</view>
    </view>
    <view class="video-tips-box" v-if="dataRef.isHungup" @click="JoinRoom">
      <view class="title">当前视频正在通话中...</view>
      <view class="btn-text">点此进入</view>
    </view>

    <view
      class="tips-box"
      @click="goInquiryForm(dataRef.currentOrderSn)"
      v-if="dataRef.showWzOrder"
    >
      <view class="title">请及时填写问诊单</view>
      <view class="text">缺少问诊单医生无法准确了解您的病情</view>
      <view class="btn-text">去填写>></view>
    </view>

    <scroll-view
      class="message-wrap"
      scroll-y
      upper-threshold="50"
      :scroll-into-view="dataRef.scrollIntoView"
      :scroll-with-animation="dataRef.scrollWithAnimation"
      @scrolltoupper="onScrolltoupper"
      :style="{ height: dataRef.scrollViewHeight + 'px' }"
    >
      <uni-load-more
        extClass="my-loading"
        status="loading"
        iconType="circle"
        :showText="false"
        v-show="dataRef.loading == 'loading'"
      />
      <view v-if="dataRef.loading == 'nomore' && !dataRef.messageList.length" class="no-data">
        <image class="img icon" :src="assetsLink + '/assets/no-data-icon.png'" mode="aspectFill" />
        <text class="text">暂时还没有内容哦~</text>
      </view>
      <view class="message-list">
        <block v-for="(item, index) in dataRef.messageList" :key="index">
          <view
            class="message-item"
            :id="'message-item-' + item.messageUId"
            v-if="item.content.type != 1010"
          >
            <!-- 日期 -->
            <view
              class="date"
              v-if="
                index > 0 && item.sentTimeFormat != dataRef.messageList[index - 1].sentTimeFormat
              "
            >
              {{ item.sentTimeFormat }}</view
            >

            <block v-if="item.messageType === 'MYZX:DefaultMsg'">
              <view
                class="text-box"
                v-if="item.content.type == 0"
                @click="goUploadCase(item.content.order_sn)"
              >
                {{ item.content.content }}
                <text class="blue">点此更新病历</text>
              </view>
              <view class="text-box" v-else-if="item.content.type == 1"
                >医生邀请您填写咨询单，点击顶部提示去填写</view
              >
              <view
                class="text-box"
                v-else-if="
                  item.content.type == 3 ||
                    item.content.type == 4 ||
                    item.content.type == 5 ||
                    item.content.type == 10
                "
                :data-ordersn="item.content.order_sn"
                :data-dialtime="item.content.reservation_time"
              >
                <block v-if="item.content.type == 3">
                  您已成功购买
                  <text class="blue">图文咨询服务</text>
                  ，医生将在48h内与您沟通，逾期未回复您，您可选择继续等待或
                  <text
                    class="blue"
                    @click="handleRefund(item.content.order_sn, item.content.reservation_time)"
                    >申请退款</text
                  >
                  , 在开始沟通前，您需要先
                  <text class="blue" @click="goList">完善咨询资料</text>
                  。
                </block>
                <block v-else-if="item.content.type == 4">
                  您已成功购买
                  <text class="blue">电话咨询服务</text>
                  ，医生将在{{
                    item.content.reservation_time
                  }}开始与您沟通，请注意接听。医生逾期未回复您，您可选择继续等待或
                  <text
                    class="blue"
                    @click="handleRefund(item.content.order_sn, item.content.reservation_time)"
                    >申请退款</text
                  >
                  ,在开始沟通前，您需要先
                  <text class="blue" @click="goList">完善咨询资料</text>
                  。
                </block>
                <block v-else-if="item.content.type == 5">
                  您已成功购买
                  <text class="blue">视频咨询服务</text>
                  ，医生将在{{
                    item.content.reservation_time
                  }}开始与您沟通，请注意接听。医生逾期未回复您，您可选择继续等待或
                  <text
                    class="blue"
                    @click="handleRefund(item.content.order_sn, item.content.reservation_time)"
                    >申请退款</text
                  >
                  , 在开始沟通前，您需要先
                  <text class="blue" @click="goList">完善咨询资料</text>
                  。
                </block>

                <block v-else-if="item.content.type == 10">
                  您已成功购买
                  <text class="blue">快速图文咨询服务</text>
                  ，{{
                    item.content.doctorname
                  }}医生将在48h内与您沟通，逾期未回复您，您可选择继续等待或
                  <text
                    class="blue"
                    @click="handleRefund(item.content.order_sn, item.content.reservation_time)"
                    >申请退款</text
                  >
                  , 为了帮助医生更准确的了解您的病情，您需要先
                  <text class="blue" @click="goList">完善咨询资料</text>
                  。
                </block>
              </view>
              <view class="text-box" v-else-if="item.content.type == 8">
                {{ item.content.title_user }}
              </view>
              <view class="text-box" v-else-if="item.content.type == 9">
                {{ item.content.title_user }}
              </view>

              <view v-else-if="item.content.type == 7" />
              <view class="text-box" v-else>{{ item.content.content }}</view>
            </block>

            <block v-else>
              <view :class="item.messageDirection == 1 ? 'right' : ''" class="message-box">
                <!-- 头像 -->
                <image
                  class="avatar-img"
                  :src="item.content.user.portrait || assetsLink + '/assets/avatar@2x.png'"
                  mode="aspectFill"
                  binderror="onAvatarError"
                  data-index="{{index}}"
                />
                <!-- 咨询信息 -->
                <view
                  class="message-cont patient-info"
                  v-if="item.messageType === 'MYZX:WzMsg'"
                  @click="goInquiryInfo(item.content.order_sn)"
                >
                  <view class="type-box">
                    <image
                      class="type-img"
                      :src="assetsLink + '/assets/doctor-home/text_inquiry@2x.png'"
                      v-if="item.content.type == 0"
                    />
                    <image
                      class="type-img"
                      :src="assetsLink + '/assets/doctor-home/call_inquiry@2x.png'"
                      v-if="item.content.type == 1"
                    />
                    <image
                      class="type-img"
                      :src="assetsLink + '/assets/doctor-home/video_inquiry@2x.png'"
                      v-if="item.content.type == 2"
                    />
                    <view class="title-box">
                      <view class="title">{{ item.content.title }}</view>
                      <view class="date">{{
                        item.content.type == 1 || item.content.type == 2
                          ? item.content.dial_time
                          : item.content.time
                      }}</view>
                    </view>
                  </view>
                  <view class="item-box border-1px">
                    <text class="label">患者</text>
                    <text class="value"
                      >{{ item.content.username }}（{{ item.content.sex }}
                      {{ item.content.age }}）</text
                    >
                  </view>
                  <view class="item-box flex-column">
                    <view class="label">病情描述</view>
                    <view class="value ellipsis-3">{{ item.content.desc || '' }}</view>
                  </view>
                  <button class="button" type="primary">查看咨询单</button>
                </view>
                <!-- 检查检验 -->
                <view
                  class="message-cont patient-info patient-info-spc"
                  v-if="item.messageType === 'MYZX:TreatmentMessage'"
                  data-ordersn="{{patientInfo.patient_id}}"
                  @click.stop="goInquiryJian"
                >
                  <!-- item.content.id -->
                  <view class="item-box border-1px item-box-spc">
                    <!-- <text class="label">患者</text> -->
                    <!-- （{{item.content.sex}} {{item.content.age}}） -->
                    <text class="value">{{ item.content.content }}</text>
                  </view>
                  <!-- <view class="item-box flex-column">
              <view class="label">病情描述</view>
              <view class="value ellipsis-3">{{item.content.desc || ''}}</view>
            </view> -->
                  <button class="button" type="primary">查看检查检验</button>
                </view>
                <!-- 我的问诊单 -->
                <view
                  class="message-cont patient-info"
                  v-else-if="item.messageType === 'MYZX:WzOrderMsg'"
                  @click="goInquiryForm(item.content.order_sn)"
                >
                  <view class="type-box">
                    <image
                      class="type-img"
                      :src="assetsLink + '/assets/doctor-home/text_inquiry@2x.png'"
                      v-if="item.content.type == 0"
                    />
                    <image
                      class="type-img"
                      :src="assetsLink + '/assets/doctor-home/call_inquiry@2x.png'"
                      v-if="item.content.type == 1"
                    />
                    <image
                      class="type-img"
                      :src="assetsLink + '/assets/doctor-home/video_inquiry@2x.png'"
                      v-if="item.content.type == 2"
                    />
                    <view class="title-box">
                      <view class="title">我的咨询单</view>
                      <view class="date">{{ item.content.time }}</view>
                    </view>
                  </view>
                  <view class="item-box border-1px">
                    <text class="label">患者</text>
                    <text class="value"
                      >{{ item.content.username }}（{{ item.content.sex }}
                      {{ item.content.age }}）</text
                    >
                  </view>
                  <view class="btn">
                    <text class="label">{{ item.content.content }}</text>
                  </view>
                </view>
                <!-- 处方 -->
                <view
                  class="message-cont patient-info "
                  :class="item.content.status == 0 ? 'disabled' : ''"
                  v-else-if="item.messageType === 'MYZX:CureMsg'"
                  @click="goDrugOrder(item.content.status, item.content.order_sn)"
                >
                  <view class="type-box">
                    <image
                      class="type-img"
                      :src="assetsLink + '/assets/doctor-home/text_inquiry@2x.png'"
                      v-if="item.content.type == 0"
                    />
                    <image
                      class="type-img"
                      :src="assetsLink + '/assets/doctor-home/call_inquiry@2x.png'"
                      v-if="item.content.type == 1"
                    />
                    <image
                      class="type-img"
                      :src="assetsLink + '/assets/doctor-home/video_inquiry@2x.png'"
                      v-if="item.content.type == 2"
                    />
                    <view class="title-box">
                      <view class="title">{{ item.content.title }}</view>
                      <view class="date">{{ item.content.time }}</view>
                    </view>
                  </view>
                  <view class="item-box border-1px">
                    <text class="label">患者</text>
                    <text class="value"
                      >{{ item.content.patient_name }}（{{ item.content.patient_sex }}
                      {{ item.content.patient_age }}）</text
                    >
                  </view>
                  <view class="item-box border-1px">
                    <text class="label">诊断</text>
                    <text class="value ellipsis-2">{{ item.content.diagnose }}</text>
                  </view>
                  <view class="item-box">
                    <view class="label">{{
                      item.content.status == 0
                        ? '医生已撤回处方，调理方案不可购买'
                        : '根据方案购买、服药，并按时复诊'
                    }}</view>
                  </view>
                  <button class="button" type="primary">点击查看并支付>></button>
                </view>
                <!-- 更新类消息 -->
                <view class="message-cont" v-else-if="item.messageType == 'MYZX:UpdateMsg'">
                  <view
                    class="content blue"
                    v-if="item.content.title == '请完善咨询资料'"
                    @click="goUploadCaseList(item.content.order_sn)"
                    >{{ item.content.title }}
                  </view>
                  <view class="content blue" v-else @click="goUploadCase(item.content.order_sn)"
                    >{{ item.content.title_user }}
                  </view>
                  <view
                    class="content"
                    v-if="item.content.type == 2"
                    @click="goUploadCase(item.content.order_sn)"
                  >
                    我的病历资料已更新请您
                    <text class="blue">点击查看>></text>
                  </view>
                </view>
                <!-- 电话咨询完成 -->
                <block v-else-if="item.messageType == 'MYZX:WzCallRecordMsg'">
                  <view class="message-cont">
                    <image :src="assetsLink + '/assets/call@2x.png'" class="image-tel" />
                    {{ item.content.content }}
                  </view>
                  <view
                    class="tell-play"
                    @click.stop="onAudioStart"
                    :data-isplay="item.isPlay"
                    :data-src="item.content.url"
                    :data-index="index"
                  >
                    <image
                      :src="assetsLink + '/assets/play@2x.png'"
                      class="image-play"
                      v-if="!item.isPlay"
                    />
                    <image
                      :src="assetsLink + '/assets/stop@2x.png'"
                      class="image-play"
                      v-else
                    ></image>
                    回听
                  </view>
                </block>
                <!-- 视频咨询完成 -->
                <view class="message-cont" v-else-if="item.messageType == 'MYZX:WzVideoRecordMsg'">
                  <image :src="assetsLink + '/assets/video@2x.png'" class="image-tel" />
                  {{ item.content.content }}
                </view>
                <!-- 图片 -->
                <view
                  class="message-cont"
                  v-else-if="item.messageType == 'RC:ImgMsg'"
                  style="background: transparent;"
                >
                  <image
                    class="image-img"
                    :src="'data:image/png;base64,' + item.content.content"
                    mode="aspectFit"
                    @click.stop="onPreviewImage"
                    data-imageuri="{{item.content.imageUri}}"
                    :style="`width: ${item.content.width}rpx; height: ${item.content.height}rpx`"
                  />
                </view>
                <!-- 语音 -->
                <view
                  class="message-cont"
                  v-else-if="item.messageType == 'RC:HQVCMsg' || item.messageType == 'RC:VcMsg'"
                >
                  <view
                    class="audio-box"
                    @click.stop="onAudioStart"
                    :data-isplay="item.isPlay"
                    :data-src="item.content.remoteUrl"
                    :data-index="index"
                  >
                    <view class="speech-bar" :class="item.isPlay ? 'pressed' : ''">
                      <view class="speaker-box">
                        <view class="speaker1" />
                        <view class="speaker2" />
                        <view class="speaker3" />
                      </view>
                    </view>
                    <text class="audio-text">{{ item.content.duration }}"</text>
                  </view>
                </view>
                <!-- 其他 -->
                <text class="message-cont" v-else>{{ item.content.content }}</text>
              </view>
            </block>
          </view>
        </block>
        <view id="messageBottom" />
      </view>
    </scroll-view>

    <view class="footer-box" v-if="dataRef.status == 2 || dataRef.status == 3">
      <image class="image" :src="assetsLink + '/assets/image@2x.png'" @click="onSendImage" />
      <view class="input-box">
        <input
          v-model="dataRef.value"
          placeholder="输入文字开始对话"
          cursor-spacing="10"
          confirm-hold
          confirm-type="send"
          bindinput="onInput"
          bindfocus="onFocus"
          bindblur="onBlur"
          bindconfirm="onConfirm"
        />
        <!-- <textarea value="{{value}}" placeholder="输入文字开始对话" cursor-spacing="10" confirm-hold confirm-type="return" bindinput="onInput"
      bindfocus="onFocus" bindblur="onBlur" bindconfirm="onConfirm" show-confirm-bar="{{false}}" auto-height hold-keyboard fixed></textarea> -->
      </view>
      <button type="primary" size="mini" class="button button-mini" @click="onSend">发送</button>
    </view>
    <view class="footer-box" v-if="dataRef.status == 4 && dataRef.doctorInfo.doctor_id">
      <button
        type="primary"
        class="button"
        @click="goDoctorHome()"
        style="flex: 1; margin: 0 30rpx;"
      >
        点此复诊
      </button>
    </view>

    <canvas
      canvas-id="canvas"
      :style="{
        width: dataRef.cWidth + 'px',
        height: dataRef.cHeight + 'px',
        position: 'absolute',
        left: '-1000px',
        top: '-1000px',
      }"
    />
  </view>
</template>

<script setup lang="ts">
import config from '../../../config/config'
import { reactive, ref, nextTick } from 'vue'
import { onLoad, onShow, onResize, onUnload, onHide } from '@dcloudio/uni-app'
import Api from '../../../api/index'
import cache from '../../../utils/auth'
import im from '../../../utils/im'
import utils from '../../../utils/util'
import events from '../../../utils/events'
import * as RongIMLib from '@rongcloud/imlib-v4'
const title = ref('Hello')
const assetsLink = config.assetsLink
const dataRef = <any>reactive({
  type: 2, // 问诊订单类型 1.快速图文 2.定向图文 3.定向电话 4.定向视频
  order_sn: <any>'',
  typeText: '',
  userInfo: null,
  orderInfo: null,
  doctorInfo: null,
  patientInfo: null,
  payInfo: null,
  targetId: '',
  status: <any>null, // 订单状态 -1.待支付 0.待抢单 1.待接诊 2.待问诊（就是待看诊）3.问诊中 4.已结束
  refundStatus: null, // 退款状态 0.正常订单 1.退款中 2.已退款
  messageList: [],
  hasMore: true,
  timestamp: 0,
  loading: 'loadmore',
  value: '',
  scrollViewHeight: 0,
  scrollIntoView: '',
  scrollWithAnimation: true,
  showWzOrder: false, // 是否填写问诊单
  currentOrderSn: '',
  _chooseTempFiles: [],
  _innerAudioContext: null,
  _index: null,
  room_id: '', // 腾讯会议房间ID
  isHungup: false, //是否挂断状态
})

onLoad((options) => {
  // console.log('onLoad', options)

  dataRef.order_sn = options.order_sn
  dataRef.userInfo = cache.getUserCf()
  // dataRef.options = options
  initListen()
  if (cache.getConnect()) {
    getMessageList()
    // onReceiveVideo()
  } else {
    im.connect()
  }
  initInnerAudioContext()
})

onShow(() => {
  getOrderDetail()
})

onHide(() => {})
/**
 * 生命周期函数--监听页面卸载
 */
onUnload(() => {
  removeListen()
  if (dataRef._innerAudioContext) dataRef._innerAudioContext.stop()
  im.ReqMsgSync(dataRef.targetId)
  // im.Call.destroy();
  cache.removeMessageUser()
})

const getOrderDetail = async () => {
  const { code, data } = await Api.inquiry.getWzOrderDetail({ order_sn: dataRef.order_sn })
  console.log(data)
  if (code == 200) {
    // if (data.preliminary_data != 1 && data.order_infos.refund_status == 0) {
    //   uni.redirectTo({
    //     url: `/pages/im-inquiry/info/material/index?order_sn=${dataRef.order_sn}`,
    //   })
    //   return
    // }

    dataRef.status = data.order_infos.order_status
    dataRef.refundStatus = data.order_infos.refund_status
    dataRef.targetId = data.ry_room
    dataRef.type = data.type
    dataRef.typeText =
      data.type == 1 || data.type == 2 ? '图文咨询' : data.type == 3 ? '电话咨询' : '视频咨询'
    dataRef.orderInfo = data.order_infos
    dataRef.doctorInfo = data.doctor_infos
    dataRef.patientInfo = data.patient_infos
    dataRef.payInfo = data.pay_infos
    dataRef.room_id = data.room_id

    uni.setNavigationBarTitle({
      title: `与${data?.doctor_infos?.doctor_name}医生的对话`,
    })

    if (data.is_send_default_wz == 1 && data.interrogation_single == 0) {
      setWzListData(data.order_sn, true)
    } else {
      const wzOrder = cache.getShowWzList()
      setWzListData(data.order_sn, wzOrder && wzOrder[data.order_sn] ? true : false)
    }

    // 医生未接诊
    if (!(data.doctor_infos && data.doctor_infos.doctor_id)) {
      uni.showToast({
        title: '正在等待医生接诊',
        icon: 'none',
        duration: 2000,
      })
    }

    //    医生第一次发送消息给患者 0.医生未发消息 1.医生已发消息患者未读 2.医生已发消息患者已读
    if (data.message_first_doctor_send_user == 1) {
      await Api.inquiry.updateWzStatus({ order_sn: dataRef.order_sn })
    }

    try {
      const { code, data } = await Api.inquiry.getRoomStatus({ order_sn: dataRef.order_sn })
      if (data.is == 1) {
        dataRef.isHungup = true
      } else {
        dataRef.isHungup = false
      }
    } catch (error) {
      console.log(error)
      dataRef.isHungup = false
    }
  } else {
  }
}

const initListen = () => {
  events.listen('connect', () => {
    getMessageList()
    // this.onReceiveVideo()
  })
  events.listen('message', (message) => {
    receiveMessage(message)
  })
  events.listen('wzOrderMsg', (ordersn) => {
    // 患者填写完咨询单
    sendMessage(
      'MYZX:WzOrderMsg',
      {
        type: 0,
        title: '咨询单已填写完成',
        title_user: '咨询单已填写完成',
        time: utils.formatDate(new Date().getTime(), ''),
        username: dataRef.patientInfo.patient_name,
        patient_id: dataRef.patientInfo.patient_id,
        sex: dataRef.patientInfo.sex == 0 ? '女' : '男',
        age: dataRef.patientInfo.age,
        order_sn: ordersn,
        content: '已填写完成，点击查看>>',
      },
      ''
    )
    setWzListData(ordersn, false)
  })
  events.listen('updateCaseMsg', (ordersn) => {
    console.log('ordersn', ordersn)
    sendMessage(
      'MYZX:UpdateMsg',
      {
        type: 2,
        title: '病历资料已更新',
        title_user: '病历资料已更新',
        content: '我的病历资料已更新请您 点击查看>>',
        order_sn: ordersn,
      },
      ''
    )
  })
}
const removeListen = () => {
  events.remove('connect', '')
  events.remove('message', '')
  events.remove('wzOrderMsg', '')
  events.remove('updateCaseMsg', '')
}

const setWzListData = (order_sn: string, val: boolean) => {
  cache.setShowWzList(order_sn, val)
  dataRef.showWzOrder = val
  dataRef.currentOrderSn = order_sn
  nextTick(() => {
    getScrollViewHeight()
  })
}

const receiveMessage = async (message: any) => {
  const { messageType, targetId, messageUId } = message
  if (messageType === 'RC:TxtMsg') {
    const type = message.content.type
    if (type == 1009) {
      JoinRoom()
    }
  }
  console.log(dataRef.targetId)
  if (targetId !== dataRef.targetId) {
    return
  }
  if (messageType === 'MYZX:DefaultMsg') {
    const type = message.content.type
    if (type === 1) {
      // 医生提醒患者填写咨询单
      setWzListData(message.content.order_sn, true)
    } else if (type === 2 || type === 6) {
      // 2.咨询已结束 6.退款成功
      dataRef.status = 4
    } else if (type === 7 && message.content.order_sn == dataRef.order_sn) {
      // 医生首次回复
      dataRef.status = 3
      nextTick(() => {
        getScrollViewHeight()
      })
    } else if (type == 1010) {
      dataRef.isHungup = false
    } else if (type == 9) {
      setTimeout(() => {
        JoinRoom()
      }, 2000)
    }
  }
  const isHas = dataRef.messageList.find((item: any) => item.messageUId === messageUId)
  if (!isHas) {
    const newMessage = await formatMessage(message)
    dataRef.messageList = dataRef.messageList.concat([newMessage])
    dataRef.scrollWithAnimation = true
    dataRef.scrollIntoView = 'messageBottom'
  }
}

const sendMessage = (messageType: string, data: any, directionalUserIdList: any) => {
  return new Promise(async (resolve: any, reject: any) => {
    if (dataRef.status == 1) {
      uni.showToast({
        title: '暂无医生接诊，无法发送消息',
        icon: 'none',
      })
      return
    }

    if (!messageType) {
      messageType = RongIMLib.MESSAGE_TYPE.TEXT
    }

    let content = {
      content: dataRef.value,
      ...data,
    }
    try {
      const message = await im.send(
        dataRef.targetId,
        RongIMLib.CONVERSATION_TYPE.GROUP,
        messageType,
        content,
        directionalUserIdList
      )
      const newMessage = await formatMessage(message)
      dataRef.value = ''
      dataRef.messageList = dataRef.messageList.concat([newMessage])
      dataRef.scrollWithAnimation = true
      dataRef.scrollIntoView = ''
      nextTick(() => {
        dataRef.scrollIntoView = 'messageBottom'
      })

      resolve()
    } catch (error) {
      if (error?.code == 22406) {
        uni.showToast({
          title: '不在群组里',
          icon: 'none',
        })
      }
      reject(error)
    }
  })
}

const getMessageList = async () => {
  if (dataRef.loading !== 'loadmore') {
    return
  }
  dataRef.loading = 'loading'
  let timestamp = dataRef.timestamp
  setTimeout(async () => {
    try {
      const res: any = await im.getMessages(
        dataRef.targetId,
        RongIMLib.CONVERSATION_TYPE.GROUP,
        timestamp,
        ''
      )
      let list: any = []
      for (const key in res.list) {
        if (Object.hasOwnProperty.call(res.list, key)) {
          const element = res.list[key]
          const data = await formatMessage(element)
          list.push(data)
        }
      }

      dataRef.messageList = list.concat(dataRef.messageList)
      dataRef.hasMore = res.hasMore
      dataRef.timestamp = list.length ? list[0].sentTime : 0
      dataRef.loading = !res.hasMore ? 'nomore' : 'loadmore'

      if (timestamp === 0) {
        dataRef.scrollIntoView = ''
        nextTick(() => {
          dataRef.scrollIntoView = 'messageBottom'
        })
      } else {
        dataRef.scrollIntoView = ''
        nextTick(() => {
          dataRef.scrollIntoView = list.length
            ? `message-item-${list[list.length - 1].messageUId}`
            : ''
        })
      }
    } catch (error) {
      console.log(error)
      dataRef.loading = 'nomore'
    }
  }, 1000)
}
const formatMessage = async (message: any) => {
  return new Promise(async (resolve: any, reject: any) => {
    let newMessage = Object.assign({}, message)
    // 格式化头像
    const senderUserId = message?.senderUserId
    if (message.messageDirection == 1) {
      const userCf = cache.getUserCf()
      newMessage.content.user = {
        id: senderUserId,
        name: userCf.nickname,
        portrait: userCf.avatar,
      }
    } else {
      let messageUser = cache.getMessageUser()
      const user = messageUser ? messageUser[senderUserId] : null
      if (user) {
        newMessage.content.user = user
      } else {
        try {
          const { code, data } = await Api.inquiry.getRyUserInfo({ user_id: senderUserId })
          if (code == 200) {
            newMessage.content.user = {
              id: senderUserId,
              name: data.userName,
              portrait: data.userPortrait,
            }
            let obj = Object.assign({}, messageUser)
            obj[senderUserId] = newMessage.content.user
            cache.setMessageUser(obj)
          }
        } catch (error) {
          console.log(error)
        }
      }
    }
    // 格式化日期
    newMessage.sentTimeFormat = utils.formatTimeSolt(newMessage.sentTime)
    // 格式化图片宽高
    if (message.messageType == 'RC:ImgMsg') {
      try {
        const res: any = await getImageInfo(message.content.imageUri)
        let ratio = 2
        let width = res.width
        let height = res.height
        while (width > 200 || height > 200) {
          // 保证宽高在200以内
          width = Math.trunc(res.width / ratio)
          height = Math.trunc(res.height / ratio)
          ratio++
        }
        newMessage.content.width = width
        newMessage.content.height = height
      } catch (error) {}
    }
    resolve(newMessage)
  })
}

const getScrollViewHeight = () => {
  const query: any = uni.createSelectorQuery()
  query.select('.navbar-box').boundingClientRect()
  query.select('.tips-box').boundingClientRect()
  query.select('.footer-box').boundingClientRect()
  query.exec((res) => {
    const navbarHeight = res[0] ? res[0].height : 0
    const tipsHeight = res[1] ? res[1].height : 0
    const footerHeight = res[2] ? res[2].height : 0
    const windowHeight = uni.getSystemInfoSync().windowHeight
    const height = windowHeight - navbarHeight - tipsHeight - footerHeight
    dataRef.scrollViewHeight = height
  })
}

// 滚动到顶部时触发
const onScrolltoupper = () => {
  console.log('onScrolltoupper')
  // if (this.data.timestamp == 0) {
  //   return
  // }
  dataRef.scrollWithAnimation = false
  getMessageList()
}

const getImageInfo = (src: any) => {
  return new Promise((resolve, reject) => {
    uni.getImageInfo({
      src,
      // encoding: 'base64', //编码格式
      success: resolve,
      fail: reject,
    })
  })
}
const onPreviewImage = (e) => {
  const imageUri = e.currentTarget.dataset.imageuri
  let previewImages: any = []
  dataRef.messageList.map((item: any) => {
    if (item.messageType === RongIMLib.MESSAGE_TYPE.IMAGE) {
      previewImages.push(item.content.imageUri)
    }
  })
  const current = previewImages.find((item: any) => item === imageUri)
  uni.previewImage({
    current,
    urls: previewImages,
  })
}

const goDrugOrder = (status, order_sn) => {
  console.log()
  if (status == 0) return
  uni.navigateTo({
    url: `/pages/my-center/drug-orders/newdetail/index?id=${order_sn}`,
  })
}

const goUploadCase = (ordersn: any) => {
  // const order_sn = e.currentTarget.dataset.ordersn
  uni.navigateTo({
    url: `/pages/im-inquiry/info/upload/index?order_sn=${ordersn}`,
  })
}

const goUploadCaseList = (ordersn: any) => {
  // const order_sn = e.currentTarget.dataset.ordersn
  uni.navigateTo({
    url: `/pages/im-inquiry/info/material/index?order_sn=${ordersn}`,
  })
}

const goList = () => {
  uni.redirectTo({
    url: `/pages/im-inquiry/info/material/index?order_sn=${dataRef.order_sn}`,
  })
}

const goInquiryInfo = (ordersn) => {
  uni.navigateTo({
    url: `/pages/im-inquiry/info/see-info/index?order_sn=${ordersn}`,
  })
}

const goInquiryForm = (ordersn) => {
  uni.navigateTo({
    url: `/pages/im-inquiry/info/interrogation-single/index?order_sn=${ordersn}&sourceType=1`,
  })
}

const goDoctorHome = async () => {
  try {
    await Api.inquiry.visitOper({ order_sn: dataRef.order_sn })
    window.location.href = `${config.reset_link}/doctor/${dataRef.doctorInfo.doctor_wap_id}`
  } catch (error) {
    console.log(error)
  }
}

// 申请退款

const handleRefund = async (order_sn: any, dialtime: any) => {
  console.log(order_sn, dialtime, '---')
  uni.showLoading({
    title: '加载中',
  })

  try {
    const { data, code, message } = await Api.inquiry.getWzRefund({ order_sn })
    uni.hideLoading()

    if (code == 200) {
      // 退款订单状态 1. 医生未回复任何消息2. 如图文咨询，在患者购买咨询成功48小时内 3. 电话视频咨询，还未到达预约时间4. 图文咨询已经超过48小时，电话视频咨询超过预约时间5. 医生已经回复：图文咨询，电话咨询6. 如已退款或退款中，再次点击申请退款
      const status = data.refund_order_status
      if (status == 2) {
        uni.showModal({
          content: '医生将在48小时内与您沟通，确定退款吗？',
          confirmText: '确定退款',
          success: (res) => {
            if (res.confirm) {
              uni.navigateTo({
                url: `/pages/im-inquiry/refund/index?order_sn=${order_sn}`,
              })
            } else if (res.cancel) {
            }
          },
        })
      } else if (status == 3) {
        uni.showModal({
          content: `医生将在${dialtime}开始与您沟通，确定退款吗？`,
          confirmText: '确定退款',
          success: (res) => {
            if (res.confirm) {
              uni.navigateTo({
                url: `/pages/im-inquiry/refund/index?order_sn=${order_sn}`,
              })
            } else if (res.cancel) {
            }
          },
        })
      } else if (status == 4) {
        uni.navigateTo({
          url: `/pages/im-inquiry/refund/index?order_sn=${order_sn}`,
        })
      } else if (status == 5) {
        uni.showModal({
          content: '医生已跟您沟通过了，暂不支持退款哦！如需继续退款请联系客服：400-8007202',
          showCancel: false,
        })
        // wx.showToast({
        //   title: '医生已跟您沟通过了，暂不支持退款哦！如需继续退款请联系客服。',
        //   icon: 'none',
        //   duration: 2000,
        // })
      } else if (status == 6) {
        uni.navigateTo({
          url: `/pages/im-inquiry/refund/index?order_sn=${order_sn}`,
        })
      }
    }
  } catch (error) {
    uni.hideLoading()
    console.log(error)
  }
}

const onSend = () => {
  if (!dataRef.value) {
    return
  }
  sendMessage()
}
const onSendImage = () => {
  dataRef._chooseTempFiles = []
  uni.chooseImage({
    count: 9,
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    success: async (res) => {
      uni.showLoading()
      const tempFiles: any = res.tempFiles
      for (let i = 0; i < tempFiles.length; i++) {
        const { downloadUrl } = await im.upload(tempFiles[i], RongIMLib.FILE_TYPE.IMAGE)
        const tempFilePath = await compressImage(tempFiles[i].path)
        const data = imageToBase64(tempFilePath)
        sendMessage(
          RongIMLib.MESSAGE_TYPE.IMAGE,
          {
            imageUri: downloadUrl,
            content: data,
          },
          ''
        )

        dataRef._chooseTempFiles = dataRef._chooseTempFiles.concat([downloadUrl])
        if (dataRef._chooseTempFiles.length === tempFiles.length) {
          uni.hideLoading()
        }
      }
    },
  })
}

const JoinRoom = async () => {
  const { data, code, message } = await Api.inquiry.getCanYouEnterRoom({
    order_sn: dataRef.order_sn,
  })
  if (code === 200) {
    let mpUrl = `/pages/inquiry/inquiry/inquiry?isToH5=1&order_sn=${dataRef.order_sn}`
    window.location.href = `https://cloud1-5g80ysht3e049128-1306117587.tcloudbaseapp.com/h5/jump-mp.html?sign=047e33b549a034725a9760fd3f5deebd&t=1644572774&mpUrl=${encodeURIComponent(
      mpUrl
    )}`
  } else {
    uni.showToast({
      title: message,
      icon: 'none',
      duration: 2000,
    })
    dataRef.isHungup = false
  }
}

const compressImage = (src) => {
  return new Promise((resolve, reject) => {
    uni.getImageInfo({
      src,
      success: (res) => {
        // 利用canvas压缩图片
        let ratio = 2
        let canvasWidth = res.width // 图片原始长宽
        let canvasHeight = res.height
        while (canvasWidth > 200 || canvasHeight > 200) {
          // 保证宽高在200以内
          canvasWidth = Math.trunc(res.width / ratio)
          canvasHeight = Math.trunc(res.height / ratio)
          ratio++
        }
        dataRef.cWidth = canvasWidth
        dataRef.cHeight = canvasHeight

        // 绘制图形并取出图片路径
        var ctx = uni.createCanvasContext('canvas')
        ctx.drawImage(res.path, 0, 0, canvasWidth, canvasHeight)
        ctx.draw(
          false,
          <any>setTimeout(() => {
            uni.canvasToTempFilePath({
              canvasId: 'canvas',
              destWidth: canvasWidth,
              destHeight: canvasHeight,
              success: (res) => {
                resolve(res.tempFilePath)
                console.log(res.tempFilePath) // 最终图片路径
              },
              fail: (res) => {
                reject(res)
                console.log(res.errMsg)
              },
            })
          }, 100)
        )
      },
    })
  })
}
const imageToBase64 = (filePath) => {
  return filePath.substring(22)
}

// 播放语音
const initInnerAudioContext = () => {
  const innerAudioContext = uni.createInnerAudioContext()
  dataRef._innerAudioContext = innerAudioContext
  innerAudioContext.onPlay(() => {
    console.log('onPlay')
    setIsPlay(true)
  })
  innerAudioContext.onPause(() => {
    console.log('onPause')
    setIsPlay(false)
  })
  innerAudioContext.onEnded(() => {
    console.log('onEnded')
    setIsPlay(false)
  })
  innerAudioContext.onError((res) => {
    console.log(res)
  })
}
const onAudioStart = (e) => {
  // console.log(e)
  const innerAudioContext = dataRef._innerAudioContext
  const index = e.currentTarget.dataset.index
  const src = e.currentTarget.dataset.src
  const isplay = e.currentTarget.dataset.isplay || false
  if (isplay) {
    // console.log(innerAudioContext)
    innerAudioContext.pause()
    return
  }

  if (index != dataRef._index) {
    // 不是同一个语音
    innerAudioContext.stop()
  }
  setIsPlay(false)
  console.log(index)
  dataRef._index = index

  innerAudioContext.src = src
  // innerAudioContext.src = 'http://music.163.com/song/media/outer/url?id=1372060183.mp3'
  innerAudioContext.play()
}
const setIsPlay = (value) => {
  if (dataRef._index != null) {
    dataRef.messageList[dataRef._index].isPlay = value
  }
}
</script>

<style>
.container {
  /* display: flex;
  flex-direction: column;
  height: 100vh; */
}

.navbar-box {
  /* position: fixed;
  top: 0;
  left: 0;
  right: 0; */
  height: 50rpx;
  /* z-index: 10; */
  background: #fff;
  text-align: center;
}

.my-loading {
  padding: 30rpx 0;
  background: #f4f6f7;
}

.message-wrap {
  height: calc(100vh - 120rpx);
  flex: 1;
  background-color: #f4f6f7;
}

.tag {
  display: inline-block;
  vertical-align: top;
  padding: 5rpx 15rpx;
  background: #fef0e8;
  border-radius: 8rpx;
  font-size: 24rpx;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 700;
  text-align: center;
  color: #f86e21;
  line-height: 33rpx;
}

.navbar-cont {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50rpx;
  margin-top: -10rpx;
}

.navbar-cont .text {
  font-size: 24rpx;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  text-align: justify;
  color: #666666;
  line-height: 33rpx;
  margin-right: 20rpx;
}

.tips-box {
  /* position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10; */
  position: relative;
  padding: 10rpx 30rpx;
  background: #fef0e8;
  font-size: 28rpx;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  text-align: center;
  color: #666666;
  line-height: 40rpx;
  transition: all 0.3s linear;
}

.tips-box .yellow {
  color: #f86e21;
}

.tips-box .blue {
  color: #1890ff;
}

.tips-box .title {
  font-size: 32rpx;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 700;
  text-align: left;
  color: #f86e21;
  line-height: 45rpx;
}

.tips-box .text {
  font-size: 28rpx;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  text-align: left;
  color: #999999;
  line-height: 40rpx;
}

.tips-box .btn-text {
  position: absolute;
  right: 0rpx;
  top: 0rpx;
  color: #1890ff;
  padding: 30rpx;
}

.date {
  text-align: center;
  color: #999;
  line-height: 33rpx;
  font-size: 24rpx;
  margin-bottom: 20rpx;
}

.message-list {
  text-align: center;
  padding: 50rpx 30rpx;
}

.message-item {
  flex: 1;
  margin-bottom: 50rpx;
}

.message-item:last-child {
  margin-bottom: 0;
}

.message-box {
  display: flex;
  /* margin-top: 50rpx; */
}

.message-box .avatar-img {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  margin-right: 20rpx;
}

.message-cont {
  position: relative;
  max-width: 450rpx;
  padding: 20rpx;
  color: #333;
  font-size: 28rpx;
  line-height: 40rpx;
  background: #fff;
  border-radius: 8rpx;
  word-break: break-word;
  text-align: left;
}

.message-cont.disabled {
  opacity: 0.5;
}

/* .message-cont::after {
  position: absolute;
  content: '';
  top: 22rpx;
  left: -26rpx;
  width: 0;
  height: 0;
  border: 16rpx solid transparent;
  border-top-color: #fff;
  transform: rotate(88deg);
} */

.message-box .image-img {
  display: block;
  width: 240rpx;
  height: 240rpx;
  border-radius: 8rpx;
  margin: -20rpx;
  background: #f4f6f7;
}

.message-box.right {
  flex-direction: row-reverse;
}

.message-box.right .avatar-img {
  margin-right: 0;
  margin-left: 20rpx;
}

.message-box.right .message-cont {
  background: #e7f3ff;
}

/* .message-box.right .message-cont::after {
  left: auto;
  right: -26rpx;
  transform: rotate(-88deg);
  border-top-color: #e7f3ff;
} */

.audio-box {
  display: flex;
  align-items: center;
}

.audio-box text {
  font-weight: 500;
  margin-left: 20rpx;
}
.audio-box .speech-bar {
  /* transform: rotate(180deg) */
}
.audio-box .speaker-box {
  right: 20px;
  left: auto;
}
.speech-bar {
  display: block;
  width: 40rpx;
  height: 40rpx;
  position: relative;
  top: -2px;
}
.speech-bar .speaker-box {
  position: absolute;
  width: 40rpx;
  height: 40rpx;
  left: -20rpx;
}
.speech-bar .speaker1 {
  width: 32rpx;
  height: 32rpx;
  margin: 4rpx 0 0 8rpx;
  border: 2px solid;
  border-radius: 50%;
  opacity: 1;
}
.speech-bar .speaker2 {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 48rpx;
  height: 48rpx;
  margin: -24rpx 0 0 -18rpx;
  border: 2px solid;
  border-radius: 50%;
  opacity: 1;
}
.speech-bar .speaker3 {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 8rpx;
  height: 8rpx;
  margin: -4rpx 0 0 2rpx;
  border: 2px solid;
  border-radius: 50%;
}
.speech-bar .speaker1,
.speech-bar .speaker2,
.speech-bar .speaker3 {
  border-color: transparent #333 transparent transparent;
}
.speech-bar.pressed .speaker1 {
  -webkit-animation: speaker1 1.2s ease-in-out infinite;
}
.speech-bar.pressed .speaker2 {
  -webkit-animation: speaker2 1.2s ease-in-out infinite;
}
@-webkit-keyframes speaker1 {
  0% {
    opacity: 0;
  }
  70%,
  100% {
    opacity: 1;
  }
}
@-webkit-keyframes speaker2 {
  0% {
    opacity: 0;
  }
  20%,
  100% {
    opacity: 1;
  }
}

.patient-info {
  background: #fff !important;
  border-radius: 16rpx;
  padding: 50rpx 0 0 0;
  width: 490rpx;
  max-width: 490rpx;
}
.patient-info-spc {
  padding: 20rpx 0rpx 0rpx 0rpx;
}
.patient-info > view {
  padding: 0 20rpx;
  text-align: left;
}

.patient-info .btn {
  height: 100rpx;
  line-height: 3rem;
  margin: 0 30rpx;
  padding: 0;
}

.patient-info .type-box {
  display: flex;
}

.patient-info .item-box {
  display: flex;
  margin: 0 30rpx;
  padding: 20rpx 0;
}
.patient-info .item-box-spc {
  padding: 10rpx 0rpx 20rpx 0rpx;
}
.patient-info .label {
  color: #999;
  flex: none;
  margin-right: 20rpx;
}

.patient-info .value {
  flex: 1;
}

.patient-info .flex-column {
  flex-direction: column;
}

.patient-info .flex-column .value {
  margin-top: 10rpx;
}

.patient-info .type-img {
  width: 120rpx;
  height: 130rpx;
  margin-right: 10rpx;
}

.patient-info .title-box {
  flex: 1;
}

.patient-info .title {
  margin-bottom: 10rpx;
  font-size: 36rpx;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 700;
  text-align: left;
  color: #333333;
  line-height: 50rpx;
}

.patient-info .date {
  text-align: left;
  font-size: 26rpx;
  color: #999999;
  line-height: 40rpx;
}

.patient-info .button {
  height: 80rpx;
  border-radius: 0 0 16rpx 16rpx;
  font-size: 28rpx;
}

.text-box {
  display: inline-block;
  margin-bottom: 50rpx;
  padding: 20rpx;
  background: #eeeeee;
  border-radius: 8rpx;
  font-size: 24rpx;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  text-align: justify;
  color: #999999;
  line-height: 33rpx;
}

.blue {
  color: #1890ff;
}

.image-tel {
  width: 40rpx;
  height: 40rpx;
  margin-right: 10rpx;
  vertical-align: -10rpx;
}

.tell-play {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10rpx;
  margin-left: 20rpx;
  width: 146rpx;
  height: 60rpx;
  background: #e7f3ff;
  border-radius: 30rpx;
  font-size: 28rpx;
  color: #1890ff;
  line-height: 40rpx;
}

.image-play {
  width: 40rpx;
  height: 40rpx;
  margin-right: 13rpx;
}

.footer-box {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  padding: 20rpx 0;
  /* height: 120rpx; */
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 10;
}

.footer-box .image {
  width: 66rpx;
  height: 66rpx;
  margin-left: 20rpx;
}

.footer-box .input-box {
  flex: 1;
  margin: 0 20rpx;
  background: #f4f6f7;
  border-radius: 8rpx;
  padding: 0 20rpx;
}

.footer-box .input-box input {
  height: 80rpx;
  line-height: 80rpx;
}

.footer-box .input-box textarea {
  width: 100%;
  height: 40rpx;
  padding: 20rpx 0;
  max-height: 180rpx;
  /* line-height: 80rpx; */
}

.footer-box .button-mini {
  padding: 20rpx;
  margin-right: 20rpx;
  border-radius: 8rpx;
  font-size: 28rpx;
  line-height: 40rpx;
  transition: all 0.3s linear;
}

.no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 150rpx;
}

.no-data .icon {
  width: 500rpx;
  height: 422rpx;
  margin-bottom: 30rpx;
}

.no-data .text {
  min-width: 224rpx;
  height: 40rpx;
  font-size: 28rpx;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  text-align: center;
  color: #999999;
  line-height: 40rpx;
}

.video-tips-box {
  display: flex;
  align-items: center;
  background-color: #1890ff;
  justify-content: center;
  padding: 10rpx 0;
}

.video-tips-box .title {
  color: #fff;
  font-size: 24rpx;
}

.video-tips-box .btn-text {
  color: #f86e21;
  font-size: 24rpx;
  padding-left: 12rpx;
}
</style>
