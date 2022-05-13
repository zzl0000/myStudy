import { defHttp } from '/@/utils/http/axios';
import { videoInfoModel } from './model/videoInterrogation';

enum Api {
  GetVideoInfo = '/hospital-manage/video/info',
  GetVideoPatient = '/hospital-manage/video/patient',
  GetVideoDoctor = '/hospital-manage/video/doctor',
  GetRongcloudToken = '/hospital-manage/ry/token',
  GetVideoRemoveUser = '/appointments/remove-user',
  GetCheckYzRoom = '/appointments/check-yz-room',
}

/**
 * @description: 获取医助视频模块信息
 */
export const GetVideoInfo = (params: any) => {
  return defHttp.get<videoInfoModel>({ url: Api.GetVideoInfo, params });
};

/**
 * @description: 医助邀请患者进行视频
 */
export const GetVideoPatient = (params: any) => {
  return defHttp.get<any>({ url: Api.GetVideoPatient, params });
};

/**
 * @description: 医助邀请医生[发通知]
 */
export const GetVideoDoctor = (params: any) => {
  return defHttp.get<any>({ url: Api.GetVideoDoctor, params });
};

/**
 * @description: 获取融云token
 */
export const GetRongcloudToken = (params: any) => {
  return defHttp.get<any>({ url: Api.GetRongcloudToken, params });
};

/**
 * @description: 腾讯云视频 移除用户
 *
 */

export const GetVideoRemoveUser = (params: any) => {
  return defHttp.post<any>({ url: Api.GetVideoRemoveUser, params });
};

/**
 * @description: 腾讯云视频 校验医助是否已经在房间里
 *
 */

export const GetCheckYzRoom = (params: any) => {
  return defHttp.post<any>({ url: Api.GetCheckYzRoom, params });
};
