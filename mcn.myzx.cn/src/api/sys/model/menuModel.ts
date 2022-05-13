import type { RouteMeta } from 'vue-router';
export interface RouteItem {
  path: string;
  component: any;
  meta: RouteMeta;
  name?: string;
  alias?: string | string[];
  redirect?: string;
  caseSensitive?: boolean;
  children?: RouteItem[];
}

/**
 * @description: Get menu return value
 */
export type userMenusListModel = RouteItem[];

/**
 * @description: 菜单
 */
export interface menuModel {
  id: number | string;
  icon: string;
  name: string;
  title: string;
  path: string;
  full_path: string;
  component: string;
  redirect: string;
  created_at: string;
  updated_at: string;
  deleted_at: any;
  children?: menuModel[] | undefined;
}

/**
 * @description: 菜单列表
 */
export type menuListModel = menuModel[];

/**
 * @description: 菜单创建修改表单参数
 */
export interface menuParams {
  title: string;
  parent_id: number | string;
  icon?: string | undefined;
  sort?: number | string | undefined;
  full_path: string;
  component: string;
  redirect?: string | undefined;
}

