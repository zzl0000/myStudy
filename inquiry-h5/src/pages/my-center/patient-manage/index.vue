<template>
  <view class="container">
    <view class="list-group">
      <view
        class="list-item"
        @click.stop.prevent="handleEdit(item)"
        v-for="(item, index) in data.list"
        :key="index"
      >
        <view class="avatar">
          <image class="img" :src="item.avatar || assetsLink + '/assets/def-header-icon.png'" />
        </view>

        <view class="info-gorup">
          <text class="name">{{ item.uname }}</text>
          <text class="sex">{{ sexEnum[item.sex] }}</text>
          <text class="age">{{ item.age }} {{ ageEnum[item.age_type] }}</text>
          <view class="messange" @click.stop.prevent="update(item)" v-if="!item.idcard">
            <image class="imgpen" :src="assetsLink + '/assets/physician/pen.png'"></image>
            完善信息
          </view>
        </view>
      </view>
    </view>
    <view class="btn-group">
      <button class="btn" @click.stop.prevent="handleAdd">添加患者</button>
    </view>

    <add-item
      :isShow="data.show"
      :title="data.title"
      :patientRow="data.patientRow"
      @cancel="handleCancel"
      @confirm="handleConfrim"
    ></add-item>
  </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref, watch } from 'vue'
import config from '../../../config/config'
import Api from '../../../api/index'
import AddItem from './add-item/add-item.vue'

const app = getApp()

const ageEnum = ['', '岁', '月', '天']
const sexEnum = ['女', '男']

const assetsLink = config.assetsLink
const data = ref({
  show: false,
  list: [],
  patientRow: {},
  ageEnum: ageEnum,
  sexEnum: sexEnum,
  type: null,
  // 如果type为1 表示是从快速咨询过来的, 2=定向图文、电话、视频咨询
  isAdd: 0,
  pid: '',
  isbuy: 0,
  paid: '', //快速问诊 无身份证号
  title: '',
})

/**
 * 生命周期函数--监听页面加载
 */
onLoad((options) => {
  if (options && options.type) {
    data.value.type = <any>options.type
    data.value.show = data.value.type == 1 ? true : false
    data.value.title = data.value.type == 1 ? '添加患者' : ''
  }
  uni.setNavigationBarTitle({
    title: '就诊人管理',
  })
  handleInit()

  data.value.pid = <string>options.pid
  data.value.isbuy = <any>options.isbuy

  if (options.paid) {
    data.value.paid = options.paid
  }
})

async function handleInit() {
  try {
    await Api.patientManage.getPatientList({}).then((res: any) => {
      if (res.code == 200) {
        let PatientList = res.data
        data.value.list = PatientList

        if (PatientList && PatientList.length && data.value.type == '2' && data.value.isAdd == 1) {
          setSelectedPatient(PatientList[0])
        }
        if (PatientList && PatientList.length == 0) {
          app.globalData?.$cache.removeSelectedPatient()
        }
        if (data.value.paid) {
          update(data.value.paid)
        }
        const pid = Number(data.value.pid)
        const showlist = data.value.list.filter((item: any) => {
          return pid === item.paid
        })
        handleEdit(showlist[0])
      }
    })
  } catch (error) {
    console.log(error)
  }
}

function setSelectedPatient(row: any) {
  console.log(row)
  app.globalData?.$cache.setSelectedPatient({
    id: row.paid,
    name: row.uname,
    sex: sexEnum[row.sex],
    age: `${row.age}${row.age_type ? ageEnum[row.age_type] : '岁'}`,
    phone: row.phonenumber,
  })
}

function update(e: any) {
  if (data.value.paid) {
    const completion: any = data.value.list.filter((item: any) => {
      return item.paid == e
    })
    completion[0]['title'] = true
    data.value.patientRow = completion[0]
    data.value.show = true
  } else {
    e['title'] = true
    data.value.patientRow = e
    data.value.show = true
  }
}

function handleEdit(e: any) {
  let type = data.value.type
  const row = e

  if (e) {
    switch (type) {
      case null:
        data.value.patientRow = row
        data.value.show = true
        data.value.title = '完善患者信息'
        break
      case '1':
        if (row.idcard) {
          app.globalData?.$cache.set('quick_patient', JSON.stringify(row))
          uni.navigateBack({
            delta: 1,
          })
        } else {
          data.value.show = true
          data.value.title = '完善患者信息'
          data.value.patientRow = row
        }
        break
      case '2':
        setSelectedPatient(row)
        uni.navigateBack({
          delta: 1,
        })
        break
      default:
        break
    }
  }
}

function handleAdd() {
  data.value.show = true
  data.value.patientRow = {}
  data.value.title = '添加患者'
}

function handleCancel() {
  data.value.show = false
  data.value.patientRow = {}
  data.value.paid = ''
}

async function handleConfrim(e: any) {
  try {
    let detail = e.detail
    if (detail.title == '添加患者') {
      delete detail.title
      await Api.patientManage.addPatient(detail).then((res: any) => {
        console.log(res)
        if (res.code === 200) {
          if (data.value.type != 1) {
            handleCancel()
            handleInit()
            data.value.isAdd = 1
            uni.showToast({
              title: '操作成功',
              icon: 'none',
              duration: 2000,
            })
          } else {
            app.globalData?.$cache.set('quick_patient', JSON.stringify(detail))
            uni.redirectTo({
              url: `/pages/quick-inquiry/index?paid=${data.value.paid}`,
            })
          }
        }
      })
    } else {
      delete detail.title
      await Api.patientManage.updatePatient(detail).then((res: any) => {
        if (res.code === 200) {
          if (data.value.isbuy == 1) {
            uni.showToast({
              title: '操作成功',
              icon: 'none',
              duration: 2000,
            })
            setSelectedPatient(detail)
            setTimeout(() => {
              app.globalData?.$cache.set('quick_patient', JSON.stringify(detail))
              if (!data.value.paid) {
                uni.navigateBack({
                  delta: 1,
                })
              } else {
                uni.redirectTo({
                  url: `/pages/quick-inquiry/index?paid=${data.value.paid}`,
                })
              }
            }, 300)
          } else {
            uni.showToast({
              title: '操作成功',
              icon: 'none',
              duration: 2000,
            })
            handleCancel()
            handleInit()
          }
        }
      })
    }
  } catch (error) {
    console.log(error)
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.list-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 30rpx 150rpx 30rpx;
}

.list-group .list-item {
  width: 100%;
  height: 160rpx;
  background: #fff;
  border-radius: 8px;
  margin-top: 20rpx;
  display: flex;
  align-items: center;
  position: relative;
}

.list-group .list-item .name-wrap {
  display: flex;
  justify-content: space-between;
}

.list-group .list-item .wrap {
  display: flex;
  align-items: center;
}

.list-group .list-item .avatar {
  width: 100rpx;
  height: 100rpx;
  margin-left: 30rpx;
  border-radius: 20%;
  overflow: hidden;
}

.list-group .list-item .info-gorup {
  display: flex;
  align-items: center;
  color: #000000;
}

.list-group .list-item .info-gorup .name {
  font-size: 36rpx;
  font-weight: 500;
  text-align: left;
  /* color: #333333; */
  margin-left: 30rpx;
}

.list-group .list-item .info-gorup .sex {
  font-size: 32rpx;
  font-weight: 500;
  text-align: left;
  /* color: #666; */
  margin-left: 30rpx;
}

.list-group .list-item .info-gorup .age {
  font-size: 32rpx;
  font-weight: 500;
  text-align: left;
  /* color: #666; */
  margin-left: 30rpx;
}

.list-group .list-item .info-gorup .messange {
  /* background: #1890ff; */
  border-radius: 15rpx;
  color: #0555fe;
  font-size: 28rpx;
  /* padding: 0rpx 80rpx; */
  font-weight: 500;
  width: 170rpx;
  position: absolute;
  right: 30rpx;
  height: 70rpx;
  line-height: 70rpx;
  text-align: center;
}

.btn-group {
  position: fixed;
  bottom: 0rpx;
  padding: 30rpx 0 40rpx;
  display: flex;
  justify-content: center;
  width: 100%;
  background: #fff;
}

.btn-group .btn {
  min-width: 144rpx;
  width: 80%;
  background: #0052fe;
  border-radius: 60rpx;
  box-shadow: 0px 20rpx 20rpx -10rpx rgba(24, 144, 255, 0.5);
  color: white;
  font-size: 32rpx;
  padding: 6rpx 60rpx;
}

.img {
  width: 100%;
  height: 100%;
  border-radius: 100%;
}

.imgpen {
  width: 24rpx;
  height: 24rpx;
}

// 身份验证
.mask {
  background: rgba(0, 0, 0, 0.302);
  position: fixed;
  left: 0;
  right: 0;
  width: 100%;
  height: 100vh;
}
.add-patient {
  margin: 0 auto;
  position: fixed; /*脱离文档流*/
  left: 0;
  right: 0;
  margin-top: calc(50vh - 440rpx);
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
