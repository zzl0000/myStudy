/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  mobile: string;
  password: string;
}

/**
 * @description: AccessToken模型
 */
export interface AccessTokenModel {
  type: string;
  token: string;
  expire_in: number;
  user_id: number;
}

/**
 * @description: User模型
 */
export interface UserModel {
  // 标识
  id: number;
  // 姓名
  title: string;
  //手机号
  mobile: string;
  // 头像
  avatar: string;
  // 隶属MCN机构ID
  organization_id: number;
  // 隶属MCN机构信息 暂无
  // 最后登录时间
  last_login_at: string;
  role_ids: number[];
}

export type UserModelList = UserModel[];
