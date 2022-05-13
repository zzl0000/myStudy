import { defHttp } from '/@/utils/http/axios';

enum Api {
  GetPatient = '/patients',
}

export const getPatients = (params:any) => {
  return defHttp.get<any>({ url: Api.GetPatient, params });
}
