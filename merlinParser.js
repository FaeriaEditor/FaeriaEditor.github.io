

// var static = require('node-static');
// var file = new static.Server();
// require('http').createServer(function(request, response) {
  // request.addListener('end', function() {
    // file.serve(request, response);
  // }).resume();
// }).listen(process.env.PORT || 3000);

var TileTypeEnum = Object.freeze({empty: "empty", neutral: "neutral", forest: "forest", desert: "desert", lake: "lake", mountain: "mountain"});

var OwnerEnum = Object.freeze({nobody: "nobody", player:"player", enemy:"enemy", ally: "ally"});

var CardTypeEnum = Object.freeze({structure: "structure", creature:"creature", event:"event"});

var AbilityEnum = Object.freeze({aquatic: "aquatic", charge: "charge", flying: "flying", jump: "jump", ranged: "ranged", taunt: "taunt"});

function AddZeroes(val){
	
	while(val.length < 3){
		val = "0" + val;
	}
	return val;
}

function CardInfo(values){
	
	this.id = AddZeroes(values[0]);
    this.name = values[2];
    this.cardType = values[3];
    this.cost = Number(values[5]);
    this.isPandoraOnly = values[1] == 'PANDORA'
    this.landReq = {
        mountain: Number(values[8]), 
        forest: Number(values[7]),
        lake: Number(values[6]),
        desert: Number(values[9]),
        neutral: Number(values[4])
    };
    
    this.landType = [];
    
    for(var i=0; i<Object.keys(TileTypeEnum).length;i++)
    {
        var key = Object.keys(TileTypeEnum)[i];
        if (this.landReq[key] > 0){
            this.landType.push(key);
        }
    }

    this.hp = Number(values[11]);
    this.power = Number(values[10]);
    this.desc =  values[12];
    this.abilities = parseAbilities(this.desc);
    this.rarity = values[16];
}

function parseAbilities(description){
    var possibleAbilities = ['charge', 'jump', 'taunt', 'aquatic', 'ranged', 'flying'];
    var actualAbilities = [];
    possibleAbilities.filter(function(el){
        if (description.indexOf(el) != -1){
            actualAbilities.push(el);
        }
    });
    return actualAbilities;
}

function parseMerlin(callback){
    
    var cards = [];
    // TODO: change link to local server
    var file='https://rawgit.com/abrakam/Faeria_Cards/master/CardExport/merlin_shortened.csv';
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                var lines = allText.trim().split('\n');
                
                $(lines).each(function(index,line){
					
					var values = line.split(';');
					cards.push(new CardInfo(values)); 
                });
				
                cards.sort(function(c1, c2){return c1.name > c2.name ? 1 : -1});
                
                callback(cards);
            }
        }
    }
    
    rawFile.send();
}