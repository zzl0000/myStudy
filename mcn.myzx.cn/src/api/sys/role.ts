import { defHttp } from '/@/utils/http/axios';
import { RoleModel } from './model/roleModel';
import { useUserStoreWithOut } from '/@/store/modules/user';

const userStore = useUserStoreWithOut();

enum Api {
  GetRoles = '/organization/orgId/roles',
  CreateRoles = '/organization/orgId/roles',
  DestroyRole = '/roles/id',
  EditRole = '/roles/id',
}

/**
 * @description: 获取角色
 * @param id
 */
export function getRoles() {
  const id = userStore.getUserInfo.organization_id;
  return defHttp.get<RoleModel[]>({ url: Api.GetRoles.replace('orgId', String(id)) });
}

export function destroyRole(id: number) {
  return defHttp.delete<any>({ url: Api.DestroyRole.replace('id', String(id)) });
}

export function createRole(id: number, params: any) {
  return defHttp.post<any>({ url: Api.CreateRoles.replace('orgId', String(id)), params });
}

export function editRole(id: number, params: any) {
  return defHttp.put<any>({ url: Api.EditRole.replace('id', String(id)), params });
}
