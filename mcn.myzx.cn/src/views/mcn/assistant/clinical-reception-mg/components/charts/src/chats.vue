<template>
  <div class="scollbox" id="scollbox" @scroll="scrollEvent" v-show="patientchatList.length > 0">
    <div v-if="isLodeMore" class="text-center">上滑动加载更多...</div>
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
                <video
                  :src="item.url"
                  controls="controls"
                  controlslist="nodownload  nofullscreen noremoteplayback"
                >
                  您的浏览器不支持 video 标签。
                </video>
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
                <video
                  :src="item.url"
                  controls="controls"
                  controlslist="nodownload  nofullscreen noremoteplayback"
                >
                  您的浏览器不支持 video 标签。
                </video>
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
  import { defineComponent, ref, watch, nextTick, onUpdated } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getChats } from '/@/api/sys/appointments';
  import { Row, Col, Image } from 'ant-design-vue';

  export default defineComponent({
    components: { BasicForm, useForm, Row, Col, Image },
    props: {
      id: Number,
    },
    emits: ['changeTab'],
    setup(props) {
      const { createMessage } = useMessage();
      const detail = ref<any>({ caseList: [], tongueList: [] });
      const patientchatList = ref<any>([]);
      watch(
        () => {
          return props.id;
        },
        (state) => {
          console.log(state);
          if (state) {
            nextTick(async () => {
              getChatsSync(props.id);
            });
          }
        },
        {
          immediate: true,
          deep: true,
        }
      );
      let params = {
        page: 1,
        limit: 10,
      };
      const isLodeMore = ref(false);
      const noMore = ref(false);
      const getChatsSync = (id) => {
        getChats(id, params).then((response) => {
          detail.value = response;
          let items = response.list || [];
          let list: any = [];
          if (params.page === 1) {
            list = items || [];
          } else {
            list = patientchatList.value.concat(items);
          }
          console.log(list.length, response.total);
          isLodeMore.value = list.length >= response.total ? false : true;
          noMore.value = !(params.page !== 1 && items.length === 0);
          patientchatList.value = list;
          // console.log(response);
          // console.log(detail.order_status);
        });
      };

      onUpdated(() => {
        nextTick(() => {
          const div: any = document.getElementById('scollbox');
          div.scrollTop = div.scrollHeight;
        });
      });

      const scrollEvent = (e) => {
        // console.log(e);
        if (e.srcElement.scrollTop <= 5) {
          console.log('我在定部触发了');
          console.log(noMore.value, isLodeMore.value);
          if (noMore.value && isLodeMore.value) {
            params.page++;
            getChatsSync(props.id);
          }
        }
      };

      return {
        detail,
        patientchatList,
        getChatsSync,
        createMessage,
        scrollEvent,
        isLodeMore,
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
    height: 680px;
    overflow-y: scroll;
  }
  .text-center {
    text-align: center;
  }
</style>
