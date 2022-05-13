<template>
  <uni-nav-bar
    left-icon="left"
    :fixed="true"
    title="完善问诊资料"
    @clickLeft="onCancel"
  ></uni-nav-bar>
  <view class="container">
    <view class="notice-box">
      <view>提交资料即可开始沟通，否则医生无法收到复诊请求。</view>
    </view>
    <view class="form-box">
      <view class="form-item">
        <view class="label">
          就诊人：
          <text v-if="patientInfo.name"
            >{{ patientInfo.name }}（{{ patientInfo.sex }}·{{ patientInfo.age }}）</text
          >
        </view>
      </view>
      <view class="form-item" style="padding: 0;">
        <view class="input-box">
          <input
            type="number"
            placeholder="身高"
            @input="onInput"
            data-name="height"
            v-model="formData.height"
          />
          <text>cm</text>
        </view>
        <view class="input-box">
          <input
            type="number"
            placeholder="体重"
            @input="onInput"
            data-name="weight"
            v-model="formData.weight"
          />
          <text>kg</text>
        </view>
      </view>
      <view
        class="form-item border-1px"
        @click="selectCity"
        style="padding-top: 50rpx; padding-bottom: 10rpx;"
      >
        <view class="label">当前城市</view>
        <view class="cont">
          <text>{{ formData.province }}{{ formData.city }}{{ formData.area }}</text>
          <image class="right-img" :src="assetsLink + '/assets/arrow-r@2x.png'" />
        </view>
      </view>
      <view class="notice">*请选择当前长居城市，方便医生为您提供精准的服务和诊断</view>
      <view
        class="form-item border-1px"
        @click="onUpdatePhone"
        style="padding-top: 30rpx; padding-bottom: 10rpx;"
      >
        <view class="label">
          <text>{{ formData.patient_phone }}</text>
        </view>
        <view class="cont">
          <text class="active">修改</text>
        </view>
      </view>
      <view class="notice">*用于接听电话和服务通知</view>
      <image class="info-img" :src="assetsLink + '/assets/info@2x.png'" />
      <view class="title border-1px">
        <view>病情描述</view>
      </view>
      <view class="form-item">
        <view class="textarea-box">
          <textarea
            maxlength="500"
            placeholder="请输入病情描述"
            placeholder-style="placeholder-style"
            data-name="content"
            data-size="500"
            data-sizename="contentSize"
            @input="onInput"
            v-model="formData.content"
          />
          <view class="limit">{{ dataRef.contentSize }}/500</view>
        </view>
      </view>
      <block v-if="patientInfo.sex == '女'">
        <view class="title border-1px">
          <view>特殊时期</view>
          <view class="tag-box">
            <view
              :class="formData.special_period == item.id ? 'active' : ''"
              v-for="(item, index) in isOptions"
              :key="index"
              @click="onOptionsChange(item.id, 'special_period')"
            >
              {{ item.name }}
            </view>
          </view>
        </view>
        <view class="form-item border-1px" v-if="formData.special_period == 1">
          <view class="tag-box">
            <view
              :class="formData.special_period_enum == item.name ? 'active' : ''"
              v-for="(item, index) in specialDatesOptions"
              :key="index"
              @click="onOptionsChange(item.name, 'special_period_enum')"
            >
              {{ item.name }}
            </view>
          </view>
        </view>
      </block>
      <view class="title border-1px">
        <view>过敏史</view>
        <view class="tag-box">
          <view
            :class="formData.allergy == item.id ? 'active' : ''"
            v-for="(item, index) in isOptions"
            :key="index"
            @click="onOptionsChange(item.id, 'allergy')"
            >{{ item.name }}</view
          >
        </view>
      </view>
      <view class="form-item border-1px" v-if="formData.allergy == 1">
        <view class="textarea-box">
          <textarea
            maxlength="300"
            placeholder="请填写您的过敏药物，过敏病史"
            placeholder-style="placeholder-style"
            data-name="allergy_text"
            data-size="300"
            data-sizename="allergyTextSize"
            @input="onInput"
            v-model="formData.allergy_text"
          />
          <view class="limit">{{ dataRef.allergyTextSize }}/300</view>
        </view>
      </view>
      <view class="title border-1px">
        <view>既往病史</view>
        <view class="tag-box">
          <view
            :class="formData.medical_history == item.id ? 'active' : ''"
            v-for="(item, index) in isOptions"
            :key="index"
            @click="onOptionsChange(item.id, 'medical_history')"
          >
            {{ item.name }}
          </view>
        </view>
      </view>
      <view class="form-item border-1px" v-if="formData.medical_history == 1">
        <view class="textarea-box">
          <textarea
            maxlength="300"
            placeholder="请填写您的既往病史"
            placeholder-style="placeholder-style"
            data-name="medical_history_text"
            data-size="300"
            data-sizename="medicalHistoryTextSize"
            @input="onInput"
            v-model="formData.medical_history_text"
          />
          <view class="limit">{{ medicalHistoryTextSize }}/300</view>
        </view>
      </view>
      <view class="form-item border-1px">
        <uploader
          title="舌照与面照上传"
          max-count="16"
          tips="*请上传清晰的舌苔和舌底及面部素颜色彩照片"
          @fail="uploadFail"
          @success="uploadSuccess"
          @delete="uploadDelete"
          :files="formData.tongue_face_imgs"
          :imgKey="'tongue_face_imgs'"
          style="width: 100%;"
        />
      </view>
      <view class="form-item">
        <uploader
          :title="'病历及检查资料上传（选填'"
          max-count="16"
          tips="*如有相关的就诊病历、检验报告和化验单，请上传照片，以便医生更精准的为您诊疗。"
          @fail="uploadFail"
          @success="uploadSuccess"
          @delete="uploadDelete"
          :files="formData.cases_checkdata_imgs"
          :imgKey="'cases_checkdata_imgs'"
          style="width: 100%;"
        />
      </view>
      <view class="btn-box">
        <button type="primary" class="button" @click="formSubmit" :disabled="disabled">
          下一步
        </button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import config from '@/config/config'
import { reactive, ref } from 'vue'
import { onLoad, onShow, onResize } from '@dcloudio/uni-app'
import { useStore } from 'vuex'
const store = useStore()

import Api from '@/api'
import cachel from '@/utils/auth'
import uploader from '@/components/uploader/uploader'

const patientInfo = <any>ref({})
const formData = <any>ref({
  patient_phone: '',
  special_period: 0,
  allergy: 0,
  medical_history: 0,
})
const ageEnum = ['', '岁', '月', '天']
const sexEnum = ['女', '男']
const assetsLink = config.assetsLink
const disabled = ref(false)

const isOptions = ref([
  {
    id: 0,
    name: '无',
  },
  {
    id: 1,
    name: '有',
  },
])

const specialDatesOptions = ref([
  {
    id: 1,
    name: '备孕期',
  },
  {
    id: 2,
    name: '妊娠期',
  },
  {
    id: 3,
    name: '哺乳期',
  },
  {
    id: 4,
    name: '经期',
  },
])

const dataRef = <any>reactive({
  order_sn: '',
  type: '',
  isChanged: false,
})

onLoad((option: any) => {
  // console.log(option)
  dataRef.order_sn = option.order_sn
  dataRef.type = option.type || null // type=1 快速图文咨询
})

onShow(() => {
  setCityData()
  store.dispatch('validateLogin').then(async () => {
    getPatientInfo()
    if (!dataRef.isChanged) {
      getWzInfo()
      dataRef.isChanged = true
    }
  })
})

const setCityData = () => {
  const selectedCity = cachel.getSelectedCity()
  if (selectedCity) {
    formData.value = {
      ...formData.value,
      ...selectedCity,
    }
  }
}

const getPatientInfo = async () => {
  try {
    const { data, code, message } = await Api.inquiryInfo.getWenZhenPatientInfo({
      order_sn: dataRef.order_sn,
    })
    if (code == 200) {
      const _patientInfo = {
        id: data.paid,
        name: data.uname,
        sex: sexEnum[data.sex],
        age: `${data.age}${ageEnum[data.age_type]}`,
        phone: data.phonenumber,
      }

      console.log(2222, data)
      patientInfo.value = _patientInfo
      // 设置就诊人手机号
      if (_patientInfo.phone) {
        formData.value.patient_phone = _patientInfo.phone
      } else {
        const userInfo = cachel.getUserCf()

        formData.value.patient_phone = userInfo ? userInfo.phone : ''
      }

      console.log(111111111, formData.value)
      // 设置特殊时期
      if (!dataRef.isChanged) {
        formData.value.special_period = patientInfo.sex == '女' ? 1 : 0
      }
    }
  } catch (error) {
    console.log(error)
  }
}
const getWzInfo = async () => {
  try {
    const { data, code, message } = await Api.inquiryInfo.getWenZhenAgainInfo({
      order_sn: dataRef.order_sn,
    })
    if (code == 200) {
      const info = data.info
      if (info) {
        let _formData = Object.assign({}, formData.value, {
          height: info.height || '',
          weight: info.weight || '',
          province: info.province || '',
          city: info.city || '',
          area: info.area || '',
          content: info.content || '',
          special_period: info.special_period || 0,
          special_period_enum: info.special_period_enum || '',
          allergy: info.allergy || 0,
          allergy_text: info.allergy_text || '',
          medical_history: info.medical_history || 0,
          medical_history_text: info.medical_history_text || '',
          tongue_face_imgs: [],
          cases_checkdata_imgs: [],
        })
        if (info.tongue_face_imgs && info.tongue_face_imgs.length) {
          _formData.tongue_face_imgs = info.tongue_face_imgs.map((item: any) => {
            return {
              url: item,
              ossUrl: item,
            }
          })
        }
        if (info.cases_checkdata_imgs && info.cases_checkdata_imgs.length) {
          _formData.cases_checkdata_imgs = info.cases_checkdata_imgs.map((item: any) => {
            return {
              url: item,
              ossUrl: item,
            }
          })
        }
        formData.value = _formData
        dataRef.contentSize = _formData.content.length
        dataRef.allergyTextSize = _formData.allergy_text.length
      }
    }
  } catch (error) {
    console.log(error)
  }
}

const uploadSuccess = (e: { key: string | number; files: any }) => {
  console.log('upload success', e)
  let _formData = Object.assign({}, formData.value)
  _formData[e.key] = e.files
  formData.value = _formData
}
const uploadFail = (e: any) => {
  console.log('upload fail', e)
}
const uploadDelete = (e: { key: string | number; files: any }) => {
  console.log('upload delete', e)
  let _formData = Object.assign({}, formData.value)
  _formData[e.key] = e.files
  formData.value = _formData
}

const selectCity = () => {
  uni.navigateTo({
    url: '/pages/my-center/address/selectArea/index',
  })
}

const onOptionsChange = (id: any, name: string | number) => {
  console.log(1111)
  let _formData = Object.assign({}, formData.value)
  _formData[name] = id
  formData.value = _formData
}

const onInput = (e) => {
  const name = e.currentTarget.dataset.name
  const size = e.currentTarget.dataset.size
  const sizename = e.currentTarget.dataset.sizename
  const value = e.detail.value
  setTimeout(() => {
    formData.value[name] = value.substring(0, size)
    dataRef[sizename] = formData.value[name].length
  }, 0)
}

const onUpdatePhone = () => {
  if (!patientInfo.value) {
    uni.showToast({
      title: '请选择就诊人',
      icon: 'none',
    })
    return
  }
  uni.navigateTo({
    url: `/pages/im-inquiry/info/amend-mobile/index?order_sn=${dataRef.order_sn}&patient_id=${patientInfo.value.id}&patient_phone=${formData.value.patient_phone}`,
  })
}

const onCancel = () => {
  uni.redirectTo({
    url: `/pages/im-inquiry/im/index?order_sn=${dataRef.order_sn}`,
  })
}

const formSubmit = async () => {
  console.log(formData.value)
  if (dataRef.disabled) {
    return
  }
  if (!formData.value.height) {
    uni.showToast({
      title: '请输入身高',
      icon: 'none',
    })
    return
  }
  if (!formData.value.weight) {
    uni.showToast({
      title: '请输入体重',
      icon: 'none',
    })
    return
  }
  if (!formData.value.province) {
    uni.showToast({
      title: '请选择当前城市',
      icon: 'none',
    })
    return
  }
  if (!formData.value.patient_phone) {
    uni.showToast({
      title: '请输入手机号，用于接听电话和服务通知',
      icon: 'none',
    })
    return
  }
  if (!formData.value.content) {
    uni.showToast({
      title: '请输入病情描述',
      icon: 'none',
    })
    return
  }
  if (formData.value.special_period == 1 && !formData.value.special_period_enum) {
    uni.showToast({
      title: '请选择您的特殊时期',
      icon: 'none',
    })
    return
  }
  if (formData.value.allergy == 1 && !formData.value.allergy_text) {
    uni.showToast({
      title: '请填写您的过敏药物，过敏病史',
      icon: 'none',
    })
    return
  }
  if (formData.value.medical_history == 1 && !formData.value.medical_history_text) {
    uni.showToast({
      title: '请填写您的既往病史',
      icon: 'none',
    })
    return
  }
  if (!(formData.value.tongue_face_imgs && formData.value.tongue_face_imgs.length)) {
    uni.showToast({
      title: '请上传清晰的舌苔和舌底及面部素颜色彩照片',
      icon: 'none',
    })
    return
  }
  uni.showLoading({})

  dataRef.disabled = true
  let tongue_face_imgs,
    cases_checkdata_imgs = <any>[]
  if (formData.value.tongue_face_imgs) {
    tongue_face_imgs = JSON.stringify(
      formData.value.tongue_face_imgs.map((item: { ossUrl: any }) => item.ossUrl)
    )
  }
  if (formData.value.cases_checkdata_imgs) {
    cases_checkdata_imgs = JSON.stringify(
      formData.value.cases_checkdata_imgs.map((item: { ossUrl: any }) => item.ossUrl)
    )
  }
  let params = {
    order_sn: dataRef.order_sn,
    ...formData.value,
    tongue_face_imgs,
    cases_checkdata_imgs,
  }

  try {
    const { data, code, message } = await Api.inquiryInfo.getWenZhenInfoSace(params)
    dataRef.disabled = true
    uni.hideLoading()
    if (code == 200) {
      // 是否为快速图文咨询
      if (dataRef.type == 1) {
        uni.redirectTo({
          url: `/pages/my-center/inquiry-record/index`,
        })
      } else {
        // 是否需要填写咨询单
        if (data.is_send_default_wz == 1) {
          uni.redirectTo({
            url: `/pages/im-inquiry/info/interrogation-single/index?order_sn=${dataRef.order_sn}`,
          })
        } else {
          // uni.navigateBack({ delta: 1 })
          uni.redirectTo({
            url: `/pages/im-inquiry/im/index?order_sn=${dataRef.order_sn}`,
          })
        }
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
    uni.showToast({
      title: error.message,
      icon: 'none',
    })
  }
}
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.notice-box {
  padding: 10rpx 30rpx;
  background: #fef0e8;
  font-size: 24rpx;
  color: #f86e21;
  line-height: 33rpx;
}

.notice {
  font-size: 24rpx;
  color: #f86e21;
  line-height: 33rpx;
  padding: 20rpx 30rpx;
}

.info-img {
  width: 100%;
  height: 106rpx;
  margin-top: 30rpx;
}

.tag-box {
  display: flex;
}

.tag-box view {
  text-align: center;
  width: 136rpx;
  height: 55rpx;
  background: #f6f6f6;
  border-radius: 8rpx;
  font-size: 32rpx;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  color: #999999;
  line-height: 55rpx;
  margin-right: 20rpx;
  transition: all 0.3s linear;
}

.tag-box view:last-child {
  margin-right: 0;
}

.tag-box view.active {
  color: #1890ff;
  background: #e7f3ff;
}

.active {
  color: #1890ff;
}

.form-box {
  display: flex;
  flex-direction: column;
  font-size: 28rpx;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  line-height: 40rpx;
  color: #333;
  padding-bottom: 190rpx;
}

.form-box .form-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx 0;
  margin: 0 30rpx;
}

.form-box .label {
  flex: 1;
  color: #999999;
  text-align: justify;
}

.form-box .label text {
  color: #333;
}

.form-box .cont {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-size: 28rpx;
  text-align: right;
  color: #333333;
  line-height: 40rpx;
}

.form-box .right-img {
  width: 16rpx;
  height: 25rpx;
  margin-left: 20rpx;
}

.title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 30rpx;
  padding: 30rpx 0;
  font-size: 36rpx;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 700;
  text-align: justify;
  color: #333333;
  line-height: 50rpx;
}

.input-box {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
  padding-bottom: 10rpx;
}

.input-box:last-child {
  margin-left: 90rpx;
}

.input-box text {
  margin-left: 20rpx;
}

.textarea-box {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 250rpx;
  padding: 20rpx;
  background: #ededed;
  border-radius: 8rpx;
}

.textarea-box textarea {
  width: 100%;
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

.btn-box {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 20rpx 30rpx;
  background: #fff;
  z-index: 10;
}
.btn {
  width: 100%;
  height: 90rpx;
  background: #1890ff;
  border-radius: 45rpx;
  font-size: 36rpx;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 700;
  text-align: center;
  color: #ffffff;
  line-height: 90rpx;
}

.weui-uploader__title {
  font-size: 36rpx;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 700;
  text-align: justify;
  color: #333333;
  line-height: 50rpx;
}

.weui-uploader__tips {
  font-size: 24rpx;
  color: #f86e21;
  line-height: 33rpx;
  padding: 10rpx 0;
}

.weui-uploader__info {
  font-size: 36rpx;
  color: #999999;
  line-height: 50rpx;
}
</style>
