import { defHttp } from '/@/utils/http/axios';
import { userMenusListModel, menuListModel, menuParams } from './model/menuModel';

enum Api {
  GetUserMenus = '/users/menu',
  GetMenus = '/menus',
  DestroyMenus = '/menus/id',
  CreateMenu = '/menus',
  EditMenu = '/menus/id',
}

/**
 * @description: 获取用户菜单
 */
export const getUserMenuList = () => {
  return defHttp.get<userMenusListModel>({ url: Api.GetUserMenus });
};

/**
 * @description: 获取菜单
 */
export const getMenuList = () => {
  return defHttp.get<menuListModel>({ url: Api.GetMenus });
};

/**
 * @description: 删除菜单
 */
export const destroyMenu = (id: number) => {
  return defHttp.delete<any>({ url: Api.DestroyMenus.replace('id', id) });
};

/**
 * @description: 创建菜单
 * @param params
 */
export const createMenu = (params: menuParams) => {
  return defHttp.post<any>({ url: Api.CreateMenu, params});
};

/**
 * @description: 修改菜单
 * @param params
 */
export const editMenu = (id: number, params: menuParams) => {
  return defHttp.put<any>({ url: Api.EditMenu.replace('id', id), params});
};
