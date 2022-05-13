import { defHttp } from '/@/utils/http/axios';
import { useUserStoreWithOut } from '/@/store/modules/user';

const userStore = useUserStoreWithOut();

enum Api {
  getexperts = '/papers',
  GetDepartments = '/hospital/departments',
  GetDiseases = '/diseases',
  GetPaperId = '/papers/paperId',
}

/**
 * @description: 专家文章列表
 */
export const GetExperts = (params: any) => {
  return defHttp.get<any>({
    url: Api.getexperts,
    params,
  });
};

/**
 * @description: 专家文章新增
 */
export const GetExpertsNews = (params: any) => {
  return defHttp.post<any>({
    url: Api.getexperts,
    params,
  });
};

/**
 * @description: 专家文章编辑
 */
export const GetPaperId = (paperId: number, params: any) => {
  return defHttp.put<any>({
    url: Api.GetPaperId.replace('paperId', String(paperId)),
    params,
  });
};

/**
 * @description: 专家文章详情
 */
export const GetPaperInfo = (paperId: number) => {
  return defHttp.get<any>({
    url: Api.GetPaperId.replace('paperId', String(paperId))
  });
};

/**
 * @description: 专家文章删除
 */
export const GetExpertsNewsDelete = (params: any) => {
  return defHttp.delete<any>({
    url: Api.getexperts,
    params,
  });
};

/**
 * @description: 获取科室列表
 */
export const GetDepartments = () => {
  return defHttp.get<any>({
    url: Api.GetDepartments,
  });
};

/**
 * @description: 获取疾病列表
 */
export const GetDiseases = (params: any) => {
  return defHttp.get<any>({
    url: Api.GetDiseases,
    params,
  });
};
