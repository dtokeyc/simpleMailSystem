var express = require('express');//express模板
var app = express();
var bodyParser = require('body-parser');//用于处理和解析post请求的中间件
var multer = require('multer');
var path = require('path');
var session = require('express-session');

var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'Q12qw34er',
    database : 'mail_sys'
})

app.set('views',__dirname);
app.set( 'view engine', 'html' );
app.engine( '.html', require( 'ejs' ).__express );//设置渲染模板ejs

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());

app.use(express.static(require('path').join(__dirname, 'public')));//静态资源存放位置

app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:false,
    cookie:{
        maxAge:1000*60*10 //过期时间设置(单位毫秒)
    }
}));

app.use(function(req, res, next){
    　　res.locals.user = req.session.user;
    　　var err = req.session.error;
    　　res.locals.message = '';
    　　if (err) res.locals.message = '<div style="margin-bottom: 20px;color:red;">' + err + '</div>';
    　　next();
});
 
app.get('/', function (req, res) {
   res.render('login');
})//访问时进入登录页面

app.get('/login',function(req,res){
    res.render('login');
})

app.get('/index',function(req,res){
    if(req.session.username){
        res.render('index',{username:req.session.username});
    }else{
        res.redirect('login');
    }
})


app.post('/login',function(req,res){
    connection.connect();
    var sql = 'SELECT password FROM users WHERE username = ?';
    var sqlParams = [req.body.username];
    connection.query(sql,sqlParams,function (err, result) {
        if(err){
         console.log('[SELECT ERROR] - ',err.message);
         return;
        }
        if(req.body.password==result)
        {
            req.session.username = req.body.username;
            res.sendStatus(200);
        }else{
            res.sendStatus(403);
        }

});

    // var user={
    //     　　　　username:'admin',
    //     　　　　password:'123'
    //     　　}
    // console.log(req.body.username);
    connection.end();
})

app.get('/logout',function (req,res) {
    req.session.username = null;
    res.redirect('login');
})
 
app.listen(1234);
