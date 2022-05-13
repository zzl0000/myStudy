<template>
  <view class="weui-uploader">
    <view class="weui-uploader__hd" v-if="title && tips">
      <view class="weui-uploader__overview" wx-if="title">
        <view class="weui-uploader__title">{{ title }}</view>
        <view class="weui-uploader__info">{{ myFiles.length }}/{{ maxCount }}</view>
      </view>
      <view class="weui-uploader__tips" v-if="tips">{{ tips }}</view>
    </view>
    <view class="weui-uploader__bd">
      <view
        class="weui-uploader__file"
        v-for="(item, index) in myFiles"
        :key="index"
        @click="previewImage(index)"
      >
        <image class="weui-uploader__img" mode="" :src="item.url"></image>
        <view class="weui-uploader__file-content" v-if="item.loading || item.error">
          <!-- <mp-loading type="circle" tips="" v-if="item.loading" style="width: 100%;"></mp-loading> -->
          <uni-load-more v-if="item.loading" :status="status" :content-text="1" />
          <icon color="#F43530" size="23" type="warn" v-if="item.error"></icon>
        </view>
        <image
          class="weui-uploader__delete"
          :src="assetsLink + '/assets/close-2@2x.png'"
          @click="deleteFile(index)"
        ></image>
      </view>
      <view
        class="weui-uploader__input-box"
        hover-class="weui-active"
        @click="chooseImage"
        v-if="myFiles.length < maxCount"
      >
        <image class="weui-uploader__input" :src="assetsLink + '/assets/jia@2x.png'"></image>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, toRefs, watch } from 'vue'
import config from '@/config/config'
import $send from '@/api/request'
import OSS from '@/utils/alioss/alioss.js'
export default defineComponent({
  props: {
    title: {
      type: String,
      value: '',
    },
    tips: {
      type: String,
      value: '',
    },
    maxCount: {
      type: Number,
      value: 1,
    },
    files: {
      type: Array,
      value: [],
    },
    imgKey: {
      type: String,
      value: '',
    },
  },
  emits: ['select', 'delete', 'success', 'fail'],
  setup(props, { emit }) {
    const assetsLink = computed(() => config.assetsLink)
    const dataRef: any = <any>reactive({
      showGallery: false,
      myFiles: [],
      uploadUrls: [],
      imgUrls: [],
      current: '',
    })

    watch(
      () => {
        return props.files
      },
      (state) => {
        console.log(state)
        if (state) {
          dataRef.myFiles = props.files
        }
      },
      {
        immediate: true,
        deep: true,
      }
    )

    const previewImage = (index) => {
      dataRef.imgUrls = dataRef.myFiles.map((item) => item.url)
      dataRef.current = index
      uni.previewImage({
        current: dataRef.current,
        urls: dataRef.imgUrls,
      })
    }
    const selectFile = (files) => {
      console.log('select files', files)
      // 返回false可以阻止某次文件上传
      emit('select', files)
    }
    const chooseImage = (e) => {
      uni.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: (res) => {
          // let tempFiles = res.tempFiles.map(item => {
          //   return {
          //     url: item.path,
          //     loading: true,
          //   }
          // })
          // this.setData({
          //   myFiles: this.data.myFiles.concat(tempFiles)
          // })
          console.log(1111)
          uploadFile(res)
        },
      })
    }

    const uploadFile = (files) => {
      uni.showLoading({
        title: '上传中',
      })
      dataRef.uploadUrls = []
      $send
        .get(`${config.wzAPi}/union/getOssUpload`, {}, 2)
        .then((res: any) => {
          if (res.status == 200) {
            const oss = new OSS(res.data)
            const tempFilePaths = files.tempFilePaths
            tempFilePaths.map((item) => {
              oss
                .uploadFile(item)
                .then((url) => {
                  console.log('uploadFile: ', url)
                  dataRef.myFiles = dataRef.myFiles.concat({
                    url: item,
                    ossUrl: url,
                  })
                  // const index = this.data.myFiles.findIndex(file => file.url == item)
                  // this.setData({
                  //   [`myFiles[${index}].ossUrl`]: url,
                  //   [`myFiles[${index}].loading`]: false,
                  //   [`myFiles[${index}].error`]: false
                  // })
                  emit('success', { files: dataRef.myFiles, key: props.imgKey })
                  dataRef.uploadUrls = dataRef.uploadUrls.concat([url])
                  if (tempFilePaths.length == dataRef.uploadUrls.length) {
                    uni.hideLoading()
                  }
                })
                .catch((error) => {
                  console.log(error)
                  uni.hideLoading()
                  updateFilesError(item)
                  emit('fail', { files: dataRef.files, key: props.imgKey })
                })
            })
          } else {
            uni.hideLoading()
            updateFilesError(files.tempFilePaths[0])
          }
        })
        .catch((res) => {
          uni.hideLoading()
          updateFilesError(files.tempFilePaths[0])
        })
    }

    const deleteFile = (index) => {
      dataRef.myFiles = dataRef.myFiles.filter((item, i) => i != index)
      emit('delete', { files: dataRef.myFiles, key: dataRef.key })
    }

    const updateFilesError = (url) => {
      dataRef.myFiles = dataRef.myFiles.concat({
        url: url,
        ossUrl: '',
        loading: false,
        error: true,
      })
    }

    return {
      assetsLink,
      ...toRefs(dataRef),
      previewImage,
      selectFile,
      chooseImage,
      deleteFile,
      updateFilesError,
    }
  },
})
</script>

<style lang="less">
.weui-uploader__bd {
  display: flex;
  flex-wrap: wrap;
  overflow: unset;
}

.weui-uploader__file {
  position: relative;
  width: 210rpx;
  height: 210rpx;
  border-radius: 8rpx;
  margin-right: 8rpx;
  margin-bottom: 8rpx;
}

.weui-uploader__file .weui-uploader__img {
  display: contents;
}

.weui-uploader__delete {
  position: absolute;
  right: -20rpx;
  top: -20rpx;
  width: 40rpx;
  height: 40rpx;
  z-index: 1;
}

.weui-uploader__file-content {
  content: ' ';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translate(0, 0);
}

.weui-uploader__input-box {
  position: relative;
  margin-right: 8px;
  margin-bottom: 8px;
  width: 210rpx;
  height: 210rpx;
  box-sizing: border-box;
  background-color: #f3f3f3;
  border-radius: 8rpx;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.weui-uploader__input-box::before,
.weui-uploader__input-box::after {
  display: none;
}

.weui-uploader__input {
  position: relative;
  width: 96rpx;
  height: 96rpx;
  opacity: 1;
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
