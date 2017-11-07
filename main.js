var game = {};


var clas = function(){return {id:9999,levels:0};};
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
maxHP: 10
};


game.mandates = {
active: [["attack","enemy"]],
evaluate: function (m){
switch(m[0]){
case "attack":
var ret = game.mandates.getTarget(m[1]);
if(ret) {ret.takeHit(1);return 1;}
else {return 0;}
break;
default:
return 0;break;
}
},
getTarget: function (t){
switch(t){
case "enemy":if(game.enemies.cur[0]) return game.enemies.cur[0];else return 0;break;
default:return 0;break;
}
}
};


game.enemies = {
cur:[],
gen: function(w,n){
return {hp:1+w+n/100.0,maxhp:1+w+n/100.0,dmg:1,takeHit:function(d){this.hp-=d;if(this.hp<=0)game.enemies.cur.splice(game.enemies.cur.indexOf(this),1);}};
}
};


game.story = {w:1,n:0,advance:function(){if(game.story.n<100)game.story.n++;else{game.story.w++;game.story.n=1;}game.enemies.cur.push(game.enemies.gen(game.story.w,game.story.n));document.getElementById("WOcurrent").innerHTML=game.story.w;document.getElementById("NDcurrent").innerHTML=game.story.n;}};


game.loop = function(){
console.log("loop");
if(game.enemies.cur.length==0) game.story.advance();
for(var i=0;i<game.mandates.active.length;i++){
if(game.mandates.evaluate(game.mandates.active[i])) break;
}

};


window.setInterval(game.loop,1000);
