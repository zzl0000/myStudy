<template>
  <view class="container">
    <view class="uploader-title"
      >根据《互联网医院管理办法》，请上传您的病例图片、处方单、化验单、检查单、出院小结、患处照片等，照片仅医生可见。</view
    >

    <uploader
      :max-count="maxCount"
      :files="files"
      @fail="uploadFail"
      @success="uploadSuccess"
      @delete="uploadDelete"
    >
    </uploader>

    <view class="uploader-info">已上传 {{ files.length }}/{{ maxCount }} 张</view>

    <view class="footer-box">
      <button class="button" type="primary" @click="onSubmit" :disabled="disabled">
        确认上传
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import config from '@/config/config'
import { reactive, ref, toRefs } from 'vue'
import { onLoad, onShow, onResize } from '@dcloudio/uni-app'
import { useStore } from 'vuex'
const store = useStore()
import Api from '@/api'
import cachel from '@/utils/auth'
import events from '@/utils/events'
import $send from '@/api/request'
import uploader from '@/components/uploader/uploader'
// const title = ref('Hello')
const maxCount = ref(16)
const disabled = ref(false)

const dataRef = <any>reactive({
  order_sn: '',
  isChanged: false,
  tag: null,
  address: null,
  patientId: null,
  type: null,
  files: [],
})

onLoad((option) => {
  dataRef.order_sn = option.order_sn
  dataRef.tag = option.tag
  dataRef.patientId = option.patientId
  getData()
})

const getData = async () => {
  uni.showLoading({
    title: '加载中',
  })

  if (dataRef.tag != 1) {
    $send
      .post(
        '/wenzhen/wz_imgs',
        {
          order_sn: dataRef.order_sn,
        },
        ''
      )
      .then((res: any) => {
        uni.hideLoading()
        if (res.code == 200) {
          // console.log(res.data)
          dataRef.files = res.data.cases_checkdata_imgs.map((item, index) => {
            return {
              url: item,
              ossUrl: item,
            }
          })
        } else {
        }
      })
      .catch(() => {
        uni.hideLoading()
      })
  } else {
    $send
      .get(
        '/patients/' + dataRef.patientId + '/all-record-images',
        {
          order_sn: dataRef.order_sn,
          patientId: dataRef.patientId,
        },
        ''
      )
      .then((res: any) => {
        uni.hideLoading()
        if (res.code == 200) {
          dataRef.files = res.data.map((item) => {
            return {
              url: item.imgUrl,
              ossUrl: item.imgUrl,
            }
          })
        } else {
        }
      })
      .catch(() => {
        uni.hideLoading()
      })
  }
}

const uploadSuccess = (e) => {
  console.log('upload success', e)
  dataRef.files = e.files || []
}
const uploadFail = (e) => {
  console.log('upload fail', e)
}
const uploadDelete = (e) => {
  console.log('upload delete', e)
  dataRef.files = e.files || []
}

const onSubmit = () => {
  if (!dataRef.order_sn) {
    uni.showToast({
      title: '订单号不能为空',
      icon: 'none',
    })
    return
  }
  if (dataRef.files.length == 0) {
    uni.showToast({
      title: '请上传您的病例图片',
      icon: 'none',
    })
    return
  }
  if (dataRef.disabled) {
    return
  }
  uni.showLoading({
    title: '加载中',
  })

  dataRef.disabled = true

  let params = {
    order_sn: dataRef.order_sn,
    cases_checkdata_imgs: JSON.stringify(dataRef.files.map((item) => item.ossUrl)),
  }

  $send
    .post(
      dataRef.tag != 1
        ? '/wenzhen/wz_imgs_save'
        : '/patients/' + dataRef.patientId + '/save-record-images',
      params,
      ''
    )
    .then((res: any) => {
      uni.hideLoading()
      dataRef.disabled = false
      if (res.code == 200) {
        uni.showToast({
          title: '上传病例资料成功',
          icon: 'none',
        })
        setTimeout(() => {
          uni.navigateBack({
            delta: 1,
            success: function() {
              events.trigger('updateCaseMsg', dataRef.order_sn)
            },
            fail: function() {
              uni.switchTab({
                url: '/pages/inquiry/dialogue/dialogue',
              })
            },
          })
        }, 1000)
      } else {
        uni.showToast({
          title: res.message,
          icon: 'error',
        })
      }
    })
    .catch((res) => {
      uni.hideLoading()
      dataRef.disabled = false
      uni.showToast({
        title: res.message,
        icon: 'none',
      })
    })
}

const { order_sn, files, isChanged, tag, address, patientId, type } = toRefs(dataRef)
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-bottom: 180rpx;
}

.footer-box {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 20rpx 30rpx;
  background: #fff;
  z-index: 10;
}

.uploader-title {
  padding: 30rpx 30rpx 0 30rpx;
  font-size: 28rpx;
  text-align: justify;
  color: #666;
  line-height: 40rpx;
}

.uploader-info {
  position: static;
  left: 0;
  bottom: 180rpx;
  right: 0;
  text-align: center;
  font-size: 36rpx;
  color: #999999;
  line-height: 50rpx;
}

.weui-uploader {
  padding: 30rpx;
}

.weui-uploader__input-box {
  width: 158rpx !important;
  height: 158rpx !important;
}

.weui-uploader__file {
  width: 158rpx !important;
  height: 158rpx !important;
}
</style>
