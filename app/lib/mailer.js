
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');
var EmailTemplate = require('email-templates').EmailTemplate;
var path = require('path');
var key = require('../../config/config.json').sendGridkey;
var options = {
  auth: {
    api_key: key
  }
}
module.exports = function() {
  var mailer={};

  mailer.sendAdminForgotPasswordEmail= function(user) {
    var templateDir = path.join(__dirname, '..', 'email_templates', 'admin_forgot_password');
    var welcomeMail = new EmailTemplate(templateDir);
    var mailer = nodemailer.createTransport(sgTransport(options));
    welcomeMail.render({
      fullName: user.fullName,
      password: user.password
    }, function (err, result) {
      var email = {
        from: 'do-not-reply@alifkitab.com',
        to: user.email,
        subject: 'Password Changed',
        html: result.html
      };
      mailer.sendMail(email, function (error, res) {
        if (error) {
          console.log(error);
        } else {
          console.log(res)
        }
      });
    })
  }

 return mailer;
}
