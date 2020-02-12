import 'reflect-metadata';
import { Request, Response } from 'express';
import { controller, get } from './decorator';
import { getResponseData } from '../utils/util';

interface BodyRequest extends Request {
  body: { [key: string]: string | undefined };
}

// 会放到单独的 decorator.ts 里面
// 把路径存到方法上面
// function get(path: string) {
//   return function(target: any, key: string) {
//     // path => '/'. target => LoginCtr prototype, key => home
//     Reflect.defineMetadata('path', path, target, key);
//   };
// }

// function controller(target: any) {
//   // target 就是 Class （LoginController)
//   for (let key in target.prototype) {
//     console.log(Reflect.getMetadata('path', target.prototype, key));
//   }
// }

@controller // 类的装饰器一般做逻辑的融合
class LoginController {
  @get('/logout')
  logout(req: BodyRequest, res: Response) {
    if (req.session) {
      req.session.login = undefined;
    }
    res.json(getResponseData(true));
  }

  @get('/')
  home(req: BodyRequest, res: Response) {
    const isLogin = req.session ? req.session.login : false;
    if (isLogin) {
      res.send(`
      <html>
        <body>
          <a href='/getData'>爬取内容</a>
          <a href='/showData'>展示内容</a>
          <a href='/logout'>退出</a>
        </body>
      </html>
    `);
    } else {
      res.send(`
      <html>
        <body>
          <form method="post" action="/login">
            <input type="password" name="password" />
            <button>登陆</button>
          </form>
        </body>
      </html>
    `);
    }
  }
}
