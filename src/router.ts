// import fs from 'fs';
// import path from 'path';
// import { Router, Request, Response, NextFunction } from 'express';
// import Crowller from './utils/crowller';
// import Analyzer from './utils/analyzer';
// import { getResponseData } from './utils/util';

// interface BodyRequest extends Request {
//   body: { [key: string]: string | undefined };
// }

// const router = Router();

// const checkLogin = (req: Request, res: Response, next: NextFunction) => {
//   const isLogin = req.session ? req.session.login : false;
//   if (isLogin) {
//     next();
//   } else {
//     res.json(getResponseData(null, 'Please login first'));
//   }
// };

// router.post('/login', (req: BodyRequest, res: Response) => {
//   const { password } = req.body;
//   const isLogin = req.session ? req.session.login : undefined;

//   if (isLogin) {
//     res.json(getResponseData(false, 'Already login'));
//   } else {
//     if (password === '123' && req.session) {
//       req.session.login = true;
//       res.json(getResponseData(true));
//     } else {
//       res.json(getResponseData(false, 'Login Failed'));
//     }
//   }
// });

// router.get('/getData', checkLogin, (req: BodyRequest, res: Response) => {
//   const secret = 'secretKey';
//   const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`;
//   const analyzer = Analyzer.getInstance();
//   new Crowller(url, analyzer);
//   res.json(getResponseData(true));
// });

// router.get('/showData', checkLogin, (req: BodyRequest, res: Response) => {
//   try {
//     const position = path.resolve(__dirname, '../data/course.json');
//     const result = fs.readFileSync(position, 'utf8');
//     res.json(getResponseData(JSON.parse(result)));
//   } catch (e) {
//     res.json(getResponseData(false, 'Not content yet'));
//   }
// });

// export default router;
