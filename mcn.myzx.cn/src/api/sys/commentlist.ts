import { defHttp } from '/@/utils/http/axios';
import { useUserStoreWithOut } from '/@/store/modules/user';

const userStore = useUserStoreWithOut();

enum Api {
  getnews = '/papers/comments',
  deletes = '/papers/comments',
}

/**
 * @description: 评论列表
 */
export const getnews = (params: any) => {
  return defHttp.get<any>({
    url: Api.getnews,
    params,
  });
};


/**
 * @description: 评论列表
 */
 export const deletes = (params: any) => {
  return defHttp.delete<any>({
    url: Api.getnews,
    params,
  });
};
