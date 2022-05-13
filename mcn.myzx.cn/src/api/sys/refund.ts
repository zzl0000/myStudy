import { defHttp } from '/@/utils/http/axios';
import { RefundListModel } from './model/refound';

enum Api {
  GetRefunds = '/organization/orgId/refunds',
  ChangeRefundsStatus = '/refunds/id/status',
}

/**
 * @description:获取退款审核列表
 * @param orgId
 * @param params
 */
export function getRefundsList(orgId: number, params: any) {
  return defHttp.get<RefundListModel>({ url: Api.GetRefunds.replace('orgId', String(orgId)), params });
}

/**
 * @description: 修改退款审核的审核状态
 * @param id
 * @param status
 */
export function editRefundsStatus(id: number, status: string) {
  const params = {
    status: status,
  };
  return defHttp.put<RefundListModel>({ url: Api.ChangeRefundsStatus.replace('id', String(id)), params });
}
