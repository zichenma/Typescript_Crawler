import fs from 'fs';
import path from 'path';
import 'reflect-metadata';
import { Request, Response, NextFunction } from 'express';
import { controller, get, use } from '../decorator';
import { getResponseData } from '../utils/util';
import Crowller from '../utils/crowller';
import Analyzer from '../utils/analyzer';

interface BodyRequest extends Request {
  body: { [key: string]: string | undefined };
}

const checkLogin = (req: Request, res: Response, next: NextFunction): void => {
  const isLogin = !!(req.session ? req.session.login : false);
  console.log('check login middleware');
  if (isLogin) {
    next();
  } else {
    res.json(getResponseData(null, 'Please login first'));
  }
};

const test = (req: Request, res: Response, next: NextFunction): void => {
  console.log('test middleware');
  next();
};

@controller('/')
export class CrowllerController {
  @get('/getData')
  @use(checkLogin)
  @use(test)
  getData(req: BodyRequest, res: Response): void {
    const secret = 'secretKey1';
    const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`;
    const analyzer = Analyzer.getInstance();
    try {
      new Crowller(url, analyzer);
      res.json(getResponseData(true));
    } catch (error) {
      res.json(getResponseData(false, `Error: ${error}`));
    }
  }
  @get('/showData')
  @use(checkLogin)
  showData(req: BodyRequest, res: Response): void {
    try {
      const position = path.resolve(__dirname, '../../data/course.json');
      const result = fs.readFileSync(position, 'utf8');
      res.json(getResponseData(JSON.parse(result)));
    } catch (e) {
      res.json(getResponseData(false, 'Not content yet'));
    }
  }
}
