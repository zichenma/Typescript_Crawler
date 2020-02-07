// 对自定义的类型，可以在原有 Express 定义类型的基础上，仿照
// 原有定义文件做一个类型融合，此时原有 Express 就有了新自定义类型

declare namespace Express {
  interface Request {
    teacherName: string;
  }
}
