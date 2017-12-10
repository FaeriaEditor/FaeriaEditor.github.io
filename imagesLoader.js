
var allImagesCount = 0;
var loadedImages=[];
var loadedImagesCount = 0;

function loadImages(arr) {
    // Make sure arr is actually an array and any other error checking
    for (var i = 0; i < arr.length; i++){
        var img = new Image();
       // img.setAttribute('crossOrigin', 'anonymous');
        img.onload = imageLoaded;
        img.src = arr[i];
        loadedImages[arr[i]] = img;
    }

    function imageLoaded(e) {
        loadedImagesCount++;
    }
}

$(document).ready(function() {
    
    var urls = [
    'res\\gameUI\\cardsUpsideDown.png', 'res\\gameUI\\cardback.png', 
    'res\\gameUI\\cards.png',
    'res\\gameUI\\wheel-full.png', 'res\\Icons\\cross.png',
    'res/Board/1.jpg', 'res/Board/2.jpg', 'res/Board/3.jpg', 'res/Board/4.jpg','res/Board/5.jpg','res/Board/6.jpg',
    "res\\gameUI\\desert.png", "res\\gameUI\\forest.png", "res\\gameUI\\lake.png", "res\\gameUI\\mountain.png", "res\\gameUI\\neutral.png", 
    "res\\gameUI\\desertb.png", "res\\gameUI\\forestb.png", "res\\gameUI\\lakeb.png", "res\\gameUI\\mountainb.png", "res\\gameUI\\neutralb.png", 
    "res\\gameUI\\orbs\\1.png", "res\\gameUI\\orbs\\2.png", "res\\gameUI\\orbs\\3.png", "res\\gameUI\\orbs\\4.png", "res\\gameUI\\orbs\\5.png", "res\\gameUI\\orbs\\6.png",
    
    "res\\gameUI\\avatars\\1.png", "res\\gameUI\\avatars\\2.png", "res\\gameUI\\avatars\\3.png", "res\\gameUI\\avatars\\4.png", "res\\gameUI\\avatars\\5.png", "res\\gameUI\\avatars\\6.png", "res\\gameUI\\avatars\\7.png", "res\\gameUI\\avatars\\8.png","res\\gameUI\\avatars\\9.png" ,"res\\gameUI\\avatars\\10.png" ,"res\\gameUI\\avatars\\11.png", "res\\gameUI\\avatars\\12.png", "res\\gameUI\\avatars\\13.png", "res\\gameUI\\avatars\\14.png", "res\\gameUI\\avatars\\15.png", "res\\gameUI\\avatars\\16.png", "res\\gameUI\\avatars\\17.png", "res\\gameUI\\avatars\\18.png",
    
    "res\\gameUI\\life.png",
    "res\\gameUI\\emptyWell.png", "res\\gameUI\\activeWell.png", 
    "res\\gameUI\\frame.png", "res\\gameUI\\frameb.png", "res\\gameUI\\structureb.png", "res\\gameUI\\structure.png", "res\\gameUI\\flegend.png", "res\\gameUI\\flegendb.png",
    "res\\Tokens\\Abilities\\charge.png", "res\\Tokens\\Abilities\\flying.png","res\\Tokens\\Abilities\\flyingFlipped.png", "res\\Tokens\\Abilities\\jump.png","res\\Tokens\\Abilities\\ranged.png", "res\\Tokens\\Abilities\\taunt.png",
    "res\\gameUI\\pepe.png", "res\\gameUI\\cardNoImage.png",
    "res\\Icons\\icon_battle.png"
    ];
    allImagesCount = urls.length;
    loadImages(urls);
    
    var timerId = setInterval(function(){
        if (loadedImagesCount == allImagesCount){
            clearInterval(timerId);
            initDrawCards();
            initField();
            initMenu();
            initEditCreatureLightbox();
            initOrbLightbox();
        }
    }, 1000)
});