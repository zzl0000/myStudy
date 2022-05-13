import { MockMethod } from 'vite-plugin-mock';
import { resultError, resultSuccess, getRequestToken, requestParams } from '../_util';

export function createList() {
  return [
    {
      doctor_name: '医生姓名',
      1: '2021/9/20',
      2: '2021/9/21',
      3: '2021/9/22',
      4: '2021/9/23',
      5: '2021/9/24',
      6: '2021/9/25',
      7: '2021/9/26',
    },
    {
      doctor_name: 'HNOESC DDC',
      disabled: true,
      week: '周二',
      date: '2021/9/21'
    },
    {
      doctor_name: 'DFVFV DDC',
      week: '周三',
      date: '2021/9/22'
    },
    {
      doctor_name: 'WWW DDC',
      week: '周四',
      date: '2021/9/23'
    },
  ];
}

export default [
  {
    url: '/api/getSchedulingList',
    method: 'get',
    response: (request: requestParams) => {
      // const token = getRequestToken(request);
      // if (!token) return resultError('Invalid token');
      const list = createList();
      return list;
    },
  },
  
] as MockMethod[];
