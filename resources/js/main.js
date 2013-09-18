jQuery(document).ready( function() {
  
  //Masonry
  var $container = $('#items-wrapper');
  
  $container.imagesLoaded(function(){
    $container.masonry({
      columnWidth: '.base',
      itemSelector: '.item'
    });  
  });
  
  //Insert New
  $('#insert').on('click', function(){
    
    var random_index = Math.floor((Math.random()*$('.item').length));
    var text = $('.item:eq(' + random_index + ') p').text();
    var image =  $('.item:eq(' + random_index + ') img').prop('src');
    var new_block = 
      $('<div class="item">' + 
          '<img src="' + image + '" />' + 
          '<div>No. 1.</div>' + 
          '<p>' + text + '</p>' + 
        '</div>');
    
    $("#items-wrapper").prepend( new_block ).masonry('prepended', new_block );
    
    $('.item').each( function( index ) {
      index = index+1;
      
      $(this).find('div').html('No. ' + index + '.');
    });
     
  });
    
});
