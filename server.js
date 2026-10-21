const express=require('express');
const http=require('http');
const {Server}=require('socket.io');
const crypto=require('crypto');
const path=require('path');
const app=express(); const server=http.createServer(app);
const io=new Server(server,{cors:{origin:false}});
// Public files live in the repository root for easy GitHub upload.
app.get('/',(req,res)=>res.sendFile(path.join(__dirname,'index.html')));
app.get('/manifest.webmanifest',(req,res)=>res.sendFile(path.join(__dirname,'manifest.webmanifest')));
app.get('/sw.js',(req,res)=>{res.set('Cache-Control','no-cache');res.sendFile(path.join(__dirname,'sw.js'))});
app.get('/icon-192.png',(req,res)=>res.sendFile(path.join(__dirname,'icon-192.png')));
app.get('/icon-512.png',(req,res)=>res.sendFile(path.join(__dirname,'icon-512.png')));
app.get('/health',(req,res)=>res.json({ok:true,app:'DOMINO RD',socketio:true}));
const rooms=new Map();
const randCode=()=>crypto.randomBytes(3).toString('hex').slice(0,4).toUpperCase();
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const makeTiles=()=>{const a=[];for(let i=0;i<=6;i++)for(let j=i;j<=6;j++)a.push([i,j]);return shuffle(a)};
function roomPublic(r,viewer){return {code:r.code,count:r.count,goal:r.goal,variant:r.variant,stockCount:r.stock.length,handNo:r.handNo,scores:r.scores.slice(),board:r.board.map(t=>t.slice()),turn:r.turn,finished:r.finished,status:r.status,players:r.players.map(p=>({id:p.id,name:p.name,tileCount:p.hand.length,hand:p.id===viewer?p.hand.map(t=>t.slice()):[]})),history:r.history.slice(-20)}}
function emitState(r){for(const p of r.players){if(p.socketId)io.to(p.socketId).emit('state',roomPublic(r,p.id))}}
function say(r,msg){r.status=msg;emitState(r)}
function deal(r,starter=null){
 const tiles=makeTiles();r.board=[];r.passes=0;r.lastPlay=null;r.finished=false;r.stock=[];
 if(r.count===4){r.players.forEach((p,i)=>p.hand=tiles.slice(i*7,i*7+7));}
 else {r.players[0].hand=tiles.slice(0,7);r.players[1].hand=tiles.slice(7,14);r.stock=tiles.slice(14);}
 let start=starter;
 if(start===null){let best=-1;start=0;r.players.forEach((p,i)=>p.hand.forEach(t=>{let score=t[0]===t[1]?100+t[0]:t[0]+t[1];if(score>best){best=score;start=i}}));}
 r.turn=start;r.status=`Mano ${r.handNo}: le toca a ${r.players[start].name}.`;emitState(r)
}
function team(i,r){return r.count===2?i:i%2}
function points(hand){return hand.reduce((n,t)=>n+t[0]+t[1],0)}
function finishHand(r,winner,reason){
 if(r.finished)return;r.finished=true;
 const totals=r.players.map(p=>points(p.hand));
 let winningTeam=winner===null?null:team(winner,r),award=0,message='';
 if(reason==='tranca'){
  const sums=[0,0];r.players.forEach((p,i)=>sums[team(i,r)]+=points(p.hand));
  if(sums[0]===sums[1]){message=`Trancada empatada (${sums[0]}–${sums[1]} fichas)`;}
  else{winningTeam=sums[0]<sums[1]?0:1;award=Math.abs(sums[0]-sums[1]);message=`Tranca: gana ${winningTeam===0?'Pareja A':'Pareja B'} por menos puntos (${sums[0]}–${sums[1]})`;}
 } else if(winner!==null){const losingTeam=1-winningTeam;award=r.players.reduce((n,p,i)=>n+(team(i,r)===losingTeam?points(p.hand):0),0);message=`${r.players[winner].name} salió; ${(winningTeam===0?'Pareja A':'Pareja B')} suma ${award}`;}
 if(winningTeam!==null&&award>0){if(r.variant==='thirty'&&award<30)award=0;r.scores[winningTeam]+=award;}
 r.history.push({handNo:r.handNo,message:message||'Mano terminada sin puntos',scores:r.scores.slice()});
 if(r.scores.some(v=>v>=r.goal)){r.status=`¡Partida terminada! ${r.scores[0]>=r.goal?'Pareja A':'Pareja B'} gana.`}
 else{r.status=message+' · Nueva mano disponible.'}
 emitState(r);io.to(r.code).emit('handResult',{message:r.status});
}
function legalSides(board,t){if(!board.length)return ['right'];const out=[];if(t.includes(board[0][0]))out.push('left');if(t.includes(board[board.length-1][1]))out.push('right');return out}
function applyPlay(r,p,tile,side){
 if(r.finished)return p.socket.emit('errorMsg','La mano terminó.');
 const idx=r.players.findIndex(p2=>p2.id===p.id);if(idx!==r.turn)return p.socket.emit('errorMsg','No es tu turno.');
 const ti=p.hand.findIndex(t=>t[0]===tile[0]&&t[1]===tile[1]);if(ti<0)return p.socket.emit('errorMsg','Esa ficha no está en tu mano.');
 const legal=legalSides(r.board,tile);if(!legal.includes(side))return p.socket.emit('errorMsg','Esa ficha no conecta con ese extremo.');
 p.hand.splice(ti,1);
 if(!r.board.length){r.board.push(tile.slice());}
 else if(side==='left'){let t=tile.slice();if(t[1]!==r.board[0][0])t.reverse();r.board.unshift(t);}
 else{let t=tile.slice();if(t[0]!==r.board[r.board.length-1][1])t.reverse();r.board.push(t);}
 r.passes=0;r.lastPlay={player:idx,tile:tile.slice()};r.turn=(idx+1)%r.count;
 if(!p.hand.length){finishHand(r,idx,'out');return}
 r.status=`${p.name} jugó ${tile[0]}-${tile[1]}. Turno de ${r.players[r.turn].name}.`;emitState(r);
}
io.on('connection',socket=>{
 socket.on('createRoom',({name,count,goal,variant})=>{
  let code=randCode();while(rooms.has(code))code=randCode();
  const p={id:crypto.randomUUID(),socketId:socket.id,name:String(name||'Jugador').slice(0,18),hand:[]};
  const r={code,count:Number(count)===2?2:4,goal:[100,150,200,250,300,500].includes(Number(goal))?Number(goal):200,variant:variant==='thirty'?'thirty':'standard',players:[p],scores:[0,0],board:[],stock:[],turn:0,handNo:1,passes:0,lastPlay:null,finished:false,status:'Esperando jugadores…',history:[]};
  rooms.set(code,r);socket.join(code);socket.emit('joined',{room:code,playerId:p.id,state:roomPublic(r,p.id)});
 });
 socket.on('joinRoom',({name,code})=>{
  const r=rooms.get(String(code||'').toUpperCase());if(!r)return socket.emit('errorMsg','No existe esa mesa.');
  if(r.players.length>=r.count)return socket.emit('errorMsg','La mesa está llena.');
  if(r.players.some(p=>p.socketId===socket.id))return;
  const p={id:crypto.randomUUID(),socketId:socket.id,name:String(name||'Jugador').slice(0,18),hand:[]};r.players.push(p);socket.join(r.code);
  socket.emit('joined',{room:r.code,playerId:p.id,state:roomPublic(r,p.id)});
  if(r.players.length===r.count){deal(r);io.to(r.code).emit('notice','¡Mesa completa! Comienza la partida.')}
  else emitState(r);
 });
 socket.on('playTile',({room,tile,side})=>{const r=rooms.get(room);const p=r&&r.players.find(x=>x.socketId===socket.id);if(!r||!p)return;if(!Array.isArray(tile)||tile.length!==2)return;applyPlay(r,p,tile,side)});
 socket.on('passTurn',({room})=>{
  const r=rooms.get(room),p=r&&r.players.find(x=>x.socketId===socket.id);if(!r||!p||r.finished)return;
  const idx=r.players.indexOf(p);if(idx!==r.turn)return socket.emit('errorMsg','No es tu turno.');
  if(!r.board.length)return socket.emit('errorMsg','No puedes pasar al inicio de la mano.');
  const canPlay=p.hand.some(t=>legalSides(r.board,t).length);
  if(canPlay)return socket.emit('errorMsg','Tienes una ficha que puedes jugar.');
  if(r.count===2&&r.stock.length){return socket.emit('errorMsg','Hay fichas en el pozo; debes robar antes de pasar.')}
  r.passes++;r.turn=(r.turn+1)%r.count;
  if(r.passes>=r.count){finishHand(r,null,'tranca');return}
  say(r,`${p.name} pasó. Turno de ${r.players[r.turn].name}.`);
 });
 socket.on('drawTile',({room})=>{
  const r=rooms.get(room),p=r&&r.players.find(x=>x.socketId===socket.id);if(!r||!p||r.finished)return;
  if(r.count!==2||!r.stock.length)return socket.emit('errorMsg','No hay fichas para robar.');
  if(r.players.indexOf(p)!==r.turn)return socket.emit('errorMsg','No es tu turno.');
  if(p.hand.some(t=>legalSides(r.board,t).length))return socket.emit('errorMsg','Tienes una ficha que puedes jugar.');
  p.hand.push(r.stock.pop());say(r,`${p.name} robó una ficha.`);
 });
 socket.on('squareTable',({room})=>{
  const r=rooms.get(room),p=r&&r.players.find(x=>x.socketId===socket.id);if(!r||!p||r.finished)return;
  if(r.count!==4)return socket.emit('errorMsg','Cuadrar está disponible en mesas de cuatro.');
  if(r.players.indexOf(p)!==r.turn)return socket.emit('errorMsg','No es tu turno.');
  if(!r.board.length)return socket.emit('errorMsg','Primero debe jugarse una ficha.');
  const a=r.board[0][0],b=r.board[r.board.length-1][1];
  if(a!==b)return socket.emit('errorMsg','Para cuadrar, ambos extremos deben tener el mismo número.');
  if(!p.hand.some(t=>t[0]===a||t[1]===a))return socket.emit('errorMsg','No tienes ficha para cuadrar ese número.');
  // In this MVP, "cuadrar" is a table marker/action rather than forcing a particular tile.
  r.status=`${p.name} cuadró la mesa en ${a}.`;emitState(r);
 });
 socket.on('nextHand',({room})=>{
  const r=rooms.get(room),p=r&&r.players.find(x=>x.socketId===socket.id);if(!r||!p||!r.finished)return;
  if(r.scores.some(v=>v>=r.goal))return socket.emit('errorMsg','La partida ya terminó.');
  if(r.players.indexOf(p)!==0)return socket.emit('errorMsg','Solo quien creó la mesa puede iniciar la próxima mano.');
  r.handNo++;deal(r,(r.turn+1)%r.count);
 });
 socket.on('leaveRoom',({room})=>{const r=rooms.get(room);if(!r)return;const i=r.players.findIndex(p=>p.socketId===socket.id);if(i>=0){r.players.splice(i,1);socket.leave(room);if(!r.players.length)rooms.delete(room);else{r.status='Un jugador salió. La mesa espera a que se complete de nuevo.';emitState(r)}}});
 socket.on('disconnect',()=>{for(const r of rooms.values()){const p=r.players.find(x=>x.socketId===socket.id);if(p){p.socketId=null;r.status=`${p.name} se desconectó.`;emitState(r)}}});
});
const port=process.env.PORT||3000;server.listen(port,()=>console.log(`DOMINO RD listening on ${port}`));
