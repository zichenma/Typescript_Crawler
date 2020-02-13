import { Router, RequestHandler } from 'express';
export const router = Router();

enum Method {
  get = 'get',
  post = 'post'
}

export function controller(target: any) {
  for (let key in target.prototype) {
    // console.log(Reflect.getMetadata('path', target.prototype, key));
    const path = Reflect.getMetadata('path', target.prototype, key);
    const method: Method = Reflect.getMetadata('method', target.prototype, key);
    // handler 是 controller 中具体的的方法 e.g. login() logout()
    const handler = target.prototype[key];
    const middleware = Reflect.getMetadata('middleware', target.prototype, key);
    if (path && method && handler) {
      if (middleware) {
        router[method](path, middleware, handler);
      } else {
        router[method](path, handler);
      }
    }
  }
}

export function use(middleware: RequestHandler) {
  return function(target: any, key: string) {
    Reflect.defineMetadata('middleware', middleware, target, key);
  };
}

function getRequestDecorator(type: string) {
  return function(path: string) {
    return function(target: any, key: string) {
      Reflect.defineMetadata('path', path, target, key);
      Reflect.defineMetadata('method', type, target, key);
    };
  };
}

export const get = getRequestDecorator('get');
export const post = getRequestDecorator('post');
export const put = getRequestDecorator('put');
export const patch = getRequestDecorator('patch');
export const del = getRequestDecorator('delete');
