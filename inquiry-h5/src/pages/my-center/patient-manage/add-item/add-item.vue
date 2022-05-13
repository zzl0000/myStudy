<template>
  <view class="mask" v-if="isShow">
    <view class="add-patient">
      <view class="title">{{ title }}</view>
      <view class="form-box">
        <view class="form-item">
          <view class="label">姓名</view>
          <view class="val-group">
            <input
              class="weui-input"
              :value="data.uname"
              @input="bindKeyInput($event, 'uname')"
              @blur="bindKeyBlur"
              placeholder="请输入真实姓名"
            />
          </view>
        </view>
        <view class="form-item">
          <view class="label">身份证号</view>
          <view class="val-group">
            <input
              class="weui-input"
              maxlength="18"
              type="idcard"
              :disabled="data.idCardSuccess ? true : false"
              :value="data.idcard"
              @input="bindKeyInput($event, 'idcard')"
              @blur="bindKeyBlur"
              placeholder="请输入身份证号"
            />
          </view>
        </view>
        <view class="form-item">
          <view class="label">性别</view>
          <view class="val-group">
            <view class="custom-radio-group">
              <view
                :class="'radio-item ' + (data.sex == 1 ? 'active' : '')"
                @click="handleChangeRadio('1')"
                >男</view
              >
              <view
                :class="'radio-item ' + (data.sex == 0 ? 'active' : '')"
                @click="handleChangeRadio('0')"
                >女</view
              >
            </view>
          </view>
        </view>
        <view class="form-item">
          <view class="label">出生年月日</view>
          <view class="val-group" :disabld="true">
            <!-- <picker mode="date" value="{{birthdatePicker}}" start="09:01" end="21:01" bindchange="bindTimeChange"> -->
            <view v-if="!data.birthdate" class="picker t-r">
              <text>请选择</text>
              <image class="arrows-img" :src="assetsLink + '/assets/arrow-right-icon.png'"></image>
            </view>
            <view class="picker" v-else>
              <text>{{ data.birthdate }}</text>
              <image class="arrows-img" :src="assetsLink + '/assets/arrow-right-icon.png'"></image>
            </view>
            <!-- </picker> -->
          </view>
        </view>
        <view class="tips">*请确认患者信息真实准确，一经添加将无法修改</view>
      </view>
      <view class="form-btn-group">
        <button class="btn" @click="handleCancel">关闭</button>
        <button class="btn active" @click="handleConfrim">确认</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import config from '../../../../config/config'
import utils from '../../../../utils/util'
import Api from '../../../../api/index'

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  isShow: {
    type: Boolean,
    default: false,
  },
  patientRow: {
    type: Object,
    default: () => {},
  },
})

const emit = defineEmits(['cancel', 'confirm'])

const assetsLink = config.assetsLink
const data = ref({
  idcard: '',
  uname: '',
  sex: null,
  birthdate: '',
  birthdatePicker: '',
  paid: '',
  idCardSuccess: false,
})

// function bindTimeChange(e) {
// uni.showToast({
//     title: '请输入姓名，身份证获取',
//     icon: 'none',
//     duration: 2000
// });
// return; // console.log('picker发送选择改变，携带值为', e.detail.value)
// const value = e.detail.value;
// this.setData({
//     birthdate: value.replace(/-/g, '/'),
//     birthdatePicker: value
// });
// }

function handleChangeRadio(e: string) {
  const { idcard } = data.value
  if (!idcard) {
    uni.showToast({
      title: '请输入姓名、身份证获取',
      icon: 'none',
      duration: 2000,
    })
  }
  return
}
function bindKeyInput(e: any, val: string) {
  data.value[val] = e.detail.value
}

function bindKeyBlur() {
  const { idcard, uname } = data.value
  if (idcard && uname) {
    const state = verifyFn()
    if (state) {
      // 请求验证身份证接口
      uni.showLoading({ title: '加载中' })
      Api.patientManage
        .verifyIdCard({ uname: uname, idcard: idcard, verson: 'v3' })
        .then((res: any) => {
          if (res.code == 200) {
            let birthday, sex
            if (idcard.length === 18) {
              birthday =
                idcard.substring(6, 10) +
                '/' +
                idcard.substring(10, 12) +
                '/' +
                idcard.substring(12, 14)
              sex = Number(idcard.substring(16, 17)) % 2
            } else {
              const year = Number(idcard.substring(6, 7)) < 30 ? '20' : '19'
              birthday = year + idcard.substring(6, 11)
              sex = Number(idcard.substring(14, 15)) % 2
            }

            data.value.sex = <any>sex
            data.value.birthdate = birthday
            data.value.birthdatePicker = utils.formatDate(birthday, 'YYYY-MM-DD')
            data.value.idCardSuccess = true
          } else {
            uni.showToast({
              title: '身份证姓名比对失败！',
              icon: 'none',
              duration: 2000,
            })
          }
          uni.hideLoading()
        })
        .catch((err: any) => {
          data.value.idCardSuccess = false

          uni.showToast({
            title: '身份证姓名比对失败！',
            icon: 'none',
            duration: 2000,
          })
          uni.hideLoading()
        })
    }
  }
}
//手机号
function validMobile(str: string) {
  const reg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
  return reg.test(str)
}

// //身份证
function validIdCard(str: string) {
  const reg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/
  return reg.test(str)
}

// 验证姓名、身份证
function verifyFn() {
  const { idcard, uname } = data.value
  let errMsg

  if (uname) {
    if (uname.length < 2) {
      errMsg = '姓名不能少于两个字符~!'
    }
  } else {
    errMsg = '请输入姓名!'
  }

  if (!validIdCard(idcard)) {
    errMsg = '请输入正确身份证号！'
  }

  if (errMsg) {
    uni.showToast({
      title: errMsg,
      icon: 'none',
      duration: 2000,
    })
    return false
  }

  return true
}

/**
 * 取消事件（调用父组件方法）
 */
function handleCancel() {
  data.value.idcard = ''
  data.value.uname = ''
  data.value.sex = null
  data.value.birthdate = ''
  data.value.birthdatePicker = ''
  data.value.paid = ''
  data.value.idCardSuccess = false

  emit('cancel')
}

/**
 * 确定事件（调用父组件方法）
 */
function handleConfrim(e: any) {
  let { uname, sex, birthdate, paid = 0, idcard, idCardSuccess, birthdatePicker } = data.value
  let { age_type = 1, phonenumber = '' } = props.patientRow || {}

  let csrq = birthdatePicker
  let age: string | number = ''
  let d = new Date()
  let year = d.getFullYear()
  let month: string | number = d.getMonth() + 1
  let day: string | number = d.getDate()
  if (month < 10) {
    month = '0' + month
  }
  if (day < 10) {
    day = '0' + day
  }
  let now = year + '-' + month + '-' + day
  if (
    now.substring(0, 4) >= csrq.substring(0, 4) &&
    now.substring(5, 7) >= csrq.substring(5, 7) &&
    now.substring(8, 10) >= csrq.substring(8, 10)
  ) {
    age = year - parseInt(csrq.substring(0, 4))
  } else {
    age = year - parseInt(csrq.substring(0, 4)) - 1
  }
  let params = {
    uname,
    sex,
    birthdate,
    paid,
    idcard,
    age,
    age_type,
    phonenumber,
    title: props.title,
  }
  if (!verifyFn()) {
    return
  }
  if (age <= 6) {
    uni.showToast({
      title: '不支持6岁以下儿童在线问诊！',
      icon: 'none',
      duration: 2000,
    })
    return
  }
  if (!idCardSuccess) {
    uni.showToast({
      title: '身份证姓名比对失败！',
      icon: 'none',
      duration: 2000,
    })
    return
  }
  if (birthdate) {
    params.birthdate = birthdate.replace(/\//g, '-')
  }
  emit('confirm', {
    detail: params,
  })
}

watch(
  () => props.patientRow,
  (newVal, oldVal) => {
    if (newVal) {
      data.value.idcard = newVal.idcard
      data.value.uname = newVal.uname
      data.value.sex = newVal.sex
      data.value.birthdate = newVal.birthdate
        ? utils.formatDate(newVal.birthdate.replace(/-/g, '/'), 'YYYY/MM/DD')
        : ''
      data.value.birthdatePicker = newVal.birthdate
        ? utils.formatDate(newVal.birthdate.replace(/-/g, '/'), 'YYYY-MM-DD')
        : ''
      data.value.paid = newVal.paid
      data.value.idCardSuccess = newVal.idcard ? true : false
    } else {
      data.value.idcard = ''
      data.value.uname = ''
      data.value.sex = null
      data.value.birthdate = ''
      data.value.birthdatePicker = ''
      data.value.paid = ''
      data.value.idCardSuccess = false
    }
  }
)
</script>

<style lang="scss" scoped>
.add-patient {
  margin: 0 auto;
  position: relative; /*脱离文档流*/
  margin-top: calc(50vh - 390rpx);
  width: 650rpx;
  height: 780rpx;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  padding: 0 50rpx;
  border-radius: 14rpx;
  box-sizing: border-box;
}

.add-patient .title {
  font-size: 36rpx;
  font-weight: 400;
  text-align: center;
  color: #000000;
  padding: 50rpx 0;
}

.add-patient .form-btn-group {
  display: flex;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 650rpx;
  border-top: 1px solid #dedede;
  border-radius: 0 0 14rpx 14rpx;
  overflow: hidden;
}

.add-patient .form-btn-group .btn {
  width: 50%;
  border: 0;
  border-radius: 0;
  font-size: 36rpx;
  font-weight: 400;
  text-align: center;
  color: #000000;
}

.add-patient .form-btn-group .btn.active {
  color: #1890ff;
}

.add-patient .form-btn-group .btn::after {
  border: 0;
}
.add-patient .form-btn-group .btn:last-child {
  border-left: 1px solid #dedede;
}

.form-box .form-item {
  display: flex;
  align-items: center;
  width: 550rpx;
  height: 85rpx;
  opacity: 1;
  border: 1px solid #cccccc;
  border-radius: 9rpx;
  padding: 20rpx;
  box-sizing: border-box;
  margin-bottom: 30rpx;
}

.form-box .form-item .label {
  width: 198rpx;
  font-size: 32rpx;
  font-weight: 400;
  text-align: justify;
  color: #666666;
}

.form-box .form-item .val-group {
  width: calc(100% - 198rpx);
  font-size: 32rpx;
  font-weight: 400;
  text-align: justify;
  color: #999;
}

.custom-radio-group {
  display: flex;
}

.custom-radio-group .radio-item {
  font-size: 32rpx;
  font-weight: 400;
  text-align: center;
  color: #999;
  width: 136rpx;
  height: 55rpx;
  background: #f6f6f6;
  border-radius: 8rpx;
  margin-right: 30rpx;
}

.custom-radio-group .radio-item.active {
  color: #1890ff;
}

.custom-radio-group .radio-item:last-child {
  margin-right: 0;
}

.t-r {
  text-align: right;
}
.picker {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.arrows-img {
  width: 16rpx;
  height: 25rpx;
  margin-left: 20rpx;
  margin-top: 8rpx;
}

.tips {
  font-size: 24rpx;
  font-weight: 400;
  text-align: left;
  color: #f86e21;
}
</style>
