var cors = require('cors');
// CORS
var whitelist = require('./config').whitelist;
var corsOptions = {
  origin: function (origin, callback) {
    // console.log("origin",origin);
    // console.log("whitelist",whitelist);
    if (whitelist.indexOf(origin) !== -1) {
      // console.log("si",origin);
      callback(null, true)
    } else {
      // console.log("no",origin);
      callback(new Error('Not allowed by CORS'))
    }
  }
}
module.exports = cors(corsOptions);
