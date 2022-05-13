import { SDKAPPID, EXPIRETIME, SECRETKEY } from './config/config';
import TIM from 'tim-js-sdk';
import TIMUploadPlugin from 'tim-upload-plugin';
import TRTC from 'trtc-js-sdk';
import { message } from 'ant-design-vue';

class RtcClass {
  roomId: any;
  client: any;
  localStream: any;
  config: {
    SECRETKEY: string;
    sdkAppId: number;
    userId: string;
    userName: string;
    userSig: '';
    avatar: string;
  };
  remoteStreamArr: Array<any>;
  remoteStream: any;
  tim: any;
  isLeaving: boolean;
  isPublished: boolean;
  isPublishing: boolean;
  isUnPublishing: boolean;

  constructor() {
    this.config = {
      SECRETKEY: SECRETKEY,
      sdkAppId: SDKAPPID,
      userId: '',
      userSig: '',
      userName: '',
      avatar: '',
    }; // rtct 配置
    this.localStream = null; // 本地流
    this.remoteStreamArr = []; // 远端流
    this.remoteStream = null;
    this.client = null;
    this.roomId = null;
    this.tim = null;
    this.isLeaving = false;
    this.isPublishing = false;
    this.isPublished = false;
    this.isUnPublishing = false;
  }

  // 初始化
  init(options: any) {
    console.log(options);
    this.config.userId = 'yz_' + options.userId;
    this.config.userSig = options.userSig;
    this.config.userName = options.userName;
    this.config.avatar = options.avatar;
    this.roomId = options.roomId;
    this.initIm();
    this.create();
  }

  initIm() {
    let that = this;
    this.tim = TIM.create({ SDKAppID: this.config.sdkAppId });
    this.tim.registerPlugin({ 'tim-upload-plugin': TIMUploadPlugin });
    this.tim.on(TIM.EVENT.SDK_READY, function (event) {
      console.log('SDK_READY');
      // that.globalData.isImLogin = true;
      // 收到离线消息和会话列表同步完毕通知，接入侧可以调用 sendMessage 等需要鉴权的接口
      // event.name - TIM.EVENT.SDK_READY
      that.updateMyInfo();
    });
    let promise = this.tim.login({ userID: this.config.userId, userSig: this.config.userSig });
    promise
      .then(function (imResponse) {
        console.log(imResponse.data); // 登录成功
        if (imResponse.data.repeatLogin === true) {
          // 标识账号已登录，本次登录操作为重复登录。v2.5.1 起支持
          console.log(imResponse.data.errorInfo);
        }
      })
      .catch(function (imError) {
        console.warn('login error:', imError); // 登录失败的相关信息
      });
  }

  updateMyInfo() {
    // 修改个人标配资料
    let promise2 = this.tim.updateMyProfile({
      nick: this.config.userName,
      avatar: this.config.avatar,
      gender: TIM.TYPES.GENDER_MALE,
      selfSignature: '我的个性签名',
      allowType: TIM.TYPES.ALLOW_TYPE_ALLOW_ANY,
    });
    promise2
      .then(function (imResponse) {
        console.log('1111111111', imResponse.data); // 更新资料成功
      })
      .catch(function (imError) {
        console.log('updateMyProfile error:', imError); // 更新资料失败的相关信息
      });
  }

  getUserProfile(params) {
    let that = this;
    return new Promise((resolve, reject) => {
      that.tim
        .getUserProfile({
          userIDList: [params.userId],
        })
        .then(function (imResponse) {
          // console.log(imResponse.data);
          resolve(imResponse.data);
        })
        .catch(function (imError) {
          console.warn('getUserProfile error:', imError);
        });
    });
  }

  // 创建房间
  create() {
    this.client = TRTC.createClient({
      mode: 'live',
      role: 'audience',
      ...this.config,
    });
  }

  // 加入房房间
  join() {
    let that = this;
    return new Promise<void>((resolve, reject) => {
      that.client
        .join({ roomId: that.roomId })
        .catch((error) => {
          console.error('进房失败 ' + error);
        })
        .then(() => {
          console.log('进房成功');
          that.createStream(that.config.userId); //创建本地流
          resolve();
          // playStream(client); //播放远端流
          // handleEvents(client); //监听远端流退房删除
        });
    });
  }

  // 创建本地视频流

  async createStream(userId) {
    let that = this;
    const localStream = TRTC.createStream({
      userId,
      audio: true,
      video: true,
    });
    this.localStream = localStream;
    try {
      await localStream.initialize().then(() => {
        console.log('初始化本地流成功');
        // 创建好后才能播放 本地流播放 local_stream 是div的id
        localStream.play('local_stream');
        // 创建好后才能发布
        this.publishStream(localStream, this.client);
      });
    } catch (error: any) {
      switch (error.name) {
        case 'NotReadableError':
          message.warning(
            '暂时无法访问摄像头/麦克风，请确保系统允许当前浏览器访问摄像头/麦克风，并且没有其他应用占用摄像头/麦克风'
          );
          break;
        case 'NotAllowedError':
          if (error.message === 'Permission denied by system') {
            message.warning('请确保系统允许当前浏览器访问摄像头/麦克风');
          } else {
            console.log('User refused to share the screen');
            message.warning('请确保系统允许当前浏览器访问摄像头/麦克风');
          }
          break;
        case 'NotFoundError':
          message.warning(
            '浏览器获取不到摄像头/麦克风设备，请检查设备连接并且确保系统允许当前浏览器访问摄像头/麦克风'
          );
          break;
        default:
          break;
      }
    }
  }

  // 发布本地视频流
  publishStream(localStream, client) {
    client
      .publish(localStream)
      .catch((error) => {
        console.error('本地流发布失败 ' + error);
      })
      .then(() => {
        console.log('本地流发布成功');
      });
  }

  // 退出房间
  async handleLeave() {
    this.isLeaving = true;
    this.stopGetAudioLevel();
    this.destroyLocalStream();
  }

  stopGetAudioLevel() {
    this.client && this.client.enableAudioVolumeEvaluation(-1);
  }

  async destroyLocalStream() {
    await this.client.unpublish(this.localStream);
    // leave the room
    await this.client.leave();
    this.localStream.stop();
    this.localStream.close();
    this.localStream = null;
    message.success('离开诊室');
  }

  // 检查设备是否异常
  inspectionEquipment() {}

  // 禁用音频
  muteAudio() {
    this.localStream.muteAudio();
  }
  // 禁用视频
  muteVideo() {
    this.localStream.muteVideo();
  }
  // 启用视频
  unmuteAideo() {
    this.localStream.unmuteAudio();
  }
  // 启用音频
  unmuteVideo() {
    this.localStream.unmuteVideo();
  }

  // 检查浏览器版本是否支持
}

export default new RtcClass();
