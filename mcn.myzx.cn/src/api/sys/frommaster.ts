import { defHttp } from '/@/utils/http/axios';
import { useUserStoreWithOut } from '/@/store/modules/user';

const userStore = useUserStoreWithOut();

enum Api {
  GetFromMaster = '/hospital-manage/mcn/sb/edu/kecheng/frommaster/listApply',
  examine = '/hospital-manage/mcn/sb/edu/kecheng/frommaster/info',
  push =  '/hospital-manage/mcn/sb/edu/kecheng/frommaster/review',
 
}

/**
 * @description: 拜师申请
 */
export const GetFromMaster = (params: any) => {
  return defHttp.post<any>({
    url: Api.GetFromMaster,
    params,
  });
};

/**
 * @description: 拜师申请审核
 * @param params
 */
 export const examine = (params) => {
  return defHttp.post<any>({ url: Api.examine,params});
};

/**
 * @description: 拜师申请审核
 * @param params
 */
 export const push = (params) => {
  return defHttp.post<any>({ url: Api.push,params});
};