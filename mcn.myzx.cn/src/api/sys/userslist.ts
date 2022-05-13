import { defHttp ,pictureHttp} from '/@/utils/http/axios';
import { useUserStoreWithOut } from '/@/store/modules/user';

const userStore = useUserStoreWithOut();

enum Api {
  getuserlist = '/hospital-manage/mcn/sb/user/index',
  getparams = '/hospital-manage/mcn/sb/user/params',
  GetUpLoadImg = '/hospital-manage/mcn/sb/upload/image',
  GetHospitalSearch = '/hospital-manage/mcn/sb/hospital/search',
  GetDepartment = '/hospital-manage/mcn/sb/department',
  GetUserDetail = '/hospital-manage/mcn/sb/user/detail',
  image = '/hospital-manage/mcn/sb/upload/image',
  create = '/hospital-manage/mcn/sb/user/create',
  shenhe = '/hospital-manage//mcn/sb/user/audit',
 
}

/**
 * @description: 用户列表
 */
export const GetUserList = (params: any) => {
  return defHttp.post<any>({
    url: Api.getuserlist,
    params,
  });
};

/**
 * @description: 用户管理涉及相关配置参数
 */
export const GetParams = () => {
  return defHttp.post<any>({
    url: Api.getparams,
  });
};

/**
 * @description: 用户管理图片上传
 */
export const GetUpLoadImg = () => {
  return defHttp.post<any>({
    url: Api.GetUpLoadImg,
  });
};

/**
 * @description: 根据医院名称模糊匹配医院
 */
export const GetHospitalSearch = (params: any) => {
  return defHttp.post<any>({
    url: Api.GetHospitalSearch,
    params,
  });
};

/**
 * @description: 科室
 */
export const GetDepartment = () => {
  return defHttp.post<any>({
    url: Api.GetDepartment,
  });
};

/**
 * @description: 用户详情
 */
export const GetUserDetail = (params: any) => {
  return defHttp.post<any>({
    url: Api.GetUserDetail,
    params,
  });
};

/**
 * @description: 用户上传
 */
 export const image = (params) => {
  return pictureHttp.post<any>({
    url: Api.image,
    params,
  });
};


/**
 * @description: 专家顾问团新增
 */
 export const create = (params) => {
  return defHttp.post<any>({
    url: Api.create,
    params,
  });
};


/**
 * @description: 专家顾问团新增
 */
 export const shenhe = (params) => {
  return defHttp.post<any>({
    url: Api.shenhe,
    params,
  });
};


