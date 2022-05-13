import { defHttp } from '/@/utils/http/axios';
import { WeekSchedulingModel } from './model/schedulingModel';

enum Api {
  CopyScheduling = '/activity/enrolls/id',
}

/**
 * @description: 编辑线索
 */
export const CopyScheduling = (id: number, params: any) => {
  return defHttp.get<any>({ url: Api.CopyScheduling.replace('id', String(id)), params });
};
