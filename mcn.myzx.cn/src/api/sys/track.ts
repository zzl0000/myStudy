import { defHttp } from '/@/utils/http/axios';
import { MediumModel, TrackModel } from './model/trackModel';
import { useUserStoreWithOut } from '/@/store/modules/user';

const userStore = useUserStoreWithOut();

enum Api {
  GetMediums = '/mediums',
  CreateTrack = '/organization/orgId/tracks',
  EditTrack = '/tracks/id',
  GetTracks = '/organization/orgId/tracks',
  DestroyTrack = '/tracks/id',
}

/**
 * @description: 获取媒体来源列表
 */
export const getMediumList = () => {
  return defHttp.get<MediumModel[]>({ url: Api.GetMediums });
};

/**
 * @description: 创建线索
 */
export const createTrack = (params: any) => {
  return defHttp.post<any>({
    url: Api.CreateTrack.replace('orgId', String(userStore.getUserInfo.organization_id)),
    params,
  });
};

/**
 * @description: 编辑线索
 */
export const editTrack = (id: number, params: any) => {
  return defHttp.put<any>({ url: Api.EditTrack.replace('id', String(id)), params });
};

/**
 * @description: 获取线索列表
 */
export const getTrackList = (params: any) => {
  return defHttp.get<TrackModel[]>({
    url: Api.GetTracks.replace('orgId', String(userStore.getUserInfo.organization_id)),
    params,
  });
};

/**
 * @description: 删除线索
 */
export const destroyTrack = (id: number) => {
  return defHttp.delete<any>({ url: Api.DestroyTrack.replace('id', String(id)) });
};
