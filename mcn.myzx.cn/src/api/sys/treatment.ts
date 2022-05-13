import { defHttp } from '/@/utils/http/axios';
import { TreatmentModel } from './model/treatmentModel';

enum Api {
  GetTreatments = '/organization/orgId/appointments/treatments',
  GetTreatmentsCounts = '/treatments/counts',
}

/**
 * @description: 获取看诊列表
 */
export const getTreamentList = (orgId: number, params: any) => {
  return defHttp.get<TreatmentModel[]>({
    url: Api.GetTreatments.replace('orgId', String(orgId)),
    params,
  });
};

/**
 * @description: 获取看诊列表tab统计数
 */

export const GetTreatmentsCounts = () => {
  return defHttp.get<TreatmentModel[]>({
    url: Api.GetTreatmentsCounts,
  });
};
