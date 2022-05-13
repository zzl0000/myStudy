<template>
  <uni-popup
    ref="popup"
    type="bottom"
    mask-click
    @maskClick="mask"
    @touchmove.stop.prevent="touchmove"
  >
    <view class="content" :style="`height: 80vh`">
      <view class="con-top">
        <view class="inp">
          <icon type="search" size="18" />
          <input
            id="input"
            placeholder="请输入地址"
            :value="inputValue"
            @input="handleInput"
            @focus="handleFocus"
            @blur="handleBlur"
            :focus="props.show ? true : false"
            :adjust-position="false"
          />
        </view>
        <view class="btn" @click="handleComplete">{{ title }}</view>
      </view>
      <div id="container"></div>

      <view class="list">
        <scroll-view
          scroll-y
          @scrolltolower="scrollTolower"
          class="scroll-y"
          :style="`height: 70vh`"
        >
          <view class="list-for" v-for="item in data.poisList" :key="item.id">
            <view class="list-item" @click="handleAddress(item)">
              <view class="name">{{ item.name }}</view>
              <view class="address">{{ item.address }}</view>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
  </uni-popup>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  city: {
    type: String,
    default: '',
  },
  address: {
    type: String,
    default: '',
  },
})

watch(
  () => props.show,
  (newVal, oldVal) => {
    if (newVal) {
      popup.value.open()
      inputValue.value = props.address
      getPOI(props.address)
    }
  }
)

const emit = defineEmits(['cancel', 'confirm'])

const data = ref({
  poisList: [],
})
const inputValue = ref('')
const title = ref('取消')
const page = ref(1)
const values = ref('')
const popup = ref()
const scrollViewHeight = ref(0)

const inputWrapHeight = ref()

let key = '8c8e38cc8bf318af883881583db43318'
window._AMapSecurityConfig = {
  securityJsCode: 'b968daf41eb35b67e691478776821f7e', //密钥
}

function getPOI(params: string) {
  AMapLoader.load({
    key: key,
    version: '2.0',
    plugins: [],
  })
    .then((AMap) => {
      AMap.plugin(['AMap.PlaceSearch'], function() {
        var placeSearch = new AMap.PlaceSearch({
          citylimit: true, //是否强制限制在设置的城市内搜索
          city: props.city,
          pageSize: 15, // 单页显示结果条数
          pageIndex: page.value, // 页码
        })
        let keyword = params
        placeSearch.search(keyword, function(status: string, result: any) {
          try {
            console.log(result)
            if (result) {
              data.value.poisList = data.value.poisList.concat(result.poiList.pois)
            }
          } catch (error) {}
        })
      })
    })
    .catch((e) => {
      console.log(e)
    })
}

function scrollTolower() {
  page.value = page.value + 1

  let obj = {
    detail: {
      value: values.value,
    },
  }
  handleInput(obj)
}

function handleInput({ detail: { value } }) {
  if (value) {
    if (values.value != value) {
      data.value.poisList = []
    }
    values.value = value
    title.value = '完成'
    getPOI(value)
  } else {
    title.value = '取消'
    data.value.poisList = []
  }

  inputValue.value = value
}

function handleComplete() {
  if (title.value == '取消') emit('cancel')

  if (title.value == '完成') emit('confirm', inputValue.value, 0)

  data.value.poisList = []
  title.value = '取消'
  inputValue.value = ''
  popup.value.close()
}

function handleAddress(item: any) {
  data.value.poisList = []
  title.value = '取消'
  inputValue.value = ''

  emit('confirm', item, 1)
  popup.value.close()
}

function mask() {
  title.value = '取消'
  handleComplete()
}

function handleFocus(e: any) {}

function handleBlur(e: any) {
  scrollViewHeight.value = 0

  const res = uni.getSystemInfoSync()
  if (res.platform == 'ios') {
    setTimeout(() => {
      window.scrollTo(0, 0)
    }, 100)
  }
}

function touchmove() {
  return
}
</script>

<style lang="scss" scoped>
.content {
  width: 100%;
  // height: 85vh;
  background: #fff;
  position: absolute;
  bottom: 0;
  left: 0;
  border-radius: 40rpx 40rpx 0 0;
  padding: 40rpx;
  box-sizing: border-box;
  .con-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .btn {
      margin: 0 0 0 20rpx;
      font-size: 32rpx;
      color: #2ab6ee;
    }
    .inp {
      background: rgba(199, 199, 199, 0.596);
      padding: 10rpx 20rpx;
      border-radius: 50rpx;
      display: flex;
      align-items: center;
      flex: 1;
      input {
        // transform: scale(0.9);
        margin-left: 10rpx;
        width: 100%;
      }
    }
  }

  .list {
    padding: 30rpx 0;

    .list-for {
      .list-item {
        padding: 30rpx 0 10rpx;
        border-bottom: 1px solid rgba(231, 230, 230, 0.376);

        .name {
          font-size: 28rpx;
        }
        .address {
          font-size: 16rpx;
          color: #acaaaa;
          margin-top: 10rpx;
        }
      }
    }
  }
}
</style>
