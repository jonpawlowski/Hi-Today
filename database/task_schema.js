"use strict";

require('lodash');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 *
 * Initialize the simple tasks collection schema
 *
 * **/

var taskSchema = new Schema({
  createdBy: String,
  name: { type: String, required: true },
  status: { type: Boolean, required: true },
  Description: String,
  created_at: Date,
  updated_at: Date
});

/**
 *
 * Setup a method to check whether the task is existing
 *
 * **/

taskSchema.methods.checkName = function(name) {
  taskSchema.find({name: name}, function (err, user) {
    if (err || user == "") {
      return false;
    }
    if (user) {
      return true;
    }
  })
}

/**
 *
 * Setup pre save function to update date property
 *
 * **/

taskSchema.pre('save', function(next){
  var current_date = new Date();
  this.updated_at = current_date;
  if(!this.created_at){
    this.created_at = current_date;
  }
});

var Task = mongoose.model('Task', taskSchema);

module.exports = Task;





