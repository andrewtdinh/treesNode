/* eslint no-reserved-keys: 0 */

'use strict';

var Mongoose = require('mongoose');
var Life;

var lifeSchema = Mongoose.Schema({
  name: String,
  min: Number,
  max: Number,
  url: String
});

Life = Mongoose.model('Life', lifeSchema);
module.exports = Life;
