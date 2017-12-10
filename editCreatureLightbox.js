var creatureLightboxCellX;
var creatureLightboxCellY;

function showEditCreatureLightbox(creature, cellx, celly){
    initialize(creature);
    var lightbox = $('.edit-creature-lightbox');
    var back = $('.lightbox-background');
    creatureLightboxCellX = cellx;
    creatureLightboxCellY = celly;
    var left = (screenPreferences.currentWidth - lightbox.width()) / 2;
    var top = (screenPreferences.currentHeight - lightbox.height()) / 2;
    lightbox.offset({left: left, top: top});
    lightbox.show();
    back.show();
}

function initialize(creature){
    var lightbox = $('.edit-creature-lightbox');
    lightbox.find('#divOwnerContainer input[data-owner="'+creature.owner+'"]').prop('checked', 'true');
    
    $('.edit-pic-power').removeClass('buffed');
    $('.edit-pic-power').removeClass('debuffed');
    $('.edit-pic-hp').removeClass('buffed');
    $('.edit-pic-hp').removeClass('debuffed');
    
    $('.edit-pic-power').removeClass('long');
    $('.edit-pic-hp').removeClass('long');

    lightbox.find('#numPowerEdit').val(creature.power);
    lightbox.find('#numHpEdit').val(creature.hp);
    lightbox.find('.edit-pic-power').html(creature.power);
    lightbox.find('.edit-pic-hp').html(creature.hp);
    var image = new Image();
    image.onerror = function() {
        var lightbox = $('.edit-creature-lightbox');
        lightbox.find('.span-creature').css('background-image', "url('res/gameUI/pepe.png')");
        lightbox.find('.span-creature').css('background-size', "100% 100%");
    }
    var creatureSrc = 'https://raw.githubusercontent.com/abrakam/Faeria_Cards/master/CardExport/English/' + creature.id  +'.png';
    var frameSrc = "res/gameUI/frame.png"
        
    var frameBackground = creature.owner == 'player' ? "url('res/gameUI/frame.png')" : "url('res/gameUI/frameb.png')";
    image.src = creatureSrc;
    lightbox.find('#spanFrame').css('background-image', frameBackground);
    lightbox.find('.span-creature').css('background-image', "url(" + creatureSrc + ")");
    lightbox.data('basePower', creature.power);
    lightbox.data('baseHp', creature.hp);
    
    lightbox.find('#numPowerEdit').trigger('input');
    lightbox.find('#numHpEdit').trigger('input');
    $('#divAbilitiesContainer').find('span').removeClass('pressed');
    $('#picCreatureEdit').find('span').addClass('hide');
     
    $(creature.abilities).each(function(index, ab){
        $('#divAbilitiesContainer').find('span').filter(function (index, ab2){
            return $(ab2).data('ability') == ab;
        }).toggleClass('pressed');
        
        $('#picCreatureEdit').find('span').filter(function (index, ab3){
            return $(ab3).data('ability') == ab;
        }).toggleClass('hide');
    })
}

function initEditCreatureLightbox() {
    var lightbox = $('.edit-creature-lightbox');
    
    $('#lightboxFooter').find('span').on('mousedown', function(){
        $(event.target).css('background-image', "url('res/Panels/Stone/StoneButton_Gold_Pressed.png')")
    });
    
    lightbox.find('#divOwnerContainer input').on('change', function(){
        var frameBackground = $(event.target).data('owner') == 'player' ? "url('res/gameUI/frame.png')" : "url('res/gameUI/frameb.png')";
        $('#spanFrame').css('background-image', frameBackground);
    });
    
    lightbox.find('.ok-button-lightbox').click(function() {
        
        var lightbox = $('.edit-creature-lightbox');
        var newCreature = {
            owner: lightbox.find('#divOwnerContainer input:checked').data('owner'),
            hp: lightbox.find('#numHpEdit').val(),
            power: lightbox.find('#numPowerEdit').val(),
            abilities: $('#divAbilitiesContainer').find('span.pressed').map(function(){
                return $(this).data('ability');
            }).toArray()
        }
        
        applyCreatureChanges(newCreature, creatureLightboxCellX, creatureLightboxCellY);
         
         
        var back = $('.lightbox-background');
        lightbox.offset({left: 0, top: 0});
        lightbox.hide();
        back.hide();  
    });
    
    $('.cancel-button-lightbox').click( function() {
        var lightbox = $('.edit-creature-lightbox');
        var back = $('.lightbox-background');
        lightbox.offset({left: 0, top: 0});
        lightbox.hide();
        back.hide();
    });
    
    lightbox.find('*').on('mouseup', function(){
        $('#lightboxFooter').find('span').css('background-image', "url('res/Panels/Stone/StoneButton_Gold.png')");
    });
    
    $('.lightbox-background').on('mouseup', function(){
        $('#lightboxFooter').find('span').css('background-image', "url('res/Panels/Stone/StoneButton_Gold.png')");
    });
    
    $('#divAbilitiesContainer').find('span').on('click', function(){
        $(event.target).toggleClass('pressed');
        var ability = $(event.target).data('ability');
        $('#picCreatureEdit').find('span').filter(function(index, el){
            return $(el).data('ability') == ability;
        }).toggleClass('hide');
        
        if (ability == 'charge' && $(event.target).hasClass('pressed') && $('#divAbilitiesContainer').find('.pic-jump').hasClass('pressed')){
            $('#divAbilitiesContainer').find('.pic-jump').toggleClass('pressed');
            $('#picCreatureEdit').find('.edit-pic-jump').toggleClass('hide');
        }
        
        if (ability == 'jump' && $(event.target).hasClass('pressed') && $('#divAbilitiesContainer').find('.pic-charge').hasClass('pressed')){
            $('#divAbilitiesContainer').find('.pic-charge').toggleClass('pressed');
            $('#picCreatureEdit').find('.edit-pic-charge').toggleClass('hide');
        }
    });
    
    lightbox.find('#numPowerEdit').on('input', function(){
        var text = $('#numPowerEdit').val();
        
        if (text.length > 2){
            text = text.substring(0, 2);
            $('#numPowerEdit').val(text);
        }
        
        if (!text){
            text = "1";
            $('#numPowerEdit').val(text);
        }
        
        var intValue = parseInt(text, 10);
        
        $('.edit-pic-power').toggleClass('buffed', !Number.isNaN(intValue) && intValue > $('.edit-creature-lightbox').data('basePower'));
        $('.edit-pic-power').toggleClass('debuffed', !Number.isNaN(intValue) && intValue < $('.edit-creature-lightbox').data('basePower'));
            
        $('.edit-pic-power').text(text);
        $('.edit-pic-power').toggleClass('long', text.length > 1);
    });
    
    lightbox.find('#numHpEdit').on('input', function(){
        var text = $('#numHpEdit').val();
        if (text.length > 2){
            text = text.substring(0, 2);
            $('#numHpEdit').val(text);
        }
        
        if (!text){
            text = "1";
            $('#numHpEdit').val(text);
        }
        
        var intValue = parseInt(text, 10);
        
        $('.edit-pic-hp').toggleClass('buffed', intValue && intValue > $('.edit-creature-lightbox').data('baseHp'));
        $('.edit-pic-hp').toggleClass('debuffed', intValue && intValue < $('.edit-creature-lightbox').data('baseHp'));
            
        $('.edit-pic-hp').text(text);
        $('.edit-pic-hp').toggleClass('long', text.length > 1);
    });
};
