import { defHttp } from '/@/utils/http/axios';
import { OperationModel, OperationSeting } from './model/operationModel';

// const userStore = useUserStoreWithOut();
enum Api {
  GetDoctor = '/manage/orgId/doctor-list',
  GetDoctorSeting = '/manage/doctor-settings',
  // GetDoctorSets = '/manage/doctor-settings',
}

/**
 * @description: 获取医生列表
 * @param mcn_id
 */
export function getDoctorList(mcn_id: number, params: any) {
  return defHttp.get<OperationModel>({
    url: Api.GetDoctor.replace('orgId', String(mcn_id)),
    params,
  });
}

/**
 * @description: 医生问诊设置
 * @param
 */
export function getDoctorSeting(params: any) {
  return defHttp.put<OperationModel>({ url: Api.GetDoctorSeting, params });
}

/**
 * @description: 获取医生问诊设置信息
 * @param
 */
export function getDoctorSets(params: any) {
  return defHttp.get<OperationSeting>({ url: Api.GetDoctorSeting, params });
}
