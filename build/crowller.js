"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
// ts -> .d.ts 翻译文件 -> js
var superagent_1 = __importDefault(require("superagent"));
// import cheerio from 'cheerio';
var dellAnalyzer_1 = __importDefault(require("./dellAnalyzer"));
// interface Content {
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
// [propName: number]: Course[];
// }
// crowller 负责读写
var Crowller = /** @class */ (function () {
    function Crowller(url, analyzer) {
        this.url = url;
        this.analyzer = analyzer;
        // private secret = 'secretKey';
        // private url = `http://www.dell-lee.com/typescript/demo.html?secret=${this.secret}`;
        // 根据当前路径 __dirname 去找跟目录下的 course.json
        this.filePath = path_1.default.resolve(__dirname, '../data/course.json');
        this.initSpiderProcess();
    }
    // 迁移到 dellAnalyzer
    // getCourseInfo(html: string) {
    //   const $ = cheerio.load(html);
    //   const courseItems = $('.course-item');
    //   const courseInfos: Course[] = [];
    //   courseItems.map((index, element) => {
    //     const descs = $(element).find('.course-desc');
    //     // <div class="course-item">
    //     //   <img class="course-img" src="/imgs/vue.jpg">
    //     //   <p class="course-desc">Vue2.5开发去哪儿网App</p>
    //     //   <p class="course-desc">当前课程学习人数：21</p>
    //     // </div>
    //     const title = descs.eq(0).text(); // <p class="course-desc">Vue2.5开发去哪儿网App</p>
    //     const count = parseInt(
    //       descs
    //         .eq(1)
    //         .text()
    //         .split('：')[1], // <p class="course-desc">当前课程学习人数：21</p>
    //       10
    //     );
    //     courseInfos.push({ title, count });
    //   });
    //   return {
    //     time: new Date().getTime(),
    //     data: courseInfos
    //   };
    // }
    Crowller.prototype.getRawHtml = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, superagent_1.default.get(this.url)];
                    case 1:
                        result = _a.sent();
                        // 因为 getCourseInfo 和 getRawHtml 耦合
                        // 所以需要 initSpiderProcess() 单独处理爬虫功能
                        // 把 getCourseInfo() 放到 initSpiderProcess 里
                        return [2 /*return*/, result.text];
                }
            });
        });
    };
    // 迁移到 dellAnalyzer
    // generateJsonContent(courseInfo: CourseResult) {
    //   let fileContent: Content = {};
    //   // 判断文件是否存在
    //   if (fs.existsSync(this.filePath)) {
    //     // 如果有内容则把读取内容存(老数据）在 fileContent
    //     fileContent = JSON.parse(fs.readFileSync(this.filePath, 'utf-8'));
    //   }
    //   // 把新爬到的内容(新数据)存在 fileContent
    //   fileContent[courseInfo.time] = courseInfo.data;
    //   // generateJsonContent 只应当负责生成JSON， 所以存数据应当新定义函数完成
    //   // fs.writeFileSync(filePath, JSON.stringify(fileContent));
    //   return fileContent;
    // }
    Crowller.prototype.writeFile = function (content) {
        fs_1.default.writeFileSync(this.filePath, content);
    };
    Crowller.prototype.initSpiderProcess = function () {
        return __awaiter(this, void 0, void 0, function () {
            var html, fileContent;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getRawHtml()];
                    case 1:
                        html = _a.sent();
                        fileContent = this.analyzer.analyze(html, this.filePath);
                        this.writeFile(fileContent); // 通用的: crowller 负责
                        return [2 /*return*/];
                }
            });
        });
    };
    return Crowller;
}());
var secret = 'secretKey';
var url = "http://www.dell-lee.com/typescript/demo.html?secret=" + secret;
var analyzer = dellAnalyzer_1.default.getInstance();
new Crowller(url, analyzer);
