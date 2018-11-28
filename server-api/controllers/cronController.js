var debug = require('debug')('home-productsapi:cronController');
var config = require('../config');
var appError = require('../config/appError');

var sequelize = require('../db/models').sequelize;
var Sequelize = require('../db/models').Sequelize;
var Op = require('sequelize').Op;

var schedule = require('node-schedule');

var Auction = require('../db/models').remate;
var AuctionGeneralInfo = require('../db/models').infoGeneralRemate;
var Capturist = require('../db/models').capturista;
var emailController = require('./emailController');

var auctionCron;
exports.start = ()=>{
  debug("start");
  // auctionCron = schedule.scheduleJob('*/30 * * * * *', ()=>{
  // auctionCron = schedule.scheduleJob('0 */1 * * * *', ()=>{
  auctionCron = schedule.scheduleJob('0 0 0 * * *', ()=>{
    debug("Looking for expired auctions");
    let auctionExpired =Auction.findAll({
      include: [
        {model: AuctionGeneralInfo, as: 'infoGeneral' },
        {model: Capturist, as: 'capturista' },
      ],
      where:{[Op.and]: [
        sequelize.where(sequelize.col('fechaHoraSubasta'),Op.lt,new Date()),
        {bandera: { [Op.ne]:'expirado'}}
      ]}
    });
    let expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate()+3);
    let auctionToExpire = Auction.findAll({
      include: [
        {model: AuctionGeneralInfo, as: 'infoGeneral' },
        // {model: Capturist, as: 'capturista' },
      ],
      where:{[Op.and]: [
        sequelize.where(sequelize.col('fechaHoraSubasta'),Op.gt,new Date()),
        sequelize.where(sequelize.col('fechaHoraSubasta'),Op.lt,expirationDate),
        {bandera: { [Op.ne]:'expirado'}}
      ]}
    });

    Promise.all([auctionExpired, auctionToExpire])
    .then(values=>{
      let auctionsPromises = [];
      let emailPromises = [];
      values[0].forEach(async value=>{
        debug("expired id",value.id);
        debug("value",value.bandera);
        debug("fecha",value.infoGeneral.fechaHoraSubasta);
        // value.bandera = 'expirado';
        auctionsPromises.push(value.save());
        let capturistEmail = {name:value.capturista.name,email:value.capturista.email};
        debug("capturistEmail",capturistEmail);
        let adminMaster = await Capturist.findOne({type:'master'});
        let adminEmail = {name:adminMaster.name,email:adminMaster.email};
        debug("adminEmail",adminEmail);
        let adminsEmails = [capturistEmail];
        if(adminEmail.email != capturistEmail.email)
        adminsEmails.push(adminEmail);
        debug("adminsEmails",adminsEmails);
        // send notification to capturist && admin(4);
        adminsEmails.forEach(adminEmail=>{
          emailPromises.push(emailController.sendExpirationMessage(adminEmail.name,adminEmail.email,3,value.id));
        });
      });

      values[1].forEach(async value=>{
        debug("to expire id",value.id);
        debug("value",value.bandera);
        debug("fecha",value.infoGeneral.fechaHoraSubasta);
        let auctionUsersEmails = (await value.getUsuarios()).map(user=>{return {name:user.name,email: user.email}});
        debug("auctionUsersEmails",auctionUsersEmails);
        // send notification to all users (1);
        auctionUsersEmails.forEach(userEmail=>{
          emailPromises.push(emailController.sendExpirationMessage(userEmail.name,userEmail.email,0,value.id,true));
        });
      });

      Promise.all(auctionsPromises).then(values=>{
        values.forEach(value=>{
          debug("value",value);
        },error=>{
          debug("error",error);
        });
      });
      // Promise.all(emailPromises)
      // .then(values=>{
      //   values.forEach(value=>{
      //     debug("value",value);
      //   },error=>{
      //     debug("error",error);
      //   });
      // });
    },error=>{
      debug("Error",error.message?error.message:error.error.message?error.error.message:'error');
    });
  });
}

// exposrt.stop = ()=>{
//   auctionCron
// }
