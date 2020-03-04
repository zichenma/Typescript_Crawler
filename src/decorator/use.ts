import 'reflect-metadata';
import { RequestHandler } from 'express';
import { CrowllerController, LoginController } from '../controller';

export function use(middleware: RequestHandler) {
  return function(target: CrowllerController | LoginController, key: string) {
    // 这样可以用多个中间件在一个函数下
    // 当第一次拿中间件，会添加到originMiddlewares空数组里
    // 第二次把两个中间件存在middlewares
    const originMiddlewares =
      Reflect.getMetadata('middlewares', target, key) || [];
    originMiddlewares.push(middleware);
    Reflect.defineMetadata('middlewares', originMiddlewares, target, key);
  };
}
