/*
 * @Author: your name
 * @Date: 2021-01-04 09:48:25
 * @LastEditTime: 2022-04-13 15:30:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \inquiry-wapf:\project\wx_xcx\utils\util.js
 */

/**
 * 日期格式化
 * @param {Object} time
 * @param {Object} format
 */
const formatDate = (time, format) => {
  const date = new Date(time)

  const year = date.getFullYear()
  const month = date.getMonth() + 1 // 月份是从0开始的
  const day = date.getDate()
  const hour = date.getHours()
  const min = date.getMinutes()
  const sec = date.getSeconds()
  let preArr = Array.apply(null, Array(10)).map((elem, index) => {
    return '0' + index
  }) // 开个长度为10的数组 格式为 00 01 02 03

  if (!format) {
    format = 'YYYY-MM-DD hh:mm'
  }

  const newTime = format
    .replace(/YYYY/g, year)
    .replace(/MM/g, preArr[month] || month)
    .replace(/DD/g, preArr[day] || day)
    .replace(/hh/g, preArr[hour] || hour)
    .replace(/mm/g, preArr[min] || min)
    .replace(/ss/g, preArr[sec] || sec)

  return newTime
}

const formatTime = (date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return (
    [year, month, day].map(formatNumber).join('/') +
    ' ' +
    [hour, minute, second].map(formatNumber).join(':')
  )
}

const formatTimeS = (data, isSecond) => {
  let date = new Date(data * 1000)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return isSecond
    ? `${year}年${month}月${day}日 ${[hour, minute, second].map(formatNumber).join(':')}`
    : `${year}年${month}月${day}日`
}

const formatTimeSecond = (data) => {
  let date = new Date(data * 1000)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return `${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatTimeMinute = (second) => {
  let str
  let s = second && parseFloat(second)
  str = formatNumber(Math.floor(s / 60)) + ':' + formatNumber(s % 60)
  return str
}

const formatNumber = (n) => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/*
 * fn [function] 需要防抖的函数
 * delay [number] 毫秒，防抖期限值
 */
const debounce = (fn, interval) => {
  var enterTime = 0 //触发的时间
  var gapTime = interval || 300 //间隔时间，如果interval不传，则默认300ms
  return function() {
    var context = this
    var backTime = new Date() //第一次函数return即触发的时间
    if (backTime - enterTime > gapTime) {
      fn.call(context, arguments)
      enterTime = backTime //赋值给第一次触发的时间，这样就保存了第二次触发的时间
    }
  }
}

/*函数节流*/
const throttle = (fn, interval) => {
  var enterTime = 0 //触发的时间
  var gapTime = interval || 300 //间隔时间，如果interval不传，则默认300ms
  return function() {
    var context = this
    var backTime = new Date() //第一次函数return即触发的时间
    if (backTime - enterTime > gapTime) {
      fn.call(context, arguments)
      enterTime = backTime //赋值给第一次触发的时间，这样就保存了第二次触发的时间
    }
  }
}

/**
 *
 * @param {*} stopTimeStr  //结束时间
 * @returns  {}  剩余时间对象
 */
const sub = (stopTimeStr) => {
  // let stopTime = new Date(stopTimeStr);
  // let nowTime = new Date();
  let subTime = stopTimeStr
  let days = Math.floor(subTime / (3600 * 24))
  let hours = Math.floor((subTime % (3600 * 24)) / 3600)
  let minutes = Math.floor(((subTime % (3600 * 24)) % 3600) / 60)
  let seconds = Math.floor((subTime % (3600 * 24)) % 3600) % 60

  days >= 0 && days <= 9 ? (days = '0' + days) : 0
  hours >= 0 && hours <= 9 ? (hours = '0' + hours) : 0
  minutes >= 0 && minutes <= 9 ? (minutes = '0' + minutes) : 0
  seconds >= 0 && seconds <= 9 ? (seconds = '0' + seconds) : 0
  return {
    days,
    hours,
    minutes,
    seconds,
  }
}

const formatTimeSolt = (timestamp) => {
  const oldtime = new Date(timestamp)
  const date = new Date()
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() // 今天凌晨
  const yestday = new Date(today - 24 * 3600 * 1000).getTime()
  const beforeYestday = new Date(today - 24 * 3600 * 1000 * 2).getTime()
  const beforeWeek = new Date(today - 24 * 3600 * 1000 * 7).getTime()
  const Y = oldtime.getFullYear() // 年份
  const M = oldtime.getMonth() + 1 // 月份
  const d = oldtime.getDate() // 日
  const h = oldtime.getHours() % 12 == 0 ? 12 : oldtime.getHours() % 12 // 12小时
  let H = oldtime.getHours() // 24小时
  H = H > 9 ? H : '0' + H
  let m = oldtime.getMinutes() // 分
  m = m > 9 ? m : '0' + m
  const w = toWeek(oldtime.getUTCDay()) // 星期
  const timesolt = toTimeSolt(oldtime.getHours()) // 时间段

  let timeStr = ''

  // 当天
  if (oldtime.getTime() > yestday) {
    timeStr = H + ':' + m
  }
  // 昨天
  if (oldtime.getTime() < today && yestday <= oldtime.getTime()) {
    timeStr = '昨天 ' + H + ':' + m
  }
  // 一周内
  if (oldtime.getTime() < yestday && beforeWeek <= oldtime.getTime()) {
    timeStr = w + ' ' + H + ':' + m
  }
  // 一周前
  if (oldtime.getTime() < beforeWeek) {
    timeStr = Y + '年' + M + '月' + d + '日 ' + ' ' + H + ':' + m
  }
  // 比当前时间晚
  if (oldtime.getTime() > date.getTime()) {
    timeStr = H + ':' + m
  }

  return timeStr

  // 格式化时间段
  function toTimeSolt(h) {
    var bt = ''
    if (0 <= h && h <= 3) bt = '凌晨'
    if (4 <= h && h <= 8) bt = '早上'
    if (9 <= h && h <= 11) bt = '上午'
    if (12 == h) bt = '中午'
    if (13 <= h && h <= 17) bt = '下午'
    if (18 <= h && h <= 23) bt = '晚上'

    return bt
  }

  // 格式星期
  function toWeek(w) {
    var week = ''
    switch (w) {
      case 0:
        week = '星期日'
        break
      case 1:
        week = '星期一'
        break
      case 2:
        week = '星期二'
        break
      case 3:
        week = '星期三'
        break
      case 4:
        week = '星期四'
        break
      case 5:
        week = '星期五'
        break
      case 6:
        week = '星期六'
        break
    }
    return week
  }
}

const isEqual = (target, source) => {
  return target == source
}

const isEmpty = (str) => {
  return isEqual(str.length, 0)
}

// 己方挂断后的提示
const getSummaryText = (status, message) => {
  var senderUserId = message.senderUserId
  var text
  switch (status) {
    case 1:
      text = '视频通话已取消'
      break
    case 2:
      text = '视频通话已拒绝'
      break
    case 3:
      text = '视频通话已挂断'
      break
    case 4:
      text = `收到 ${senderUserId} 的音视频邀请, 但己方忙碌中, 不处理`
      break
    case 5:
      text = '视频通话未接听'
      break
    default:
      text = '未知原因'
  }
  return text
}

// 获取挂断原因
const getHungupReason = (reason, message) => {
  var reasonPrompt
  var senderUserId = '医生' //message.senderUserId;
  switch (reason) {
    case 8:
      reasonPrompt = '其他设备已处理'
      break
    case 11:
      reasonPrompt = `${senderUserId} 已取消`
      break
    case 12:
      reasonPrompt = `${senderUserId} 已拒绝`
      break
    case 13:
      reasonPrompt = `${senderUserId} 已挂断`
      break
    case 14:
      reasonPrompt = `${senderUserId} 忙碌中`
      break
    case 15:
      reasonPrompt = `${senderUserId} 未接听`
      break
    default:
      reasonPrompt = '未知原因挂断'
  }
  return reasonPrompt
}

const unique = (arr) => {
  const res = new Map()
  return arr.filter((a) => !res.has(a.id) && res.set(a.id, 1))
}

const dateFormat = (date, fmt) => {
  var o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'H+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    S: date.getMilliseconds(),
  }
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
  }
  return fmt
}

/**
 * @description: 获取url 参数
 * @param {*}
 * @return {*}
 */
const GetUrlParam = (name: string): any => {
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  let r = window.location.search.substr(1).match(reg)
  if (r != null) {
    return unescape(r[2])
  }
  return null
}

export default {
  formatDate: formatDate,
  formatTime: formatTime,
  formatTimeS: formatTimeS,
  formatTimeSecond: formatTimeSecond,
  debounce,
  throttle,
  formatTimeMinute,
  sub,
  isEqual,
  isEmpty,
  formatTimeSolt,
  getSummaryText,
  getHungupReason,
  unique,
  dateFormat,
  GetUrlParam,
}
