const config = {
  BaseUrl: '/api',
  BaseMpUrl: '/mpapi',
  wzAPi: '/wzapi',

  // 测试环境配置
  // assetsLink: 'https://csxcxapi.myzx.cn',
  // alipay: 'https://csalipayh5.myzx.cn', //支付宝h5支付
  // appkey: 'bmdehs6pbgtcs', //测试融云KEY
  // secret: '8Gtj3X6f2oVnlV', //测试融云KEY
  // demoApi: 'https://webqa.rongcloud.net/imconf/auth/getToken',
  // mediaServer: 'https://rtc-miniapp-wctgw-prod-bdcbj.ronghub.com/wechat',
  // reset_link: 'https://cs.myzx.cn', //'http://192.168.1.22:3111', //https://cs.myzx.cn' //https://m.myzx.cn', /// 跳转到老版M端地址

  // 正式环境配置

  assetsLink: 'https://xcxapi.myzx.cn',
  alipay: 'https://alipayh5.myzx.cn', //支付宝h5支付
  appkey: 'pkfcgjstpzrq8', //测试融云KEY
  secret: '1400594172', //测试融云KEY
  demoApi: 'https://webqa.rongcloud.net/imconf/auth/getToken',
  mediaServer: 'https://rtc-miniapp-wctgw-prod-bdcbj.ronghub.com/wechat',
  reset_link: 'https://m.myzx.cn',

  //本地测试公众号 appid

  // AppId: 'wxc5179ead61145154',
  // appSecret: 'ca36939f7389c53da39b0d6cd9702d35',
  // authUrl: 'http://192.168.1.22:3000/#pages/index/index',

  // 线上测试
  // 三分钟看医生公众号
  // AppId: 'wxfb54f9cb38108067',
  // appSecret: '3d5fca241ebd5d7a5c0266725c79b849',
  // authUrl: '',

  //  线上正式
  // 名医在线平台公众号
  AppId: 'wxfa378c75f10d6f9c',
  appSecret: 'da4798862fe19e26b81f04dc21b9cff3',
}

export default config
