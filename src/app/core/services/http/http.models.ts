export interface RequestConfig {
  url: string;
  baseUrl?: string;
  body?: any;
}

export interface BaseRequestConfig extends RequestConfig {
  method: string;
}

export interface BackEndResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}
