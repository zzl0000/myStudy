import * as RongIMLib from '@rongcloud/imlib-v4';
import { LogLevel, ConnectionStatus, ISendMsgOptions } from '@rongcloud/engine';
import { message } from 'ant-design-vue';
import { useGlobSetting } from '/@/hooks/setting';
const globSetting = useGlobSetting();
const AppKey = globSetting.AppKey;

class IM {
  // IM 客户端实例对象
  imClient;

  // IM 是否连接成功
  isConnected = false;

  constructor() {}

  /**
   * 初始化 IM
   */
  initIM(callback) {
    if (!this.isConnected) {
      this.imClient = RongIMLib.init({
        appkey: AppKey,
        logLevel: LogLevel.DEBUG,
      });
    }
    this.setIMListener(callback);
  }

  /**
   * 设置 IM 监听
   * @returns
   */
  setIMListener(callback) {
    if (!this.imClient) {
      message.warning('请先初始化 IM');
      return;
    }

    this.imClient.watch({
      // 监听消息通知
      message(message) {
        console.log('receive message =>', message);
        callback && callback.message && callback.message(message);
      },
      // 监听 IM 连接状态变化
      status(event) {
        console.log('connection status change:', event.status);
      },
    });
  }

  /**
   * 连接 IM
   */
  connectIM(token: string) {
    return new Promise((resolve, reject) => {
      if (!this.imClient) {
        message.warning('请先初始化 IM');
        reject();
        return;
      }

      if (!token) {
        message.warning('请输入 token');
        reject();
        return;
      }

      this.imClient
        .connect({ token })
        .then((user) => {
          console.log('connect success', user.id);
          this.isConnected = true;
          resolve(user.id);
        })
        .catch((error) => {
          message.warning(`连接失败: ${error}`);
          reject(error);
        });
    });
  }
}

export default new IM();
