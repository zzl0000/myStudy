<!--
 * @Author: your name
 * @Date: 2020-12-03 16:16:15
 * @LastEditTime: 2021-01-12 10:08:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \register-managef:\project\inquiry-wap\src\component\noData\noData.vue
-->

<template>
  <view class="no-data-container">
    <view v-if="noDataConfig.show"
          class="no-data">
      <image class="img"
             :src="noDataConfig.img ?  noDataConfig.img: defNoDataIcon"
             mode="" />
      <text class="tips">{{noDataConfig.noDataDes ? noDataConfig.noDataDes: defNoDataDes}}</text>
    </view>
  </view>
</template>


<script>
export default {
  props: {
    noDataConfig: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      defNoDataDes: '暂时没有找到数据',
      defNoDataIcon: '/static/img/no-data-icon.png'
    }
  }
}
</script>

<style lang="scss">
.no-data-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  .no-data {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: calc(100vh - 88rpx - env(safe-area-inset-top));
    .img {
      width: 342rpx;
      height: 304rpx;
    }
    .tips {
      font-size: 26rpx;
      font-weight: 400;
      text-align: center;
      color: #999999;
      line-height: 37rpx;
    }
  }
}
</style>