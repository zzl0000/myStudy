import { defHttp } from '/@/utils/http/axios';
import { PermissionListModel, PermissionParams } from './model/permissionModel';

enum Api {
  GetPermissions = '/permissions',
  DestroyPermissions = '/permissions/id',
  CreatePermissions = '/permissions',
  EditPermissions = '/permissions/id',
}

/**
 * @description: 获取权限列表
 */
export const getPermissionList = () => {
  return defHttp.get<PermissionListModel>({ url: Api.GetPermissions });
};

/**
 * @description: 删除权限
 */
export const destroyPermission = (id: number) => {
  return defHttp.delete<any>({ url: Api.DestroyPermissions.replace('id', id) });
};

/**
 * @description: 创建权限
 */
export const createPermission = (params: PermissionParams) => {
  return defHttp.post<any>({ url: Api.CreatePermissions, params});
};

/**
 * @description: 修改权限
 */
export const editPermission = (id: number, params: PermissionParams) => {
  return defHttp.put<any>({ url: Api.EditPermissions.replace('id', id), params});
};
