var _ = require("lodash");
var defaults = require("./environments/default.js");
var config = require("./environments/" + (process.env.NODE_ENV || "development") + ".js");
module.exports = _.merge({}, defaults, config);
