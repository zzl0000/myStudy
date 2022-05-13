import { MockMethod } from 'vite-plugin-mock';
import { resultError, resultSuccess, getRequestToken, requestParams } from '../_util';

export function createList() {
  return [
    {
      id: '1',
      resource: '抖音',
      patient_name: 'Vben Admin',
      phone: '13800000000',
      weixin: '13800000000',
      disease: '感冒',
      doctor_name: '田爱国',
      remark: '无',
      agree: 'A',
      status: '是',
      service_name: '哈哈哈', 
      age: 24,
      sex: '男',
      idcard: 'X13429472947294'
    },
    {
      id: '2',
      resource: '抖音',
      patient_name: 'Vben Admin',
      phone: '13800000000',
      weixin: '13800000000',
      disease: '感冒',
      doctor_name: '田爱国',
      remark: '无',
      agree: 'A',
      status: '是',
      service_name: '哈哈哈',
    },
  ];
}

export default [
  {
    url: '/api/getPatientList',
    method: 'get',
    response: (request: requestParams) => {
      // const token = getRequestToken(request);
      // if (!token) return resultError('Invalid token');
      const list = createList();
      return list;
    },
  },
  
] as MockMethod[];
