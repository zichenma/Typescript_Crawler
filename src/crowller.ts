// ts -> .d.ts 翻译文件 -> js

import superagent from 'superagent';
import cheerio from 'cheerio';

interface Course {
  title: string;
  count: number;
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
    const result = {
      time: new Date().getTime(),
      data: courseInfos
    };
    console.log(result);
  }

  async getRawHtml() {
    const result = await superagent.get(this.url);

    this.getCourseInfo(result.text);
  }

  constructor() {
    this.getRawHtml();
  }
}

const crowller = new Crowller();
