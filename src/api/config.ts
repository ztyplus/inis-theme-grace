import httpRequest from "@/utils/requests";

/**
 * 配置API
 */
export default class ConfigApi {
  /**
   * 获取指定配置
   * @param key 配置键
   */
  static one(key: string = "config:grace-theme") {
    return httpRequest.get<INIS.Config>("config/one", { params: { key } });
  }

  /**
   * 获取全部配置
   * @param page 页码
   * @param limit 每页数据长度
   * @param order 排序方式
   */
  static all(page?: number, limit?: number, order?: string) {
    return httpRequest.get<INIS.ConfigList>("config/all", {
      params: { page, limit, order },
    });
  }

  /**
   * 保存配置
   * @param key 键
   * @param value 值
   * @param json 配置数据
   * @param remark 备注
   * @param text 文本
   */
  static save(
    key: string,
    value: string,
    json: any,
    remark?: string,
    text?: string
  ) {
    return httpRequest.post<any>("config/save", {
      key,
      value,
      json,
      remark,
      text,
    });
  }
}
