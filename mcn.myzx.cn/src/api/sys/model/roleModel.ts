export interface RoleModel {
  id: number;
  organization_id: number;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  permissions: any[];
}
