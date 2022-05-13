<template>
  <div id="video_grid" class="video_grid">
    <div id="local_stream" class="mr-5 local-stream" v-show="isLocalStream">
      <div class="operate-btn">
        <div class="audio-btn">
          <img
            v-if="localAudio"
            class="img"
            src="../../../../../../../assets/rtrc/img/big-mic-on.png"
            alt=""
            @click="handleMuteAudio"
          />
          <img
            v-else
            class="img"
            src="../../../../../../../assets/rtrc/img/big-mic-off.png"
            alt=""
            @click="handleUnMuteAudio"
          />
        </div>
        <div class="ml-2 vidio-btn">
          <img
            v-if="localVideo"
            class="img"
            src="../../../../../../../assets/rtrc/img/big-camera-on.png"
            alt=""
            @click="handleMuteVideo"
          />
          <img
            v-else
            class="img"
            src="../../../../../../../assets/rtrc/img/big-camera-off.png"
            alt=""
            @click="handleUnMuteVideo"
          />
        </div>
      </div>
    </div>
    <div v-for="(item, index) in remoteStreamArr" :key="index" class="mr-5 remote-stream">
      <div v-html="item.view" :class="{ 'remote-stream': item.view }"></div>
    </div>
  </div>
</template>

<script lang="ts">
  import TrtcClass from '/@/utils/rtrc/rtc';
  import { ref, defineComponent, nextTick, watch, computed } from 'vue';
  import { useVideoStore } from '/@/store/modules/video';
  export default defineComponent({
    props: {
      userId: String,
      isLoad: Boolean,
      doctorInfo: Object,
      orderId: String,
      userSig: String,
      userName: String,
      avatar: String,
    },
    emits: ['handleUpdate'],
    setup(props, { emit }) {
      const localAudio = ref(true);
      const localVideo = ref(true);
      // const isLocalStream = ref(false);
      const videoStore = useVideoStore();
      const isLocalStream = computed(() => videoStore.isLocalStream);
      // 退房
      const leave = () => {
        TrtcClass.handleLeave();
        videoStore.setPlayListActions([]);
        videoStore.setIsLocalStreamStatus(false);
        //TrtcClass.client.switchRole('audience');
      };

      const remoteStreamArr = computed(() => videoStore.playList);

      const handleMuteAudio = () => {
        TrtcClass.muteAudio();
        localAudio.value = false;
      };
      const handleMuteVideo = () => {
        TrtcClass.muteVideo();
        localVideo.value = false;
      };
      const handleUnMuteAudio = () => {
        TrtcClass.unmuteAideo();
        localAudio.value = true;
      };

      const handleUnMuteVideo = () => {
        TrtcClass.unmuteVideo();
        localVideo.value = true;
      };

      watch(
        () => {
          return props.isLoad;
        },
        (state) => {
          if (state) {
            nextTick(async () => {
              let options = {
                userId: props?.userId,
                roomId: Number(props?.doctorInfo?.doctor_id),
                userSig: props?.userSig,
                userName: props?.userName,
                avatar: props?.avatar,
              };
              TrtcClass.init(options);
              // console.log(TrtcClass);
              JoinRoomSync();
            });
          }
        },
        {
          immediate: true,
          deep: true,
        }
      );

      const JoinRoomSync = () => {
        TrtcClass.join().then(() => {
          // isLocalStream.value = true;
          videoStore.setIsLocalStreamStatus(true);
          bindEvents(TrtcClass.client);
        });
      };
      let arr = [] as any;
      const addUser = async (userId: any) => {
        // console.log('1111', userId, userId.indexOf('u') != -1, userId.indexOf('d') != -1);
        if (userId.indexOf('d') != -1) {
          videoStore.setDoctorStatusActions('2', props?.orderId);
        }
        if (userId.indexOf('u') != -1) {
          videoStore.setPatientStatusActions('2', props?.orderId);
        }
        const data: any = await TrtcClass.getUserProfile({ userId: userId });
        // console.log(data);
        // m = data;
        arr.push(data[0]);
        await emit('handleUpdate', arr);
      };

      //远端流--加入房间处理
      const addStream = (stream) => {
        // console.log('远端流订阅成功：' + stream.getId());
        // 创建远端流标签，因为id是动态的，所以动态创建，用了v-html
        // console.log(333333333333);
        let arr = remoteStreamArr.value;
        let remoteStreamItem = `<view id="${'remote_stream-' + stream.getId()}"></view>`;
        let isExist = arr.find((item) => item.userId === stream.getUserId());
        if (!isExist) {
          arr.push({
            id: stream.getId(),
            userId: stream.getUserId(),
            view: remoteStreamItem,
            hasVideo: true, // 是否开启了摄像头
            hasMic: true, // 是否开启了麦克风
          });

          // console.log(remoteStreamArr.list);
        } else {
          arr.splice(
            arr.findIndex((v) => v.userId === stream.getUserId()),
            1,
            {
              id: stream.getId(),
              userId: stream.getUserId(),
              view: remoteStreamItem,
              hasVideo: true, // 是否开启了摄像头
              hasMic: true, // 是否开启了麦克风
            }
          );
        }
        videoStore.setPlayListActions(arr);
        playStream(stream);
      };
      const removeUser = async (userId: any) => {
        if (userId.indexOf('d') != -1) {
          videoStore.setDoctorStatusActions('3', props?.orderId);
        }
        if (userId.indexOf('u') != -1) {
          videoStore.setPatientStatusActions('3', props?.orderId);
        }
        // remoteStreamArr.list = remoteStreamArr.list.filter((item) => item.userId !== userId);
        // console.log(arr);
        arr = arr.filter((item: any) => item.userID != userId);
        emit('handleUpdate', arr);
      };

      // 远端流--退出房间处理
      const removeStream = (stream: any) => {
        let userId = stream.getUserId();
        if (userId.indexOf('d') != -1) {
          videoStore.setDoctorStatusActions('3', props?.orderId);
        }
        if (userId.indexOf('u') != -1) {
          videoStore.setPatientStatusActions('3', props?.orderId);
        }
      };

      const playStream = (stream: any) => {
        // 做了dom操作 需要使用$nextTick(),否则找不到创建的标签无法进行播放
        nextTick(() => {
          //播放远端流
          stream.play('remote_stream-' + stream.getId());
        });
      };

      // 注册监听状态

      const bindEvents = (client) => {
        client.on('error', (error) => {
          console.error(error);
          // alert(error);
        });
        client.on('client-banned', (error) => {
          console.error(`client has been banned for ${error}`);
          // alert(error);
        });
        // fired when a remote peer is joining the room
        client.on('peer-join', (event) => {
          const { userId } = event;
          console.log(`peer-join ${userId}`, event);
          addUser(userId);
        });
        // fired when a remote peer is leaving the room
        client.on('peer-leave', (event) => {
          const { userId } = event;
          console.log(`peer-leave ${userId}`, event);
          removeUser(userId);
        });

        // fired when a remote stream is added
        client.on('stream-added', (event) => {
          const { stream: remoteStream } = event;
          const remoteUserID = remoteStream.getUserId();
          if (remoteUserID === `share_${props.userId}`) {
            // don't need screen shared by us
            // this.handleUnSubscribe(remoteStream);
          } else {
            console.log(`remote stream added: [${remoteUserID}] type: ${remoteStream.getType()}`);
            // subscribe to this remote stream
            // this.handleSubscribe(remoteStream);
            client.subscribe(remoteStream);
            // addStream(remoteStream);
            // this.client.subscribe(remoteStream);
          }
        });
        // fired when a remote stream has been subscribed
        client.on('stream-subscribed', (event) => {
          const { stream: remoteStream } = event;
          addStream(remoteStream);
        });
        // fired when the remote stream is removed, e.g. the remote user called Client.unpublish()
        client.on('stream-removed', (event) => {
          const { stream: remoteStream } = event;
          remoteStream.stop();
          removeStream(remoteStream);
          console.log(
            `stream-removed userId: ${remoteStream.getUserId()} type: ${remoteStream.getType()}`
          );
        });

        client.on('stream-updated', (event) => {
          const { stream: remoteStream } = event;
          // this.updateStream && this.updateStream(remoteStream);
          console.log(
            `type: ${remoteStream.getType()} stream-updated hasAudio: ${remoteStream.hasAudio()} hasVideo: ${remoteStream.hasVideo()}`
          );
        });

        client.on('mute-audio', (event) => {
          const { userId } = event;
          console.log(`${userId} mute audio`);
          // this.updateStreamConfig && this.updateStreamConfig(userId, 'mute-audio');
        });
        client.on('unmute-audio', (event) => {
          const { userId } = event;
          console.log(`${userId} unmute audio`);
          // this.updateStreamConfig && this.updateStreamConfig(userId, 'unmute-audio');
        });
        client.on('mute-video', (event) => {
          const { userId } = event;
          console.log(`${userId} mute video`);
          // this.updateStreamConfig && this.updateStreamConfig(userId, 'mute-video');
        });
        client.on('unmute-video', (event) => {
          const { userId } = event;
          console.log(`${userId} unmute video`);
          // this.updateStreamConfig && this.updateStreamConfig(userId, 'unmute-video');
        });

        client.on('connection-state-changed', (event) => {
          console.log(`RtcClient state changed to ${event.state} from ${event.prevState}`);
        });

        client.on('network-quality', (event) => {
          const { uplinkNetworkQuality, downlinkNetworkQuality } = event;
          console.log(
            `network-quality uplinkNetworkQuality: ${uplinkNetworkQuality}, downlinkNetworkQuality: ${downlinkNetworkQuality}`
          );
          // this.updateStreamConfig &&
          //   this.updateStreamConfig(this.userID, 'uplink-network-quality', uplinkNetworkQuality);
          // this.updateStreamConfig &&
          //   this.updateStreamConfig(this.userID, 'downlink-network-quality', downlinkNetworkQuality);
        });
      };

      return {
        // ...toRefs(remoteStreamArr),
        remoteStreamArr,
        leave,
        localAudio,
        localVideo,
        isLocalStream,
        handleMuteAudio,
        handleMuteVideo,
        handleUnMuteAudio,
        handleUnMuteVideo,
        JoinRoomSync,
      };
    },
  });
</script>

<style lang="less">
  .video_grid {
    display: flex;
    flex-wrap: wrap;
    flex: 1;
  }
  .local-stream {
    width: 300px;
    height: 300px;
    position: relative;
  }

  .remote-stream {
    width: 300px;
    height: 300px;
    position: relative;
  }

  .operate-btn {
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 9999;
    display: flex;
    justify-content: flex-end;
    width: 100%;
    padding-right: 10px;
    padding-bottom: 10px;
    .img {
      width: 32px;
      height: 32px;
    }
  }
</style>
