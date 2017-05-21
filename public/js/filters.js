'use strict';

/* Filters */

angular.module('myApp.filters', [])

  .filter('interpolate', function (version) {
    return function (text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    };
  })
/**
 *@description
 * This is a customized filter to transfer date timezone to shanghai,
 * and make the date format like: mmm dd yy, h:mm:ss
 *
 * @param date
 * the raw date come from api
 *
 * @return
 * the well-preocessed date
 * **/

.filter('transferTimeFormat', function(){
  return function (date) {

    //add the timezone for whole application
    moment.tz.add("Asia/Shanghai|CST CDT|-80 -90|01010101010101010|-1c1I0 LX0 16p0 1jz0 1Myp0 Rb0 1o10 11z0 1o10 11z0 1qN0 11z0 1o10 11z0 1o10 11z0|23e6");

    if(moment(date).isValid()){
      return moment(date).tz('Asia/Shanghai').format('MMM Do YY, h:mm:ss a');
    }else{
      return date;
    }
  }
});
