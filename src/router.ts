import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import Crowller from './crowller';
import DellAnalyzer from './dellAnalyzer';

interface RequestWithBody extends Request {
  body: {
    [key: string]: string | undefined;
  };
}

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const isLogin = req.session ? req.session.login : undefined;
  if (isLogin) {
    res.send(`
    <html>
    <body>
      <a href='/getData'>Get Content</a>
       <a href='/logout'>Log out</a>
    </body>
  <html> 
    `);
  } else {
    res.send(`
    <html>
      <body>
        <form method="post" action="/login">
          <input type="password" name="password" />
          <button>LogIn</button>
        </form>
      </body>
    <html> 
    `);
  }
});

router.post('/login', (req: RequestWithBody, res: Response) => {
  const { password } = req.body;
  const isLogin = req.session ? req.session.login : undefined;
  console.log('req.session', req.session);

  if (isLogin) {
    res.send('Already login');
  } else {
    if (password === '123' && req.session) {
      req.session.login = true;
      res.send(`
      <html>
      <body>
        <div>Login Successfully</div>
        <a href='/getData'>Get Content</a>
        <a href='/showData'>Show Content</a>
         <a href='/logout'>Log out</a>
      </body>
    <html> 
      `);
    } else {
      res.send('Login Failed');
    }
  }
});

router.get('/logout', (req: Request, res: Response) => {
  if (req.session) {
    req.session.login = undefined;
  }
  res.redirect('/');
});

router.get('/getData', (req: RequestWithBody, res: Response) => {
  const isLogin = req.session ? req.session.login : undefined;
  if (isLogin) {
    const secret = 'secretKey';
    const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`;
    const analyzer = DellAnalyzer.getInstance();
    new Crowller(url, analyzer);
    res.send('getData Success!');
  } else {
    res.send(`Please login first`);
  }
});

router.get('/showData', (req: RequestWithBody, res: Response) => {
  const isLogin = req.session ? req.session.login : undefined;
  if (isLogin) {
    try {
      const position = path.resolve(__dirname, '../data/course.json');
      const result = fs.readFileSync(position, 'utf8');
      res.json(JSON.parse(result));
    } catch (e) {
      res.send('Not content yet');
    }
  } else {
    res.send(`Please login first then check`);
  }
});

export default router;
