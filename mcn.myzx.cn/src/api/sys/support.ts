import { defHttp } from '/@/utils/http/axios';
import { RegionModel } from './model/supportModel';

enum Api {
  GetRegions = '/regions',
}

/**
 * @description: 获取媒体来源列表
 */
export const getRegionList = () => {
  return defHttp.get<RegionModel[]>({ url: Api.GetRegions });
};
