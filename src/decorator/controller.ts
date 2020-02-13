import { RequestHandler } from 'express';
import router from '../router';
import { Methods } from './request';

// target 是一个构造函数，其类型为： new (...args: any[]) => any)
// 代表 构造函数能接收类型为 any 的多个参数，并且返回 any，new 代表了
// 它是一个构造函数

export function controller(root: string) {
  return function(target: new (...args: any[]) => any) {
    for (let key in target.prototype) {
      // console.log(Reflect.getMetadata('path', target.prototype, key));
      const path: string = Reflect.getMetadata('path', target.prototype, key);
      const method: Methods = Reflect.getMetadata(
        'method',
        target.prototype,
        key
      );
      const middleware: RequestHandler = Reflect.getMetadata(
        'middleware',
        target.prototype,
        key
      );
      // handler 是 controller 中具体的的方法 e.g. login() logout()
      const handler = target.prototype[key];
      if (path && method) {
        const fullPath = root === '/' ? path : `${root}${path}`;
        if (middleware) {
          router[method](fullPath, middleware, handler);
        } else {
          router[method](fullPath, handler);
        }
      }
    }
  };
}
