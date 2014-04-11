/*
 * jQuery PageSwipe
 * Version 2.0
 * Horizontal page slider for desktiop browsers and mobile Devices
 *
 * Copyright (c) 2013 Ingo M. Schaefer (schaefer@schaller-werbung.de) 
*/

function pageswipe(currentPath, numPages)
{
  var moveThreshold = 150;
  var pageGap = 30;
  var grabbed = false;
  var page = {width:$('#container').width(), height:$('#container').height()};
  var startMove = {x:0, y:0};
  var endMove = {x:0, y:0};
  var currentPage = 0;
  var desiredPage = 0;
  
  var viewerPage = 0;
  var numViewerPages = 0;

  function advancePage()
  {
    if(desiredPage>currentPage) 
    {
      currentPage++; 
      $('#prevPage div.page').remove(); 
      $('#prevPage').append($('#currentPage div.page')); 
      $('#currentPage').append($('#nextPage div.page')); 
      if(currentPage+1<numPages) $('<div class="page">').appendTo($('#nextPage')).load(currentPath+'page'+(currentPage+1)+'.html');
    }
    if(desiredPage<currentPage) 
    {
      currentPage--; 
      $('#nextPage div.page').remove(); 
      $('#nextPage').append($('#currentPage div.page')); 
      $('#currentPage').append($('#prevPage div.page')); 
      if(currentPage>0) $('<div class="page">').appendTo($('#prevPage')).load(currentPath+'page'+(currentPage-1)+'.html');
    }
    $('#currentPage').css({'left':0}); $('#prevPage').css({'left':-page.width-pageGap}); $('#nextPage').css({'left':page.width+pageGap});
    $('#header h1').html($('#currentPage h1.header').html()).hide().fadeIn();
    
    if($('#currentPage .overlayzoom').length==0) { $('#currentPage .zoombutton').append('<div class="overlayzoom">'); }
    $('#currentPage .overlayzoom').on('click tap', function(e)
    { 
      $('<div class="overlay">').appendTo($('#container')).append($(this).parent().find('img').clone()).append('<div class="overlayclose">'); 
      $('.overlayclose').bind('click tap', function(){ $('.overlay').remove(); });
      $('.overlay img').touchPanView({ width:1024, height:768, startZoomedOut:true });
    });

    $('#currentPage .viewerbutton').on('click tap', function(e)
    {
      if($('.overlay').length==0)
      {
        $('<div class="overlay"><div class="loader">Inhalte werden geladen ...</div></div>').appendTo($('#container')).load($(this).data('target'), function()
        { 
          viewerPage = 0;
          numViewerPages = Number($('.imgholder').data('num'));
          $('.imgholder').height(numViewerPages*768).css({'top':0});
          $('.overlay').append('<div class="overlayclose"></div><div class="overlayup"></div><div class="overlaydown"></div>'); 
          $('.overlayup').bind('click tap', function(){ if(viewerPage>0) viewerPage--; $('.imgholder').animate({'top':-viewerPage*768}, 360); });
          $('.overlaydown').bind('click tap', function(){ if(viewerPage<numViewerPages-1) viewerPage++; $('.imgholder').animate({'top':-viewerPage*768}, 360); });
          $('.overlayclose').bind('click tap', function(){ $('.imgholder img').remove(); $('.overlay').remove(); });
          $('.overlay img').touchPanView({ width:1024, height:768, startZoomedOut:true });
        }); 
      }
    });
    
    $('#currentPage .hoverbutton').removeClass('active').first().addClass('active');
    $('#currentPage .infopage').hide().first().show();
    $('.hoverbutton').on('click tap', function(e)
    { 
      e.preventDefault();
      $('.hoverbutton').removeClass('active'); 
      $(this).addClass('active'); 
      $('#currentPage .infopage').hide();
      $($(this).data('target')).show(); 
    });
  }
  
  $('<div class="page">').appendTo($('#currentPage')).load(currentPath+'page'+(currentPage)+'.html', function(){ advancePage(); });
  $('<div class="page">').appendTo($('#nextPage')).load(currentPath+'page'+(currentPage+1)+'.html');

  $('#prevPage').css({'left':-page.width});
  $('#nextPage').css({'left':page.width});
  
  $('.pageHolder').bind('touchstart mousedown', function(e){
    grabbed = true;
    if(e.originalEvent.touches && e.originalEvent.touches.length) { startMove.x = e.originalEvent.touches[0].pageX; startMove.y = e.originalEvent.touches[0].pageY; } else { startMove.x = e.pageX; startMove.y = e.pageY; }
    endMove.x = startMove.x;
    endMove.y = startMove.y;
  });

  $('.pageHolder').bind('touchmove mousemove', function(e){
    if(e.originalEvent.touches && e.originalEvent.touches.length) { endMove.x = e.originalEvent.touches[0].pageX; endMove.y = e.originalEvent.touches[0].pageY; } else { endMove.x = e.pageX; endMove.y = e.pageY; }
    if(grabbed) 
    {
      var dragX = endMove.x-startMove.x;
      $('#currentPage').css({'left':dragX});
      $('#nextPage').css({'left':dragX+page.width+pageGap});
      $('#prevPage').css({'left':dragX-page.width-pageGap});
    }
    e.preventDefault();
  });

  $(document).bind('touchend mouseup', function(e){
    grabbed = false;
    var dragX = endMove.x-startMove.x;
    if(dragX>moveThreshold) { desiredPage--; if(desiredPage<0) desiredPage=0; }
    if(-dragX>moveThreshold) { desiredPage++; if(desiredPage>=numPages) desiredPage=numPages-1; }
    if(desiredPage<currentPage) { dragX = page.width; }
    if(desiredPage>currentPage) { dragX = -page.width; }
    if(desiredPage==currentPage) { dragX = 0; }
    $('#prevPage').animate({'left':dragX-page.width-pageGap}, 360); 
    $('#nextPage').animate({'left':dragX+page.width+pageGap}, 360);
    $('#currentPage').animate({'left':dragX}, 360, function(){ if(Math.abs(dragX)>moveThreshold) advancePage(); }); 
  });

}
