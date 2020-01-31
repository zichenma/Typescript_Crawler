import fs from 'fs';
import path from 'path';
// ts -> .d.ts 翻译文件 -> js
import superagent from 'superagent';
import cheerio from 'cheerio';

interface Course {
  title: string;
  count: number;
}

interface CourseResult {
  time: number; // type is number
  data: Course[];
}

interface Content {
  // 转化数据结构从：
  // {
  //   time: 1580489013468,
  //   data: [
  //     { title: 'Vue2.5开发去哪儿网App', count: 74 },
  //     { title: 'React 16.4 开发简书项目', count: 77 },
  //     { title: 'React服务器渲染原理解析与实践', count: 94 },
  //     { title: '手把手带你掌握新版Webpack4.0', count: 55 }
  //   ]
  // }
  // 转化成：
  // {
  //   1580489013468 :  [
  //     { title: 'Vue2.5开发去哪儿网App', count: 74 },
  //     { title: 'React 16.4 开发简书项目', count: 77 },
  //     { title: 'React服务器渲染原理解析与实践', count: 94 },
  //     { title: '手把手带你掌握新版Webpack4.0', count: 55 }
  //   ],
  //   1580489013468 :  [
  //     { title: 'Vue2.5开发去哪儿网App', count: 74 },
  //     { title: 'React 16.4 开发简书项目', count: 77 },
  //     { title: 'React服务器渲染原理解析与实践', count: 94 },
  //     { title: '手把手带你掌握新版Webpack4.0', count: 55 }
  //   ]
  // }
  [propName: number]: Course[];
}

class Crowller {
  private secret = 'secretKey';
  private url = `http://www.dell-lee.com/typescript/demo.html?secret=${this.secret}`;

  getCourseInfo(html: string) {
    const $ = cheerio.load(html);
    const courseItems = $('.course-item');
    const courseInfos: Course[] = [];

    courseItems.map((index, element) => {
      const descs = $(element).find('.course-desc');
      // <div class="course-item">
      //   <img class="course-img" src="/imgs/vue.jpg">
      //   <p class="course-desc">Vue2.5开发去哪儿网App</p>
      //   <p class="course-desc">当前课程学习人数：21</p>
      // </div>
      const title = descs.eq(0).text(); // <p class="course-desc">Vue2.5开发去哪儿网App</p>
      const count = parseInt(
        descs
          .eq(1)
          .text()
          .split('：')[1], // <p class="course-desc">当前课程学习人数：21</p>
        10
      );
      courseInfos.push({ title, count });
    });
    return {
      time: new Date().getTime(),
      data: courseInfos
    };
  }

  async getRawHtml() {
    const result = await superagent.get(this.url);
    // 因为 getCourseInfo 和 getRawHtml 耦合
    // 所以需要 initSpiderProcess() 单独处理爬虫功能
    // 把 getCourseInfo() 放到 initSpiderProcess 里
    return result.text;
  }

  generateJsonContent(courseInfo: CourseResult) {
    // 根据当前路径 __dirname 去找跟目录下的 course.json
    const filePath = path.resolve(__dirname, '../data/course.json');
    let fileContent: Content = {};
    // 判断文件是否存在
    if (fs.existsSync(filePath)) {
      // 如果有内容则把读取内容存(老数据）在 fileContent
      fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
    // 把新爬到的内容(新数据)存在 fileContent
    fileContent[courseInfo.time] = courseInfo.data;
    // generateJsonContent 只应当负责生成JSON， 所以存数据应当新定义函数完成
    // fs.writeFileSync(filePath, JSON.stringify(fileContent));
    return fileContent;
  }

  async initSpiderProcess() {
    // 1. 首先获取 HTML
    // 2. 再拿到课程信息
    // 3. 存储到Json文件里
    const html = await this.getRawHtml();
    const courseInfo = this.getCourseInfo(html);
    const fileContent = this.generateJsonContent(courseInfo);
    const filePath = path.resolve(__dirname, '../data/course.json');
    fs.writeFileSync(filePath, JSON.stringify(fileContent));
  }

  constructor() {
    this.initSpiderProcess();
  }
}

const crowller = new Crowller();
