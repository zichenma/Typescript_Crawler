"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var crowller_1 = __importDefault(require("./crowller"));
var dellAnalyzer_1 = __importDefault(require("./dellAnalyzer"));
var router = express_1.Router();
router.get('/', function (req, res) {
    var isLogin = req.session ? req.session.login : undefined;
    if (isLogin) {
        res.send("\n    <html>\n    <body>\n      <a href='/getData'>Get Content</a>\n       <a href='/logout'>Log out</a>\n    </body>\n  <html> \n    ");
    }
    else {
        res.send("\n    <html>\n      <body>\n        <form method=\"post\" action=\"/login\">\n          <input type=\"password\" name=\"password\" />\n          <button>LogIn</button>\n        </form>\n      </body>\n    <html> \n    ");
    }
});
router.post('/login', function (req, res) {
    var password = req.body.password;
    var isLogin = req.session ? req.session.login : undefined;
    console.log('req.session', req.session);
    if (isLogin) {
        res.send('Already login');
    }
    else {
        if (password === '123' && req.session) {
            req.session.login = true;
            res.send("\n      <html>\n      <body>\n        <div>Login Successfully</div>\n        <a href='/getData'>Get Content</a>\n        <a href='/showData'>Show Content</a>\n         <a href='/logout'>Log out</a>\n      </body>\n    <html> \n      ");
        }
        else {
            res.send('Login Failed');
        }
    }
});
router.get('/logout', function (req, res) {
    if (req.session) {
        req.session.login = undefined;
    }
    res.redirect('/');
});
router.get('/getData', function (req, res) {
    var isLogin = req.session ? req.session.login : undefined;
    if (isLogin) {
        var secret = 'secretKey';
        var url = "http://www.dell-lee.com/typescript/demo.html?secret=" + secret;
        var analyzer = dellAnalyzer_1.default.getInstance();
        new crowller_1.default(url, analyzer);
        res.send('getData Success!');
    }
    else {
        res.send("Please login first");
    }
});
router.get('/showData', function (req, res) {
    var isLogin = req.session ? req.session.login : undefined;
    if (isLogin) {
        try {
            var position = path_1.default.resolve(__dirname, '../data/course.json');
            var result = fs_1.default.readFileSync(position, 'utf8');
            res.json(JSON.parse(result));
        }
        catch (e) {
            res.send('Not content yet');
        }
    }
    else {
        res.send("Please login first then check");
    }
});
exports.default = router;
