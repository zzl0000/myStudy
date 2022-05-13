import { defHttp } from '/@/utils/http/axios';
import { DoctorModel } from './model/doctorModel';
import { useUserStoreWithOut } from '/@/store/modules/user';

const userStore = useUserStoreWithOut();

enum Api {
  GetOrganizationDoctors = '/organization/orgId/doctors',
  GetConsultation = '/doctors/doctorId/consultation',
}

/**
 * @description: 获取媒体来源列表
 */
export const getOrganizationDoctorList = (params?: any) => {
  return defHttp.get<DoctorModel[]>({
    url: Api.GetOrganizationDoctors.replace('orgId', String(userStore.getUserInfo.organization_id)),
    params,
  });
};

export const getConsultation = (doctorId: number, mold, did: number) => {
  const params = {
    types: mold,
    did,
  };
  return defHttp.get<any>({
    url: Api.GetConsultation.replace('doctorId', String(doctorId)),
    params,
  });
};
