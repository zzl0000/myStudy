<template>
  <div v-if="isConsultingRoom" class="mb-3 no-vide-gaid">
    <div v-if="isLeaveRoom">
      <a-alert type="warning" show-icon @click="onJoinRoom">
        <template #message>
          当前医患正在视频中，<a-button type="link">点此进入</a-button>
        </template>
      </a-alert>
    </div>
  </div>
  <div v-if="isLoad && patientStatus == 0" class="mb-3 no-vide-gaid">
    <a-alert type="warning" show-icon @click="onJoinRoom">
      <template #message> 患者还未支付，支付后发起视频 </template>
    </a-alert>
  </div>
  <div v-if="!isConsultingRoom" class="consulting-room">
    <!-- <a-button type="primary" danger class="btn join-btn" @click="handleCreateConsultingRomm"
      >点此进入诊室</a-button
    > -->
    <div class="join-btn" @click="handleCreateConsultingRomm">进入诊室</div>
    <VideoPlayer />
  </div>

  <!-- 腾讯云 视频诊室 -->
  <div v-else class="rtrc-video-wrap">
    <!-- 成员列表 -->
    <!-- <a-card class="member-list"> -->
    <div class="invite-box">
      <!-- 医生卡片 -->
      <div class="doctor-card">
        <div class="add-icon">
          <img src="../../../../../../../assets/btns/add.png" alt="" class="btn-img" />
        </div>
        <div class="doctor-name">
          <div>医生：{{ doctorInfo.doctor_name }}</div>
          <div>{{
            doctorStatus === '1'
              ? '已发送通知'
              : doctorStatus === '2'
              ? '已进入诊室'
              : doctorStatus === '3'
              ? '已退出诊室'
              : ''
          }}</div>
          <div @click="onInviteDoctor" class="join-btns" style="margin: 10px auto">邀请</div>
        </div>
      </div>
      <!-- 患者卡片 -->
      <div class="patient-card">
        <div class="add-icon-2">
          <img src="../../../../../../../assets/btns/add.png" alt="" class="btn-img" />
        </div>
        <div class="doctor-name doctor-name-2">
          <div style="margin-right: 10px">患者：{{ patientInfo.patient_name }}</div>
          <div>{{
            patientStatus === '1'
              ? '已发送通知'
              : patientStatus === '2'
              ? '已进入诊室'
              : patientStatus === '3'
              ? '已退出诊室'
              : ''
          }}</div>
          <div @click="onInvitePatient" class="join-btns" style="margin: 3px 15px">叫号</div>
        </div>
      </div>
      <!-- 医助卡片 -->
      <div class="other-card" v-if="!isLeaveRoom">
        <div class="item-title docter-other">
          <div class="img-info">
            <img src="../../../../../../../assets/btns/info.png" alt="" class="btn-img" />
          </div>
          <div class="member-name" style="font-size: 15px">
            {{ useStore.getUserInfo.title }}医助
          </div>
          <div class="member-btns">
            <div class="item-btn" v-if="localAudio" @click="handleMuteAudio">
              <img src="../../../../../../../assets/btns/volume.png" alt="" class="btn-img" />
            </div>
            <div class="item-btn" v-else @click="handleUnMuteAudio">
              <img src="../../../../../../../assets/btns/vedio-no.png" alt="" class="btn-img" />
            </div>
            <div class="item-btn" @click="handleYzLeave">
              <img src="../../../../../../../assets/btns/close.png" alt="" class="btn-img" />
            </div>
            <div class="item-btn" v-if="localVideo" @click="handleMuteVideo">
              <img src="../../../../../../../assets/btns/camera.png" alt="" class="btn-img" />
            </div>
            <div class="item-btn" v-else @click="handleUnMuteVideo">
              <img src="../../../../../../../assets/btns/cmare-no.png" alt="" class="btn-img" />
            </div>
          </div>
        </div>
      </div>
      <!-- <div
        class="invite-item"
        :class="patientStatus === 0 ? 'disabled' : ''"
        @click="onInvitePatient"
      >
        <div class="invite-cont">
          <a-avatar :size="40" :src="patientInfo.user_avatar">
            <template #icon><UserOutlined /></template>
          </a-avatar>
          <p class="name ellipsis">邀请{{ patientInfo.patient_name }}患者</p>
          <p class="desc">{{
            patientStatus === '1'
              ? '已发送通知'
              : patientStatus === '2'
              ? '已进入诊室'
              : patientStatus === '3'
              ? '已退出诊室'
              : ''
          }}</p>
        </div>
      </div> -->
      <!-- <div
        class="invite-item"
        :class="patientStatus === 0 ? 'disabled' : ''"
        @click="onInviteDoctor"
      >
        <div class="invite-cont">
          <a-avatar :size="40" :src="doctorInfo.doctor_avatar">
            <template #icon><UserOutlined /></template>
          </a-avatar>
          <p class="name ellipsis">邀请{{ doctorInfo.doctor_name }}医生</p>
          <p class="desc">{{
            doctorStatus === '1'
              ? '已发送通知'
              : doctorStatus === '2'
              ? '已进入诊室'
              : doctorStatus === '3'
              ? '已退出诊室'
              : ''
          }}</p>
        </div>
      </div>-->
    </div>
    <div v-if="!isLeaveRoom">
      <!-- v-show="isLocalStream" -->
      <!-- <div class="member-item">
        <div class="member-name"> {{ useStore.getUserInfo.title }} 医助 </div>
        <div class="btn-group">
          <div class="member-operate-btn" @click="handleYzLeave()">
            <a-button :disabled="!isLocalStream" type="danger" size="small">离开诊室</a-button>
          </div>
        </div>
      </div> -->
      <div class="member-item" v-for="(item, index) in userList" :key="index">
        <!-- doctor -->
        <div v-if="item.type == 'doctor'" class="item-title item-doctor">
          <div class="member-name" style="font-size: 15px"> 医生：{{ item.nick }} </div>
          <div class="btn-group">
            <div class="member-operate-btn-spc" @click="handleLeave(item.userID)">
              <!-- <a-button type="danger" size="small"></a-button> -->移除诊室
            </div>
          </div>
        </div>
        <!-- patient -->
        <div v-if="item.type == 'patient'" class="item-title item-patient">
          <div class="member-name"> 患者：{{ item.nick }} </div>
          <div class="btn-group">
            <div class="member-operate-btn-spc" @click="handleLeave(item.userID)"> 移除诊室 </div>
          </div>
        </div>
      </div>
    </div>
    <!-- </a-card> -->
    <!-- 视频网格 -->
    <!-- <div class="vide-gaid"> -->
    <!--  主视频 -->
    <VideoGaid
      v-show="!isLeaveRoom"
      ref="trtccomp"
      :isLoad="isLoad"
      :orderId="orderId"
      :doctorInfo="doctorInfo"
      :userId="useStore.getUserInfo.id"
      :userSig="userSig"
      :userName="useStore.getUserInfo.title"
      :avatar="useStore.getUserInfo.avatar"
      :list="userList"
      :enlarge="enlarge"
      @handleUpdate="handleUpdate"
    />
    <!-- </div> -->
  </div>

  <QrModal @register="registerModal" />
</template>

<script lang="ts">
  import { reactive, ref, defineComponent, computed, inject, toRefs, watch, nextTick } from 'vue';
  import { message } from 'ant-design-vue';
  import { UserOutlined } from '@ant-design/icons-vue';
  import { QrModal } from '../model';
  import { useModal } from '/@/components/Modal';
  import {
    GetVideoInfo,
    GetVideoPatient,
    GetVideoDoctor,
    GetRongcloudToken,
    GetVideoRemoveUser,
    GetCheckYzRoom,
  } from '/@/api/sys/videoInterrogation';
  import { VideoGaid, VideoPlayer } from '../model';
  import { useUserStore } from '/@/store/modules/user';
  import { useVideoStore } from '/@/store/modules/video';
  import { setRoomState } from '/@/utils/auth';
  import { useClinicalReceptionStore } from '/@/store/modules/clinical-reception';
  import TrtcClass from '/@/utils/rtrc/rtc';
  export default defineComponent({
    name: 'TrtcVideoInterrogation',
    components: {
      UserOutlined,
      QrModal,
      VideoGaid,
      VideoPlayer,
    },
    props: {
      id: String,
      doctorId: String,
    },
    emits: ['changeTab'],
    setup(props) {
      const srcVideo = '../../../../../../../assets/images/vedio.png';
      const videoStore = useVideoStore();
      const [registerModal, { openModal }] = useModal();
      const useStore = useUserStore();
      // const order_data: any = inject('data');

      // 状态集
      const isConsultingRoom = computed(() => {
        return videoStore.getIsConsultingRoomStatus;
      });
      // const isConsultingRoom = ref(false);
      const isLocalStream = computed(() => videoStore.isLocalStream);
      const isLeaveRoom = computed(() => videoStore.getIsLeaveRoomStatus);
      const isLoad = ref(false);

      // trtc config
      const trtcCf = reactive({
        userSig: '',
      });

      const patientStatus: any = computed(() => videoStore.patientStatus);

      const doctorStatus: any = computed(() => videoStore.dictorStatus);

      const isInvite = computed(() =>
        patientStatus.value == 1 && doctorStatus.value == 1 ? true : false
      );
      const isJoinRoom = computed(() =>
        patientStatus.value == 1 && doctorStatus.value == 1 ? true : false
      );

      const useClinicalReception = useClinicalReceptionStore();

      const payStatus = computed(() => useClinicalReception.payStatus);
      const orderSn = computed(() => useClinicalReception.orderSn);
      const patientInfo: any = computed(() => useClinicalReception.patientStore);
      const doctorInfo: any = computed(() => useClinicalReception.doctoreStore);

      // console.log(useStore);

      // 基础数据

      const data = reactive({
        qrCode: '',
      });

      // let patientStatus = ref();
      // let doctorStatus = ref();

      //    视频问诊;用户列表
      const userList = ref([] as any);

      // 初始化

      watch(
        () => {
          return patientInfo.value.paid;
        },
        (state) => {
          if (state) {
            nextTick(async () => {
              // initData();
              videoStore.setPatientStatusActions('4', orderSn.value);
            });
          }
        }
      );

      watch(
        () => {
          return props.doctorId;
        },
        (state) => {
          if (state) {
            nextTick(async () => {
              userList.value = [];
              initData();
            });
          }
        },
        {
          immediate: true,
          deep: true,
        }
      );
      const localAudio = ref(true);
      const localVideo = ref(true);
      //
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
      // onBeforeMount(() => {
      //   initData();
      // });

      let token = '';
      const initData = async () => {
        // if (isConsultingRoom.value) {
        //   return;
        // }
        await getVideoInfo();
        if (isConsultingRoom.value) {
          await getRongcloudToken();
        }

        // console.log(videoStore);
        // videoStore.setPlayListActions([]);
      };

      // 获取视频信息
      const getVideoInfo = () => {
        return new Promise(async (resolve) => {
          if (!orderSn.value) {
            message.warning('订单号不存在');
            return;
          }
          // message.loading('加载中...');
          const res: any = await GetVideoInfo({ order_sn: orderSn.value });
          // message.destroy();
          if (res?.info) {
            data.qrCode = res?.qrcode;
            resolve(res);
          }
        });
      };

      const onReceiveMessage = (message) => {
        console.log(message);
        let contentType = message?.message?.content?.name;
        if (contentType === '诊室已关闭') {
        }
      };

      // 获取融云token和 腾讯云userSig

      const getRongcloudToken = () => {
        return new Promise(async (resolve) => {
          const userInfo: any = useStore.getUserInfo;
          console.log(userInfo);
          const res: any = await GetRongcloudToken({
            user_id: userInfo.id,
            name: userInfo.mobile,
            avatar: userInfo.avatar,
          });
          token = res.token;
          // user_sig
          isLoad.value = true;
          trtcCf.userSig = res.user_sig;
          resolve(res);
        });
      };

      const handleCreateConsultingRomm = async () => {
        if (payStatus.value === 0) {
          message.warning('患者还未支付，支付后发起视频');
          return;
        }
        try {
          await getRongcloudToken();
          await GetCheckYzRoom({ order_sn: orderSn.value });
          setRoomState('roomState', { roomId: doctorInfo.value.doctor_id, state: true });
          // isConsultingRoom.value = true;
          videoStore.setIsConsultingRoomStatus(true);
        } catch (error) {
          console.log(error);
        }
      };

      // 邀请用户

      const onInvitePatient = async () => {
        if (payStatus.value === 0) {
          return;
        }
        // console.log(patientStatus.value);
        if (patientStatus.value == 1) {
          message.info('该患者已发送过邀请，请勿重复发起邀请!');
          return;
        }
        if (patientStatus.value == 2) {
          message.info('该患者已加入诊室，请勿重复发起邀请!');
          return;
        }
        message.loading('加载中...');
        const a: any = await GetVideoPatient({ order_sn: orderSn.value });
        console.log(a);
        videoStore.setPatientStatusActions('1', orderSn.value);
        message.destroy();
        message.success('已发送通知！');

        openModal(true, {
          a: a.url,
          qrCode: data.qrCode,
          doctor_name: doctorInfo.value.doctor_name,
          patient_name: patientInfo.value.patient_name,
          order_sn: orderSn.value,
        });
      };

      // 邀请医生

      const onInviteDoctor = async () => {
        if (payStatus.value === 0) {
          return;
        }

        if (doctorStatus.value == 1) {
          message.info('该医生已发送过邀请，请勿重复发起邀请!');
          return;
        }
        if (doctorStatus.value == 2) {
          message.info('该医生已加入诊室，请勿重复发起邀请!');
          return;
        }

        //await GetChatStateAddQueue(params);
        message.loading('加载中...');
        await GetVideoDoctor({ order_sn: orderSn.value });
        videoStore.setDoctorStatusActions('1', orderSn.value);
        message.destroy();
        message.success('已发送通知！');
      };

      // 更新问诊用户列表

      const handleUpdate = (arr: any) => {
        let newArr = [];
        newArr = arr.filter((x, index, self) => {
          var arrids = [];
          arr.forEach((item, i) => {
            arrids.push(item.userID);
          });
          return arrids.indexOf(x.userID) === index;
        });
        console.log(newArr);

        userList.value = newArr;
      };

      // 患者、医生退出诊室
      const handleLeave = async (userId) => {
        let room_id = doctorInfo.value.doctor_id;
        try {
          const { code } = await GetVideoRemoveUser({
            room_id: room_id,
            user_ids: userId,
          });
          userList.value = userList.value.filter((f) => f.userID != userId);
        } catch (error) {
          console.log(error);
        }
      };
      const trtccomp = ref();
      // 医助退出诊室
      const handleYzLeave = () => {
        setTimeout(() => {
          trtccomp.value.leave();
          // isLeaveRoom.value = true;
          // isConsultingRoom.value = false;

          videoStore.setIsConsultingRoomStatus(false);
          videoStore.setIsLeaveRoomStatus(false);
          // isLeaveRoom.value = false;
          videoStore.setDoctorStatusActions('3', orderSn.value);
          videoStore.setPatientStatusActions('3', orderSn.value);
          setRoomState('roomState', { roomId: doctorInfo.value.doctor_id, state: false });
        }, 1000);
      };

      // 重新加入房间

      const onJoinRoom = () => {
        // isLeaveRoom.value = false;
        videoStore.setIsLeaveRoomStatus(false);
        isLoad.value = true;
        videoStore.setPatientStatusActions('2', orderSn.value);
        videoStore.setDoctorStatusActions('2', orderSn.value);
      };
      // 点击图标 切换视频大小
      const enlarge = ref();
      const checkoutBig = (value) => {
        enlarge.value = value;
      };
      return {
        enlarge,
        checkoutBig,
        isConsultingRoom,
        isLocalStream,
        isLeaveRoom,
        isLoad,
        isInvite,
        isJoinRoom,
        ...toRefs(trtcCf),
        payStatus,
        orderSn,
        patientInfo,
        doctorInfo,
        data,
        useStore,
        userList,
        patientStatus,
        doctorStatus,
        registerModal,
        handleCreateConsultingRomm,
        onInvitePatient,
        handleUpdate,
        onInviteDoctor,
        handleLeave,
        handleYzLeave,
        trtccomp,
        onJoinRoom,
        srcVideo,
        localAudio,
        localVideo,
        handleMuteAudio,
        handleMuteVideo,
        handleUnMuteAudio,
        handleUnMuteVideo,
      };
    },
  });
</script>

<style lang="less">
  .join-btns {
    cursor: pointer;
    width: 109px;
    height: 36px;
    line-height: 34px;
    font-size: 22px;
    color: #fff;
    background: #409eff;

    border-radius: 10px;
  }
  #rong-video-box {
    background: #000;

    .res-tag {
      position: absolute;
      top: 1px;
      left: 1px;
      background-color: #ecf5ff;
      display: inline-block;
      height: 32px;
      padding: 0 10px;
      line-height: 30px;
      font-size: 12px;
      color: #409eff;
      border: 1px solid #d9ecff;
      border-radius: 4px;
      box-sizing: border-box;
      white-space: nowrap;
    }
    video {
      width: 100%;
      height: 600px;
      background: #69696938;
    }
    .video-wrap {
      display: inline-block;
      position: relative;
      width: 48%;
      margin: 1%;
      vertical-align: top;
    }
  }
</style>

<style lang="less" scoped>
  .join-btn {
    position: absolute;
    top: 145px;
    height: 0px;
    width: 1200px;
    height: 700px;
    background: red;
    z-index: 100;
    cursor: pointer;
    opacity: 0;
  }
  .box-item {
    display: flex;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 5px;
  }
  .invite-item {
    position: relative;
    display: inline-block;
    background: #fff;
    border-radius: 8px;
    width: 120px;
    height: 130px;
    padding: 15px 0;
    transition: color 0.3s ease-in-out, background-color 0.3s ease-in-out;
    cursor: pointer;
    margin: 20px auto;
    box-shadow: 0 2px 8px #00000017;
    vertical-align: top;
    &.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .plus-icon {
      position: absolute;
      left: 10px;
      font-size: 24px;
      color: #999;
      margin-top: 30px;
    }
    .invite-cont {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .name {
      font-size: 13px;
      font-weight: 500;
      color: #000;
      margin-top: 10px;
      margin-bottom: 0;
      padding: 0 10px;
    }
    .desc {
      margin-top: 5px;
      margin-bottom: 0;
      font-size: 14px;
      color: #999;
    }
    &:not(.disabled):hover {
      .name {
        color: @primary-color;
      }
    }
  }
  .invite-box {
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #dedede;
    // margin-bottom: 20px;
  }

  .consulting-room {
    display: flex;
    min-height: 750px;
    width: 100%;
    justify-content: center;
    align-items: flex-start;
    .btn {
      width: 200px;
      height: 60px;
      margin-top: 200px;
      font-size: 24px;
    }
  }
  .item-title {
    z-index: 100;
    display: flex;
    width: 268px;
    height: 62px;
    background: rgba(0, 0, 0, 0.63);
    line-height: 62px;
    font-size: 22px;
    color: #fff;
    padding-left: 14px;
    align-items: center;
    box-sizing: border-box;
  }
  .icon-big {
    width: 55px;
    height: 55px;
    position: absolute;
    top: -246px;
    right: 14px;
    z-index: 100;
    cursor: pointer;
  }
  .item-doctor {
    position: absolute;
    top: 256px;
    right: 0px;
  }
  .item-patient {
    position: absolute;
    bottom: 0px;
    left: 0px;
    width: calc(100% - 268px);
    padding-left: 25px;
  }

  .member-operate-btn-spc {
    width: 83px;
    height: 35px;
    background: #f95151;
    border-radius: 8px;
    font-size: 14px;
    color: #fff;
    font-weight: 600;
    line-height: 35px;
    margin-left: 27px;
    text-align: center;
    cursor: pointer;
  }
  .rtrc-video-wrap {
    // display: flex;
    min-height: 750px;
    width: 100%;
    // padding-bottom: 30px;
    // background: rgba(0, 0, 0, 0.23);
    border-radius: 10px;
    // ../../../assets/images/logo.png
    background: url(../../../../../../../assets/btns/vedio-back.png) no-repeat;
    background-size: 100% 100%;
    position: relative;
    .member-list {
      width: 350px;
      display: flex;
      flex-direction: column;
      .member-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #dedede;
        padding-bottom: 15px;
        margin-bottom: 15px;
        .btn-group {
          display: flex;
        }
      }
    }
    .vide-gaid {
      display: flex;
      flex: 1;
      // border: 1px solid #f0f0f0;
      margin-left: 20px;
      padding: 20px;
      .video-box {
        display: flex;
        width: 350px;
        height: 350px;
        background: red;
      }
    }
    .no-vide-gaid {
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: center;
    }
  }
  .rong-video-wrap {
    background: #000;
  }
  .btn-box {
    text-align: center;
    padding-bottom: 1%;
  }
  .member-info {
    position: absolute;
    top: 30px;
    left: 30px;
    display: flex;
    z-index: 50;

    .info-name {
      font-size: 30px;
      color: #fff;
      font-weight: 600;
      line-height: 70px;
    }
  }
  .member-btns {
    margin-left: 7px;
    display: flex;
    .item-btn {
      width: 30px;
      height: 30px;
      margin-right: 7px;
      cursor: pointer;
    }
    .btn-img {
      width: 100%;
      height: 100%;
    }
  }
  .doctor-card {
    position: absolute;
    right: 0px;
    top: 0px;
    width: 268px;
    height: 318px;
    background: rgba(0, 0, 0, 0.21);
    border-radius: 4px 4px 0px 0px;
    z-index: 50;
  }
  .add-icon {
    width: 74px;
    height: 74;
    margin: 50px auto 0px;
    cursor: pointer;
  }
  .doctor-name {
    margin-top: 40px;
    font-weight: 600;
    font-size: 26px;
    color: #fff;
    font-family: PingFangSC-Semibold, PingFang SC;
    text-align: center;
  }
  .patient-card {
    position: absolute;
    left: 0px;
    bottom: 0px;
    width: calc(100% - 268px);
    height: 62px;
    background: rgba(0, 0, 0, 0.21);
    border-radius: 4px 4px 0px 0px;
    // z-index: 50;
    display: flex;
    align-items: center;
    padding-left: 50px;
  }
  .add-icon-2 {
    width: 35px;
    height: 35px;
    margin-right: 15px;
    cursor: pointer;
  }
  .doctor-name-2 {
    margin-top: 0px;
    display: flex;
  }
  .other-card {
    position: absolute;
    right: 0px;
    bottom: 0px;
    width: 268px;
    height: 318px;
    background: rgba(0, 0, 0, 0.21);
    border-radius: 4px 4px 0px 0px;
    z-index: 50;
  }
  .docter-other {
    position: absolute;
    bottom: 0px;
    right: 0px;
  }
  .img-info {
    width: 30px;
    height: 30px;
    border-radius: 10px;
    margin-right: 7px;
  }
</style>
