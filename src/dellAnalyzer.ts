import fs from 'fs';
import cheerio from 'cheerio';
import { Analyzer } from './crowller';

interface Course {
  title: string;
  count: number;
}

interface CourseResult {
  time: number; // type is number
  data: Course[];
}

interface Content {
  [propName: number]: Course[];
}

// analyzer 负责分析
export default class DellAnalyzer implements Analyzer {
  private getCourseInfo(html: string) {
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

  generateJsonContent(courseInfo: CourseResult, filePath: string) {
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

  public analyze(html: string, filePath: string) {
    const courseInfo = this.getCourseInfo(html); // 具体的: analyzer 负责分析
    const fileContent = this.generateJsonContent(courseInfo, filePath); // 具体的 : analyzer 负责分析
    return JSON.stringify(fileContent);
  }
}
