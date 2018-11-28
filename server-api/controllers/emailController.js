var debug = require('debug')('home-productsapi:emailController');

var config = require('../config');
var appError = require('../config/appError');

var CodeGenerator = require('node-code-generator');
var generator = new CodeGenerator();

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.getVerificationCode = function(){
  let pattern = '***************';
  return generator.generateCodes(pattern, 1, {sparsity:10})[0];
}

exports.sendUserVerificationEmail = function(toName, toEmail, verifictionCode, userId, userType){
  debug("sendUserVerificationEmail ",userType);
  let verificationLink = `${config.appDomain}/${userType?userType+'/':''}verify/${userId}?c=${verifictionCode}`;
  let textMessage = 'Gracias por tu registro. Utiliza este link para verificar tu cuenta: '+verificationLink;
  let htmlMessage = '<h2><strong>Gracias por tu registro.</strong></h2><p>Utiliza este link para verificar tu cuenta: <a href="'+verificationLink+'">'+verificationLink+'</a></p>'
  let subject = 'Verifica tu cuenta';
  return recursiveSendEmail(toName, toEmail, textMessage, htmlMessage, subject, 0);
}

exports.sendVerificationEmail = function(toName, toEmail, verifictionCode, userId, password, userModelType){
  let verificationLink = config.appDomain+'/'+userModelType+'/verify/'+userId+'?c='+verifictionCode;
  let textMessage = 'Gracias por tu registro. Utiliza este link para verificar tu cuenta: '+verificationLink;
  textMessage += 'Tu contraseña es: '+password;
  let htmlMessage = '<h2><strong>Gracias por tu registro.</strong></h2><p>Utiliza este link para verificar tu cuenta: <a href="'+verificationLink+'">'+verificationLink+'</a></p>'
  htmlMessage += '<p><strong>Tu contraseña es: '+password+'</strong></p>';
  let subject = 'Verifica tu cuenta';
  return recursiveSendEmail(toName, toEmail, textMessage, htmlMessage, subject, 0);
}

exports.sendEmail = function(toName, toEmail, textMessage, htmlMessage, subject){
  return recursiveSendEmail(toName, toEmail, textMessage, htmlMessage, subject, 0);
}

function recursiveSendEmail(toName, toEmail, textMessage, htmlMessage, subject, count = 0){
  debug("sendEmail",toEmail, count);
  return _sendEmail(toName, toEmail, textMessage, htmlMessage, subject)
  .then((sended)=>{
    debug("sended", sended);
    return sended;
  },error=>{
    debug("send error",error);
    debug("send error",error.response.body.errors);
    if(count<=3){
      count++;
      return recursiveSendEmail(toName, toEmail, textMessage, htmlMessage, subject, count);
    }else{
      throw error;
    }
  });
 }

function _sendEmail(toName, toEmail, textMessage, htmlMessage, subject){
  const msg = {
    to: {name: toName, email: toEmail},
    from: {name:'Tuttihome-products',email:config.verifyEmail},
    subject: subject,
    text: textMessage,
    html: htmlMessage,
  };
  // debug("_sendEmail",msg);
  return sgMail.send(msg);
}

exports.verifyEmail = function(verificationCode, userId, userType){
  debug("userId",userId)
    return User.findById(userId).then(user=>{
      debug("user.verificationCode",user.verificationCode);
      debug("verificationCode",verificationCode);
      if(user.verificationCode == verificationCode){
        return user.update({status:'active'}).then(success=>{
          return true;
        },error=>{
          throw error;
        });
      }else{
        return false;
      }
    },error=>{
      throw error;
    });
}
