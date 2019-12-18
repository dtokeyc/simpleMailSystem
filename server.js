var express = require('express'); //express模板
var app = express();
var bodyParser = require('body-parser'); //用于处理和解析post请求的中间件
var multer = require('multer');
var path = require('path');
var session = require('express-session');
var sendamail = require('./sendMail');

const nodemailer = require('nodemailer'); //邮箱发送依赖

var Imap = require('imap')
var MailParser = require("mailparser").MailParser
var fs = require("fs")

var imap = new Imap({
    user: 'dingtestmail@126.com', //你的邮箱账号
    password: 'Q12345', //你的邮箱密码
    host: 'imap.126.com', //邮箱服务器的主机地址
    port: 993, //邮箱服务器的端口地址
    tls: true, //使用安全传输协议
    tlsOptions: {
        rejectUnauthorized: false
    } //禁用对证书有效性的检查
});
// 邮箱收取依赖 

// var mysql = require('mysql'); var connection =
// mysql.createConnection({ host     : 'localhost',     user     : 'root',
// password : 'Q12qw34er', database : 'mail_sys' })

app.set('views', __dirname);
app.set('view engine', 'html');
app.engine('.html', require('ejs').__express); //设置渲染模板ejs

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(multer());

app.use(express.static(require('path').join(__dirname, 'public'))); //静态资源存放位置

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 10 //过期时间设置(单位毫秒)
    }
}));

app.use(function (req, res, next) {
    res.locals.user = req.session.user;
    var err = req.session.error;
    res.locals.message = '';
    if (err) 
        res.locals.message = '<div style="margin-bottom: 20px;color:red;">' + err + '</' +
                'div>';
    next();
});

app.get('/', function (req, res) {
    res.render('login');
}) //访问时进入登录页面

app.get('/login', function (req, res) {
    res.render('login');
})

app.get('/index', function (req, res) {
    if (req.session.username) {
        res.render('index', {username: req.session.username});
    } else {
        res.redirect('login');
    }
})

app.get('/send.html', function (req, res) {
    res.render('send');
})

app.get('/send', function (req, res) {
    res.render('send');
})

app.post('/login', function (req, res) {
    // 注释部分为数据库实现     connection.connect();     var sql = 'SELECT password FROM
    // users WHERE username = ?';     var sqlParams = [req.body.username];
    // connection.query(sql,sqlParams,function (err, result) {         if(err){
    // console.log('[SELECT ERROR] - ',err.message);          return;         }
    // if(req.body.password==result)         {             req.session.username =
    // req.body.username;             res.sendStatus(200);         }else{
    // res.sendStatus(403);         } }); var user={     　　　　username:'admin',
    // password:'123'     　　} console.log(req.body.username); connection.end();

    var user = {
        username: 'admin',
        password: '123'
    }
    if (req.body.username == user.username && req.body.password == user.password) {
        req.session.username = req.body.username;
        res.sendStatus(200);
    } else {
        res.sendStatus(403);
    }
})

app.get('/logout', function (req, res) {
    req.session.username = null;
    res.redirect('login');
})

app.get('/sendMail', function (req, res) {
    sendamail.sendAmail();
})

app.post('/sendMailno', function (req, res) {
    console.log("正在传送邮件");
    console.log("收件人：" + req.body.receiver);
    if (req.body.receiver == undefined) {
        res.sendStatus(403);
    } else {
        sendamail.sendAmailnoAtt(req.body.receiver, req.body.topic, req.body.context);
        res.sendStatus(200);
    }
})

app.get('/receiveMail', function (req, res) {
    var receiveMails = require('./receiveMail');
    receiveMails.receiveMails();
    fs.readFile('mails.json',function(err,data){
        if(err){
            console.error(err);
        }

        var mails = data.toString();
        mails = JSON.parse(mails);
        var length = mails.data.length;
        res.render('receive',{data:mails.data,con:mails.context});

    })
 })

app.listen(1234);
