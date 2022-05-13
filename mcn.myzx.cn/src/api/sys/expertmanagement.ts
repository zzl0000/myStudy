import { defHttp } from '/@/utils/http/axios';
import { useUserStoreWithOut } from '/@/store/modules/user';

const userStore = useUserStoreWithOut();

enum Api {
  getexpertmanagement = '/expert-consultation/list',
  GetConsultationId = '/expert-consultation/id',
  GetConsultationIdTips = '/expert-consultation/id',
}

/**
 * @description: 专家预约列表
 */
export const GetExpertManagement = (params: any) => {
  return defHttp.get<any>({
    url: Api.getexpertmanagement,
    params,
  });
};

/**
 * @description: 专家预约审核
 */
export const GetConsultationId = (id: number, params: any) => {
  return defHttp.put<any>({
    url: Api.GetConsultationId.replace('id', String(id)),
    params,
  });
};



/**
 * @description: 专家预约详情
 */
 export const GetConsultationIdTips = (id: number) => {
  return defHttp.get<any>({
    url: Api.GetConsultationIdTips.replace('id', String(id)),
  });
};

