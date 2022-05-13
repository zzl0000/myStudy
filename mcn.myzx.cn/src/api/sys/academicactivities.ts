import { defHttp } from '/@/utils/http/axios';
import { AppointmentsListModel } from './model/appointmentsModel';

enum Api {
  getList = '/activity/list',
  deleteList = '/activity/id',
  createList = '/activity/create',
  addList = '/activity/id',
  getListTips = '/activity/id',
  getDoctor = '/activity/doctor-list',
}

/**
 * @description: 获取学术列表数据
 * @param orgId
 * @param params
 */
export const getList = (params) => {
  return defHttp.get<any>({ url: Api.getList, params });
};

/**
 * @description: 新增学术列表
 * @param orgId
 * @param params
 */
export const createList = (params) => {
  return defHttp.post<any>({ url: Api.createList, params });
};

/**
 * @description: 编辑学术列表
 * @param params
 */
export const addList = (id, params) => {
  return defHttp.put<any>({ url: Api.addList.replace('id', String(id)), params });
};

/**
 * @description: 编辑学术列表
 * @param params
 */
export const getListTips = (id) => {
  return defHttp.get<any>({ url: Api.getListTips.replace('id', String(id)) });
};

/**
 * @description: 获取专家列表
 * @param params
 */
export const getDoctor = (params) => {
  return defHttp.get<any>({ url: Api.getDoctor,params });
};
/**
 * @description: 删除学术列表
 * @param orgId
 * @param params
 */
export const deleteList = (id) => {
  return defHttp.delete<any>({ url: Api.deleteList.replace('id', String(id)) });
};
