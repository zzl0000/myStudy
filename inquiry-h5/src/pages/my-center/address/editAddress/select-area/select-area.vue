<template>
  <view class="popup" v-if="props.show">
    <view class="mask" @click="cancel"></view>
    <view class="content">
      <view class="region">请选择所在地区</view>

      <view class="area-list">
        <view class="head-box">
          <text class="name" @click="handleCityBack('province')">{{
            data.activeProvinceName
          }}</text>
          <text class="name" @click="handleCityBack('city')" v-if="data.activeCityName">{{
            data.activeCityName
          }}</text>
          <text class="name" @click="handleCityBack('district')" v-if="data.activeAreaName">{{
            data.activeAreaName
          }}</text>
          <text class="name active" v-if="!data.activeAreaName">请选择</text>
        </view>

        <scroll-view
          :scroll-y="true"
          :scroll-into-view="data.scrollIntoView"
          :scroll-top="data.scrollTop"
          scroll-with-animation="ture"
          style="height: calc(49vh - 20rpx)"
        >
          <view class="city-list">
            <view class="city-item" v-for="(value, key) in data.list" :key="key">
              <!-- <view class="title" :id="'scroll_into_view_' + key">{{ key }}</view> -->

              <view
                class="name"
                @click="handleCity(item)"
                v-for="(item, index) in value"
                :key="index"
              >
                {{ item.name }}
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onDeactivated, onMounted, ref, watch } from 'vue'
import Api from '../../../../../api/index'
import config from '../../../../../config/config'
import common from '../../../../../utils/common'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
})

watch(
  () => props.show,
  (newVal, oldVal) => {
    if (newVal) {
      getCities()
    }
  }
)

const emit = defineEmits(['onSelect', 'onCancel'])

const app = getApp()

const data = ref({
  level: 'province', // 级别，province：省份；city：城市；district：区县
  pid: 0,
  hotCitys: [],
  list: [],
  activeLetter: '',
  scrollTop: 0,
  lettersTop: [],
  scrollIntoView: '',
  activeProvinceName: '',
  activeProvinceId: '',
  activeCityName: '',
  activeCityId: '',
  activeAreaName: '',
  activeAreaId: '',
})

function cancel() {
  data.value = {
    level: 'province', // 级别，province：省份；city：城市；district：区县
    pid: 0,
    hotCitys: [],
    list: [],
    activeLetter: '',
    scrollTop: 0,
    lettersTop: [],
    scrollIntoView: '',
    activeProvinceName: '',
    activeProvinceId: '',
    activeCityName: '',
    activeCityId: '',
    activeAreaName: '',
    activeAreaId: '',
  }
  emit('onCancel')
}

async function getCities() {
  // request
  await common.request({
    method: 'get',
    url: `${config.BaseMpUrl}/apps/mpv1/public/cities`,
    data: {
      level: data.value.level,
      pid: data.value.pid,
      group: 'word',
    },
    callback: (res: any) => {
      uni.stopPullDownRefresh()
      if (res.code == 200) {
        if (data.value.level == 'district') {
          if (res.data.length <= 0) {
            emit('onSelect', {
              province: data.value.activeProvinceName,
              city: data.value.activeCityName,
              area: data.value.activeCityName,
            })
            cancel()
          }
        }

        data.value.hotCitys = res.data.hot || []
        data.value.list = res.data.list || []
      } else {
        uni.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000,
        })
      }
    },
  })
}

function selectArea(item: string, id: number) {}

function handleCity(item: any) {
  const id = item.id
  const name = item.name
  if (data.value.level === 'province') {
    data.value.level = 'city'
    data.value.pid = id
    data.value.activeProvinceId = id
    data.value.activeProvinceName = name

    getCities()
  } else if (data.value.level === 'city') {
    data.value.level = 'district'
    data.value.pid = id
    data.value.activeCityId = id
    data.value.activeCityName = name

    getCities()
  } else {
    data.value.activeAreaId = id
    data.value.activeAreaName = name

    emit('onSelect', {
      province: data.value.activeProvinceName,
      city: data.value.activeCityName,
      area: data.value.activeAreaName,
    })
    cancel()
  }
}

function handleCityBack(e: any) {
  const level = e
  if (level === 'province') {
    data.value.level = level
    data.value.pid = <any>''
    data.value.activeProvinceId = ''
    data.value.activeProvinceName = ''
    data.value.activeCityId = ''
    data.value.activeCityName = ''
  } else if (level === 'city') {
    data.value.level = level
    data.value.pid = <any>data.value.activeProvinceId
    data.value.activeCityId = ''
    data.value.activeCityName = ''
    data.value.activeAreaId = ''
    data.value.activeAreaName = ''
  } else {
  }
  getCities()
}
</script>

<style lang="scss" scoped>
.popup {
  width: 100%;
  height: 100%;
  position: relative;

  .mask {
    background: rgba(0, 0, 0, 0.4);
    height: 100%;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
  }
  .content {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 60vh;
    background: #fff;
    z-index: 100;
    border-radius: 50rpx 50rpx 0 0;
    padding: 30rpx 20rpx 0 20rpx;
    box-sizing: border-box;

    .region {
      font-size: 34rpx;
      font-weight: 600;
      padding-left: 10rpx;
      color: #333;
      margin-bottom: 20rpx;
    }

    .area-list {
      padding-left: 10rpx;
      .head-box {
        font-size: 32rpx;
        color: #333;
        margin-bottom: 20rpx;
        .active {
          color: #1890ff;
        }
        .name {
          margin-right: 20rpx;
        }
      }
    }
  }
}

.city-list {
  padding: 0 20rpx;
}
.city-item .title {
  margin-bottom: 20rpx;
  font-size: 24rpx;
  line-height: 33rpx;
}
.city-item .name {
  font-size: 28rpx;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 600;
  line-height: 40rpx;
  margin-bottom: 30rpx;
}
</style>
