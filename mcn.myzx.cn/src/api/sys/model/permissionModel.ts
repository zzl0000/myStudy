export interface PermissionParams {
  id: number;
  title: string;
  parent_id: number;
  method: number;
  path: string;
  description: string;
}

export interface PermissionModel {
  id: number;
  title: string;
  parent_id: number;
  menu_id: number;
  method: string;
  path: string;
  description: string;
  created_at: string;
  updated_at: string;
  children: PermissionModel[] | undefined;
}

export type PermissionListModel = PermissionModel[];
