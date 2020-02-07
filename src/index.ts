import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import router from './router';

// 问题一： express 库的类型定义文件 ,.d.ts 文件描述不准
// 问题二： 当使用中间件时候，对 req， res, 做了修改之后，实际上
// 实际上类型不能改变

const app = express();

// 一定要放在router前面，因为必须先去解析域名
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req: Request, res: Response, next: NextFunction) => {
  req.teacherName = 'dell';
  next();
});
app.use(router);

app.listen(7001, () => {
  console.log('server is running');
});
