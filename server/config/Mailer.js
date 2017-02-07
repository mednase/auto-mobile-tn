var sendgrid = require("sendgrid"),
    fs= require('fs'),
    hogan= require('hogan'),
    params= require('../config/params');


var template=fs.readFileSync('server/views/email.hjs','utf-8');
var compiledTemplate=hogan.compile(template);

/* Prepare the email */
function InitEmail(name,destination,title,message){
    var year=new Date().getFullYear();


    var helper = sendgrid.mail;
    from_email = new helper.Email(params.server_email);
    to_email = new helper.Email(destination);
    subject = title;
    content = new helper.Content("text/html",
        compiledTemplate.render({firstname: name,message: message,siteUrl: params.server_url,year:year}));

      mail = new helper.Mail(from_email, subject, to_email, content);

    return mail.toJSON();
}
module.exports.sendEmail=function (name,message,destination,title,callback) {

        email=InitEmail(name,destination,title,message);

        var sg = sendgrid(params.sendgateApi);

        var requestPost = sg.emptyRequest({
            method: 'POST',
            path: '/v3/mail/send',
            body: email
        });
        sg.API(requestPost, function (error, response) {
            if(error)
                 callback(error,response);
            else
                 callback(error,response);

        });
};
