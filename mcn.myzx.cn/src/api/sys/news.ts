import { defHttp } from '/@/utils/http/axios';
import { useUserStoreWithOut } from '/@/store/modules/user';

const userStore = useUserStoreWithOut();

enum Api {
  getnews = '/news/list',
  getnewsdelete = '/news/id',
  GetNewsCreate = '/news/create',
  GetNewsId = '/news/id',
  bianjis = '/news/id',
}

/**
 * @description: 新闻资讯列表
 */
export const GetNews = (params: any) => {
  return defHttp.get<any>({
    url: Api.getnews,
    params,
  });
};

/**
 * @description: 新闻删除
 */
export const GetNewsDelete = (id: String) => {
  return defHttp.delete<any>({
    url: Api.getnewsdelete.replace('id', String(id)),
  });
};

/**
 * @description: 新闻资讯新增
 */
export const GetNewsCreate = (params: any) => {
  return defHttp.post<any>({
    url: Api.GetNewsCreate,
    params,
  });
};

/**
 * @description: 新闻资讯详情
 */
export const GetNewsId = (id: number) => {
  return defHttp.get<any>({
    url: Api.GetNewsId.replace('id', String(id)),
  });
};


/**
 * @description: 新闻资讯编辑
 */
 export const bianjis = (id: number,params:any) => {
  return defHttp.put<any>({
    url: Api.bianjis.replace('id', String(id)),params
  });
};

