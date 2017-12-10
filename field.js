function EmptyCell(){
    this.tileType = TileTypeEnum.empty,
    this.objectOnTile = null,
    this.objectOnTileType = null,
    this.owner = OwnerEnum.nobody,
    this.points = [],
    this.coords = {};
}

var playerHand = [];
function initializeField(size, x, y, sideSize){
    
    // initialize field of particular size with some math magic
    var rowsCount = size * 3 + (size % 2==0 ? 1 : 2);
    this.field = Array(rowsCount);
    this.wheel = [];
    for(var i =0; i < rowsCount; i++){
        var cellsCount;
        if (i < size)
        {
            cellsCount = i + 1;
        }
        else if (i > size * 2 + 1){
            cellsCount = rowsCount - i;
        }
        else if (size % 2 != 0){
            cellsCount = i % 2 ? size - 1  : size;
        }
        else {
            cellsCount = i % 2 ? size : size - 1;
        }
        
        this.field[i] = Array(cellsCount);
        
        for(var j =0; j<this.field[i].length; j++){
            this.field[i][j] = new EmptyCell();
            this.field[i][j].coords = {x:i, y:j};
        }
    }
    
    // redraw canvas with newly initialized field
    redraw();
}

// draws cells with needed offsets
function drawField(size, x, y, sideSize){
    for(var i =0; i < this.field.length; i++){
        for(var j =this.field[i].length-1; j >=0; j--){
            var coordX = x + j *  3 * sideSize - (this.field[i].length - size) * sideSize * 1.5;
            var coordY = y + i * sideSize *2/3;
            if (this.field[i][j].objectOnTile && this.field[i][j].objectOnTileType=="well"){
                    var src = "res\\gameUI\\" + this.field[i][j].objectOnTile + ".png";
                    drawLoadedImage(coordX-40,coordY-180,sideSize*2, sideSize*3.5, loadedImages[src]);
            }
            
            if (this.field[i][j].objectOnTile && this.field[i][j].objectOnTileType=="orb"){
                    var src = "res\\gameUI\\orbs\\"+(this.field[i][j].owner =='player' ? playerOrbNumber : enemyOrbNumber) +".png";
                    var srcAvatar = "res\\gameUI\\avatars\\"+(this.field[i][j].owner =='player' ? playerAvatarNumber : enemyAvatarNumber) +".png"
                    var srcLife = "res\\gameUI\\life.png"
                    drawLoadedImage(coordX-40,coordY-195,sideSize*2, sideSize*2, loadedImages[srcAvatar]);
                    drawLoadedImage(coordX-60,coordY-200,sideSize*2.5, sideSize*2.5, loadedImages[src]);
                    drawLoadedImage(coordX+60,coordY-95,sideSize* .75, sideSize* .75, loadedImages[srcLife]);
                    drawText(this.field[i][j].owner =='player' ? playerLifeCount : enemyLifeCount, coordX+90,coordY-60,20, "white");
                    
                    if (this.field[i][j].owner == 'enemy'){
                        drawLoadedImage(coordX-30,coordY-85,sideSize*0.5, sideSize*0.5, loadedImages["res\\Icons\\icon_battle.png"]);
                    }
                    
            }
                
            if (!(this.field[i][j].objectOnTile && (this.field[i][j].objectOnTileType=="well" || this.field[i][j].objectOnTileType=="orb")))
            {
                drawCell(this.field[i][j], coordX, coordY, sideSize);
            }            
        }
    }
    
     for(var i =0; i < this.field.length; i++){
        for(var j =this.field[i].length-1; j >=0; j--){
            
            var coordX = x + j *  3 * sideSize - (this.field[i].length - size) * sideSize * 1.5;
            var coordY = y + i * sideSize *2/3;
            
            if (this.field[i][j].objectOnTile)
            {
                if (this.field[i][j].objectOnTileType=="card")
                {
                    ;
                    var src = "res\\pics\\" + this.field[i][j].objectOnTile + ".png";
                    drawCreature(coordX-86,coordY-190,sideSize*3.35, sideSize*3.30, this.field[i][j].objectOnTile);
                }
            }
        }
    }
}

// draw one particular cell
function drawCell(cell, x, y, sideSize){
    points = [{x: x, y: y}, {x: x+sideSize, y: y}, {x:x+sideSize*1.5, y: y+sideSize*2/3}, {x: x + sideSize, y: y + sideSize*4/3}, {x: x, y: y + sideSize*4/3}, {x: x - sideSize * 0.5, y: y + sideSize*2/3}];
    
    for (var i=0; i< points.length; i++){
        points[i].x*=screenPreferences.mX;
        points[i].y-=120;
        points[i].y*=screenPreferences.mY;
    }
    cell.points = points;
    
    var ownerPostfix = "";
    
    switch(cell.owner){
        case OwnerEnum.player:
        case OwnerEnum.nobody:
            break;
        case OwnerEnum.enemy:
            ownerPostfix = "b";
            break;
        case OwnerEnum.ally:
            ownerPostfix = "a";
            break;
    }
    
    switch(cell.tileType)
    {
        case TileTypeEnum.empty:
            drawEmptyCell(points);
            break;
        case TileTypeEnum.forest:
        case TileTypeEnum.lake:
        case TileTypeEnum.mountain:
        case TileTypeEnum.desert:
        case TileTypeEnum.neutral:
            drawLoadedImage(x - 40,y - 164,sideSize*2 + 4, sideSize*2+14, loadedImages["res\\gameUI\\" + cell.tileType + ownerPostfix +  ".png"]);
            break;
    }
}

function drawEmptyCell(points){
    var canvas = $('#canvas')[0].getContext('2d');
    canvas.shadowColor = '#ADD8E6';
    canvas.shadowBlur = 18;
     
    canvas.strokeStyle = '#5F9EA0';
    canvas.beginPath();
    canvas.moveTo(points[0].x, points[0].y);
    for (var i=1; i < points.length; i++)
    {
        canvas.lineTo(points[i].x, points[i].y);
    }
    
    canvas.closePath();
    canvas.stroke();
    canvas.shadowBlur = 0;
}

function drawLoadedImage(x,y,width,height,image){
    var canvas = $('#canvas')[0].getContext('2d');
    canvas.drawImage(image, screenPreferences.mX*x,screenPreferences.mY*y, screenPreferences.mX*width, screenPreferences.mY*height);
}

function drawImage(x,y,width,height,srcLink, callback){
    var canvas = $('#canvas')[0].getContext('2d');
    var image = new Image();
    image.onload = function(){
        
        canvas.drawImage(this, screenPreferences.mX*x,screenPreferences.mY*y, screenPreferences.mX*width, screenPreferences.mY*height);
        if (callback)
        {
            callback();
        }
    }
    image.src = srcLink;
}

// check that particular point lays inside a polygon defined by array of points
function isPointInPolygon(x,y, points){
    var inside = 0;
    for (var i=0; i<points.length; i++){
        var p0 = points[i];
        var p1 = i == points.length - 1 ? points[0] : points[i+1];
        
        var coef = ((y - p0.y) * (p1.x - p0.x)) - ((x - p0.x) * (p1.y - p0.y));
        var sign = coef > 0 ? 1 : (coef < 0 ? -1 : 0);
        
        if (inside == 0){
            inside = sign;
            continue;
        }
        
        if (sign == 0) {
            continue;
        }
        else if (sign != inside){
            return false;
        }
    }
    
    return true;
}

function redraw(){
    var canvas = $('#canvas');
    canvas[0].getContext('2d').clearRect(0, 0, canvas.width(), canvas.height());
    drawBackground(currentBackNumber);
    this.drawField(4, 600, 240, 80);
    this.drawWheel();
    
    drawOpponentHand();
    drawPlayerHand();
    drawLoadedImage(50, -2,230,300,loadedImages["res\\gameUI\\cardsUpsideDown.png"]);

          var playerName = $('#txtOpponentName').val();
          drawText(playerName, 165, 54, 16);
          var playerCards = $('#numRemainingCardsO').val();
          drawText(playerCards, 152, 20, 16);
          var playerFaeria = $('#numFaeriaCountO').val();
          drawText(playerFaeria, 163, 158,40, "black");
          
          var ODeckSize = $('#numDeckSizeO').val();
          drawText(ODeckSize, 205, 20,16);
    
    drawLoadedImage(50, 782,230,300,loadedImages["res\\gameUI\\cards.png"]); 
          var opponentsName =  $('#txtPlayerName').val();
          drawText(opponentsName, 165, 1040,16);
          var OCards = $('#numRemainingCards').val();
          drawText(OCards, 155, 1074,16);
          var OFaeria = $('#numFaeriaCount').val();
          drawText(OFaeria, 168, 960,40, "black");
          
    clearLands();
    
          for(var i =0; i < this.field.length; i++){
            for(var j =this.field[i].length-1; j >=0; j--){
                if (this.field[i][j].objectOnTileType!="well" && !this.field[i][j].objectOnTileType!="orb" && this.field[i][j].tileType && this.field[i][j].tileType != 'empty' && this.field[i][j].owner && this.field[i][j].owner!='nobody')
                {
                    switch(this.field[i][j].tileType){
                        case TileTypeEnum.empty:
                        case TileTypeEnum.neutral:
                        break;
                        case TileTypeEnum.forest:
                        case TileTypeEnum.lake:
                        case TileTypeEnum.mountain:
                        case TileTypeEnum.desert:
                        this.landsCounter[this.field[i][j].owner][this.field[i][j].tileType] += 1;
                        break;
                    }
                }
            }
          }
          
          drawText(landsCounter.player.forest, 105, 922, 18, 'green', null,null, true);
          drawText(landsCounter.player.desert, 231, 922, 18, 'yellow', null,null, true);
          drawText(landsCounter.player.lake, 144, 886, 18, '#1279D1', null,null, true);
          drawText(landsCounter.player.mountain, 193, 886, 18, 'red', null,null, true);
          
          
          drawText(landsCounter.enemy.forest, 99, 175, 18, 'green', null,null, true);
          drawText(landsCounter.enemy.desert, 225, 175, 18, 'yellow', null,null, true);
          drawText(landsCounter.enemy.lake, 137, 210, 18, '#1279D1', null,null, true);
          drawText(landsCounter.enemy.mountain, 186, 210, 18, 'red', null,null, true);
    
}

function drawOpponentHand(){
    var deckSize = $('#numDeckSizeO').val();
    deckSize = parseInt(deckSize, 10);
    if (deckSize && deckSize > 0)
    {
        for (var i=0; i<deckSize; i++){
            drawLoadedImage(-deckSize * 50 + 900 + i*100, -200, 300,300, loadedImages["res\\gameUI\\cardback.png"]);
        }
    }
}

function drawPlayerHand(){
    if (playerHand && playerHand.length > 0)
    {
        for (var i=0; i< playerHand.length; i++){
            src = 'https://cdn.rawgit.com/abrakam/Faeria_Cards/master/CardExport/English/' + playerHand[i].id  +'.png';
            drawImageFragment(-playerHand.length * 65 + 910 + i*120, 800, 370,410, src, 200,45,824,910);
        }
    }
}

function drawImageFragment(x,y,width,height,srcLink, xO,yO, widthO, heightO){
    var canvas = $('#canvas')[0].getContext('2d');
    var image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = function(){
        canvas.drawImage(this, xO, yO, widthO, heightO, screenPreferences.mX*x,screenPreferences.mY*y, screenPreferences.mX*width, screenPreferences.mY*height);
    }
    
    // image.onerror = function(){
        // this.src = "res\\gameUI\\CardNoImage.png"
    // }
    
    image.src = srcLink;
}

function addCardToPlayerHand(id){
    var ids = playerHand.map(function(el){return el.id;});
    ids.push(id);
    recalcPlayerHand(ids);
    redraw();
}

function recalcPlayerHand(cardIds){
    playerHand = [];
        for (var i=0; i< cardIds.length; i++){
            var points = [{x: -cardIds.length * 65 + 960 + i*120, y: 850}, {x:-cardIds.length * 65 + 960 + i*120+120, y:850}, {x: -cardIds.length * 65 + 960 + i*120 + 120, y: 850+410}, {x:-cardIds.length * 65 + 960 + i*120, y:850+410}];
            
            if (i == cardIds.length-1){
                points = [{x: -cardIds.length * 65 + 960 + i*120, y: 850}, {x:-cardIds.length * 65 + 960 + i*120+190, y:850}, {x: -cardIds.length * 65 + 960 + i*120 + 190, y: 850+410}, {x:-cardIds.length * 65 + 960 + i*120, y:850+410}];
            }
            
            for (var j=0; j< points.length; j++){
                points[j].x*=screenPreferences.mX;
                points[j].y*=screenPreferences.mY;
            }
            
            playerHand.push({id: cardIds[i], points: points});
        }
}

function UserClickedOnCardInHand(eventX, eventY){
    for (var i=0; i< playerHand.length; i++){
        if(isPointInPolygon(eventX, eventY, playerHand[i].points)){
            var curPoints = playerHand[i].points;
            playerHand = playerHand.filter(function(val){
                return val.points != curPoints;
            });
            break;
        }
    }
    
    recalcPlayerHand(playerHand.map(function(el){return el.id;}));
    redraw();
}


function drawCreature(x, y, width, height, creature){
    
    var src = 'https://cdn.rawgit.com/abrakam/Faeria_Cards/master/CardExport/English/' + creature.id  +'.png';
    var card = $.grep(this.cards, function(e){ return e.id == creature.id; })[0];
    var hp = creature.hp;
    var power = creature.power;
    
    var callback = function(){
        var canvas = $('#canvas')[0].getContext('2d');
        var framePrefix = creature.owner == 'player' ? "" : "b";
        var useStructureFrame = card.cardType == 'structure';
        var useLegendaryFrame = card.rarity == 'LEGENDARY';
        
        var frame;
        
         if (creature.abilities.indexOf('flying') != -1){
            drawLoadedImage(x+55,y+30,width*0.15,height*0.3,loadedImages["res\\Tokens\\Abilities\\flying.png"]);
            drawLoadedImage(x+155,y+30,width*0.15,height*0.3,loadedImages["res\\Tokens\\Abilities\\flyingFlipped.png"]);
        }
        
        if (useLegendaryFrame && !useStructureFrame){
            frame = loadedImages["res\\gameUI\\flegend" + framePrefix + ".png"];
            drawLoadedImage(x+69, y+38, width*0.43, height*0.45, frame); 
        }
        else if (useStructureFrame){
            frame = loadedImages["res\\gameUI\\structure" + framePrefix + ".png"];
            
            drawLoadedImage(x+72, y+54, width*0.40, height*0.37, frame); 
        }
        else{
            frame = loadedImages["res\\gameUI\\frame" + framePrefix + ".png"];
            drawLoadedImage(x+70, y+54, width*0.43, height*0.40, frame); 
        }
        
        if (creature.abilities.indexOf('taunt') != -1){
            drawLoadedImage(x+111,y+42,width*0.12,height*0.12,loadedImages["res\\Tokens\\Abilities\\taunt.png"]);
        }
         
        if (creature.abilities.indexOf('jump') != -1){
            drawLoadedImage(x+114,y+125,width*0.12,height*0.12,loadedImages["res\\Tokens\\Abilities\\jump.png"]);
        }
         
        if (creature.abilities.indexOf('charge') != -1){
            drawLoadedImage(x+114,y+125,width*0.12,height*0.12,loadedImages["res\\Tokens\\Abilities\\charge.png"]);
        }
         
        if (creature.abilities.indexOf('ranged') != -1){
            drawLoadedImage(x+146,y+90,width*0.12,height*0.12,loadedImages["res\\Tokens\\Abilities\\ranged.png"]);
        }
        
        var fontSize = screenPreferences.mX*22;
        
        canvas.font = "bold " + fontSize + "px verdana, sans-serif";
        var hpCoordX = (hp+'').length > 1 ? x + 152 : x + 159;
        var attackCoordX = (power+'').length > 1 ? x+77 : x + 83;
        
        if (fontSize >= 14)
        {   
            canvas.fillStyle = "white";
            canvas.shadowColor = "black";
            if (!useStructureFrame)
            {
                canvas.fillText(power, screenPreferences.mX*attackCoordX, screenPreferences.mY*(y + 148));
                canvas.strokeText(power, screenPreferences.mX*attackCoordX, screenPreferences.mY*(y + 148));
            }
            
            if (!useStructureFrame)
            {
                canvas.fillText(hp, screenPreferences.mX*(hpCoordX-2), screenPreferences.mY*(y + 146));
                canvas.strokeText(hp, screenPreferences.mX* (hpCoordX-2), screenPreferences.mY*(y + 146));
            }
            else{
               canvas.fillText(hp, screenPreferences.mX*(hpCoordX-6), screenPreferences.mY*(y + 143)); 
               canvas.strokeText(hp, screenPreferences.mX* (hpCoordX-6), screenPreferences.mY*(y + 143));
            }
        }
        else{
            if (!useStructureFrame)
            {
                canvas.fillStyle = "black";
                canvas.fillText(power, screenPreferences.mX*attackCoordX, screenPreferences.mY*(y + 148));
            }
            
            if (!useStructureFrame)
            {
                canvas.fillStyle = "white";
                canvas.fillText(hp, screenPreferences.mX*hpCoordX-2, screenPreferences.mY*(y + 146));
                //canvas.strokeText(hp, screenPreferences.mX* hpCoordX, screenPreferences.mY*(y + 150));
            }
            else{
                canvas.fillStyle = "white";
                canvas.fillText(hp, screenPreferences.mX*(hpCoordX-6), screenPreferences.mY*(y + 143));
            }
        }
    }
    
    var canvasEl = document.createElement('canvas');
    drawTempImage(src, x, y, width, height, callback);
}

function drawTempImage(src, x, y, width, height, callback){
var image = new Image();
image.crossOrigin = 'anonymous';
    image.onload = function(){
        
            var scratchCanvas = document.createElement('canvas');
            
            var scratchCtx = scratchCanvas.getContext('2d');
        if ($(this).data('pepe'))
        {
            scratchCanvas.width = 256;
            scratchCanvas.height = 256;

            scratchCtx.clearRect(0, 0, scratchCanvas.width, scratchCanvas.height);

            scratchCtx.globalCompositeOperation = 'source-over'; //default

            scratchCtx.drawImage(this, 0,0,256,256);  

            scratchCtx.fillStyle = '#fff'; //color doesn't matter, but we want full opacity
            scratchCtx.globalCompositeOperation = 'destination-in';
            scratchCtx.beginPath();
            scratchCtx.arc(128, 128, 200, 0, 2 * Math.PI, true);
            
            scratchCtx.closePath();
            scratchCtx.fill();
            
            var canvas = $('#canvas')[0].getContext('2d');
            canvas.drawImage(scratchCanvas, screenPreferences.mX*(x+80), screenPreferences.mY*(y+60), screenPreferences.mX*(width/2.8), screenPreferences.mY*(height/2.8));
        }
        else{
            scratchCanvas.width = 400;
            scratchCanvas.height = 400;

            scratchCtx.clearRect(0, 0, scratchCanvas.width, scratchCanvas.height);

            scratchCtx.globalCompositeOperation = 'source-over'; //default

            scratchCtx.drawImage(this, 0,0,400,400);  

            scratchCtx.fillStyle = '#fff'; //color doesn't matter, but we want full opacity
            scratchCtx.globalCompositeOperation = 'destination-in';
            scratchCtx.beginPath();
            scratchCtx.arc(200, 190, 65, 0, 2 * Math.PI, true);
            
            scratchCtx.closePath();
            scratchCtx.fill();
            
            var canvas = $('#canvas')[0].getContext('2d');
            canvas.drawImage(scratchCanvas, screenPreferences.mX*(x-8), screenPreferences.mY*(y-20), screenPreferences.mX*width, screenPreferences.mY*height);
        }
        
        if (callback){
            callback();
        }
    }
    
    image.onerror = function(){
        this.src = "res\\gameUI\\pepe.png";
        $(this).data('pepe', 'pepe');
    }
    
    image.src = src;
}
 
function drawText(textToDraw, x, y, fontSize, fontColor, strikeColor, strike, bold){
        var canvas = $('#canvas')[0].getContext('2d');
        var fontSize = screenPreferences.mX*fontSize;
        canvas.textAlign = "center";
        canvas.font.weight = "normal";
        
        if (!fontColor){
            fontColor="white";
        }
        
        if(!strikeColor){
            strikeColor="black";
        }
        
        canvas.font = (bold ? "bold " : "") + fontSize + "pt" + " verdana, sans-serif";
        
        canvas.fillStyle = fontColor;
        canvas.fillText(textToDraw, screenPreferences.mX*x, screenPreferences.mY*y);
        if (strike){
            canvas.fillStyle = strikeColor;
            canvas.font = (bold ? "bold " : "") + (3+fontSize) + "pt" + " verdana, sans-serif";
            canvas.strokeText(textToDraw, screenPreferences.mX*x+2, screenPreferences.mY*y+2);
        }
        canvas.textAlign = "start";
}

function GetUserClickedCell(x, y){
    for(var i=0; i< field.length; i++){
			for(var j=0; j< field[i].length; j++){
                
				var inside = isPointInPolygon(event.offsetX, event.offsetY, field[i][j].points);
                if (inside){
                    return field[i][j];                
                    }
            }
    }
    
    return null;
}

function UserClickedOnWheel(x, y,eventX, eventY){
    var sideSize = 40;
    
    points = [{x: x, y: y}, {x: x+sideSize, y: y}, {x:x+sideSize*1.5, y: y+sideSize*0.9}, {x: x + sideSize, y: y + sideSize*1.8}, {x: x, y: y + sideSize*1.8}, {x: x - sideSize * 0.5, y: y + sideSize*0.9}];
    
    for (var i=0; i< points.length; i++){
        points[i].x*=screenPreferences.mX;
        points[i].y*=screenPreferences.mY;
    }
    
    return isPointInPolygon(eventX, eventY, points);
}

function ManageWheel(cell){
    if (wheel.indexOf(cell) == -1){
        wheel.push(cell);
    }
    else{
        wheel = wheel.filter(function(val){
            return val != cell;
        });
    }
}

function ProcessWheel(eventX, eventY){
    if (UserClickedOnWheel(1730, 802, eventX, eventY)){
        ManageWheel("mountain");
        this.redraw();
        return true;
    }
    else if (UserClickedOnWheel(1730, 874, eventX, eventY)) {
        ManageWheel("neutral");
        this.redraw();
        return true;
    }
    else if (UserClickedOnWheel(1730, 948, eventX, eventY)) {
        ManageWheel("draw");
        this.redraw();
        return true;
    }
    else if (UserClickedOnWheel(1668, 840, eventX, eventY)) {
        ManageWheel("forest");
        this.redraw();
        return true;
    }
    else if (UserClickedOnWheel(1668, 912, eventX, eventY)) {
        ManageWheel("lake");
        this.redraw();
        return true;
    }
    else if (UserClickedOnWheel(1792, 912, eventX, eventY)) {
        ManageWheel("faeria");
        this.redraw();
        return true;
    }
    else if (UserClickedOnWheel(1792, 840, eventX, eventY)) {
        ManageWheel("desert");
        this.redraw();
        return true;
    }    
    return false;
}

function drawWheel(){
    var canvas = $('#canvas')[0].getContext('2d');
    
    canvas.drawImage(loadedImages['res\\gameUI\\wheel-full.png'], screenPreferences.mX *  1600, screenPreferences.mY * 760, screenPreferences.mX* 320,screenPreferences.mY* 320);
    
    if (wheel.indexOf("mountain") != -1){
        drawLoadedImage(1730, 814,40,40, loadedImages["res\\Icons\\cross.png"], null);
    }
    if (wheel.indexOf("neutral") != -1){
        drawLoadedImage(1730, 888,40,40,loadedImages["res\\Icons\\cross.png"], null);
    }
    if (wheel.indexOf("draw") != -1){
        drawLoadedImage(1730, 964,40,40,loadedImages["res\\Icons\\cross.png"], null);
    }
    if (wheel.indexOf("lake") != -1){
        drawLoadedImage(1668, 924,40,40,loadedImages["res\\Icons\\cross.png"], null);
    }
    if (wheel.indexOf("forest") != -1){
        drawLoadedImage(1668, 852,40,40,loadedImages["res\\Icons\\cross.png"], null);
    }
    if (wheel.indexOf("desert") != -1){
        drawLoadedImage(1794, 852,40,40,loadedImages["res\\Icons\\cross.png"], null);
    }
    if (wheel.indexOf("faeria") != -1){
        drawLoadedImage(1794, 924,40,40,loadedImages["res\\Icons\\cross.png"], null);
    }   
}

function drawBackground(backNumber){
    $('#backgroundPreview').css('background-image', "url('res/Board/" + backNumber + ".jpg')");
    var canvas = $('#canvas')[0].getContext('2d');
    canvas.clearRect(0, 0, $('#canvas').width(), $('#canvasBack').height());
    canvas.drawImage(loadedImages['res/Board/' + backNumber + '.jpg'], -$('#canvas').width() * .23,-$('#canvas').height() * .23, $('#canvas').width()*1.50, $('#canvas').height()*1.50);
}

function clearLands(){
    this.landsCounter = {
         player:{
             forest: 0,
             mountain: 0,
             lake: 0,
             desert:0
         },
         enemy:{
             forest: 0,
             mountain: 0,
             lake: 0,
             desert:0
         }
     };
}

function applyCreatureChanges(newCreature, cellX, cellY){
   
        if (this.field[cellX][cellY].objectOnTile && this.field[cellX][cellY].objectOnTileType!="well" && this.field[cellX][cellY].objectOnTileType!="orb"){
            this.field[cellX][cellY].objectOnTile.owner = newCreature.owner;
            this.field[cellX][cellY].objectOnTile.hp = newCreature.hp;
            this.field[cellX][cellY].objectOnTile.power = newCreature.power;
            this.field[cellX][cellY].objectOnTile.abilities = newCreature.abilities;
        }
        
        redraw();
}

function initField() {
     initializeField(4, 600, 175, 80);
     drawBackground(currentBackNumber);
     clearLands();
     
    this.field[0][0].objectOnTileType = "orb";
    this.field[0][0].objectOnTile = "orb";
    this.field[0][0].owner = "enemy";
    this.field[0][0].tileType = "empty";
    
    this.field[12][0].objectOnTileType = "orb";
    this.field[12][0].objectOnTile = "orb";
    this.field[12][0].owner = "player";
    this.field[12][0].tileType = "empty";
    
    this.field[3][0].objectOnTileType = "well";
    this.field[3][0].objectOnTile = "activeWell";
    this.field[3][0].tileType = "empty";
    this.field[3][0].owner = "nobody";
    
    this.field[3][3].objectOnTileType = "well";
    this.field[3][3].objectOnTile = "activeWell";
    this.field[3][3].tileType = "empty";
    this.field[3][3].owner = "nobody";
    
    this.field[9][0].objectOnTileType = "well";
    this.field[9][0].objectOnTile = "activeWell";
    this.field[9][0].tileType = "empty";
    this.field[9][0].owner = "nobody";
    
    this.field[9][3].objectOnTileType = "well";
    this.field[9][3].objectOnTile = "activeWell";
    this.field[9][3].tileType = "empty";
    this.field[9][3].owner = "nobody";
    
    $('.orb-button.player-orb').hide();
    $('#btnPlayerOrb').prop('checked', false);  

    $('.orb-button.enemy-orb').hide();
    $('#btnEnemyOrb').prop('checked', false);  
                            
    redraw();
     
     $('#canvas').on('click', function(){
         
         var cell = GetUserClickedCell(event.x, event.y);
         if (cell){
            var selectedLand = $('[name = "landsCreaturesRedact"]:checked').data();
            var selectedCreature = $('.creature-in-list-container.selected-creature .creature-in-list').data();
                    if (selectedLand)
                    {
                        cell.tileType = selectedLand.landtype;
                        cell.owner = selectedLand.owner;
                        
                        if (cell.objectOnTileType=='well')
                        {
                            cell.objectOnTile = null;
                            cell.objectOnTileType = null;
                        }
                        
                        if (selectedLand.welltype)
                        {
                            cell.owner = "nobody";
                            cell.tileType = "empty";
                            cell.objectOnTile = selectedLand.welltype;
                            cell.objectOnTileType = "well";
                        }
                        
                        if (selectedLand.orb){
                            cell.owner = selectedLand.owner;
                            cell.tileType = "empty";
                            cell.objectOnTile = "orb";
                            cell.objectOnTileType = "orb";
                            
                            if (selectedLand.owner == 'player'){
                                $('.orb-button.player-orb').hide();
                                $('#btnPlayerOrb').prop('checked', false);  
                            }
                            if (selectedLand.owner == 'enemy'){
                                $('.orb-button.enemy-orb').hide();
                                $('#btnEnemyOrb').prop('checked', false);  
                            }
                        }
                        
                        redraw();
                    }
                    else if(selectedCreature){
                        
                        var card = $.grep(cards, function(e){ return e.id == selectedCreature.id; })[0];
                        cell.objectOnTile = {
                            id: selectedCreature.id, 
                            owner: $('#divOwnerContainerMainMenu').find('input:checked').data('owner'),
                            hp:card.hp,
                            power: card.power,
                            abilities: card.abilities
                        };
                        cell.objectOnTileType = "card";
                        redraw();
                    }
                }
        else{
                if(!ProcessWheel(event.offsetX, event.offsetY))
                {
                    UserClickedOnCardInHand(event.offsetX, event.offsetY);
                }
            }
     });
};

