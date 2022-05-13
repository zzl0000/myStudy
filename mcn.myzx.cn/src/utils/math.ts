/*
 * @Author: your name
 * @Date: 2021-03-31 22:48:52
 * @LastEditTime: 2022-01-26 21:57:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \internet-hospital-admin\src\utils\math.js
 */

import { t } from '../hooks/web/useI18n';

//乘法

export const multiply = (arg1, arg2) => {
  if (isNaN(arg1)) {
    arg1 = 0;
  }

  if (isNaN(arg2)) {
    arg2 = 0;
  }

  arg1 = Number(arg1);

  arg2 = Number(arg2);

  let m = 0;
  const s1 = arg1.toString(),
    s2 = arg2.toString();

  try {
    m += s1.split('.')[1].length;
  } catch (e) {
    console.log('error');
  }

  try {
    m += s2.split('.')[1].length;
  } catch (e) {
    console.log('error');
  }

  return (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / Math.pow(10, m);
};

/**
 * @description: 保留两位小数
 * @param {*}
 * @return {*}
 */

export const roundSync = (num, digit) => {
  let n = parseFloat(num);
  if (isNaN(n)) {
    alert('function:changeTwoDecimal->parameter error');
    return false;
  }
  n = Math.round(num * digit) / digit;
  let m = n.toString();
  let o = m.indexOf('.');
  if (o < 0) {
    o = m.length;
    m += '.';
  }
  while (m.length <= o + 2) {
    m += '0';
  }
  return m;
};
