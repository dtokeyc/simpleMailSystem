function receiveMails() {

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

    function openInbox(cb) {
        imap.openBox('INBOX', true, cb);
    }

    imap.once('ready', function () {

        openInbox(function (err, box) {

            console.log("打开邮箱")

            if (err) 
                throw err;
            
            imap.search([
                'UNSEEN',
                [
                    'SINCE', 'May 20, 2017'
                ]
            ], function (err, results) { //搜寻2017-05-20以后未读的邮件

                if (err) 
                    throw err;
                
                var f = imap.fetch(results, {bodies: ''}); //抓取邮件（默认情况下邮件服务器的邮件是未读状态）

                f.on('message', function (msg, seqno) {

                    var mailparser = new MailParser();

                    msg.on('body', function (stream, info) {

                        stream.pipe(mailparser); //将为解析的数据流pipe到mailparser

                        //邮件头内容
                        mailparser.on("headers", function (headers) {
                            console.log("邮件头信息>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
                            console.log("邮件主题: " + headers.get('subject'));
                            console.log("发件人: " + headers.get('from').text);
                            console.log("收件人: " + headers.get('to').text);

                            var params = {
                                topic: headers.get('subject'),
                                from: headers
                                    .get('from')
                                    .text
                            }

                            fs.readFile('mails.json', function (err, data) {
                                if (err) {
                                    return console.error(err);
                                }

                                var person = data.toString();
                                person = JSON.parse(person);

                                var jud = true;

                                for (i = 0; i < person.total; i++) {
                                    // console.log(person.data[i].topic);
                                    if (person.data[i].topic == params.topic && person.data[i].from == params.from) {
                                        jud = false;
                                    }
                                }

                                if (jud) {
                                    person
                                        .data
                                        .push(params); //将传来的对象push进数组对象中
                                    person.total = person.data.length;
                                    console.log(person.data);
                                    var str = JSON.stringify(person); //因为nodejs的写入文件只认识字符串或者二进制数，所以把json对象转换成字符串重新写入json文件中
                                    fs.writeFile('mails.json', str, function (err) {
                                        if (err) {
                                            console.error(err);
                                        }
                                        console.log('----------新增成功-------------');
                                    })
                                }

                            });
                        });

                        
                        //邮件内容

                        mailparser.on("data", function (con) {
                            if (con.type === 'text') { //邮件正文
                                console.log("邮件内容信息>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
                                console.log("邮件内容: " + con.text);

                             var params = {
                                    context: con.text
                                }

                                fs.readFile('mails.json', function (err, data) {
                                    if (err) {
                                        return console.error(err);
                                    }

                                    var mails = data.toString();
                                    mails = JSON.parse(mails);

                                    var jud = true;

                                    for (i = 0; i < mails.total2; i++) {
                                        if (mails.context[i].context == params.context) {
                                            jud = false;
                                        }
                                    }

                                    if (jud) {
                                        mails
                                            .context
                                            .push(params); //将传来的对象push进数组对象中
                                        mails.total2 = mails.context.length;
                                        console.log(mails.context);
                                        var str = JSON.stringify(mails); //因为nodejs的写入文件只认识字符串或者二进制数，所以把json对象转换成字符串重新写入json文件中
                                        fs.writeFile('mails.json', str, function (err) {
                                            if (err) {
                                                console.error(err);
                                            }
                                            console.log('----------新增成功-------------');
                                        })
                                    }

                                });

                            }
                            if (con.type === 'attachment') { //附件
                                console.log("邮件附件信息>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
                                console.log("附件名称:" + con.filename); //打印附件的名称
                                con
                                    .content
                                    .pipe(fs.createWriteStream(con.filename)); //保存附件到当前目录下
                                con.release();
                            }
                        });

                    });
                    msg.once('end', function () {
                        console.log(seqno + '完成');
                    });
                });
                f.once('error', function (err) {
                    console.log('抓取出现错误: ' + err);
                });
                f.once('end', function () {
                    console.log('所有邮件抓取完成!');
                    imap.end();
                });
            });
        });
    });

    imap.once('error', function (err) {
        console.log(err);
    });

    imap.once('end', function () {
        console.log('关闭邮箱');
    });

    imap.connect();
}

module.exports = {
    receiveMails
}
