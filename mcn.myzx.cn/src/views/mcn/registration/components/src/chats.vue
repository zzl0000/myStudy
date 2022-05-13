<template>
  <div class="scollbox" id="scollbox" v-show="patientchatList.length > 0">
    <div id="box">
      <div v-for="(item, index) in patientchatList" :key="index" class="mains">
        <!-- 用户 -->
        <div class="fl" v-if="item.from_user.type == 'user'">
          <div class="avatar">
            <img
              :src="
                item.from_user.avatar
                  ? item.from_user.avatar
                  : 'https://img.myzx.cn/video/mysource/image/20210729/61018b834413b.png'
              "
            />
          </div>
          <div class="content">
            <div>
              {{ item.datetime }}
            </div>
            <div class="text">
              <div v-if="item.type == 'TEXT'">{{ item.content }}</div>
              <div v-if="item.type == 'IMG' || item.type == 'GIF'">
                <img class="sendImg" :src="item.url" />
              </div>
              <div v-if="item.type == 'AUDIO'">
                <audio :src="item.url" controls="controls">
                  Your browser does not support the audio element.
                </audio>
              </div>
              <div v-if="item.type == 'FILE'">{{ item.content }}</div>
              <div v-if="item.type == 'IMG_TEXT'" v-html="item.content"></div>
              <div v-if="item.type == 'VIDEO'">
                <video :src="item.url" controls="controls"> 您的浏览器不支持 video 标签。 </video>
              </div>
              <div v-if="item.type == 'NONE'">不支持的消息</div>
            </div>
          </div>
        </div>
        <!-- 医生 -->
        <div class="fr" v-if="item.from_user.type == 'doctor'">
          <div class="content">
            <div>
              {{ item.datetime }}
            </div>
            <div class="text">
              <div v-if="item.type == 'TEXT'">{{ item.content }}</div>
              <div v-if="item.type == 'IMG' || item.type == 'GIF'">
                <img class="sendImg" :src="item.url" />
              </div>
              <div v-if="item.type == 'AUDIO'">
                <audio :src="item.url" controls="controls">
                  Your browser does not support the audio element.
                </audio>
              </div>
              <div v-if="item.type == 'FILE'">{{ item.content }}</div>
              <div v-if="item.type == 'IMG_TEXT'" v-html="item.content"></div>
              <div v-if="item.type == 'VIDEO'">
                <video :src="item.url" controls="controls"> 您的浏览器不支持 video 标签。 </video>
              </div>
              <div v-if="item.type == 'NONE'">不支持的消息</div>
            </div>
          </div>
          <div class="avatar">
            <img
              :src="
                item.from_user.avatar
                  ? item.from_user.avatar
                  : 'https://img.myzx.cn/video/mysource/image/20210729/61018a40d8f4f.png'
              "
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div align="center" v-show="patientchatList.length == 0">暂无数据</div>
</template>

<script lang="ts">
  import { defineComponent, ref, computed, unref, inject } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getChats } from '/@/api/sys/appointments';
  import { Row, Col, Image } from 'ant-design-vue';
  import { bool } from 'vue-types';

  export default defineComponent({
    components: { BasicForm, useForm, Row, Col, Image },
    emits: ['changeTab'],
    setup() {
      const { createMessage } = useMessage();
      const data = inject('data');
      const detail = ref<any>({ caseList: [], tongueList: [] });
      const patientchatList = ref<any>([]);

      getChats(data.id).then((response) => {
        detail.value = response;
        patientchatList.value = response.list;
        console.log(response);
        console.log(detail.order_status);
      });

      return {
        detail,
        patientchatList,
      };
    },
  });
</script>

<style type="text/css">
  .showImage {
    width: 200px;
    height: 200px;
    margin-right: 30px;
  }
  .addNone {
    background-color: #ffffff;
  }
  .mains:after {
    clear: both;
    content: '';
    display: block;
  }
  .mains .avatar {
    width: 30px;
    height: 30px;
  }
  .mains .avatar img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
  .mains .fl {
    display: flex;
    min-width: 600px;
  }
  .mains .fr {
    display: flex;
    align-items: flex-start;
    float: right;
    margin-right: 30px;
  }
  .mains > div {
    margin-top: 15px;
    margin-bottom: 15px;
  }
  .mains > div .content {
    max-width: 360px;
  }
  .mains .fr .content {
    margin-right: 15px;
  }
  .mains .fl .content {
    margin-left: 15px;
  }
  .mains .text {
    margin-top: 10px;
    line-height: 20px;
  }
  .mains .fr .text {
    background: #1890ff;
    border-radius: 10px;
    padding: 10px;
    color: #fff;
    font-size: 14px;
    padding-top: 7px;
  }
  .mains .fl .text {
    border-radius: 10px;
    padding: 10px;
    color: #333;
    font-size: 14px;
    padding-top: 7px;
    box-shadow: 0 0 7px rgb(0, 0, 0, 0.2);
  }
  #scollbox {
    height: 940px;
    overflow-y: scroll;
  }
</style>
