import { defHttp } from '/@/utils/http/axios';
import { LoginParams, UserModel, AccessTokenModel, UserModelList } from './model/userModel';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  SourceAccessToken = '/auth/access_token',
  GetProfile = '/users/profile',
  GetPermCode = '/permission/code',
  GetUsers = '/organization/orgId/users',
  DestroyUser = '/users/id',
  CreateUser = '/organization/orgId/users',
  EditUser = '/users/id',
}

/**
 * @description: 登录授权/获取Access Token
 */
export function getAccessToken(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<AccessTokenModel>(
    {
      url: Api.SourceAccessToken,
      params,
    },
    {
      errorMessageMode: mode,
    }
  );
}

/**
 * @description: 获取d登录用户Profile
 */
export function getUserProfile() {
  return defHttp.get<UserModel>({ url: Api.GetProfile });
}

export function getPermCode() {
  return defHttp.get<string[]>({ url: Api.GetPermCode });
}

/**
 * @description: 退出登录
 */
export function deleteAccessToken() {
  return defHttp.delete({ url: Api.SourceAccessToken });
}

/**
 * @description: 获取机构用户下的id
 * @param orgId
 */
export function getUserList(orgId: number, params: any) {
  return defHttp.get<UserModelList>({ url: Api.GetUsers.replace('orgId', String(orgId)), params });
}

/**
 * @description: 删除用户
 * @param id
 */
export function destroyUser(id: number) {
  return defHttp.delete<any>({ url: Api.DestroyUser.replace('id', String(id)) });
}

/**
 * @description: 创建用户
 * @param id
 */
export function createUser(orgId: number, params: any) {
  return defHttp.post<any>({ url: Api.CreateUser.replace('orgId', String(orgId)), params });
}

/**
 * @description: 编辑用户
 * @param id
 */
export function editUser(id: number, params: any) {
  return defHttp.put<any>({ url: Api.EditUser.replace('id', String(id)), params });
}
