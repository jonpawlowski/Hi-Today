'use strick';

(function () {
  $('button').click(function(){
    $('.form').fadeIn('slow', 'linear', function(){
      console.log("called");
    })
  })
})();
