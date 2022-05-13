<template>
  <view class="container">
    <view class="head-box">
      <text v-if="!data.activeProvinceName">热门城市</text>
      <block v-else>
        <text class="name" @click="handleCityBack('province')">{{ data.activeProvinceName }}</text>
        <text class="name" @click="handleCityBack('city')" v-if="data.activeCityName">{{
          data.activeCityName
        }}</text>
        <text class="name" @click="handleCityBack('district')" v-if="data.activeAreaName">{{
          data.activeAreaName
        }}</text>
        <text class="name active" v-if="!data.activeAreaName">请选择</text>
      </block>
    </view>

    <scroll-view
      :scroll-y="true"
      :scroll-into-view="data.scrollIntoView"
      :scroll-top="data.scrollTop"
      scroll-with-animation="ture"
      @scroll="handleScroll"
      style="height: calc(100vh - 104rpx)"
    >
      <view class="hot-citys" v-if="!data.activeProvinceName">
        <text @click="handleHotcity(item)" v-for="(item, index) in data.hotCitys" :key="index">
          {{ item.name }}
        </text>
      </view>

      <view class="city-list">
        <view
          class="city-item"
          :data-letter="key"
          v-for="(value, key) in data.list"
          :key="value.key"
        >
          <view class="title" :id="'scroll_into_view_' + key">{{ key }}</view>

          <view class="name" @click="handleCity(item)" v-for="(item, index) in value" :key="index">
            {{ item.name }}
          </view>
        </view>
      </view>
    </scroll-view>

    <view class="letter-box">
      <view
        :data-letter="item"
        :class="data.activeLetter == item ? 'active' : ''"
        @click="handleLetter"
        v-for="(item, index) in data.letters"
        :key="index"
        >{{ item }}</view
      >
    </view>
  </view>
</template>

<script lang="ts" setup>
import { onLoad, onPullDownRefresh, onReady } from '@dcloudio/uni-app'
import { ref } from 'vue'
import Api from '../../../../api/index'
import config from '../../../../config/config'
import common from '../../../../utils/common'

const app = getApp()

const data = ref({
  level: 'province', // 级别，province：省份；city：城市；district：区县
  pid: 0,
  hotCitys: [],
  list: [],
  letters: [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'J',
    'K',
    'L',
    'M',
    'N',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'W',
    'X',
    'Y',
    'Z',
  ],
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

/**
 * 生命周期函数--监听页面加载
 */
onLoad((options) => {
  getCities()
})
/**
 * 生命周期函数--监听页面初次渲染完成
 */
onReady(() => {
  const query = uni.createSelectorQuery()

  setTimeout(() => {
    let headHeight = 0
    query
      .select('.head-box')
      .boundingClientRect((rect) => {
        headHeight = <number>rect.height
      })
      .exec()

    let lettersTop: any = []
    query
      .selectAll('.city-item')
      .boundingClientRect((rect: any) => {
        rect.forEach((item: any) => {
          lettersTop.push({
            letter: item.dataset.letter,
            top: item.top - headHeight,
          })
        })

        data.value.lettersTop = lettersTop
      })
      .exec()
  }, 1000)
})

/**
 * 页面相关事件处理函数--监听用户下拉动作
 */
onPullDownRefresh(() => {
  getCities()
})

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
            app.globalData?.$cache.setSelectedCity({
              province: data.value.activeProvinceName,
              city: data.value.activeCityName,
              area: data.value.activeCityName,
            })
            uni.navigateBack({
              delta: 1,
            })
          }
        }

        data.value.hotCitys = res.data.hot || []
        data.value.list = res.data.list || []
        data.value.letters = Object.keys(res.data.list)
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

function handleHotcity(e: any) {
  const id = e.id
  const name = e.name
  const province = e.province

  data.value.activeProvinceId = province.id
  data.value.activeProvinceName = province.name
  data.value.activeCityId = id
  data.value.activeCityName = name

  // TODO 查询区县数据
  data.value.level = 'district'
  data.value.pid = id

  getCities()
}

function handleCity(e: any) {
  const id = e.id
  const name = e.name
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

    app.globalData?.$cache.setSelectedCity({
      province: data.value.activeProvinceName,
      city: data.value.activeCityName,
      area: data.value.activeAreaName,
    })
    uni.navigateBack({
      delta: 1,
    })
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

function handleLetter(e: any) {
  const letter = e.currentTarget.dataset.letter

  data.value.activeLetter = letter
  data.value.scrollIntoView = `scroll_into_view_${letter}`

  uni.vibrateLong({
    success: function() {
      // console.log('success')
    },
  })
}

function handleScroll(e: any) {
  // console.log(e.detail.scrollTop)
  const scrollTop = e.detail.scrollTop
  let lettersTop = data.value.lettersTop
  let activeItem = {}
  if (lettersTop && lettersTop.length) {
    for (let i = 0; i < lettersTop.length; i++) {
      if (i !== lettersTop.length - 1) {
        if (scrollTop >= lettersTop[i].top && scrollTop < lettersTop[i + 1].top) {
          activeItem = lettersTop[i]
        } else if (scrollTop >= lettersTop[lettersTop.length - 1].top) {
          activeItem = lettersTop[lettersTop.length - 1]
        } else if (scrollTop > 0 && scrollTop < lettersTop[0].top) {
          activeItem = lettersTop[0]
        }
      }
    }
  }

  data.value.activeLetter = activeItem.letter || ''
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  background: #f7f9fa;
}

.head-box {
  padding: 30rpx;
  font-size: 32rpx;
  color: #999999;
  line-height: 45rpx;
}
.head-box .name {
  margin-right: 50rpx;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 700;
  color: #333333;
}
.head-box .active {
  color: #1890ff;
}

.hot-citys {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding: -15rpx 0;
  padding-bottom: 50rpx;
}
.hot-citys text {
  color: #333;
  font-size: 28rpx;
  line-height: 40rpx;
  width: 25%;
  text-align: center;
  padding: 15rpx 0;
}

.city-list {
  padding: 0 30rpx;
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

.letter-box {
  position: fixed;
  top: 335rpx;
  right: 30rpx;
  z-index: 10;
  width: 35rpx;
  border-radius: 18rpx;
  background: #eee;
  font-size: 24rpx;
  color: #999;
  line-height: 33rpx;
  padding: 10rpx 0;
}
.letter-box view {
  text-align: center;
  padding: 5rpx 0;
}
.letter-box view.active {
  color: #1890ff;
}
</style>
