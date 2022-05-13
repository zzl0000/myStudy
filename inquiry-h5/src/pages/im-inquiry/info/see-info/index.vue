<template>
  <view class="container">
    <view class="navbar-box" v-if="datas">
      <text
        >{{ datas?.sex == 0 ? '女' : '男' }}·{{ datas?.age }}·{{ datas?.province || '暂无' }}</text
      >
      <text class="tag" v-if="typeText">{{ typeText }}</text>
    </view>
    <view class="list-box">
      <view class="list-item border-1px">
        <view class="label">患者身高</view>
        <view class="text">{{ datas?.height || '' }} cm</view>
      </view>
      <view class="list-item border-1px">
        <view class="label">患者体重</view>
        <view class="text">{{ datas?.weight || '' }} kg</view>
      </view>
      <view class="list-item border-1px">
        <view class="label">特殊时期</view>
        <view class="text">{{
          datas?.special_period == 1 ? datas?.special_period_enum : '无'
        }}</view>
      </view>
      <view class="list-item border-1px">
        <view class="label">过敏历史</view>
        <view class="text">{{ datas?.allergy == 1 ? datas?.allergy_text : '无' }}</view>
      </view>
      <view class="list-item border-1px">
        <view class="label">既往病史</view>
        <view class="text">{{
          datas?.medical_history == 1 ? datas?.medical_history_text : '无'
        }}</view>
      </view>
      <view class="list-item border-1px">
        <view class="label">患者自述</view>
        <view class="text">{{ datas?.content || '' }}</view>
      </view>
    </view>
    <view class="list-box">
      <view class="title border-1px">实体医疗机构病历</view>
      <view class="cont">
        <view class="image-box" v-if="datas?.cases_checkdata_imgs.length">
          <image
            :src="item"
            v-for="(item, index) in datas?.cases_checkdata_imgs"
            :key="index"
            @click="onPreviewImage('tongue_face_imgs', item)"
          ></image>
        </view>
        <view class="image-box" wx:else>
          <image :src="assetsLink + '/assets/upload_2@2x.png'"></image>
        </view>
      </view>
    </view>
    <view class="list-box">
      <view class="title border-1px">舌照面照</view>
      <view class="cont">
        <view class="image-box" v-if="datas?.tongue_face_imgs.length">
          <image
            :src="item"
            v-for="(item, index) in datas?.tongue_face_imgs"
            :key="index"
            @click="onPreviewImage('tongue_face_imgs', item)"
          ></image>
        </view>
        <view class="image-box" wx:else>
          <text class="" selectable="false" space="false" decode="false">暂未上传</text>
        </view>
      </view>
    </view>
    <view class="list-box">
      <view class="title border-1px">
        问诊单问题
        <view class="arrows-box" @click="goInquiryForm" v-if="!wzOrder.length">
          补填问诊单
          <image :src="assetsLink + '/assets/arrow-r@2x.png'"></image>
        </view>
      </view>
      <view
        class="list-item wz-order"
        v-show="wzOrder.length"
        v-for="(item, index) in wzOrder"
        :key="index"
      >
        <view class="label">{{ item.title }}</view>
        <view class="text">{{ item.values }}</view>
      </view>
      <view class="list-item" v-if="!wzOrder.length">
        <view class="label">未填写</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import config from '@/config/config'
import { reactive, ref, toRefs } from 'vue'
import { onLoad, onShow, onResize } from '@dcloudio/uni-app'
import Api from '@/api'
const assetsLink = config.assetsLink

const dataRef = <any>reactive({
  order_sn: '',
  datas: null,
  wzOrder: [],
  typeText: '11',
})
const data = reactive({
  cases_checkdata_imgs: [],
  tongue_face_imgs: [],
})

onLoad((option) => {
  dataRef.order_sn = option.order_sn
})

onShow(() => {
  getData()
})

const getData = async () => {
  uni.showLoading({ title: '加载中' })
  try {
    const { data, code, message } = await Api.inquiryInfo.getWenZhenInfo({
      order_sn: dataRef.order_sn,
    })
    if (code == 200) {
      const type = data.info ? data.info.type : null
      dataRef.datas = data.info
      dataRef.wzOrder = data.wz_dan
      dataRef.typeText =
        type == 1 || type == 2 ? '图文' : type == 3 ? '电话' : type == 4 ? '视频' : ''
      uni.setNavigationBarTitle({
        title: data.info.patient_name,
      })
      uni.hideLoading()
    }
  } catch (error) {
    uni.hideLoading()
  }
}

const goInquiryForm = () => {
  uni.navigateTo({
    url: `/pages/im-inquiry/info/interrogation-single/index?order_sn=${dataRef.order_sn}&sourceType=2`,
  })
}

const onPreviewImage = (name, url) => {
  uni.previewImage({
    current: url,
    urls: dataRef.datas[name],
  })
}

const { order_sn, datas, wzOrder, typeText } = toRefs(dataRef)
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.navbar-box {
  position: sticky;
  top: 88rpx;
  left: 0;
  right: 0;
  padding-bottom: 15rpx;
  font-size: 24rpx;
  text-align: justify;
  color: #666666;
  line-height: 33rpx;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.navbar-box .tag {
  margin-left: 20rpx;
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

.list-box {
  margin-top: 20rpx;
  background: #fff;
}

.list-item {
  display: flex;
  margin: 0 30rpx;
  padding: 30rpx 0;
  font-size: 32rpx;
  text-align: justify;
  color: #333;
  line-height: 45rpx;
}

.list-item .label {
  width: 300rpx;
  color: #666666;
}

.list-item .text {
  flex: 1;
}

.list-item.wz-order {
  flex-direction: column;
}

.list-item.wz-order .label {
  width: 100%;
}

.list-item.wz-order .text {
  margin-top: 20rpx;
}

.list-box .title {
  position: relative;
  margin: 0 30rpx;
  padding: 30rpx 0;
  font-size: 36rpx;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 700;
  text-align: justify;
  color: #333333;
  line-height: 50rpx;
}

.list-box .title .arrows-box {
  position: absolute;
  right: -20rpx;
  top: 4rpx;
  padding: 30rpx;
  font-size: 28rpx;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 700;
  text-align: right;
  color: #1890ff;
  line-height: 40rpx;
}

.list-box .title .arrows-box image {
  width: 16rpx;
  height: 25rpx;
  margin-left: 20rpx;
  vertical-align: -2rpx;
}

.list-box .cont {
  margin: 0 30rpx;
  padding: 30rpx 0;
}

.list-box .image-box {
  margin: 0 -10rpx;
}

.list-box .image-box image {
  margin: 0 10rpx;
  width: 158rpx;
  height: 158rpx;
  border-radius: 8rpx;
}
</style>
