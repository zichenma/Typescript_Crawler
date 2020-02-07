import { Router, Request, Response } from 'express';
import Crowller from './crowller';
import DellAnalyzer from './dellAnalyzer';

interface RequestWithBody extends Request {
  body: {
    [key: string]: string | undefined;
  };
}

const router = Router();

router.get('/', (req: RequestWithBody, res: Response) => {
  res.send(`
  <html>
    <body>
      <form method="post" action="/getData">
        <input type="password" name="password" />
        <button>Submit</button>
      </form>
    </body>
  <html> 
  `);
});

router.post('/getData', (req: Request, res: Response) => {
  const { password } = req.body;
  if (password === '123') {
    const secret = 'secretKey';
    const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`;
    const analyzer = DellAnalyzer.getInstance();
    new Crowller(url, analyzer);
    res.send('getData Success!');
  } else {
    res.send(`${req.teacherName} Password Error!`);
  }
});

export default router;
