import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

type Result<T> = {
  code: number;
  msg: string;
  data: T;
};

export class Request {
  private static instance: Request;
  private instance: AxiosInstance;
  private baseConfig: AxiosRequestConfig = {
    //@ts-ignore
    baseURL: INIS.api,
    //@ts-ignore
    token: INIS.token,
    timeout: 5000,
  };

  private constructor(config: AxiosRequestConfig) {
    this.instance = axios.create(Object.assign(this.baseConfig, config));

    // 请求拦截
    this.instance.interceptors.request.use(
      (config) => {
        const Authorization = localStorage.getItem("Authorization") as string;
        if (Authorization) {
          config.headers!.Authorization = Authorization;
        }
        return config;
      },
      (err: any) => {
        return Promise.reject(err);
      }
    );

    // 响应拦截
    this.instance.interceptors.response.use(
      (res: AxiosResponse) => {
        return res.data;
      },
      (err: any) => {
        let message = "";
        switch (err.response.status) {
          case 400:
            message = "请求错误(400)";
            break;
          case 401:
            message = "未授权，请重新登录(401)";
            break;
          case 403:
            message = "拒绝访问(403)";
            break;
          case 404:
            message = "请求出错(404)";
            break;
          case 408:
            message = "请求超时(408)";
            break;
          case 500:
            message = "服务器错误(500)";
            break;
          case 501:
            message = "服务未实现(501)";
            break;
          case 502:
            message = "网络错误(502)";
            break;
          case 503:
            message = "服务不可用(503)";
            break;
          case 504:
            message = "网络超时(504)";
            break;
          case 505:
            message = "HTTP版本不受支持(505)";
            break;
          default:
            message = `连接出错(${err.response.status})!`;
        }
        // console.log(message);

        //   ElMessage({
        //   showClose: true,
        //   message: `${message}，请检查网络！`,
        //   type: "error",
        // });

        return Promise.reject(err.response);
      }
    );
  }

  public static getInstance(config?: AxiosRequestConfig): Request {
    if (!Request.instance) {
      Request.instance = new Request(config || {});
    }
    return Request.instance;
  }

  public request(config: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.instance.request(config);
  }

  public get<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<Result<T>>> {
    return this.instance.get(url, config);
  }

  public post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<Result<T>>> {
    return this.instance.post(url, data, config);
  }

  public put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<Result<T>>> {
    return this.instance.put(url, data, config);
  }

  public delete<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<Result<T>>> {
    return this.instance.delete(url, config);
  }
}

export default Request.getInstance();
