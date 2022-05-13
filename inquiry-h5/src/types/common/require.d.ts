interface ResBody<T>{
  status: number;
  code: number;
  message: string;
  data: T;
}

interface RequestOptions{
  hideLoading?: boolean;
  fullPath?: string;
  path?: string;
  contentType?: string;
  hideErrModel?: boolean;
  [key: string]: any;
}
