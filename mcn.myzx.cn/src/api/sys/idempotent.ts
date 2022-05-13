import { defHttp } from '/@/utils/http/axios';

enum Api {
  GetIdempotentToken = '/idempotent/token',
}

export const getIdempotentToken = () => {
  return defHttp.get<any>({ url: Api.GetIdempotentToken });
};
