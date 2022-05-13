import { defHttp } from '/@/utils/http/axios';
import { PermissionListModel } from '/@/api/sys/model/permissionModel';

enum Api {
  GetPharmacy = '/pharmacy',
}

/**
 * @description: 获取权限列表
 */
export const getPharmacy = (id: number) => {
  const params = {
    dosage_id: id,
  };
  return defHttp.get<PermissionListModel>({ url: Api.GetPharmacy, params });
};
