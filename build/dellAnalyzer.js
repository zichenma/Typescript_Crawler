"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var cheerio_1 = __importDefault(require("cheerio"));
// analyzer 负责分析
var DellAnalyzer = /** @class */ (function () {
    function DellAnalyzer() {
    }
    DellAnalyzer.getInstance = function () {
        if (!this.instance) {
            this.instance = new DellAnalyzer();
        }
        return this.instance;
    };
    DellAnalyzer.prototype.getCourseInfo = function (html) {
        var $ = cheerio_1.default.load(html);
        var courseItems = $('.course-item');
        var courseInfos = [];
        courseItems.map(function (index, element) {
            var descs = $(element).find('.course-desc');
            // <div class="course-item">
            //   <img class="course-img" src="/imgs/vue.jpg">
            //   <p class="course-desc">Vue2.5开发去哪儿网App</p>
            //   <p class="course-desc">当前课程学习人数：21</p>
            // </div>
            var title = descs.eq(0).text(); // <p class="course-desc">Vue2.5开发去哪儿网App</p>
            var count = parseInt(descs
                .eq(1)
                .text()
                .split('：')[1], // <p class="course-desc">当前课程学习人数：21</p>
            10);
            courseInfos.push({ title: title, count: count });
        });
        return {
            time: new Date().getTime(),
            data: courseInfos
        };
    };
    DellAnalyzer.prototype.generateJsonContent = function (courseInfo, filePath) {
        var fileContent = {};
        // 判断文件是否存在
        if (fs_1.default.existsSync(filePath)) {
            // 如果有内容则把读取内容存(老数据）在 fileContent
            fileContent = JSON.parse(fs_1.default.readFileSync(filePath, 'utf-8'));
        }
        // 把新爬到的内容(新数据)存在 fileContent
        fileContent[courseInfo.time] = courseInfo.data;
        // generateJsonContent 只应当负责生成JSON， 所以存数据应当新定义函数完成
        // fs.writeFileSync(filePath, JSON.stringify(fileContent));
        return fileContent;
    };
    DellAnalyzer.prototype.analyze = function (html, filePath) {
        var courseInfo = this.getCourseInfo(html); // 具体的: analyzer 负责分析
        var fileContent = this.generateJsonContent(courseInfo, filePath); // 具体的 : analyzer 负责分析
        return JSON.stringify(fileContent);
    };
    return DellAnalyzer;
}());
exports.default = DellAnalyzer;
