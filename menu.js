 
 var randomNames=["Big Yak", "Little Yak", "Happy Yak", "Sad Yak", "Froggy Dew", "Hideo Kojima", "Solid Snake", "Felix The Cat", "SuperbWhale", "Krog-Tosser", "Dream Beaver", "Emilien E", "Luuu90", "Atmaz", "Aquablad", "J0k3se", "Hawaii", "Dan Felder", "Sharra", "Aurora", "Bruce Willis", "Jackie Chan", "Ben Brode", "Kolento", "Dr.Boom", "Face Hunter", "Leeeeroy J", "IWinAgain", "ESofDawn", "Maihem", "Teddy", "Modgnik", "Imperia", "Arianelle", "Kingdanzz", "Cappuccino", "Sweety", "Strudl", "HeliosAflame", "Zarrockar", "Gravekper", "KumpelKefer", "SuperbLizard", "John Carmack", "Gabe Newell", "Sid Meier", "Todd Howard", "Liquid Snake"];
 
 var currentBackNumber = 0;
 var enemyOrbNumber = 1;
 var playerOrbNumber = 2;
 var playerAvatarNumber = 1;
 var enemyAvatarNumber = 10;
 var playerLifeCount = 20;
 var enemyLifeCount = 20;

function initMenu() {
    
    $('div.menu-icon').on('click', onMenuIconClick);
    
    $('#btnLands').on('click', onLandsClick);
    $('#btnText').on('click', onTextClick)
    $('#btnCreatures').on('click', function() {onCreaturesButtonClick()});
    
    $('#redactLands').hide();
    $('#redactText').hide();
    $('#redactCreatures').hide();
    $('#tokenContainer').hide();
	
    var randomNameNumber = ~~(Math.random() * randomNames.length);
    var anotherRandomName = ~~(Math.random() * randomNames.length);
    
    $('#txtPlayerName').val(randomNames[randomNameNumber]);
    $('#txtOpponentName').val(randomNames[anotherRandomName]);
    
    $('#txtPlayerName').on('change', onChangeNames);
    $('#txtOpponentName').on('change', onChangeNames);
    $('#txtOpponentDeckSize').on('change', onChangeNames);
    $('#txtPlayerName').change();
    $('#txtOpponentName').change();
    
    $('#txtOpponentDeckSize').change();
    
    $('.change-background-icon').on('click', onChangeBackground);
    
    $('.download-icon').on('click', onDownload);
    
    $('#contextMenu').find('#btnRemoveLand').on('click', function(){
        var coords = $('#contextMenu').data('coords');
        var cell = field[coords.x][coords.y];
        cell.tileType = TileTypeEnum.empty;
        //cell.objectOnTileType = null;
        $('#contextMenu').hide();
        redraw();
    });
    
    $('#contextMenu').find('#btnRemoveOrb').on('click', function(){
        var coords = $('#contextMenu').data('coords');
        var cell = field[coords.x][coords.y];
        cell.objectOnTile = null;
        
        
        if (cell.owner == 'player'){
            $('.orb-button.player-orb').show();
        }
        
        if (cell.owner == 'enemy'){
            $('.orb-button.enemy-orb').show();
        }
        
        cell.owner = "nobody";
        cell.tileType = TileTypeEnum.empty;
        cell.objectOnTileType = null;
        
        $('#contextMenu').hide();
        redraw();
    });
    
    $('#contextMenu').find('#btnRemoveCreature').on('click', function(){
        var coords = $('#contextMenu').data('coords');
        var cell = field[coords.x][coords.y];
        cell.objectOnTile = null;
        $('#contextMenu').hide();
        redraw();
    });
    
    $('#contextMenu').find('#btnRemoveAll').on('click', function(){
        var coords = $('#contextMenu').data('coords');
        var cell = field[coords.x][coords.y];
        cell.objectOnTile = null;
        cell.tileType = TileTypeEnum.empty;
        cell.objectOnTileType = null;
        $('#contextMenu').hide();
        redraw();
    });
    
    $('#contextMenu').find('#btnRemoveWell').on('click', function(){
        var coords = $('#contextMenu').data('coords');
        var cell = field[coords.x][coords.y];
        cell.objectOnTile = null;
        cell.tileType = TileTypeEnum.empty;
        cell.objectOnTileType = null;
        
        $('#contextMenu').hide();
        redraw();
    });
    
    $('#contextMenu').find('#btnEditCreature').on('click', function(){
        var coords = $('#contextMenu').data('coords');
        var cell = field[coords.x][coords.y];
        if (cell.objectOnTile && cell.objectOnTileType =="card")
        {
            $('#contextMenu').hide();
            showEditCreatureLightbox(cell.objectOnTile, coords.x, coords.y);
        }
    });
    
    
    $('#contextMenu').find('#btnEditOrb').on('click', function(){
        var coords = $('#contextMenu').data('coords');
        var cell = field[coords.x][coords.y];
        if (cell.objectOnTile && cell.objectOnTileType =="orb")
        {
            $('#contextMenu').hide();
            showEditOrbLightbox(cell.owner == 'player' ? playerOrbNumber : enemyOrbNumber, cell.owner == 'player' ? playerAvatarNumber : enemyAvatarNumber, cell.owner);
        }
    });
    
    $('#canvas').click(function(){
        $('#contextMenu').find('div').hide();
    });
    
    $('#canvas').contextmenu(function(event){
        var cell = GetUserClickedCell(event.x, event.y);
        if (cell)
        {
            $('#contextMenu').find('div').show();
            $('#contextMenu').data('coords', cell.coords)
            if (!cell.objectOnTile || cell.objectOnTileType != "card"){
                $('#contextMenu').find('#btnRemoveAll').hide();
                $('#contextMenu').find('#btnRemoveCreature').hide();
                $('#contextMenu').find('#btnEditCreature').hide();
            }
            
            if (!cell.objectOnTile || cell.objectOnTileType != "well")
            {
                $('#contextMenu').find('#btnRemoveWell').hide();
            }
            
            if (!cell.objectOnTile || cell.objectOnTileType != "orb")
            {
                $('#contextMenu').find('#btnRemoveOrb').hide();
                $('#contextMenu').find('#btnEditOrb').hide();
            }
            
            if (cell.tileType === TileTypeEnum.empty){
                $('#contextMenu').find('#btnRemoveAll').hide();
                $('#contextMenu').find('#btnRemoveLand').hide();
            }
            
            $('#contextMenu').show();
            $('#contextMenu').css('top', event.offsetY);
            $('#contextMenu').css('left', event.offsetX);
        }
        else{
             $('#contextMenu').hide();
        }
        return false;
    });
    
    var cards;
    
    var callback = function(cards){
        var lookup = $('#creatureLookup');
        this.cards = cards;
        var source = cards.map(function(el){return {label: el.name, value: el}});
        
        lookup.autocomplete({
            source: source,
            minLength: 0,
            response: function(event, ui){
                ShowHideCreatures(lookup.val() ? ui.content : source);
            },
            delay: 300
            
        });
        
        drawCreatures(source);
    }
    
    $('.card-tooltip')[0].onerror = function(){
        //this.setAttribute('crossOrigin', 'anonymous');
        this.src = "res\\gameUI\\CardNoImage.png";
     };
    
    parseMerlin(callback);
    
};

function onDownload(){
    
    var canvas = $('#canvas')[0];
    var img = canvas.toDataURL("image/png");
    var newWindow = window.open();
    newWindow.document.write('<div><strong>Right click -> Save as...</strong></div><img style="" src="' + img + '"/>');
    newWindow.document.location = "#"
    $(newWindow.document).find('body').css('text-align', 'center');
}

function onChangeNames(){
    redraw();
}

function onChangeBackground(){
    
    var backsCount = 6;
    var direction = $(event.target).data('direction');
    var offset = direction == "left" ? 1 : -1;

    var backNumber = currentBackNumber + offset < 1 ? backsCount : (currentBackNumber + offset >= backsCount ? 1 :currentBackNumber + offset);
   
   currentBackNumber = backNumber;
   redraw();
}

function onCreaturesButtonClick(){
    $('#creatureLookup').val('');
    $('#redactLands').hide();
    $('#redactText').hide();
    $('#redactCreatures').show("slide", {direction: "left"});
    $('#tokenContainer').show("slide", {direction: "left"});
    $('input[name="landsCreaturesRedact"]').prop('checked',false);
    $('.plus-sign').toggle(true);
}

function onMenuIconClick(){
    $('div.menu-icon').hide();
    $('.menu-container').toggle({ effect: "slide", complete: onMenuSlideComplete});
}

function onMenuSlideComplete(){
    $('div.menu-icon').toggleClass('menu-icon-back');
    $('div.menu-icon').show();
}

function onLandsClick(){
    $('#redactCreatures').hide();
    $('#redactText').hide();
    $('#tokenContainer').hide();
    
    $('input[name="cbCreature"]').prop('checked',false);
    $('#redactLands').show("slide", {direction: "up"});
}

function onTextClick(){
	$('#redactCreatures').hide();
    $('#redactLands').hide();
    $('#tokenContainer').hide();
    $('#redactText').show("slide", {direction: "left"});
}

function onCreatureCheckboxClick(){
    var creatureId = $(event.target).data("id");
    $('input[data-id='+creatureId+']').prop('checked', true);
}

function onPlusSignClick(){
    addCardToPlayerHand($(event.target).parent().data('id'));
}

function drawCreatures(cards){
    var html1 = "";
	$(cards).each(function(index, card){
        
        if (card.value.cardType == "artifact"){
            return;
        }
        
        html1 += '<div class="creature-in-list-container' + ' ' + card.value.cardType +'"><div class="creature-in-list" data-id=' + card.value.id + '><span class="plus-sign"></span><input type="radio" name="creaturesNamesHiddenInput" class="hide"></input><span style="vertical-align: middle">'+card.value.name +'</span>';
        html1 += '<span class="creature-counter faeria"><span class="creature-in-list-pic"></span><span class="count">' + card.value.cost + '</span></span>';
        html1 += '<span class="creature-counter neutral '+ (card.value.landReq.neutral ? '' : 'hide') + '"><span class="creature-in-list-pic"></span><span class="count">'+ (card.value.landReq.neutral ? card.value.landReq.neutral : '') + '</span></span>';
        html1 += '<span class="creature-counter forest '+ (card.value.landReq.forest ? '' : 'hide') + '"><span class="creature-in-list-pic"></span><span class="count">'+ (card.value.landReq.forest ? card.value.landReq.forest : '') + '</span></span>';
        html1 += '<span class="creature-counter lake '+ (card.value.landReq.lake ? '' : 'hide') + '"><span class="creature-in-list-pic"></span><span class="count">'+ (card.value.landReq.lake ? card.value.landReq.lake : '') + '</span></span>';
        html1 += '<span class="creature-counter mountain '+ (card.value.landReq.mountain ? '' : 'hide') + '"><span class="creature-in-list-pic"></span><span class="count">'+ (card.value.landReq.mountain ? card.value.landReq.mountain : '') + '</span></span>';
        html1 += '<span class="creature-counter desert '+ (card.value.landReq.desert ? '' : 'hide') + '"><span class="creature-in-list-pic"></span><span class="count">'+ (card.value.landReq.desert ? card.value.landReq.desert : '') + '</span></span>';
        html1 += '</div></div>';
        
       	});
    
    $("#tokenContainer").html(html1);
    
    $('.plus-sign').on('click', onPlusSignClick);
    
    $("#tokenContainer").find('.creature-in-list-container').on('click', function(){
        $("#tokenContainer").find('.creature-in-list-container').removeClass('selected-creature');
        $(this).addClass('selected-creature');
        $(this).find('input[type="radio"]').prop('checked', true);
    })
    
    $("#tokenContainer").find('.creature-in-list-container').mouseenter(function(e){
        var id = $(this).find('.creature-in-list').data('id');
        $('.card-tooltip')[0].src = 'https://raw.githubusercontent.com/abrakam/Faeria_Cards/master/CardExport/English/' + id  +'.png';
        
        $('.card-tooltip').css('width', screenPreferences.mX * 550);
        $('.card-tooltip').css('height', screenPreferences.mY * 550);
        
        $('.card-tooltip').css('top',  $('.background-frame').height() + screenPreferences.mX * 200);
        $('.card-tooltip').css('right', $('.background-frame-vertical').width() - 85 * screenPreferences.mX);
        $('.card-tooltip').show();
    });
    
    
    $("#tokenContainer").find('.creature-in-list-container').mouseleave(function(){
        $('.card-tooltip').hide();
    });
}

function ShowHideCreatures(cards){
    $("#tokenContainer").find('.creature-in-list-container').hide();
    $(cards).each(function(index, card){
        $("#tokenContainer").find('.creature-in-list-container').filter(function(ind, el){
           return $(el).find('.creature-in-list').data('id') == card.value.id && !$(el).hasClass('hide');
        }).show();
    });
}