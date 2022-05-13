<template>
  <view>
    <view v-if="isLoadConfig.show" class="load-more">
      <view class="load-img"></view>
      <view v-if="isLoadConfig.noMore" class="load-text">--下拉加载更多--</view>
      <view v-if="!isLoadConfig.noMore" class="no-text">--我们是有底线的--</view>
    </view>
    <view v-if="isLoadConfig.noDate" class="no-data">
      <image
        class="img icon"
        :src="assetsLink + '/assets/no-data-icon.png' + ' '"
        mode="aspectFill"
      ></image>
      <text class="text">暂时还没有内容</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import config from '../../config/config'

const assetsLink = config.assetsLink
const props = defineProps({
  isLoadConfig: {
    type: Object,
    default: () => {},
  },
})

watch(
  props.isLoadConfig,
  (newVal, oldVal) => {
    // console.log(newVal, oldVal)
  },
  { immediate: true, deep: true }
)
</script>

<style lang="scss" scoped>
.load-more {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  text-align: center;
  color: #999999;
  line-height: 40rpx;
  padding: 10rpx 0;
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
</style>
