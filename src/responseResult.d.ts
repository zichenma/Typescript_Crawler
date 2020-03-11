// 定义接口类型
declare namespace responseResult {
    interface CourseItem {
        title: string;
        count: number;
      }

    interface DataStructure {
        [key: string]: CourseItem[];
    }
    // isLogin 这个接口返回的是 boolean 类型
     type isLogin = boolean;
     type login = boolean;
     type logout = boolean;
     type getData = boolean;
     type showData = DataStructure | boolean;
}
