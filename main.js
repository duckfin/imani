var game = {};


var clas = function(){
	return {id:9999,levels:0};
};
var commonerClass = function(){
	var o = clas();
	o.id = 1;
	return o;
};


game.character = {
	stat: {str:10,dex:10,con:10,int:10,wis:10,cha:10},
	classes: [commonerClass()],
	calcHP: function(){return (this.stat.con-10)/2+10;},
	curHP: 10,
	maxHP: 10,
	recoveryTime: 10,
	recoveryMax: 10,
	takeHit:function(d){
		this.curHP-=d;
		document.getElementById("HPcurrent").innerHTML = game.character.curHP.toFixed(2);
		document.getElementById("HPmax").innerHTML = game.character.maxHP.toFixed(2);
	}
};


game.mandates = {
	active: [],
	available: [
		["None","Attack"],
		["None","First enemy"]
	],
	slots: 2,
	evaluate: function (m){
		switch(m[0]){
			case "Attack":
				var ret = game.mandates.getTarget(m[1]);
				if(ret) {ret.takeHit((game.character.stat.str-10)/2+1);return 1;}
				else {return 0;}
				break;
			default:
				return 0;
				break;
		}
	},
	getTarget: function (t){
		switch(t){
			case "First enemy":
				if(game.enemies.cur[0]) return game.enemies.cur[0];
				else return 0;
				break;
			default:
				return 0;
				break;
		}
	},
	display:function(){
		var s = '<table>';
		for(var i=0;i<game.mandates.slots;i++){
			s += '<tr><td style="width:150px;"><select id="action' + i.toString()+'" onchange="game.mandates.update();">';
			for(var k=0;k<game.mandates.available[0].length;k++){
				s += '<option value="'+game.mandates.available[0][k]+'">'+game.mandates.available[0][k]+'</option>';
			}
			s += '</select></td>';
			s += '<td style="width:150px;"><select id="target' + i.toString()+'" onchange="game.mandates.update();">';
			for(var k=0;k<game.mandates.available[1].length;k++){
				s += '<option value="'+game.mandates.available[1][k]+'">'+game.mandates.available[1][k]+'</option>';
			}
			s += '</select></td></tr>';
		}
		document.getElementById("TDmandates").innerHTML = s;
	},
	update:function(){
		game.mandates.active = [];
		for(var i=0;i<game.mandates.slots;i++){
			game.mandates.active.push([document.getElementById("action"+i.toString()).value,document.getElementById("target"+i.toString()).value]);
		}
	}
};


game.enemies = {
	cur:[],
	gen: function(w,n){
		return {
			hp:1+w+n/100.0,
			maxhp:1+w+n/100.0,
			dmg:0.25,
			takeHit:function(d){
				this.hp-=d;
				if(this.hp<=0)game.enemies.cur.splice(game.enemies.cur.indexOf(this),1);
				document.getElementById("ENHPcurrent").innerHTML=((this.hp>0)?this.hp.toFixed(2):"-");
				document.getElementById("ENHPmax").innerHTML=((this.hp>0)?this.maxhp.toFixed(2):"-");
			},
			attack:function(){
				game.character.takeHit(this.dmg);
			}
		}
	}
};


game.story = {
	w:1,
	n:0,
	advance:function(){
		if(game.story.n<100)game.story.n++;
		else{game.story.w++;game.story.n=1;}
		game.enemies.cur.push(game.enemies.gen(game.story.w,game.story.n));
		document.getElementById("WOcurrent").innerHTML=game.story.w;
		document.getElementById("NDcurrent").innerHTML=game.story.n;
	}
};


game.loop = function(){
	var nd = (new Date());
	game.lastTimeInc = nd-game.lastTime;
	game.lastTime = nd;
	
	if(game.enemies.cur.length==0) game.story.advance();
	
	if(game.character.curHP>0){
		for(var i=0;i<game.mandates.active.length;i++){
			if(game.mandates.evaluate(game.mandates.active[i])) break;
		}
		for(var i=0;i<game.enemies.cur.length;i++){
			game.enemies.cur[i].attack();
		}
	}
	else{
		game.character.recoveryTime -= 1;
		if(game.character.recoveryTime<=0){
			game.character.curHP = game.character.maxHP;
			game.character.recoveryTime = game.character.recoveryMax;
			document.getElementById("HPcurrent").innerHTML = game.character.curHP.toFixed(2);
			document.getElementById("HPmax").innerHTML = game.character.maxHP.toFixed(2);
		}
	}
};


game.onLoad = function(){
	game.lastTime = new Date();
	game.lastTimeInc = 0.5;
	game.mandates.display();
	document.getElementById('action0').value = "Attack";
	document.getElementById('target0').value = "First enemy";
	game.mandates.update();
	window.setInterval(game.loop,500);
}
