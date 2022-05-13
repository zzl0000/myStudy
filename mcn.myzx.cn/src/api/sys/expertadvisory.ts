import { defHttp, pictureHttp } from '/@/utils/http/axios';
import { useUserStoreWithOut } from '/@/store/modules/user';

const userStore = useUserStoreWithOut();

enum Api {
  getexpertadvis = '/hospital-manage/mcn/sb/group/index',
  search = '/hospital-manage/mcn/sb/hospital/search',
  keshi = '/hospital-manage/mcn/sb/department',
  creeatd = '/hospital-manage/mcn/sb/group/create',
  detail = '/hospital-manage/mcn/sb/group/detail',
  image = '/hospital-manage/mcn/sb/upload/image',
  deletes = '/hospital-manage/mcn/sb/group/delete',
  update = '/hospital-manage//mcn/sb/group/update',
}

/**
 * @description: 专家顾问团列表
 */
export const GetExpertAdvis = (params: any) => {
  return defHttp.post<any>({
    url: Api.getexpertadvis,
    params,
  });
};
/**
 * @description: 专家顾问团医院搜索
 */
export const search = (params: any) => {
  return defHttp.post<any>({
    url: Api.search,
    params,
  });
};
/**
 * @description: 专家顾问团科室
 */
export const keshi = () => {
  return defHttp.post<any>({
    url: Api.keshi,
  });
};
/**
 * @description: 专家顾问团新增
 */
export const creeatd = (params) => {
  return defHttp.post<any>({
    url: Api.creeatd,
    params,
  });
};

/**
 * @description: 专家顾问团新增
 */
export const detail = (params) => {
  return defHttp.post<any>({
    url: Api.detail,
    params,
  });
};

/**
 * @description: 专家顾问团上传
 */
export const image = (params) => {
  return pictureHttp.post<any>({
    url: Api.image,
    params,
  });
};

/**
 * @description: 专家顾问团上传
 */
export const deletes = (params) => {
  return defHttp.post<any>({
    url: Api.deletes,
    params,
  });
};

/**
 * @description: 专家顾问团编辑
 */
export const update = (params) => {
  return defHttp.post<any>({
    url: Api.update,
    params,
  });
};
