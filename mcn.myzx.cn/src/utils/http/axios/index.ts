// axios配置  可自行根据项目进行更改，只需更改该文件即可，其他文件可以不动
// The axios configuration can be changed according to the project, just change the file, other files can be left unchanged

import type {AxiosResponse} from 'axios';
import type {RequestOptions, Result} from '/#/axios';
import type {AxiosTransform, CreateAxiosOptions} from './axiosTransform';
import {VAxios} from './Axios';
import {checkStatus} from './checkStatus';
import {useGlobSetting} from '/@/hooks/setting';
import {useMessage} from '/@/hooks/web/useMessage';
import {RequestEnum, ResultEnum, ContentTypeEnum} from '/@/enums/httpEnum';
import {isString} from '/@/utils/is';
import {getToken} from '/@/utils/auth';
import {setObjToUrlParams, deepMerge} from '/@/utils';
import {useErrorLogStoreWithOut} from '/@/store/modules/errorLog';
import {useI18n} from '/@/hooks/web/useI18n';
import {joinTimestamp, formatRequestDate} from './helper';
import {useUserStoreWithOut} from '/@/store/modules/user';
import {Console} from 'console';

const globSetting = useGlobSetting();
const urlPrefix = globSetting.urlPrefix;
const baiduURL = globSetting.baiduURL;
const {createMessage, createErrorModal} = useMessage();

/**
 * @description: 数据处理，方便区分多种处理方式
 */
const transform: AxiosTransform = {
  /**
   * @description: 处理请求数据。如果数据不是预期格式，可直接抛出错误
   */
  transformRequestHook: (res: AxiosResponse<Result>, options: RequestOptions) => {
    return res.data;
  },

  // 请求之前处理config
  beforeRequestHook: (config, options) => {
    const {apiUrl, joinPrefix, joinParamsToUrl, formatDate, joinTime = true} = options;
    if (config?.params?.baiduURL) {
      config.url = `${baiduURL}${config.url}`;
    } else {
      if (joinPrefix) {
        config.url = `${urlPrefix}${config.url}`;
      }
      if (apiUrl && isString(apiUrl)) {
        config.url = `${apiUrl}${config.url}`;
      }
    }
    // console.log(apiUrl, joinPrefix);
    console.log(config);
    const params = config.params || {};
    const data = config.data || false;
    formatDate && data && !isString(data) && formatRequestDate(data);
    if (config.method?.toUpperCase() === RequestEnum.GET) {
      if (!isString(params)) {
        // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
        config.params = Object.assign(params || {}, joinTimestamp(joinTime, false));
      } else {
        // 兼容restful风格
        config.url = config.url + params + `${joinTimestamp(joinTime, true)}`;
        config.params = undefined;
      }
    } else {
      if (!isString(params)) {
        formatDate && formatRequestDate(params);
        if (Reflect.has(config, 'data') && config.data && Object.keys(config.data).length > 0) {
          config.data = data;
          config.params = params;
        } else {
          // 非GET请求如果没有提供data，则将params视为data
          config.data = params;
          config.params = undefined;
        }
        if (joinParamsToUrl) {
          config.url = setObjToUrlParams(
            config.url as string,
            Object.assign({}, config.params, config.data)
          );
        }
      } else {
        // 兼容restful风格
        config.url = config.url + params;
        config.params = undefined;
      }
    }
    return config;
  },

  /**
   * @description: 请求拦截器处理
   */
  requestInterceptors: (config, options) => {
    // 请求之前处理config
    const token = getToken();
    if (token && (config as Recordable)?.requestOptions?.withToken !== false) {
      // jwt token
      config.headers.Authorization = options.authenticationScheme
        ? `${options.authenticationScheme} ${token}`
        : token;
    }
    if (config.url === 'https://qyexpress.market.alicloudapi.com/composite/queryexpress') {
      config.headers.Authorization = 'APPCODE c8447768ba1d4d22ba2cc657ec26d2dc';
    }
    return config;
  },

  /**
   * @description: 响应拦截器处理
   */
  responseInterceptors: (res: AxiosResponse<any>) => {
    try {
      let data = res.data;
      console.log('检查返回结果格式正否有异常');
      if (typeof data === 'object') {
        return res;
      }
      console.log('返回结果异常,尝试修复...');
      if (res.config.data) {
        data = data.substr(res.config.data.length);
        res.data = JSON.parse(data);
        console.log('修复成功');
      }
    } catch (e) {
      console.log('修复失败');
    }
    return res;
  },

  /**
   * @description: 响应错误处理
   */
  responseInterceptorsCatch: (error: any) => {
    const {t} = useI18n();
    const errorLogStore = useErrorLogStoreWithOut();
    errorLogStore.addAjaxErrorInfo(error);
    const {response, message, config} = error || {};
    const errorMessageMode = config?.requestOptions?.errorMessageMode || 'none';
    const msg: string = response?.data?.message ?? '';
    const code: string = response?.data?.code ?? '';
    const err: string = error?.toString?.() ?? '';
    const userStore = useUserStoreWithOut();
    let errMessage = '';

    try {
      errMessage = msg;

      const status = error?.response?.status;

      if (status == 401) {
        userStore.logout(true);
      }

      if (errMessage) {
        if (
          errorMessageMode === 'modal' ||
          status == 401 ||
          status == 400 ||
          status == 422 ||
          status == 403
        ) {
          createErrorModal({title: t('sys.api.errorTip'), content: errMessage});
        } else if (errorMessageMode === 'message') {
          createMessage.error(errMessage);
        } else {
          createMessage.error(errMessage);
        }
        return Promise.reject(error);
      }
    } catch (error) {
      throw new Error(error);
    }

    checkStatus(error?.response?.status, msg, errorMessageMode);
    return Promise.reject(error);
  },
};

function createAxios(opt?: Partial<CreateAxiosOptions>) {
  return new VAxios(
    deepMerge(
      {
        // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#authentication_schemes
        // authentication schemes，e.g: Bearer
        // authenticationScheme: 'Bearer',
        authenticationScheme: '',
        timeout: 10 * 3000,
        // 基础接口地址
        // baseURL: globSetting.apiUrl,
        // 接口可能会有通用的地址部分，可以统一抽取出来
        urlPrefix: urlPrefix,
        headers: {'Content-Type': ContentTypeEnum.JSON},
        // 如果是form-data格式
        // headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
        // 数据处理方式
        transform,
        // 配置项，下面的选项都可以在独立的接口请求中覆盖
        requestOptions: {
          // 默认将prefix 添加到url
          joinPrefix: true,
          // 是否返回原生响应头 比如：需要获取响应头时使用该属性
          isReturnNativeResponse: false,
          // 需要对返回数据进行处理
          isTransformResponse: true,
          // post请求的时候添加参数到url
          joinParamsToUrl: false,
          // 格式化提交参数时间
          formatDate: true,
          // 消息提示类型
          errorMessageMode: 'message',
          // 接口地址
          apiUrl: globSetting.apiUrl,
          //  是否加入时间戳
          joinTime: true,
          // 忽略重复请求
          ignoreCancelToken: true,
          // 是否携带token
          withToken: true,
        },
      },
      opt || {}
    )
  );
}

export const defHttp = createAxios();
export const pictureHttp = createAxios({
  headers: {
    'Content-Type': '	application/x-www-form-urlencoded',
  },
});

export const expressHttp = createAxios({
  headers: {
    // 'Content-Type': ContentTypeEnum.JSON,
    Authorization: 'APPCODE c8447768ba1d4d22ba2cc657ec26d2dc',
  },
  requestOptions: {
    apiUrl: globSetting.express,
  },
});

// other api url
// export const otherHttp = createAxios({
//   requestOptions: {
//     apiUrl: 'xxx',
//   },
// });
