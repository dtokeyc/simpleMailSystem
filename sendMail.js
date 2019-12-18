var path = require('path');
const nodemailer = require('nodemailer');//邮箱发送依赖

function sendAmail(to,subject,text,attapath) {
    let transporter = nodemailer.createTransport({
        // host: 'smtp.ethereal.email',
        service: '126', // 使用了内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
        port: 465, // SMTP 端口
        secureConnection: true, // 使用了 SSL
        auth: {
          user: 'dingtestmail@126.com',
          // 这里密码不是qq密码，是你设置的smtp授权码
          pass: 'Q12345',
        }
      });
      
      let mailOptions = {
        from: '"丁的测试邮件账户" <dingtestmail@126.com>',// sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        // 发送text或者html格式
        // text: 'Hello world?', // plain text body
        text:text,
        // html: '<b>Hello world?</b>' // html body
        attachments: [{
            path: process.cwd() + attapath
        }]
      };
      
      // send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Message sent: <04ec7731-cc68-1ef6-303c-61b0f796b78f@qq.com>
      });
}

function sendAmailnoAtt(to,subject,text) {
    let transporter = nodemailer.createTransport({
        // host: 'smtp.ethereal.email',
        service: '126', // 使用了内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
        port: 465, // SMTP 端口
        secureConnection: true, // 使用了 SSL
        auth: {
          user: 'dingtestmail@126.com',
          // 这里密码不是qq密码，是你设置的smtp授权码
          pass: 'Q12345',
        }
      });
      
      let mailOptions = {
        from: '"丁的测试邮件账户" <dingtestmail@126.com>',// sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        // 发送text或者html格式
        // text: 'Hello world?', // plain text body
        text:text
        // html: '<b>Hello world?</b>' // html body
      };
      
      // send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Message sent: <04ec7731-cc68-1ef6-303c-61b0f796b78f@qq.com>
      });
}



  module.exports = {
      sendAmail,
      sendAmailnoAtt
  }