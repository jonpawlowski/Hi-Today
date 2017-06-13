"use strict";

require('lodash');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 *
 * Initialize the simple tasks collection schema
 *
 * **/

var keySchema = new Schema({
  key: { type: String, required: true , unique: true},
  created_at: Date,
  updated_at: Date
});

/**
 *
 * Setup pre save function to update date property
 *
 * **/

keySchema.pre('save', function(next){
  var current_date = new Date();
  this.updated_at = current_date;
  if(!this.created_at){
    this.created_at = current_date;
  }
  next();
});

var Keys = mongoose.model('keys', keySchema);

module.exports = Keys;





