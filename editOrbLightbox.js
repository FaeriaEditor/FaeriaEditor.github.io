var currentAvatarNumber;
var currentOrbNumber;
var avatarOrbOwner;

function showEditOrbLightbox(orbNumber, avatarNumber, owner){
    var lightbox = $('.edit-orb-lightbox');
    var back = $('.lightbox-background');
    currentAvatarNumber = avatarNumber;
    currentOrbNumber = orbNumber;
    avatarOrbOwner = owner;
    setPicture(this.currentOrbNumber, this.currentAvatarNumber);
    
    $('.change-orb-icon.avatar').not('.right').click(function(){
        currentAvatarNumber = currentAvatarNumber - 1 == 0 ? 18 : currentAvatarNumber - 1;
        setPicture(currentOrbNumber, currentAvatarNumber);
    });
    
    $('.change-orb-icon.avatar.right').click(function(){
        currentAvatarNumber = currentAvatarNumber + 1 > 18 ? 1 : currentAvatarNumber + 1;
        setPicture(currentOrbNumber, currentAvatarNumber);
    });
    
    $('.change-orb-icon.orb').not('.right').click(function(){
        currentOrbNumber = currentOrbNumber - 1 == 0 ? 6 : currentOrbNumber - 1;
        setPicture(currentOrbNumber, currentAvatarNumber);
    });
    
    $('.change-orb-icon.orb.right').click(function(){
        currentOrbNumber = currentOrbNumber + 1 > 6 ? 1 : currentOrbNumber + 1;
        setPicture(currentOrbNumber, currentAvatarNumber);
    });
    
    var text = avatarOrbOwner == 'player' ? playerLifeCount : enemyLifeCount;
    lightbox.find('#numHpEdit').val(text);
    
    lightbox.find('.edit-pic-orb-hp').text(text);
    lightbox.find('.edit-pic-orb-hp').toggleClass('long', text.length > 1);
        
    var left = (screenPreferences.currentWidth - lightbox.width()) / 2;
    var top = (screenPreferences.currentHeight - lightbox.height()) / 2;
    lightbox.offset({left: left, top: top});
    lightbox.show();
    back.show();
}

function setPicture(orbNumber, avatarNumber){
    $('.edit-orb-picture').css('background-image', "url('res/gameUI/Orbs/" + orbNumber + ".png'), url('res/gameUI/avatars/" + avatarNumber + ".png')");
}

function initOrbLightbox() {
    var lightbox = $('.edit-orb-lightbox');
    
    $('#lightboxFooter').find('span').on('mousedown', function(){
        $(event.target).css('background-image', "url('res/Panels/Stone/StoneButton_Gold_Pressed.png')")
    });
    
    $('.ok-button-lightbox').click(function() {
        var lightbox = $('.edit-orb-lightbox');
        var text = lightbox.find('#numHpEdit').val();
        if (avatarOrbOwner == 'player')
        {
            playerOrbNumber = currentOrbNumber;
            playerAvatarNumber = currentAvatarNumber;
            playerLifeCount = text;
        }
        else if (avatarOrbOwner == 'enemy')
        {
            enemyOrbNumber = currentOrbNumber;
            enemyAvatarNumber = currentAvatarNumber; 
            enemyLifeCount = text;
        }
         
        var lightbox = $('.edit-orb-lightbox');
        var back = $('.lightbox-background');
        lightbox.offset({left: 0, top: 0});
        lightbox.hide();
        back.hide();
        redraw();
    });
    
    $('.cancel-button-lightbox').click( function() {
        var lightbox = $('.edit-orb-lightbox');
        var back = $('.lightbox-background');
        lightbox.offset({left: 0, top: 0});
        lightbox.hide();
        back.hide();
    });
    
    lightbox.find('#numHpEdit').on('input', function(){
        var text = lightbox.find('#numHpEdit').val();
        
        var intValue = parseInt(text, 10);
        if (!intValue) {
            if(intValue < 1){
                $('#numHpEdit').val(1);
            }
            if (intValue > 99)
            {
                $('#numHpEdit').val(99);
            }
        }
        
        
        lightbox.find('.edit-pic-orb-hp').text(text);
        lightbox.find('.edit-pic-orb-hp').toggleClass('long', text.length > 1);
    });
    
    lightbox.find('*').on('mouseup', function(){
        $('#lightboxFooter').find('span').css('background-image', "url('res/Panels/Stone/StoneButton_Gold.png')");
    });
    
    $('.lightbox-background').on('mouseup', function(){
        $('#lightboxFooter').find('span').css('background-image', "url('res/Panels/Stone/StoneButton_Gold.png')");
    });
};
