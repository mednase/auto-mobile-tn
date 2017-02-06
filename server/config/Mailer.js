var sendgrid = require("sendgrid"),
    fs= require('fs'),
    hogan= require('hogan-express'),
    params= require('../config/params');


var template=fs.readFileSync('server/views/email.hjs','utf-8');
var compiledTemplate=hogan.compile(template);

/* Prepare the email */
function InitEmail(name,destination,title,message){
    var helper = sendgrid.mail;
    from_email = new helper.Email(params.server_email);
    to_email = new helper.Email(destination);
    subject = title;
    content = new helper.Content("text/html",
        compiledTemplate.render({firstname: name,message: message,siteUrl: params.server_url}));

      mail = new helper.Mail(from_email, subject, to_email, content);

    return mail.toJSON();
}
module.exports.sendEmail=function (name,message,destination,title) {

        email=InitEmail(name,destination,title,message);

        var sg = sendgrid(params.sendgateApi);

        var requestBody = email;
        var emptyRequest = require('sendgrid-rest').request;
        var requestPost = JSON.parse(JSON.stringify(emptyRequest));
        requestPost.method = 'POST';
        requestPost.path = '/v3/mail/send';
        requestPost.body = requestBody;

        sg.API(requestPost, function (error, response) {
            if(error)
                callback({success:false ,msg: 'failed to sent the email try again !'});
            else
                callback({success:true ,msg: 'An e-mail has been sent to '+user.email+' with further instruction'});

        });
};
