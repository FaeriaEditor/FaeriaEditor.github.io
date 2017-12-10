var screenPreferences = {
    mX: 1,
    mY: 1,
    currentWidth: 1920,
    currentHeight: 1080
}

function initDrawCards() {
    currentBackNumber = 1;
    changeScreenPreferences();
    $(window).on('resize', function(){
        changeScreenPreferences(); 
        redraw();
    });
    
    $('*').css('user-select', 'none');
};

function changeScreenPreferences(canvas){
   var originWidth = 1920;
   var originHeight = 1080;
   
   var currentWidth =  $('body').width();
   var currentHeight = $('body').height();
   
   // keeping aspect ratio 16:9
   if (currentHeight * 16 / 9  > currentWidth){
       
       currentHeight = (9 * currentWidth)/ 16;
   }
   else{
       currentWidth = (currentHeight * 16 / 9);
   }
   
   var multiplierX = currentWidth / originWidth;
   var multiplierY = currentHeight / originHeight;
   
   // update screen preferences
   screenPreferences.mX = multiplierX;
   screenPreferences.mY = multiplierY;
   screenPreferences.currentWidth = currentWidth;
   screenPreferences.currentHeight = currentHeight;
   
   // update canvas size
   var canvas = document.getElementById('canvas');
   var canvasBack = document.getElementById('canvasBack');
   canvas.style.width = canvasBack.style.width = currentWidth + 'px';
   canvas.style.height = canvasBack.style.height = currentHeight + 'px';
   canvas.width = canvasBack.width = currentWidth;
   canvas.height = canvasBack.height = currentHeight;
   
   var frameHeight = ($('body').height() - $('#canvas').height()) / 2;
   
   if (frameHeight > 0)
   {
        canvas.style.top = canvasBack.style.top = frameHeight + 'px';
        $('#background').css('margin-top', 'calc(-12% + '+ frameHeight +'px)');
   }
   else{
       canvas.style.top = canvasBack.style.top = '0px';
       $('#background').css('margin-top', '-13%');
   }
   
   var frames = $('.background-frame');
   frames.height(frameHeight);
   $(frames[0]).offset({top: $('body').height() - frameHeight, left: 0});
   
   var frameWidth = ($('body').width() - $('#canvas').width()) / 2;
   
   if (frameWidth > 0)
   {
        canvas.style.left = canvasBack.style.left = frameWidth + 'px';
        $('#background').css('margin-left', 'calc(-24% + '+ frameWidth +'px)');
   }
   else{
       canvas.style.left = canvasBack.style.left = '0px';
       $('#background').css('margin-left', '-24%');
   }
   
   var framesV = $('.background-frame-vertical');
   framesV.width(frameWidth);
   $(framesV[0]).offset({top:0 , left: $('body').width() - frameWidth});

   $('.menu-icon').offset({top:frameHeight > 0 ? frameHeight : 0, left: frameWidth > 0 ? frameWidth : 0});
   $('.download-icon').show();
   $('.download-icon').offset({top:frameHeight > 0 ? frameHeight + 20 : 20,  left: frameWidth > 0 ? $('body').width() - 60 - frameWidth : $('body').width() - 60});
   
   drawBackground(currentBackNumber);
}