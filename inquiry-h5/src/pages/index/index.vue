<template>
  <view class="container">
    <HomeTop></HomeTop>
    <view class="banner">
      <swiper
        class="swiper"
        :indicator-dots="indicatorDots"
        :autoplay="autoplay"
        :interval="interval"
        :duration="duration"
      >
        <swiper-item v-for="item in bannerList" :key="item.slide_id">
          <view class="swiper-item">
            <image class="img" :src="item.slide_pic.origin" mode="aspectFill" />
          </view>
        </swiper-item>
        <!--  -->
      </swiper>
    </view>
    <!-- 服务入口 -->
    <view class="serveNew">
      <!-- <a href="javaScript:void(0);"> -->
      <div @click="handelJump" class="jump">
        <dl>
          <dt>
            <img src="https://img.myzx.cn/video/mysource/image/20200407/5e8c4de64f10e.png" alt="" />
          </dt>
          <dd>
            <p><b>快速问诊</b></p>
            20万医生在线解答
          </dd>
        </dl>
      </div>
      <!-- </a> -->
      <a href="https://gh.myzx.cn/web/#/homepage">
        <dl>
          <dt style="position: relative;">
            <i class="newhint"></i>
            <img src="https://img.myzx.cn/video/mysource/image/20200407/5e8c4dde5155c.png" alt="" />
          </dt>
          <dd>
            <p><b>在线挂号</b></p>
            全国三甲医院
          </dd>
        </dl>
      </a>
      <a :href="`${reset_link}/mall/goods/goodsindex.html`">
        <dl>
          <dt>
            <img src="https://img.myzx.cn/video/mysource/image/20200407/5e8c4de0cac5b.png" alt="" />
          </dt>
          <dd>
            <p><b>安心购药</b></p>
            正品保证更安心
          </dd>
        </dl>
      </a>
    </view>

    <!--    内容入口-->
    <view class="recomContent ad-outNew">
      <a :href="`${reset_link}/search/1`" class="exphysical">
        <img
          src="https://img.myzx.cn/video/mysource/image/20200407/5e8c4ba51f8c5.png"
          onerror="this.src='https://img.myzx.cn/video/mysource/image/20191202/5de4c227a8f4f.png'"
          alt="找医生"
        />
      </a>
      <a :href="`${reset_link}/search/2`" class="consult">
        <img
          src="https://img.myzx.cn/video/mysource/image/20200407/5e8c4ba9e1a88.png"
          onerror="this.src='https://img.myzx.cn/video/mysource/image/20191202/5de4c227a8f4f.png'"
          alt="名医问答"
        />
      </a>
      <a :href="`${reset_link}/search/3`" class="exphysical">
        <img
          src="https://img.myzx.cn/video/mysource/image/20200407/5e8c4baf16018.png"
          onerror="this.src='https://img.myzx.cn/video/mysource/image/20191202/5de4c227a8f4f.png'"
          alt="医生文章"
        />
      </a>
      <a :href="`${reset_link}/search/4`" class="consult">
        <img
          src="https://img.myzx.cn/video/mysource/image/20200407/5e8c4bb2b7baf.png"
          onerror="this.src='https://img.myzx.cn/video/mysource/image/20191202/5de4c227a8f4f.png'"
          alt="健康音频"
        />
      </a>
    </view>

    <!--    名医特色服务-->
    <view class="recomContent flex-item">
      <p class="fatitle">名医特色服务</p>
      <ul class="specialServe">
        <li>
          <a :href="`${reset_link}/home/listen/listen?return_url=/`"
            ><img alt="" src="https://img.myzx.cn/video/mysource/image/20200408/5e8d6e797bb16.png"
          /></a>
        </li>
        <li>
          <a :href="`${reset_link}/tijian/center`"
            ><img src="https://img.myzx.cn/video/mysource/image/20200408/5e8d6e8804efb.png" alt=""
          /></a>
        </li>
      </ul>
    </view>

    <!--    名医问诊-->
    <view class="fatitle-doc clearfix">
      <p class="fatitle">名医问诊</p>
      <a :href="`${reset_link}/home/index/alldoctor`">更多医生 >></a>
    </view>

    <view class="multi-user">
      <view v-for="item in doctor" :key="item.doctor_id" class="multi-user-item">
        <a :href="`${reset_link}/doctor/${item.doctor_id}`" class="cardIntroNew" data-did="">
          <dl>
            <dt>
              <image class="img" :src="item.img" alt="" />
            </dt>
            <dd>
              <b>{{ item.title }}</b>
              <p class="ellipsis">{{ item.tidname }}</p>
              <view class="ellipsis">{{ item.hidname }}</view>
            </dd>
          </dl>
          <span>我要咨询</span>
        </a>
      </view>
    </view>

    <!--    推荐列表-->
    <view class="recommend-wrapper">
      <view class="recommend-menu">
        <view class="active recommend-menu-item"><a class="choiceness" name="skip">推荐</a></view>
        <!-- <li <if condition="$_GET['channel_id'] eq $item['id']">class="cur"</if> > <a
                href="/{$item['routing']}">{$item.title}</a></li> -->
        <view class="recommend-menu-item" v-for="item in channelList" :key="item.id">
          <a :href="`${reset_link}/${item.routing}`">{{ item.title }}</a>
        </view>
      </view>

      <!-- 视频 -->
      <div class="tipLists">
        <!--     视频列表-->
        <div class="revideo">
          <view v-for="item in list?.video" :key="item.id">
            <a :href="`${reset_link}/video/${item.id}.html`">
              <p class="text ellipsis-1">{{ item.title }}</p>
              <dl class="revidelDl">
                <dt>
                  <image
                    class="img"
                    :src="
                      item.big
                        ? `https://img.myzx.cn/video/${item.big}`
                        : 'https://img.myzx.cn/video/mysource/image/20191202/5de4c22b37854.png'
                    "
                    alt=""
                  />
                  <i></i>
                </dt>
                <dd>
                  <p class="ellipsis-3">{{ item.description }}</p>
                  <div>
                    视频<span>{{ item.click }}浏览</span>
                  </div>
                </dd>
              </dl>
            </a>
          </view>
        </div>
      </div>
      <view class="line"></view>
      <!--    音频列表-->
      <view class="faqs">
        <block v-for="item in list?.voice" :key="item.id">
          <a :href="`${reset_link}/voice/${item.id}.html`">
            <ul>
              <li class="origin">
                <i></i>
                <p class="ellipsis-1">{{ item.title }}</p>
              </li>
              <li class="audioStrip">
                <i>{{ item.duration }}</i>
                <!--<audio src="HTTPS_VIDEO{$voice.url}" controls="controls"></audio>-->
                <img
                  src="https://img.myzx.cn/video/mysource/image/20200409/5e8ec32d2e2a6.png"
                  alt=""
                />
                <span class="browses">{{ item.click || '0' }}收听</span>
              </li>
              <li class="docIntr">
                <img
                  :src="
                    item.small
                      ? `https://img.myzx.cn/video/${item.small}`
                      : 'https://img.myzx.cn/video/mysource/image/20200407/5e8c44e1b7ea3.png'
                  "
                  alt=""
                />
                <b>{{ item.doctorname }}</b> {{ item.tidname }}
                <span class="ellipsis audioKs">{{ item.hidname }}</span>
              </li>
            </ul>
          </a>
        </block>
      </view>
      <view class="line"></view>
      <!--     文章列表-->
      <view class="faqs">
        <block v-for="item in list?.article" :key="item.id">
          <a :href="`${reset_link}/article/${item.id}.html`">
            <ul>
              <li>
                <i class="articleIcon"></i>
                <p class="ellipsis-1">{{ item.title }}</p>
              </li>
              <li>
                <div class="ellipsis-2 answerp">{{ item.description }}</div>
              </li>
              <li class="docIntr">
                <div class="eye-box">
                  <img src="https://m.myzx.cn/public/v6.0/img/eye@2x.png" alt="" />
                  <span>{{ item.click || '0' }}人浏览</span>
                </div>
              </li>
            </ul>
          </a>
        </block>
      </view>
      <view class="line"></view>
      <!--     问答列表-->
      <view class="faqs">
        <block v-for="item in list?.ask" :key="item.id">
          <a :href="`${reset_link}/ask/${item.id}.html`">
            <ul>
              <li>
                <i class="askIcon"></i>
                <p class="ellipsis-1">{{ item.title }}</p>
              </li>
              <li>
                <i class="answerIcon"></i>
                <div class="ellipsis-2 answerp">{{ item.content }}</div>
              </li>
            </ul>
          </a>
        </block>
      </view>
    </view>
    <HomeBottom></HomeBottom>
  </view>
</template>

<script lang="ts">
import { ref } from 'vue'
import { HomeTop, HomeBottom } from './mode'
import { onLoad, onResize } from '@dcloudio/uni-app'
import Api from '../../api/index'
import cache from '../../utils/auth'
import config from '../../config/config'
import { useStore } from 'vuex'

export default {
  components: { HomeTop, HomeBottom },
  setup() {
    const bannerList = <any>ref()
    const channelList = <any>ref()
    const course = <any>ref()
    const doctor = <any>ref()
    const list = <any>ref()
    const store = useStore()

    const reset_link = config.reset_link

    onLoad((option) => {
      if (option.isOutLogin) {
        store.dispatch('loginOut')
      }
      handleInit()
    })
    const handleInit = async () => {
      try {
        const data = await Api.common.getHomeInfo()
        console.log(data)
        bannerList.value = data.banner
        channelList.value = data.channelList
        course.value = data.course
        doctor.value = data.doctor
        list.value = data.list
      } catch (error) {
        console.log(error)
      }
    }

    const handelJump = () => {
      uni.navigateTo({
        url: '/pages/quick-inquiry/index',
      })
    }
    return {
      handelJump,
      bannerList,
      channelList,
      course,
      doctor,
      list,
      reset_link,
    }
  },
}

const title = ref('Hello')
</script>

<style lang="less">
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fff;
}

.banner {
  display: flex;
  position: relative;
  top: 0;
  z-index: 1;
  height: 470rpx;
  width: 100%;
  .swiper {
    width: 100%;
    height: 100%;
    .swiper-item {
      width: 100%;
      height: 100%;
    }
  }
}

/*服务入口*/
.serveNew {
  display: flex;
  width: 100%;
  display: -webkit-flex;
  justify-content: space-around;
  -webkit-justify-content: space-around;
  padding: 50rpx 30rpx;
  img {
    width: 120rpx;
    height: 120rpx;
    margin-bottom: 15rpx;
    background-color: #f3f6ff;
    border-radius: 50%;
  }
  a {
    font-size: 26rpx;
    color: #999;
    text-align: center;
  }
  .jump {
    font-size: 26rpx;
    color: #999;
    text-align: center;
  }
  p {
    font-size: 34rpx;
    color: #333;
    line-height: 48rpx;
    margin-bottom: 5rpx;
  }
}
.ad-outNew {
  justify-content: space-between;
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 5rpx;
  a {
    width: 340rpx;
    height: 150rpx;
    margin-bottom: 10rpx;
    display: inline-block;
    img {
      display: inline-block;
      width: 100%;
      height: 100%;
      background-color: #f7f7f8;
    }
  }
}

.recomContent {
  // margin: 0 0.9375rem 1.5625rem !important;
  padding: 0 30rpx 50rpx !important;
}

/*在线课堂*/
.fatitle {
  font-size: 34rpx;
  font-weight: 800;
  color: #3f6af7;
  line-height: 48rpx;
  text-align: center;
  margin-bottom: 20rpx;
}
.onlineClass,
.specialServe {
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
  -webkit-justify-content: space-between;
}
.onlineClass a {
  width: 220rpx;
  height: 220rpx;
  font-size: 24rpx;
  color: #eee;
  position: relative;
}
.onlineClass a img,
.specialServe a img {
  width: 100%;
  height: 100%;
  background-color: #f7f7f8;
  vertical-align: middle;
}
.classPrice {
  width: 22rpx;
  height: 75rpx;
  background: rgba(3, 3, 3, 0.6);
  position: absolute;
  bottom: 0;
  padding: 8rpx 0 8rpx 10rpx;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  // line-height: 0.33rem;
}
.classPrice > b {
  color: #ff4a31;
  margin-right: 15rpx;
}
.classPrice > p {
  color: #fff;
}
.specialServe a {
  width: 340rpx;
  height: 220rpx;
}
.fatitle-doc {
  height: 48rpx;
  line-height: 48rpx;
  padding: 0 30rpx;
  width: 100%;
  box-sizing: border-box;
}
.fatitle-doc > p {
  float: left;
  margin-bottom: 0;
}
.fatitle-doc > a {
  font-size: 24rpx;
  font-weight: bold;
  color: #999999;
  float: right;
}

/* multi-user */

.multi-user {
  display: flex;
  align-items: center;
  min-height: 408rpx;
  background-color: white;
  padding: 20rpx 30rpx 50rpx;
  overflow-x: scroll;
  width: 100%;
  box-sizing: border-box;
}

.multi-user-item {
  margin-right: 30rpx;
}

.cardIntroNew {
  width: 260rpx;
  height: 408rpx;
  background: #ffffff;
  box-shadow: 0 5rpx 15rpx 0 rgba(0, 0, 0, 0.15);
  border-radius: 5rpx;
  padding: 20rpx 22rpx;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  text-align: center;
}
.cardIntroNew .img {
  width: 170rpx;
  height: 170rpx;
  border-radius: 50%;
  vertical-align: middle;
  margin-bottom: 10rpx;
  background-color: #f7f7f8;
}
.cardIntroNew > span {
  display: inline-block;
  width: 180rpx;
  height: 50rpx;
  line-height: 50rpx;
  background-color: #3f6af7;
  border-radius: 25rpx;
  font-size: 28rpx;
  font-weight: 800;
  color: #ffffff;
}
.cardIntroNew {
  color: #333333;
  font-size: 32rpx;
}
.cardIntroNew p {
  font-size: 24rpx;
  text-align: center;
  margin: 5rpx 0;
}
.cardIntroNew dd view {
  font-size: 24rpx;
  color: #999999;
  margin-bottom: 20rpx;
}

/* 推荐列表 */

.recommend-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 30rpx;
  box-sizing: border-box;
  .recommend-menu {
    display: flex;
    width: 100%;
    overflow-x: scroll;
    .recommend-menu-item {
      flex: 1;
      a {
        // margin-right: 38rpx;
        padding: 25rpx 0;
        font-size: 30rpx;
        min-width: 120rpx;
        text-align: center;
      }
    }
    .active {
      a {
        color: #3f6af7;
        position: relative;
        &::after {
          content: '';
          width: 90rpx;
          height: 4rpx;
          background-color: #007cff;
          position: absolute;
          bottom: 4rpx;
          left: 50%;
          transform: translateX(-50%);
          border-radius: 4rpx;
          transition: all 0.2s;
        }
      }
    }
  }
}

.tipLists > div {
  border-bottom: 20rpx solid #f5f5f5;
}
.tipLists > div:last-child {
  border-bottom: none;
}
.revideo a,
.faqs a {
  width: 690rpx;
  padding: 30rpx 0;
  // margin: 0 30rpx;
  border-bottom: 1px solid #ededed;
}
.revideo a:last-child,
.faqs a:last-child {
  border-bottom: none;
}
.revideo {
  a {
    .text {
      font-size: 32rpx;
      font-weight: bold;
      color: #333333;
      margin-bottom: 25rpx;
    }
  }
}
.revidelDl {
  height: 178rpx;
  dt {
    position: relative;
    width: 290rpx;
    height: 100%;
    float: left;
  }
  img {
    width: 100%;
    height: 100%;
    background-color: #f7f7f8;
  }
  i {
    display: inline-block;
    width: 70rpx;
    height: 70rpx;
    background: url(https://img.myzx.cn/video/mysource/image/20200409/5e8e87d53de9c.png) no-repeat;
    background-size: contain;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  dd {
    width: 380rpx;
    height: 100%;
    font-size: 24rpx;
    color: #333333;
    float: right;
    display: flex;
    display: -webkit-flex;
    display: -moz-flex;
    display: -ms-flex;
    flex-wrap: wrap;
    -webkit-flex-wrap: wrap;
    align-content: space-between;
    -webkit-align-content: space-between;
  }
  p {
    color: #999999;
    line-height: 33rpx;
    letter-spacing: 2rpx;
  }
  div {
    width: 100%;
  }
  span {
    color: #acbfff;
    float: right;
  }
}

.faqs {
  li {
    overflow: hidden;
    font-size: 24rpx;
    margin-bottom: 15rpx;
  }
  p {
    width: 630rpx;
    float: right;
    color: #333333;
    font-size: 32rpx;
    font-weight: bold;
  }
  .origin {
    i {
      display: inline-block;
      width: 12rpx;
      height: 12rpx;
      border-radius: 50%;
      background: #3f6af7;
      margin-top: 20rpx;
    }
    p {
      width: 660rpx;
    }
  }

  .docIntr {
    color: #999999;
    display: flex;
    display: -webkit-flex;
    display: -moz-flex;
    display: -ms-flex;
    align-items: center;
    -webkit-align-items: center;
    margin-top: 20rpx;
    margin-bottom: 0;
    img {
      width: 60rpx;
      height: 60rpx;
      border-radius: 50%;
      margin-right: 20rpx;
      background-color: #f7f7f8;
      object-fit: cover;
    }
    b {
      color: #333333;
      margin-right: 15rpx;
    }
    span {
      display: inline-block;
      max-width: 240rpx;
      margin: 0 15rpx;
    }
    .eye-box {
      display: -webkit-box;
      display: -moz-box;
      display: -ms-flexbox;
      display: -webkit-flex;
      display: flex;
      -webkit-box-align: center;
      -webkit-align-items: center;
      align-items: center;
      margin-left: 60rpx;
      img {
        width: 30rpx;
        height: 3rpx;
        margin-right: 10rpx;
      }
      span {
        font-weight: normal;
        color: #acbfff;
      }
    }
  }

  .audioStrip {
    display: flex;
    display: -moz-flex;
    display: -ms-flex;
    align-items: center;
    -webkit-align-items: center;
    align-items: center;
    i {
      display: inline-block;
      width: 446rpx;
      height: 60rpx;
      background-image: url('https://img.myzx.cn/video/mysource/image/20200409/5e8ec2e8569e2.png');
      background-repeat: no-repeat;
      background-size: contain;
      line-height: 60rpx;
      color: #acbfff;
      text-align: right;
      padding: 0 20rpx 0 0;
      box-sizing: border-box;
      margin-right: 25rpx;
    }
    img {
      width: 60rpx;
    }
    .browses {
      font-weight: normal;
      color: #acbfff;
      position: absolute;
      right: 30rpx;
    }
  }

  .askIcon,
  .answerIcon,
  .articleIcon {
    display: inline-block;
    width: 45rpx;
    height: 45rpx;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    float: left;
  }
  .askIcon {
    background-image: url('https://img.myzx.cn/video/mysource/image/20200409/5e8e9ac7819ec.png');
  }
  .answerIcon {
    background-image: url('https://img.myzx.cn/video/mysource/image/20200409/5e8e9ac3d0c42.png');
  }
  .articleIcon {
    width: 35rpx;
    height: 35rpx;
    background-image: url('https://img.myzx.cn/video/mysource/image/20200409/5e8ebb3ce02d1.png');
    margin-top: 5rpx;
  }
}

.line {
  width: 750rpx;
  background: #f5f5f5;
  height: 20rpx;
  position: relative;
  right: 30rpx;
}
</style>
