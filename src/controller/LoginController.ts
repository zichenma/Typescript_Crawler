import 'reflect-metadata';
import { Request, Response } from 'express';
import { controller, get, post } from '../decorator';
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

@controller('/') // 类的装饰器一般做逻辑的融合
export class LoginController {
  // 用静态的方法，就可以保证，LoginController 不需要实例化就可以用 isLogin
  static isLogin(req: BodyRequest): boolean {
    return !!(req.session ? req.session.login : false);
  }

  @post('/login')
  login(req: BodyRequest, res: Response): void {
    const { password } = req.body;
    const isLogin = LoginController.isLogin(req);

    if (isLogin) {
      res.json(getResponseData(false, 'Already login'));
    } else {
      if (password === '123' && req.session) {
        req.session.login = true;
        res.json(getResponseData(true));
      } else {
        res.json(getResponseData(false, 'Login Failed'));
      }
    }
  }

  @get('/logout')
  logout(req: BodyRequest, res: Response): void {
    if (req.session) {
      req.session.login = undefined;
    }
    res.json(getResponseData(true));
  }

  @get('/')
  home(req: BodyRequest, res: Response): void {
    const isLogin = LoginController.isLogin(req);
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