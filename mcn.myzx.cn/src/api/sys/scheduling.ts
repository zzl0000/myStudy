import { defHttp } from '/@/utils/http/axios';
import { WeekSchedulingModel } from './model/schedulingModel';

enum Api {
  GetWeekScheduling = '/doctors/weekly_scheduling',
  CreateScheduling = '/doctors/doctorId/scheduling',
  CopyScheduling = '/doctors/weekly_scheduling',
}

/**
 * @description: 获取以周组织的医生排班列表
 * @param week
 */
export function getWeekSchedulingList(params: any) {
  return defHttp.get<WeekSchedulingModel[]>({ url: Api.GetWeekScheduling, params });
}

/**
 * @description: 创建排班
 * @param did
 * @param doctorId
 * @param deleteIds
 * @param schedules
 */
export function createScheduling(doctorId: number, params: any) {
  return defHttp.post<any>({ url: Api.CreateScheduling.replace('doctorId', String(doctorId)), params });
}

/**
 * 复制上一周排班
 * @param params
 */
export function createWeeklyScheduling(params: any) {
  return defHttp.post<any>({ url: Api.CopyScheduling, params });
}
