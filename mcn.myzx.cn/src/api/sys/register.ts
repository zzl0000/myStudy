import { defHttp } from '/@/utils/http/axios';
import { RegisterListModel } from './model/register';

enum Api {
  GetRegisterOrder = '/registerOrder/list',
  GoTorelation = '/registerOrder/relation',
  Quickrefund = '/registerOrder/refund',
}

/**
 * @description:获取客服收费列表列表
 * @param orgId
 * @param params
 */
export function getRegisterOrder(params: any) {
  return defHttp.get<RegisterListModel>({ url: Api.GetRegisterOrder, params });
}
/**
 * @description:关联收费记录与挂号订单
 * @param id
 * @param order_sn
 */
export function goTorelation(params: any) {
  return defHttp.post<RegisterListModel>({ url: Api.GoTorelation, params });
}
/**
 * @description:客服收费记录快捷退款
 * @param order_no
 * @param refund_reason
 */
export function gpQuickrefund(params: any) {
  return defHttp.post<RegisterListModel>({ url: Api.Quickrefund, params });
}
