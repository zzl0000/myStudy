<template>
  <view class="">
    <view class="img-box">
      <image :src="assetsLink + '/assets/authorLogo.png'" mode="" />
    </view>

    <view class="tabs">
      <view class="tab">
        <view class="tab-left" @click="onClickTabs(0)" :class="current == 0 ? 'active' : ''"
          >快速登录/注册</view
        >
        <view class="tab-right" @click="onClickTabs(1)" :class="current == 1 ? 'active' : ''"
          >账号密码登录</view
        >
      </view>

      <view class="content">
        <view v-show="current === 0" class="con-left">
          <uni-forms ref="form" :modelValue="formData" :rules="rules">
            <uni-forms-item label="" name="phone">
              <view class="inp-display">
                <image :src="assetsLink + '/assets/kf@2x.png'" mode="" />
                <uni-easyinput
                  :inputBorder="false"
                  type="text"
                  v-model="formData.phone"
                  placeholder="请输入手机号"
                />
              </view>
            </uni-forms-item>

            <uni-forms-item name="code" label="">
              <view class="inp-display">
                <image :src="assetsLink + '/assets/kf@2x.png'" mode="" />
                <uni-easyinput
                  :inputBorder="false"
                  type="text"
                  v-model="formData.code"
                  placeholder="请输入验证码"
                />
                <image :src="assetsLink + '/assets/kf@2x.png'" mode="" @click="switchCode" />
              </view>
            </uni-forms-item>

            <uni-forms-item name="messageCode" label="">
              <view class="inp-display">
                <image :src="assetsLink + '/assets/kf@2x.png'" mode="" />
                <uni-easyinput
                  :inputBorder="false"
                  type="text"
                  v-model="formData.messageCode"
                  placeholder="请输入短信验证码"
                />
                <span class="huCode" @click="obtainingCode">获取验证码</span>
              </view>
            </uni-forms-item>
          </uni-forms>
          <view class="tips"
            >登录注册表示同意<text @click="onJump">《名医在线用户服务协议》</text>
          </view>

          <button @click="submitForm(0)">快速登录/注册</button>

          <view class="accredit">
            <view class="mss">—— 使用其他账号登录 ——</view>
            <view class="accredit_btn">
              <a href=""><image :src="assetsLink + '/assets/kf@2x.png'" mode=""/></a>
            </view>
          </view>
        </view>
        <view v-show="current === 1" class="con-right">
          <uni-forms ref="forms" :modelValue="formDatas" :rules="ruless">
            <uni-forms-item label="" name="mobile">
              <view class="inp-display">
                <image :src="assetsLink + '/assets/kf@2x.png'" mode="" />
                <uni-easyinput
                  :inputBorder="false"
                  type="text"
                  v-model="formDatas.mobile"
                  placeholder="请输入手机帐号"
                />
              </view>
            </uni-forms-item>

            <uni-forms-item name="password" label="">
              <view class="inp-display">
                <image :src="assetsLink + '/assets/kf@2x.png'" mode="" />
                <uni-easyinput
                  :inputBorder="false"
                  type="text"
                  v-model="formDatas.password"
                  placeholder="请输入密码"
                />
              </view>
            </uni-forms-item>
          </uni-forms>
          <view class="tips"
            >登录注册表示同意<text @click="onJump">《名医在线用户服务协议》</text>
          </view>

          <button @click="submitForm(1)">登录</button>

          <view class="entrance">
            <view class="forget" @click="onClickForget">忘记密码?</view>
            <view class="new-user" @click="onClickNewUser">新用户注册</view>
          </view>

          <view class="accredit">
            <view class="mss">—— 使用其他账号登录 ——</view>
            <view class="accredit_btn">
              <a href=""><image :src="assetsLink + '/assets/kf@2x.png'" mode=""/></a>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import config from '../../config/config'

const assetsLink = config.assetsLink

const current = ref(0)

// 快速登录/注册
const formData = ref({
  phone: '',
  code: '',
  messageCode: '',
})
const rules = ref({
  // 对name字段进行必填验证
  phone: {
    rules: [
      {
        required: true,
        errorMessage: '请输入手机号',
      },
    ],
  },
  code: {
    rules: [
      {
        required: true,
        errorMessage: '请输入验证码',
      },
    ],
  },
  messageCode: {
    rules: [
      {
        required: true,
        errorMessage: '请输入短信验证码',
      },
    ],
  },
})
const form = ref()

// 账号密码登录
const formDatas = ref({
  mobile: '',
  password: '',
})
const ruless = ref({
  // 对name字段进行必填验证
  mobile: {
    rules: [
      {
        required: true,
        errorMessage: '请输入手机号码',
      },
    ],
  },
  password: {
    rules: [
      {
        required: true,
        errorMessage: '请输入密码',
      },
    ],
  },
})
const forms = ref()

//切换登录方式
function onClickTabs(val: number) {
  current.value = val
}

//刷新验证码
function switchCode() {}

//获取短信验证码
function obtainingCode() {}

//忘记密码
function onClickForget() {}

//新用户注册
function onClickNewUser() {}

// 《名医在线用户服务协议》 跳转页面
function onJump() {
  uni.navigateTo({
    url: '/pages/my-center/service-agree/index',
  })
}

//表单提交 登录
function submitForm(num: number) {
  if (num == 0) {
    form.value.validate().then((res) => {
      console.log(res)
    })
  }

  if (num == 1) {
    forms.value.validate().then((res) => {
      console.log(res)
    })
  }
}
</script>

<style lang="scss" scoped>
.img-box {
  // width: 100%;
  height: 200rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 50rpx;
  image {
    width: 340rpx;
    height: 130rpx;
  }
}

.tabs {
  .tab {
    display: flex;
    justify-content: space-between;
    padding: 0 100rpx;
    font-size: 34rpx;
    color: #999;
    font-weight: 600;
    border-bottom: 1px solid #e9e9e9;
    text-align: center;
    margin-bottom: 20rpx;
    .active {
      // font-size: 34rpx;
      color: #333;
    }
    .tab-left {
      padding-bottom: 20rpx;
      flex: 1;
    }
    .tab-right {
      padding-bottom: 20rpx;
      flex: 1;
    }
  }

  .content {
    height: 400rpx;
    // background: rgb(68, 228, 148);
    padding: 10rpx 60rpx;
    image {
      width: 40rpx;
      height: 40rpx;
    }
    .con-left {
      .inp-display {
        display: flex;
        align-items: center;
        border-bottom: 1px solid #e9e9e9;
        .huCode {
          // background: #36c0f7;
          width: 180rpx;
          height: 60rpx;
          text-align: center;
          line-height: 60rpx;
          color: #007cff66;
          &::before {
            content: '| ';
            font-size: 20rpx;
            margin-right: 20rpx;
            color: #e1e1e1;
          }
        }
      }
      .tips {
        color: #b4b3b3;
        font-size: 22rpx;
        text {
          color: #007cff;
        }
      }
      button {
        margin-top: 40rpx;
        color: #fff;
        background: #007cff4d;
      }

      .accredit {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 60rpx;
        .mss {
          color: #b4b3b3;
          font-size: 28rpx;
          margin-bottom: 20rpx;
        }
        .accredit_btn {
          // width: 60rpx;
        }
      }
    }

    .con-right {
      .inp-display {
        display: flex;
        align-items: center;
        border-bottom: 1px solid #e9e9e9;
      }
      .tips {
        color: #b4b3b3;
        font-size: 22rpx;
        text {
          color: #007cff;
        }
      }
      button {
        margin-top: 40rpx;
        color: #fff;
        background: #007cff4d;
      }

      .accredit {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 60rpx;
        .mss {
          color: #b4b3b3;
          font-size: 28rpx;
          margin-bottom: 20rpx;
        }
        .accredit_btn {
          // width: 60rpx;
        }
      }
      .entrance {
        display: flex;
        justify-content: space-between;
        font-size: 20rpx;
        color: #007cff;
        margin-top: 30rpx;
      }
    }
  }
}
</style>
