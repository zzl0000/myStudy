<template>
  <uni-nav-bar
    left-icon="left"
    :fixed="true"
    title="填写问诊单"
    @clickLeft="onCancel"
  ></uni-nav-bar>
  <view class="container">
    <!-- <mp-navigation-bar title="填写咨询单" background="#fff" bindback="onCancel"></mp-navigation-bar> -->
    <view class="tips-box" v-if="dataRef.sourceType == 1"
      >温馨提示：急性病以当下状况为准，慢性病以近3天的症状为准，认清填写以便医生准确诊疗</view
    >
    <view class="fixed-btn" @click="goInquiry" :style="`width: ${dataRef?.width}rpx`">
      <view>回到 对话</view>
    </view>
    <form class="form-box" @submit="formSubmit">
      <view class="form-item" v-for="(item, index) in dataRef.list" :key="index">
        <view class="title">
          {{ index + 1 }}. {{ item.title }}
          <text>{{ item.is_multi == 1 ? '（多选）' : '（单选）' }}</text>
        </view>
        <radio-group :name="item.id" bindchange="radioChange" v-if="item.is_multi == 0">
          <label v-for="(k, i) in item.options" :key="i">
            <radio :value="k.value" :checked="k.checked" color="#1890ff">{{ k.value }}</radio>
          </label>
        </radio-group>
        <checkbox-group :name="item.id" bindchange="checkboxChange" v-if="item.is_multi == 1">
          <label v-for="(j, i) in item.options" :key="i">
            <checkbox :value="j.value" :checked="j.checked" color="#1890ff">{{ j.value }}</checkbox>
          </label>
        </checkbox-group>
        <!-- <view class="textarea-box" wx:if="{{item.type == 3}}">
      <textarea name="{{item.id}}" maxlength="200" placeholder="{{item.placeholder}}"
        placeholder-style="placeholder-style" ></textarea>
    </view> -->
      </view>
      <view class="footer-box">
        <view class="btn-box">
          <button type="default" class="button" @click="onCancel">稍后填写</button>
        </view>
        <view class="btn-box">
          <button type="primary" class="button" form-type="submit" :disabled="dataRef.disabled">
            提交
          </button>
        </view>
      </view>
    </form>
  </view>
</template>

<script setup lang="ts">
import config from '@/config/config'
import { reactive, ref } from 'vue'
import { onLoad, onShow, onResize } from '@dcloudio/uni-app'
import Api from '@/api'
import events from '@/utils/events'
const assetsLink = config.assetsLink
const dataRef = <any>reactive({
  order_sn: '',
  sourceType: 0, // 来自哪个页面 0=默认发送咨询单，1=查看咨询单，2=补填咨询单
  list: [],
  info: [],
  disabled: false,
})

onLoad((option: any) => {
  dataRef.order_sn = option.order_sn
  dataRef.sourceType = option.sourceType || 0
  dataRef.width = option.sourceType == 1 ? 112 : 0
  getData()
})

const getData = async () => {
  uni.showLoading({ title: '加载中' })
  try {
    const { data, code, message } = await Api.inquiryInfo.getWenZhenDan({
      order_sn: dataRef.order_sn,
    })
    uni.hideLoading()
    if (code == 200) {
      const info = data.info ? JSON.parse(data.info) : []
      const template = data.template || []
      const list = template.map((item) => {
        const options = item.options.map((item1) => {
          const data = info.find((item2) => item2.id == item.id)
          return {
            value: item1,
            checked: data && data.values.includes(item1),
          }
        })
        item.options = options
        return item
      })
      dataRef.info = info
      dataRef.list = list
    }
  } catch (error) {
    uni.hideLoading()
  }
}

const formSubmit = async (e) => {
  // console.log(e)
  if (dataRef.disabled) {
    return
  }

  let formatData = []
  const data = e.detail.value
  for (const key in data) {
    if (Object.hasOwnProperty.call(data, key)) {
      const values = data[key]
      if (Array.isArray(values) && values.length) {
        formatData.push({
          id: key,
          values,
        })
      } else if (typeof values == 'string' && values) {
        formatData.push({
          id: key,
          values: [values],
        })
      }
    }
  }
  if (formatData.length == 0) {
    uni.showToast({
      title: '请至少填写一道题目',
      icon: 'none',
    })
    return
  }

  uni.showLoading({ title: '加载中' })

  dataRef.disabled = true

  let params = {
    order_sn: dataRef.order_sn,
    interrogation_single: JSON.stringify(formatData),
  }
  try {
    const { data, code, message } = await Api.inquiryInfo.getWenZhenDanSave(params)
    uni.hideLoading()
    dataRef.disabled = false
    if (code == 200) {
      if (dataRef.sourceType == 1 || dataRef.sourceType == 2) {
        uni.navigateBack({})
        events.trigger('wzOrderMsg', dataRef.order_sn)
      } else {
        events.trigger('wzOrderMsg', dataRef.order_sn)
        uni.redirectTo({
          url: `/pages/im-inquiry/im/index?order_sn=${dataRef.order_sn}`,
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
    dataRef.disabled = false
    let res: any = error
    console.log(error)
    uni.showToast({
      title: res.message,
      icon: 'none',
    })
  }
}

const onCancel = () => {
  if (dataRef.sourceType == 0) {
    uni.redirectTo({
      url: `/pages/im-inquiry/im/index?order_sn=${dataRef.order_sn}`,
    })
  } else if (dataRef.sourceType == 1) {
    uni.navigateBack({})
  } else if (dataRef.sourceType == 2) {
    uni.navigateBack({})
  }
}

const goInquiry = () => {
  dataRef.width = 0
  uni.navigateBack({})
}
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

page {
  background-color: #fff;
  padding-bottom: 200rpx;
}

.form-box {
  display: flex;
  flex-direction: column;
}

.form-item {
  padding: 0 30rpx;
}

.form-box .title {
  padding: 30rpx 0;
  font-size: 32rpx;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 600;
  text-align: justify;
  color: #333333;
  line-height: 45rpx;
}

.form-box .title text {
  color: #999;
  font-weight: 400;
}

.form-box radio-group {
  margin: -15rpx 0;
}

.form-box label {
  display: inline-block;
  width: 50%;
  margin: 15rpx 0;
}

.form-box radio,
.form-box checkbox {
  /* font-size: 28rpx;
  color: #666666;
  line-height: 40rpx; */
}

.form-box radio[checked],
.form-box checkbox[checked] {
  color: #1890ff;
}

.textarea-box {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 250rpx;
  padding: 20rpx;
  background: #f9f9f9;
  border-radius: 8rpx;
}

.textarea-box .limit {
  text-align: right;
  font-size: 24rpx;
  color: #999999;
  line-height: 33rpx;
  transition: all 0.3s linear;
}

.placeholder-style {
  font-size: 28rpx;
  color: #999999;
}

.footer-box {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 30rpx;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 10;
}

.btn-box {
  flex: 1;
}

.btn-box:nth-of-type(1) {
  margin-right: 20rpx;
}

.tips-box {
  padding: 10rpx 30rpx;
  text-align: center;
  background: #fef0e8;
  font-size: 24rpx;
  color: #f86e21;
  line-height: 33rpx;
}

.fixed-btn {
  position: fixed;
  top: 338rpx;
  right: 0;
  width: 112rpx;
  height: 100rpx;
  background: #fff;
  border-radius: 100rpx 0px 0px 100rpx;
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.1);
  transition: width 0.2s linear;
}

.fixed-btn view {
  box-sizing: border-box;
  width: 80rpx;
  height: 80rpx;
  margin-top: 10rpx;
  margin-left: 12rpx;
  padding: 10rpx 18rpx;
  background: #1890ff;
  border-radius: 50%;
  font-size: 22rpx;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 600;
  text-align: left;
  color: #ffffff;
  line-height: 30rpx;
  text-align: center;
}
</style>
