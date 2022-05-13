import { defHttp } from '/@/utils/http/axios';

enum Api {
  GetSchedulingList = '/getSchedulingList',
}

export const getSchedulingList = () => {
  return defHttp.get({ url: Api.GetSchedulingList });
};

