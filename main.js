var game = {};


var class = function(){return {id:9999,levels:0};};
var commonerClass = function(){
var o = class();
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
active: []
};


game.enemies = {
};


game.story = {
};


game.loop = function(){
};


window.setInterval(game.loop,250);
