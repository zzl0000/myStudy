import { defHttp } from '/@/utils/http/axios';

enum Api {
  GetOssUpload = '/hospital-manage/aliyun/getOssUpload',
}

/**
 * @description: 上传视频凭证
 */
export const getOssUpload = (params: any) => {
  return defHttp.get<any>({
    url: Api.GetOssUpload,
    params,
  });
};
