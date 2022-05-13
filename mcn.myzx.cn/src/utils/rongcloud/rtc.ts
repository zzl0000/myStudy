import { LogLevel } from '@rongcloud/engine';
import { installer, RCRTCCode, RCTrack, RCRemoteTrack, helper, RCRTCRoom, RCRTCClient, RCLocalTrack } from '@rongcloud/plugin-rtc';
import im from './im';
import { message } from 'ant-design-vue';

class RTC {
  // RTC 客户端实例对象
  rtcClient;

  // Room 实例
  crtRoom;

  // 加入房间后返回的远端资源
  remoteTracks: RCRemoteTrack[] = [];

  constructor() {
    this.rtcClient = null;
    this.crtRoom = null;
    this.remoteTracks = [];
  }

  /**
   * 初始化 rtcClient
   */
  initRTCClient() {
    if (!im.imClient || !im.isConnected) {
      message.warning('请确保已经初始化完 IM 、并已连接成功');
      return;
    }

    this.rtcClient = im.imClient.install(installer, {
      timeout: 30 * 1000,
      logLevel: LogLevel.DEBUG
    });
  }

  /**
   * 加入房间
   */
   async joinRoom(roomId: string, callback) {
    return new Promise(async (resolve, reject) => {
      if (!this.rtcClient) {
        message.warning('请先初始化 RTC，再加入房间');
        reject();
        return;
      }
    
      if (!roomId) {
        message.warning('请输入房间号');
        reject();
        return;
      }
    
      if (!(/^[0-9A-Za-z+=\-_]{1,64}$/.test(roomId))) {
        message.warning('房间号长度不能超过64,可包含: A-Z、a-z、0-9、+、=、-、_');
        reject();
        return;
      }

      // tracks 为房间内的远端资源，可直接订阅
      const { code, room, tracks, userIds } = await this.rtcClient.joinRTCRoom(roomId);
    
      if (code === RCRTCCode.SUCCESS) {
        this.crtRoom = room;
        tracks.length && (this.remoteTracks = tracks);

        this.initRTCListener(callback);

        this.publishMicrophoneCamera();

        resolve({code, room, tracks, userIds});
      } else if (code === RCRTCCode.REPERT_JOIN_ROOM) {
        console.log('加入房间错误，重复加入 RTC 房间内');
        reject();
      } else {
        message.warning(`加入房间失败: ${code}`);
        reject();
      }
    })
  }

  /**
   * 离开房间
   */
  async leaveRoom() {
    if (!this.rtcClient || !this.crtRoom) {
      message.warning('请确保已经初始化完 RTC，并已加入房间');
      return;
    }
    return new Promise(async (resolve, reject) => {
      try {
        const { code } = await this.rtcClient.leaveRoom(this.crtRoom);

        this.removeVideoEl();
        this.crtRoom = null;
        this.remoteTracks = [];

        resolve(code);
      } catch (error) {
        reject(error);
      }
    })
  }

  /**
   * 设置 RTC 监听、订阅远端资源
   */
  initRTCListener(callback) {
    if (!this.crtRoom) {
      message.warning('请加入房间后再设置 Room 监听');
      return;
    }
    
    // 注册房间人员、资源变化监听
    this.registerRoomListener(callback);
    
    /**
     * 订阅远端资源
     */
    this.remoteTracks.length && this.appendVideoEl(this.remoteTracks);
    this.remoteTracks.length && this.subscribe(this.remoteTracks);
  }

  /**
   * 注册房间人员、资源变化监听
   */
  registerRoomListener(callback) {
    this.crtRoom.registerRoomEventListener({
      /**
       * 本端被踢出房间时触发
       */
      onKickOff: (byServer) => {
        console.log('onKickedByServer', byServer);
        message.warning('您已被踢出房间');
      },
      /**
       * 远端发布资源时触发，此时可订阅远端资源
       * @param tracks
       */
      onTrackPublish: (tracks: RCRemoteTrack[]) => {
        console.log('onTrackPublish:', JSON.stringify(tracks));
        this.appendVideoEl(tracks);
        this.subscribe(tracks);
      },
      /**
       * track 可播放
       */
      onTrackReady: (track: RCTrack) => {
        console.log('onTrackReady:', JSON.stringify(track));
        callback && callback.onTrackReady(track);
        this.playTrack(track, true);
      },
      /**
       * 房间有其他人员加入时触发
       */
      onUserJoin: (userIds) => {
        console.log('onUserJoined', JSON.stringify(userIds));
        callback && callback.onUserJoin(userIds);
      },
      /**
       * 房间内其他人员退出时触发
       */
      onUserLeave: (userIds) => {
        console.log('onUserLeft', JSON.stringify(userIds));
        callback && callback.onUserLeave(userIds);
        userIds.forEach((userId) => {
          document.querySelectorAll(`.video-wrap-${userId}`).forEach((el) => {
            el.remove();
          });
        });
      }
    });
  }

  /**
   * 发布摄像头、麦克风资源
   */
  async publishMicrophoneCamera() {
    if (!this.rtcClient || !this.crtRoom) {
      message.warning('请确保已经初始化完 RTC，并已加入房间');
      return;
    }
  
    // 获取摄像头、麦克风资源
    const { code, tracks } = await this.rtcClient.createMicrophoneAndCameraTracks();
    if (code !== RCRTCCode.SUCCESS) {
      message.warning(`获取资源失败: ${code}`);
      return;
    }
  
    // 发布
    const pubRes = await this.publish(tracks);
    if (pubRes) {
      // e.disabled = true
    }
  }

  /**
   * 发布屏幕共享资源
   */
  async publishScreenShare() {
    if (!this.rtcClient || !this.crtRoom) {
      message.warning('请确保已经初始化完 RTC，并已加入房间');
      return;
    }
  
    // 获取屏幕共享资源
    const { code, track } = await this.rtcClient.createScreenVideoTrack();
    if (code !== RCRTCCode.SUCCESS) {
      message.warning(`获取资源失败: ${code}`);
      return;
    }
  
    // 发布
    const pubRes = await this.publish([track]);
    if (pubRes) {
      // e.disabled = true
    }
  }

  /**
   * 发布资源
   * @param localTracks 获取资源返回的 tracks
   */
  async publish(localTracks: RCLocalTrack[]) {
    if (!localTracks.length) {
      return;
    }
    const { code } = await this.crtRoom.publish(localTracks);
  
    if (code === RCRTCCode.SUCCESS) {
      /**
       * 播放资源
       */
      this.appendVideoEl(localTracks);
      localTracks.forEach((track) => {
        this.playTrack(track, true);
      });
  
      return code;
    } else {
      message.warning(`发布资源失败: ${code}`);
    }
  }

  /**
   * 订阅远端资源
   * @param remoteTracks 
   */
  async subscribe(remoteTracks: RCRemoteTrack[]) {
    const { code } = await this.crtRoom.subscribe(remoteTracks);

    if (code !== RCRTCCode.SUCCESS) {
      message.warning(`订阅远端资源失败: ${code}`);
    }
  }

  /**
   * 播放资源
   * @param {RCTrack} track 音轨、视轨
   * @param {boolean} playAudio 否播放音频，(本端发布的音频静音，值为 false)
   */
  playTrack(track: RCTrack, playAudio: boolean) {
    // 播放视频
    if (track.isVideoTrack()) {
      const node: any = document.getElementById('rc-video-' + track.getTrackId());
      track.play(node);
      return;
    }

    // 播放音频
    if (track.isAudioTrack() && playAudio) {
      track.play();
    }
  }

  /**
   * 往页面中插入 video 元素
   * @param tracks 
   */
  appendVideoEl(tracks: RCTrack []) {
    tracks.forEach((track) => {
      if (track.isVideoTrack()) {
        const node: any = document.createElement('div');
        node.innerHTML = `<video id="rc-video-${track.getTrackId()}"></video>`;
        const { userId } = helper.parseTrackId(track.getTrackId());
        node.classList = `video-wrap video-wrap-${userId}`;

        document.querySelectorAll(`.video-wrap-${userId}`).forEach((el) => {
          el.remove();
        });
        (document.getElementById('rong-video-box') as any).appendChild(node);
      }
    });
  }

  removeVideoEl() {
    const videoBoxEl: any = document.getElementById('rong-video-box');
    videoBoxEl.innerHTML = '';
  }
}

export default new RTC();
