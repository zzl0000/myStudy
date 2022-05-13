import * as RongIMLib from '@rongcloud/imlib-v4'
import config from '../config/config'
import cache from './auth'
import $send from '../api/request'
import events from './events'
// import TIM from './TRTC/tim'

class IM {
  im: any = null
  qiniuHost = 'https://upload.qiniup.com'

  constructor() {
    this.im = null
    cache.setConnect(false)
  }

  init(callback) {
    let that = this
    // 应用初始化以获取 RongIMLib 实例对象，请务必保证此过程只被执行一次,连接类型推荐使用comet
    this.im = RongIMLib.init({
      appkey: config.appkey,
    })

    // 添加事件监听
    this.im.watch({
      // 监听会话列表变更事件
      conversation(event) {
        // 假定存在 getExistedConversationList 方法，以获取当前已存在的会话列表数据
        // const conversationList = getExistedConversationList()
        // // 发生变更的会话列表
        // const updatedConversationList = event.updatedConversationList;
        // // 通过 im.Conversation.merge 计算最新的会话列表
        // const latestConversationList = this.im.Conversation.merge({
        //   conversationList,
        //   updatedConversationList
        // })
      },
      // 监听消息通知
      message(event) {
        // 新接收到的消息内容
        const message = event.message
        events.trigger('message', message)
        callback && callback.message(message)
        console.log('收到消息：', message)
        setTimeout(() => {
          that.getTotalUnreadCountSync()
        }, 0)
      },
      // 监听 IM 连接状态变化
      status(event) {
        events.trigger('status', event.status)
        let text = ''
        switch (event.status) {
          case RongIMLib.CONNECTION_STATUS.CONNECTED:
            text = '链接成功'
            break
          case RongIMLib.CONNECTION_STATUS.CONNECTING:
            text = '正在连接中'
            break
          case RongIMLib.CONNECTION_STATUS.DISCONNECTED:
            text = '用户主动断开链接'
            break
          case RongIMLib.CONNECTION_STATUS.NETWORK_UNAVAILABLE:
            text = '网络不可用, SDK 内部会自动重连'
            break
          case RongIMLib.CONNECTION_STATUS.SOCKET_ERROR:
            text = 'Socket 不可用, SDK 内部会自动重连'
            break
          case RongIMLib.CONNECTION_STATUS.KICKED_OFFLINE_BY_OTHER_CLIENT:
            text = '被其他端踢下线！'
            uni.showToast({
              duration: 2000,
              title: text,
              icon: 'none',
            })
            break
          case RongIMLib.CONNECTION_STATUS.BLOCKED:
            text = '用户被封禁'
            break
        }
        cache.setConnect(event.status == RongIMLib.CONNECTION_STATUS.CONNECTED)
        console.log(`${text}, status: ${event.status}`)
      },
    })

    this.connect()
  }

  /**
   * 建立 IM 连接
   */
  connect() {
    const token = cache.getToken()
    if (!token) {
      return
    }
    const userCf = cache.getUserCf()
    let that = this
    return new Promise<void>((resolve, reject) => {
      $send
        .post(`/ry/token`, { user_name: userCf.nickname, avatar: userCf.avatar }, '')
        .then((res: any) => {
          console.log(res)
          if (res.code === 200) {
            that.im
              .connect({
                token: res.data.token,
              })
              .then((user: { id: any }) => {
                cache.setTrtcKey(res.data.user_sig)
                cache.setConnect(true)
                events.trigger('connect', user.id)
                console.log('链接成功, 链接用户 id 为: ', user.id)
                that.getTotalUnreadCountSync()
                // TIM.init()
                resolve()
              })
              .catch((error: { code: any; msg: any }) => {
                console.log('链接失败: ', error.code, error.msg)
                reject()
              })
          }
        })
    })
  }

  /**
   * 断开连接
   */
  disconnect() {
    this.im.disconnect().then(() => console.log('断开链接成功'))
    // this.Call.destroy()
  }

  /**
   * 重新链接
   */
  reconnect() {
    this.im
      .reconnect()
      .then((user) => {
        console.log('重新链接成功, 链接用户 id 为: ', user.id)
      })
      .catch((error) => {
        console.log('链接失败: ', error.code, error.msg)
      })
  }

  /**
   * 获取会话列表
   */
  getList() {
    return new Promise((resolve, reject) => {
      this.im.Conversation.getList()
        .then((conversationList) => {
          resolve(conversationList)
          console.log('获取会话列表成功', conversationList)
        })
        .catch((error) => {
          reject(error)
          console.log('获取会话列表失败: ', error.code, error.msg)
        })
    })
  }

  /**
   * 发送消息
   * @param {*} targetId
   * @param {*} type 会话类型：RongIMLib.CONVERSATION_TYPE.PRIVATE | RongIMLib.CONVERSATION_TYPE.GROUP
   * @param {*} messageType 消息类型，其中 RongIMLib.MESSAGE_TYPE 为 IMLib 内部的内置消息类型常量定义
   * @param {*} content 消息内容
   */
  send(targetId, type, messageType, content, directionalUserIdList) {
    return new Promise((resolve, reject) => {
      const conversation = this.im.Conversation.get({
        targetId,
        type,
      })
      let sendCf = {
        messageType,
        content,
      }
      console.log(directionalUserIdList)
      if (directionalUserIdList) {
        sendCf.directionalUserIdList = directionalUserIdList
      }
      // 向会话内发消息
      conversation
        .send(sendCf)
        .then(function(message) {
          resolve(message)
          console.log('发送消息成功', message)
        })
        .catch((error) => {
          reject(error)
          console.log('发送消息失败', error.code, error.msg)
        })
    })
  }

  /**
   * 清除未读数
   * @param {*} targetId
   * @param {*} type 会话类型：RongIMLib.CONVERSATION_TYPE.PRIVATE | RongIMLib.CONVERSATION_TYPE.GROUP
   * @param {*} messageUId 消息uid
   */

  ReqMsgSync(targetId) {
    let that = this
    return new Promise((resolve, reject) => {
      let conversation = this.im.Conversation.get({
        targetId: targetId,
        type: RongIMLib.CONVERSATION_TYPE.GROUP,
      })
      conversation
        .read()
        .then(function() {
          console.log('清除未读数成功') // im.watch conversation 将被触发
          resolve()
        })
        .catch((error) => {
          console.log('清除未读数失败') // im.watch conversation 将被触发
          reject()
        })
    })
  }

  /**
   * 获取所有会话消息未读数
   * @param {*} targetId
   * @param {*} type 会话类型：RongIMLib.CONVERSATION_TYPE.PRIVATE | RongIMLib.CONVERSATION_TYPE.GROUP
   * @param {*} messageUId 消息uid
   */
  getTotalUnreadCountSync() {
    return new Promise((resolve, reject) => {
      this.im.Conversation.getTotalUnreadCount()
        .then(function(totalUnreadCount) {
          console.log('获取未读总数成功', totalUnreadCount)
          if (totalUnreadCount > 0) {
            if (totalUnreadCount > 99) {
              totalUnreadCount = '99+'
              uni.showTabBarRedDot({ index: 1, success: () => {}, fail: () => {} })
              uni.setTabBarBadge({
                index: 1,
                text: totalUnreadCount,
                success: () => {},
                fail: () => {},
              })
            } else {
              uni.showTabBarRedDot({ index: 1, success: () => {}, fail: () => {} })
              uni.setTabBarBadge({
                index: 1,
                text: totalUnreadCount.toString(),
                success: () => {},
                fail: () => {},
              })
            }
          } else {
            uni.hideTabBarRedDot({ index: 1, success: () => {}, fail: () => {} })
          }
          resolve(totalUnreadCount)
        })
        .catch((error) => {
          reject()
          console.log('获取未读总数失败', totalUnreadCount)
        })
    })
  }

  /**
   * 获取历史消息
   * @param {*} targetId
   * @param {*} type 会话类型：RongIMLib.CONVERSATION_TYPE.PRIVATE | RongIMLib.CONVERSATION_TYPE.GROUP
   * @param {*} timestamp 获取历史消息的时间戳，默认为 0，表示从当前时间获取 +new Date()
   * @param {*} count 获取条数，有效值 1-20，默认为 20
   */
  getMessages(targetId, type, timestamp, count) {
    return new Promise((resolve, reject) => {
      const conversation = this.im.Conversation.get({
        targetId,
        type,
      })
      const option = {
        timestamp: timestamp || 0,
        count: count || 20,
        order: 0,
      }
      conversation
        .getMessages(option)
        .then((result) => {
          resolve(result)
          const list = result.list // 获取到的消息列表
          const hasMore = result.hasMore // 是否还有历史消息可获取
          console.log('获取历史消息成功', list, hasMore)
        })
        .catch((error) => {
          reject(error)
          console.log('获取历史消息失败', error.code, error.msg)
        })
    })
  }

  /**
   * 上传百度 BOS
   * @param {*} url
   * @param {*} fileInfo
   * @param {*} header
   */
  uploadBos(url, fileInfo, header) {
    return new Promise((resolve, reject) => {
      const fileData = uni.getFileSystemManager().readFileSync(fileInfo.path)
      uni.request({
        url: url,
        header: header,
        method: 'POST',
        data: fileData,
        success: function(res) {
          let data = {
            downloadUrl: url, // 上传成功的 url 即为下载 url
            isBosRes: true, // 判断是否是百度返回
          }
          resolve(data)
        },
        fail: reject,
      })
    })
  }
  /**
   * 上传七牛云
   * @param {*} fileInfo
   * @param {*} token
   * @param {*} bosHeaders
   * @param {*} bosUrl
   */
  uploadQiNiu(fileInfo, token, bosHeaders, bosUrl) {
    const url = this.qiniuHost
    return new Promise((resolve, reject) => {
      uni.uploadFile({
        url: url,
        filePath: fileInfo.path,
        name: 'file',
        formData: {
          token: token,
        },
        success: resolve,
        fail: (err) => {
          console.log('upload qiniu failed', err)
          this.uploadBos(bosUrl, fileInfo, bosHeaders).then(
            (res) => {
              resolve(res)
            },
            (err) => {
              reject(err)
            }
          )
        },
      })
    })
  }

  /**
   * 上传
   * @param {*} fileInfo
   * @param {*} uploadType
   */
  upload(fileInfo, uploadType) {
    let fileType = uploadType || RongIMLib.FILE_TYPE.FILE
    let fileName = fileInfo.name || ''
    return this.im
      .getFileToken(fileType, fileName)
      .then((result) => {
        let { token, bosToken, bosDate, bos, path } = result
        let bosHeaders = {
          authorization: bosToken,
          'x-bce-date': bosDate,
          'Content-Type': 'multipart/form-data',
        }
        let bosUploadUrl = bos + path
        return this.uploadQiNiu(fileInfo, token, bosHeaders, bosUploadUrl)
      })
      .then((res) => {
        let qiniuHash, qiniuName
        if (!res.isBosRes) {
          const { data } = res
          const { hash, name } = JSON.parse(data)
          ;(qiniuHash = hash), (qiniuName = name)
        }
        // console.log(res)
        return this.im.getFileUrl(fileType, qiniuHash, qiniuName, res)
      })
  }

  compressImageToBase64(src) {
    return new Promise((resolve, reject) => {
      uni.compressImage({
        src,
        quality: 0,
        success: (res) => {
          uni.getFileSystemManager().readFile({
            filePath: res.tempFilePath, // 选择图片返回的相对路径
            encoding: 'base64', //编码格式
            success: resolve,
            fail: reject,
          })
        },
        fail: reject,
      })
    })
  }
}

export default new IM()
