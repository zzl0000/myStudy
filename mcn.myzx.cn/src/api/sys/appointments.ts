import { defHttp } from '/@/utils/http/axios';
import { AppointmentsListModel } from './model/appointmentsModel';

enum Api {
  GetAppointments = '/organization/orgId/appointments',
  GetPaymentQrcode = '/orders/orderId/payment/qrcode',
  CreateAppointments = '/organization/orgId/appointments',
  CreateAppointmentsRefund = '/appointments/id/refund',
  CreatePrescriptRefund = '/prescript/id/refund',
  GetAppointment = '/appointments/id',
  GetConsultation = '/appointments/id/consultation',
  GetPrescription = '/appointments/id/prescription',
  GetChats = '/appointments/id/chats',
  SendMsg = '/appointments/orderId/send-sms',
  GetQRCode = '/appointments/orderId/pay-code',
  GetExport = '/organization/appointments/export',
  GetDrugDetail = '/prescript/redetail',
  GetDrugRefund = '/prescript/mergerefund',
}

/**
 * @description: 获取支付码
 * @param orgId
 * @param params
 */
export const getQRCode = (orderId: number, params: any) => {
  return defHttp.get<any>({ url: Api.GetQRCode.replace('orderId', String(orderId)), params });
};

/**
 * @description: 获取预约挂号列表
 * @param orgId
 * @param params
 */
export const getAppointmentsList = (orgId: number, params: any) => {
  return defHttp.get<AppointmentsListModel[]>({
    url: Api.GetAppointments.replace('orgId', String(orgId)),
    params,
  });
};

/**
 * @description: 获取订单详情
 * @param id
 * @param params
 */
export const getAppointment = (id: number) => {
  return defHttp.get<any>({ url: Api.GetAppointment.replace('id', String(id)) });
};

/**
 * @description: 获取订单详情
 * @param id
 * @param params
 */
export const getChats = (id: number, params: any) => {
  return defHttp.get<any>({ url: Api.GetChats.replace('id', String(id)), params });
};

/**
 * @description: 获取处方记录
 * @param id
 * @param params
 */
export const getPrescription = (id: number) => {
  return defHttp.get<any>({ url: Api.GetPrescription.replace('id', String(id)) });
};

/**
 * @description: 获取问诊资料
 * @param id
 * @param params
 */
export const getConsultation = (id: number) => {
  return defHttp.get<any>({ url: Api.GetConsultation.replace('id', String(id)) });
};

/**
 * @description: 获取问诊资料
 * @param id
 * @param params
 */
export const editConsultation = (id: number, params: any) => {
  return defHttp.put<any>({ url: Api.GetConsultation.replace('id', String(id)), params });
};

/**
 * 获取支付二维码
 *
 * @param orderId
 * @param params
 */
export const getPaymentQrcode = (orderId: number, params: any) => {
  return defHttp.post<AppointmentsListModel[]>({
    url: Api.GetPaymentQrcode.replace('orderId', String(orderId)),
    params,
  });
};

/**
 * @description: 创建预约挂号
 * @param orgId
 * @param params
 */
export const createAppointmentsList = (orgId: number, params: any) => {
  return defHttp.post<any>({ url: Api.CreateAppointments.replace('orgId', String(orgId)), params });
};

/**
 * 快捷退款
 *
 * @param id
 */
export const createAppointmentsRefund = (id: number, reason: string) => {
  const params = { reason: reason };
  return defHttp.post<any>({ url: Api.CreateAppointmentsRefund.replace('id', String(id)), params });
};

/**
 * 医助工作站 --》 处方订单 --》 快捷退款
 *
 * @param id
 */
export const createPrescriptRefund = (id: number, reason: string) => {
  const params = { reason: reason };
  return defHttp.post<any>({ url: Api.CreatePrescriptRefund.replace('id', String(id)), params });
};

/**
 * 医助工作站 --》 预约挂号 --》 发送短信
 *
 * @param id
 */

export const SendMsg = (orderId: number) => {
  return defHttp.post<any>({ url: Api.SendMsg.replace('orderId', String(orderId)) });
};

/**
 * 医助工作站 --》 预约挂号 --》 发送短信
 *
 * @param id
 */

export const GetExport = (params: any) => {
  return defHttp.get<any>({ url: Api.GetExport, params });
};

// organization/appointments/export

/**
 * @description: 药品订单退款查询
 * @param
 * @param
 */
export const drugOrderDetails = (params: any) => {
  return defHttp.post<any>({ url: Api.GetDrugDetail, params });
};

/**
 * @description: 药品订单退款
 * @param
 * @param
 */
export const mergerefund = (params: any) => {
  return defHttp.post<any>({ url: Api.GetDrugRefund, params });
};
