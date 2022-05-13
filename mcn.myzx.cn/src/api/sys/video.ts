import { defHttp, pictureHttp } from '/@/utils/http/axios';
import { useUserStoreWithOut } from '/@/store/modules/user';

const userStore = useUserStoreWithOut();

enum Api {
  GetVideo = '/hospital-manage/mcn/sb/video/index',
  UpLoadImg = '/hospital-manage/mcn/sb/upload/image',
  GetSearchTip = '/hospital-manage/mcn/sb/video/tag/search',
  GetVideoParams = '/hospital-manage/mcn/sb/video/params',
  GetVideoCancel = '/hospital-manage/mcn/sb/video/cancel',
  GetVideoDetail = '/hospital-manage/mcn/sb/video/detail',
  GetVideoTicket = '/hospital-manage/mcn/sb/video/ticket',
  GetVideoCreate = '/hospital-manage/mcn/sb/video/create',
  GetVideoSearch = '/hospital-manage/mcn/sb/video/doctor/search',
  GetVideoEdit = '/hospital-manage/mcn/sb/video/update',
}

/**
 * @description: 科普视频列表
 */
export const GetVideo = (params: any) => {
  return defHttp.post<any>({
    url: Api.GetVideo,
    params,
  });
};

/**
 * @description: 专家顾问团上传
 */
export const UpLoadImg = (params) => {
  return pictureHttp.post<any>({
    url: Api.UpLoadImg,
    params,
  });
};

/**
 * @description: 视频标签搜索
 */
export const GetSearchTip = (params: any) => {
  return defHttp.post<any>({
    url: Api.GetSearchTip,
    params,
  });
};

/**
 * @description: 科普视频相关参数
 */
export const GetVideoParams = () => {
  return defHttp.post<any>({
    url: Api.GetVideoParams,
  });
};

/**
 * @description: 科普视频下架
 */
export const GetVideoCancel = (params: any) => {
  return defHttp.post<any>({
    url: Api.GetVideoCancel,
    params,
  });
};

/**
 * @description: 科普视频详情
 */
export const GetVideoDetail = (params: any) => {
  return defHttp.post<any>({
    url: Api.GetVideoDetail,
    params,
  });
};

/**
 * @description: 上传视频凭证
 */
export const GetVideoTicket = (params: any) => {
  return pictureHttp.post<any>({
    url: Api.GetVideoTicket,
    params,
  });
};

/**
 * @description: 新增科普视频
 */
export const GetVideoCreate = (params: any) => {
  return defHttp.post<any>({
    url: Api.GetVideoCreate,
    params,
  });
};

/**
 * @description: 编辑科普视频
 */
export const GetVideoEdit = (params: any) => {
  return defHttp.post<any>({
    url: Api.GetVideoEdit,
    params,
  });
};

/**
 * @description: 医生搜索
 */
export const GetVideoSearch = (params: any) => {
  return defHttp.post<any>({
    url: Api.GetVideoSearch,
    params,
  });
};
