import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';


@Injectable()
export class HttpService {
  private _domain: string;
  constructor(
    private http: HttpClient,
  ) {}
  headers={headers:new HttpHeaders().set('Content-Type','multipart/form-data')}
  
  public post(url: string,data): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .post(url, data)
        .subscribe(
          data => {
            this.handleRequestResult(data, resolve, reject);
          },
          error => {
            reject(error);
          }
        );
    });
  }

  /**
   * 错误码处理
   * 401: token 为空/无效/过期, 重新登陆
   * 412: token 权限不足
   * 0: 接口返回成功
   * 1: 接口返回失败
   */
  private handleRequestResult(data, resolve, reject) {
    switch (data.ret) {
      // 兼容喜马拉雅数据接口正常时无错误码的情况
      case undefined:
        resolve(data);
        break;
      case 0:
        resolve(data);
        break;
      case 1:
      case 412:
      default:
        reject(data);
    }
  }
}
