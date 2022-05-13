<template>
  <div v-if="info" :class="border ? 'pro-card-info' : 'pro-card'" @click="$emit('click')">
    <div class="banner">
      <img :src="banner" alt="" />
      <div v-if="isVr" class="vr-icon">
        <uni-icons
          class="icon"
          name="vrdongxiao"
          custom-prefix="iconfont"
          color="#f7f7f7"
        />
      </div>
    </div>
    <div class="title u-line-2">{{ name }}</div>
    <div class="foot">
      <div class="left">
        <div class="desc u-line-1">
          {{ desc }}
        </div>
        <div class="plotName u-line-1">
          {{ address }}
        </div>
      </div>
      <div class="right">
        <template v-if="showBtn">
          <div @click.stop="like">
            <uni-icons
              class="icon like"
              name="heart"
              :label="isLike ? '已喜欢' : '喜欢'"
              label-pos="bottom"
              :color="isLike ? '#5ECADC' : '#333'"
              label-color="#666"
              label-size="22"
            />
          </div>
          <div class="shareBox">
            <button open-type="share" :data-name="info" class="btn" catchtap="func">
              <uni-icons
                class="icon"
                name="fenxiang"
                label="分享"
                custom-prefix="iconfont"
                label-pos="bottom"
                color="#333"
                label-color="#666"
                label-size="22"
              />
            </button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onLoad, onResize } from "@dcloudio/uni-app";
import { ref, reactive, computed, toRaw } from 'vue';
import { common as api } from '../../api/const';
import request from '../../api/request';
// import buryPoint from '@/utils/buryPoint';
// import pointCode from '@/const/pointCode';

const { info, isVr, border, showBtn, type } = defineProps({
  info: {
    type: Object,
    required: true
  },
  isVr: {
    type: Boolean,
    default: false
  },
  border: {
    type: Boolean,
    default: false
  },
  showBtn: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'case'
  }
})

const isLike = ref(false)
const desc = computed(() => {
  const descArr = [
    info.value.roomDesc || '0室0厅',
    info?.caseArea ? `${info.caseArea}m²` : '',
    info.caseWayDesc,
    info?.caseBudget ? `${info.caseBudget}万元` : '未报价',
  ];
  return descArr.filter(Boolean).join(' | ');
})

const address = computed(() => {
  if (type === 'case') {
    return (info.caseAddress ?? '') || 'xx小区';
  }
  return (info.residentialAddress ?? '') || 'xx小区';
})

const name = computed(() => {
  if (type === 'case') {
    return info.caseName;
  }
  return info.itemName;
})

const banner = computed(() => {
  if (type === 'case') {
    return info.casePage?.split(',')[0] ?? '';
  }
  return info.imgUrl?.split(',')[0] ?? '';
})

onLoad(() => {
  isLike.value = info.favorite ?? false;
})
const like = () => {
  // buryPoint.setF({
  //   id: this.isLike ? pointCode.VR_INFO_N : pointCode.VR_INFO_T,
  //   p_id: this.info.id,
  //   p_title: 'vr喜欢',
  // });
  return new Promise((resolve, reject) => {
    const params = {
      storeId: uni.getStorageSync('storeVo').id,
      [type === 'case' ? 'id' : 'itemId']: info.id,
      flag: !isLike.value,
      memberId: uni.getStorageSync('memberInfo').id,
    };
    const requestOptions = {
      path: type === 'case' ? api.houseCaseFavority : api.constructionLike,
      method: 'post',
      data: params,
      hideLoading: true,
    };
    request<PagingInfo<CaseDetail>>(requestOptions).then((res) => {
      if (res.code === 200) {
        isLike.value = !isLike.value;
        if (isLike.value) {
          uni.showToast({
            title: '已添加到我的喜欢',
            icon: 'none',
          });
        } else {
          uni.showToast({
            title: '已取消喜欢',
            icon: 'none',
          });
        }
        resolve(res);
      } else {
        reject(res.message);
      }
    })
  });
}
</script>

<style lang="scss" scoped>
.pro-card-info{
  margin: 0px 10px 10px;
  background: #FFFFFF;
  border-radius: 4px;
  border: 1px solid white;
  padding: 10px 10px 3px 10px;
  border: 1px solid #EEEEEE;
    .banner {
    width: 335px;
    height: 188px;
    border-radius: 4px 4px 0 0;
    overflow: hidden;
    position: relative;
    img {
      width: 100%;
      height: 100%;
    }
    .vr-icon {
      width: 48px;
      height: 48px;
      border-radius: 24px;
      background: rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      .icon {
        font-size: 36px;
      }
    }
    }
      .title {
    color: #111;
    font-size: 15px;
    font-weight: 500;
    line-height: 21px;
    font-weight: bold;
    margin-top: 6px;
  }
  .foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    margin: 8px 0;
    color: #666;
    .left {
      overflow: hidden;
      .plotName {
        margin-top: 6px;
      }
    }
    .right {
      display: flex;
      align-items: flex-end;
      .icon {
        &.like {
          font-size: 22px;
          margin-right: 16px;
        }
        font-size: 20px;
        min-width: 40px;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
      }

    }
  }
}
.pro-card {
  border: 1px solid black;
  margin: 0 10px 10px;
  background: #FFFFFF;
  border-radius: 4px;
  border: 1px solid white;
  padding: 10px 10px 3px 10px;
  .banner {
    width: 335px;
    height: 188px;
    border-radius: 4px 4px 0 0;
    overflow: hidden;
    position: relative;
    img {
      width: 100%;
      height: 100%;
    }
    .vr-icon {
      width: 48px;
      height: 48px;
      border-radius: 24px;
      background: rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      .icon {
        font-size: 36px;
      }
    }
  }
  .title {
    color: #111;
    font-size: 15px;
    font-weight: 500;
    line-height: 21px;
    font-weight: bold;
    margin-top: 6px;
  }
  .foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    margin: 8px 0;
    color: #666;
    .left {
      overflow: hidden;
      .plotName {
        margin-top: 6px;
      }
    }
    .right {
      display: flex;
      align-items: flex-end;
      .icon {
        &.like {
          font-size: 22px;
          margin-right: 16px;
        }
        font-size: 20px;
        min-width: 40px;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
      }

    }
  }

}
.shareBox{
  .btn{
    padding: 0;
    margin: 0;
    height: unset;
    line-height: unset;
    outline: none;
    background: #fff;
    z-index: 79;
    &::after{
          border: none;
        }
    }
      .icon{
      ::v-deep.u-icon__label{
        margin-top: 6px !important;
      }
    }
}
.icon{
      ::v-deep.u-icon__label{
        margin-top: 6px !important;
      }
}
</style>
