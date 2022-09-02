// Keys varaibles
var keyLeft = false;
var keyRight = false;
var keyUp = false;
var keyDown = false;
var shoot = 0;
var start = false;

function keysDown (event){
	//console.log(event.which);
	switch (event.which){
		case 32:
			start = true;
			shoot = 1;
			break;
		case 37:
			keyLeft = true;
			break;
		case 38:
			keyUp = true;
			break;
		case 39:
			keyRight = true;
			break;
		case 40:
			keyDown = true;
			break;
		case 77:
			shoot = 2;
			break;
		default:
			break;
	}
}

function keysUp (event){
	//console.log(event.which);
	switch (event.which){
		case 32:
			start = false;
			shoot = 0;
			break;
		case 37:
			keyLeft = false;
			break;
		case 38:
			keyUp = false;
			break;
		case 39:
			keyRight = false;
			break;
		case 40:
			keyDown = false;
			break;
		case 77:
			if (SAttack.active == false) shoot = 0;
			break;
		default:
			break;
	}
}


$(document).ready(function(){
	$(document).keydown(keysDown);
	$(document).keyup(keysUp);
})

// To define object class, use function word.
function Ship(X,Y,W,H,V){
	this.PosX = X;
	this.PosY = Y;
	this.Width = W;
	this.Height = H;
	this.Life = V;
}
function Bala(X,Y){
	this.PosX = X;
	this.PosY = Y;
	this.Width = 30;
	this.Height = 30;
	this.active = false;
	this.reload = 500;
}

var BGY = 0;
var BGY2 = -745;
var Player = new Ship (200,440,56,68,3);
var Monstro = new Ship (200,-300,134,126,32);
var SAttack = new Bala (0,0);
SAttack.Height = 202;
SAttack.Width = 28;
var Enemy = [];
Enemy[0] = new Ship (300,800,76,54,1);
Enemy[1] = new Ship (250,800,76,54,1);
Enemy[2] = new Ship (450,800,76,54,1);
Enemy[3] = new Ship (250,800,56,50,1);
Enemy[4] = new Ship (130,800,56,50,1);
Enemy[5] = new Ship (300,800,96,46,1);
Enemy[6] = new Ship (500,800,96,46,1);
var Balas = [];
Balas[0] = new Bala(0,0);
Balas[1] = new Bala(0,0);
Balas[2] = new Bala(0,0);
Balas[3] = new Bala(0,0);
Balas[4] = new Bala(0,0);
var EBalas = [];
EBalas[0] = new Bala(0,0);
EBalas[1] = new Bala(0,0);
EBalas[2] = new Bala(0,0);
EBalas[3] = new Bala(0,0);
EBalas[4] = new Bala(0,0);
EBalas[5] = new Bala(0,0);
EBalas[6] = new Bala(0,0);
EBalas[7] = new Bala(0,0);


//Variables globals
var scene = 0;
var pupaAU = false;
var fps = 0;
var wait = 0;
var wave = 1;
var fireRate = 50;
var score = 0;
var boss = false;
var bossShoot = false;
var RL;
var repeat = true;
var win = false;

//Imatges
var img = [];
var sounds = [];

function CollisionPlayer(RectA, RectB){ //Afegint espai de les ales i les banyes
	if (((RectA.PosX + 30) < RectB.PosX + RectB.Width) &&
		(RectB.PosX < (RectA.PosX + 30) + RectA.Width) &&
		((RectA.PosY + 14) < RectB.PosY + RectB.Height) &&
		(RectB.PosY < (RectA.PosY + 14) + RectA.Height)){
		return true;
    }
	return false;
}
function CheckCollision(RectA, RectB){
	if ((RectA.PosX < RectB.PosX + RectB.Width) &&
		(RectB.PosX < RectA.PosX + RectA.Width) &&
		(RectA.PosY < RectB.PosY + RectB.Height) &&
		(RectB.PosY < RectA.PosY + RectA.Height)){
		return true;
    }
	return false;
}
function Disparar(X,Y){
	if (shoot == 1) {
		for (var i = Balas.length - 1; i >= 0; i--) {
			if (Balas[i].active == false){
				Balas[i].active = true;
				Balas[i].PosX = X;
				Balas[i].PosY = Y;
				var sonido = Math.random();
				if (sonido > 0.5) sounds[18].play();
				else sounds[19].play();
				i = -1;
			}
		}
	}
	else if (shoot == 2){
		SAttack.active = true;
		SAttack.PosX = X;
		SAttack.PosY = Y;
		console.log(SAttack.active);
		sounds[20].play();
		setTimeout(function(){
			shoot = 0;
			SAttack.reload = score + 500;
			SAttack.active = false;
		}, 2200);
	}
}
function BossFight(){
	if (Monstro.PosY < 65) Monstro.PosY += 1;
	else {
		if (repeat) {
			repeat = false;
			RL = Math.floor(Math.random()*10)+1;
			setTimeout(function(){
				var disparant = false;
				if (EBalas[0].active == false){
					bossShoot = true;
				}
				repeat = true;
			}, 2000);	
		}
		if (RL <= 5) Monstro.PosX -= 2;
		else Monstro.PosX += 2;
		if (Monstro.PosX <= 70) Monstro.PosX = 70;
		else if (Monstro.PosX >= 490) Monstro.PosX = 490;
	}
}

function joc(){
	switch(scene){
		case 0:
			inicialitzacioICarregaImatges();
			break;
		case 1:
			esperarCarregarImatges();
			break;
		case 2:
			menu();
			break;
		case 3:
			loopGame();
			break;
	}
	// Aquesta linea deixeu-la al final perque es la que crida de nou a la funcio per fer
	//   el seguent frame. 
	requestAnimationFrame(joc);
}


function inicialitzacioICarregaImatges(){
	// Aquí podem inicialitzar les nostres variables del joc i fer les carregues dels fitxers necesaris
	
	// Declarem images a carregar
	for (var i = 0; i <= 19; i++) {
		img[i] = new Image();
	}

	for (var i = 0; i <= 20; i++) {
		sounds[i] = new Audio();
	}
	
	img[0].src = "fondo.png";
	img[1].src = "PIdle1.png";
	img[2].src = "PIdle2.png";
	img[3].src = "PShoot1.png";
	img[4].src = "PShoot2.png";
	img[5].src = "Enemy1Idle.png";
	img[6].src = "Enemy1Shoot.png";
	img[7].src = "PHurt.png";
	img[8].src = "PBullet.png";
	img[9].src = "EBullet.png";
	img[10].src = "Cora.png";
	img[11].src = "Enemy2Idle.png";
	img[12].src = "Enemy2Shoot.png";
	img[13].src = "Enemy3Idle.png";
	img[14].src = "Enemy3Shoot.png";
	img[15].src = "monstro.png";
	img[16].src = "monstro2.png";
	img[17].src = "monstroAT.png";
	img[18].src = "STARTIMG.png";
	img[19].src = "SAttack.png";

	sounds[0].src = "sounds/bossintro.mp3";
	sounds[1].src = "sounds/bird_death2.mp3";
	sounds[2].src = "sounds/Boss_Gurgle_Roar.mp3";
	sounds[3].src = "sounds/Boss_Lite_SloppyRoar.mp3";
	sounds[4].src = "sounds/Boss_Spit_Blob_Barf.mp3";
	sounds[5].src = "sounds/Death_Burst_Large_0.mp3";
	sounds[6].src = "sounds/Death_Burst_Large_1.mp3";
	sounds[7].src = "sounds/Death_Burst_Small_0.mp3";
	sounds[8].src = "sounds/Death_Burst_Small_1.mp3";
	sounds[9].src = "sounds/Death_Burst_Small_2.mp3";
	sounds[10].src = "sounds/Isaac_Hurt_Grunt1.mp3";
	sounds[11].src = "sounds/Isaac_Hurt_Grunt2.mp3";
	sounds[12].src = "sounds/isaacbosswin.mp3";
	sounds[13].src = "sounds/isaacdies.mp3";
	sounds[14].src = "sounds/Monster_Grunt_3_A.mp3";
	sounds[15].src = "sounds/Monster_Grunt_4_A.mp3";
	sounds[16].src = "sounds/Cute_Grunt_0.mp3";
	sounds[17].src = "sounds/Cute_Grunt_2.mp3";
	sounds[18].src = "sounds/TearImpacts0.mp3";
	sounds[19].src = "sounds/TearImpacts1.mp3";
	sounds[20].src = "sounds/Blood_Laser1.mp3";
	// si hi ha més imatges, seria bo enmagatzamar-les en un array totes juntes.
	scene = 1;
}

function esperarCarregarImatges(){
	var loading = false;
	var loaded = 0;
	for (var i = img.length - 1; i >= 0; i--) {
		if(img[i].complete) loaded++;
	}
	// Si hi haguessin més imatges, no hem de donar el loading com a true fins que no estiguin totes carregades.
	// El canvi de la variable scene només s'ha de produir quan estiguem segur que tot està carregat.
	if (loaded == img.length) loading = true;
	if (loading == true) scene = 2;
}

function menu(){
	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");
	ctx.drawImage(img[0], 0, 0);
	ctx.drawImage(img[18], 225, 350);
	if (Player.Life == 3 && !win) {
		ctx.font = '80px DotGothic16';
		ctx.fillStyle = "white";
		ctx.fillText("Isaac: Dungeon", 65, 200);
		ctx.font = '50px DotGothic16';
		ctx.fillStyle = "white";
		ctx.fillText("Press SPACE to Start", 100, 300);
	}
	else if (win){//win
		ctx.font = '70px DotGothic16';
		ctx.fillStyle = "white";
		ctx.fillText("Congratulations!", 75, 200);
		ctx.font = '40px DotGothic16';
		ctx.fillStyle = "white";
		ctx.fillText("Press SPACE to Play Again", 100, 300);
	}
	else{//loose
		ctx.font = '70px DotGothic16';
		ctx.fillStyle = "white";
		ctx.fillText("Game Over!", 125, 200);
		ctx.font = '40px DotGothic16';
		ctx.fillStyle = "white";
		ctx.fillText("Press SPACE to Play Again", 100, 300);
	}
	if (start) {
		Player.PosX = 200;
		Player.PosY = 440;
		Player.Life = 3;
		fps = 0;
		wait = 0;
		wave = 1;
		score = 0;
		win = false;
		Monstro.PosX = 200;
		Monstro.PosY = -300;
		Monstro.Life = 32;
		SAttack.reload = 500;
		for (var i = Enemy.length - 1; i >= 0; i--) {
			Enemy[i].PosY = 800;
			Enemy[i].Life = 1;
		}
		scene = 3;
	}
}

function loopGame(){
	start = false;
	// **********************
	//Aquí hi aniria la lógica del joc: captures de tecles, moviments d'objectes,,etc.
	//   Penseu també que poden haber crides a funcions, metodes de classes, etc.
	// **********************
	
	// UPDATES
	if (score >= 1000) {
		wave = score / 1000;
	}
	if (score >= 5000) {
		boss = true;
	}
	else boss = false;
	if (boss == true) {
		if (Monstro.PosY == -300) sounds[0].play();
		BossFight();
	}
	BGY += wave * 0.8;
	BGY2 += wave * 0.8;
	if (BGY >= 615) BGY = -745;
	if (BGY2 >= 615) BGY2 = -745;
	for (var i = Enemy.length - 1; i >= 0; i--) {
		for (var j = Balas.length - 1; j >= 0; j--) {
			if (Balas[j].active){
				if (CheckCollision(Balas[j],Enemy[i])){
					Balas[j].active = false;
					Enemy[i].Life--;
				}
			}
		}

		for (var l = EBalas.length - 1; l >= 0; l--) {
			if (!boss) {
				if (EBalas[l].active == false && l >= 0) {
					var rand = Math.floor(Math.random()*(100000-(wave*150)));
					if(rand >= 90070 && rand <= 90075){
						EBalas[l].active = true;
						EBalas[l].PosY = Enemy[i].PosY + (Enemy[i].Height+10);
						EBalas[l].PosX = Enemy[i].PosX + (Enemy[i].Width/2);
						if (i > 4) sounds[1].play();
						else if (i > 2) {
							var sonido = Math.random();
							if (sonido > 0.5) sounds[14].play();
							else sounds[15].play();
						}
						else {
							var sonido = Math.random();
							if (sonido > 0.5) sounds[16].play();
							else sounds[17].play();
						}
					}
				}
			}
		}
		if (SAttack.active) {
			if (CheckCollision (Enemy[i], SAttack)) Enemy[i].Life--;
		}
		if (CollisionPlayer (Player, Enemy[i])){
			pupaAU = true;
			Enemy[i].PosY = 700;
			var sonido = Math.random();        
			if (sonido > 0.5) sounds[10].play();
			else sounds[11].play();
			Player.Life--;
		}
		if (Enemy[i].Life <= 0 && boss == false) {
			score += 100;
			var sonido = Math.floor(Math.random()*(9-5))+6;
			sounds[sonido].play();
			Enemy[i].Life = Math.floor(Math.random() * (wave - 1))+1;
			Enemy[i].PosX = Math.floor(Math.random() * (570 - 40))+ 40;
			Enemy[i].PosY = Math.floor(Math.random() * (-730 + 330)) -1;
		}
		if (i > 4) Enemy[i].PosY += Math.floor(Math.random() * ((wave + 3) - 3)) +1;
		else if (i > 2)Enemy[i].PosY += Math.floor(Math.random() * ((wave + 2) - 3)) +1;
		else Enemy[i].PosY += Math.floor(Math.random() * ((wave + 4) - 3)) +1;
		if (Enemy[i].PosY > 615 && boss == false) {
			Enemy[i].PosY = Math.floor(Math.random() * (-730 + 330)) -1;
			Enemy[i].PosX = Math.floor(Math.random() * (570 - 40))+ 40;
		}
	}
	
	for (var i = EBalas.length - 1; i >= 0; i--) {
		if (EBalas[i].active){
			if (CollisionPlayer(Player,EBalas[i])){
				pupaAU = true;
				EBalas[i].active = false;
				Player.Life--;
				var sonido = Math.random();
				if (sonido > 0.5) sounds[10].play();
				else sounds[11].play();
			}
		}
	}
	if (boss) {
		if (CollisionPlayer (Player, Monstro)){
			pupaAU = true;
			Player.Life--;
		}
		for (var i = Balas.length - 1; i >= 0; i--) {
			if (Balas[i].active){
				if (CheckCollision(Balas[i],Monstro)){
					Balas[i].active = false;
					Monstro.Life--;
				}
			}
		}
		if (Monstro.Life <= 0) {
			Monstro.PosY = 900;
			sounds[12].play();
			sounds[4].play();
			setTimeout(function(){
				win = true;
				scene = 2;
			},2000); 
			
		}
		if (bossShoot) {
			setTimeout(function(){
				bossShoot = false;
			}, 1000);
			for (var i = EBalas.length - 1; i >= 0; i--) {
				var sonido = Math.random();        
				if (sonido > 0.5) sounds[2].play();
				else sounds[3].play();
				EBalas[i].active = true;
				EBalas[i].PosY = Monstro.PosY + 90;
				EBalas[i].PosX = Monstro.PosX + Math.floor(Math.random()*(90-5))+5;
			}
		}
	}
	if (keyLeft) Player.PosX -= 4;
	if (keyRight) Player.PosX += 4;
	if (keyUp) Player.PosY -= 3;
	if (keyDown) Player.PosY += 3;
	if (shoot == 2) {
		if (score >= SAttack.reload) {
			Disparar(Player.PosX + 42,Player.PosY - 200);
		}
	}
	else if (SAttack.active == false) {
		if (shoot == 1 && wait >= fireRate) {
			Disparar(Player.PosX + 42,Player.PosY);
			wait = 0;
		}
	}
	if (SAttack.active) {
		SAttack.PosX = Player.PosX + 42;
		SAttack.PosY = Player.PosY - 200;
	}
	if (Player.PosX < 30) Player.PosX = 30;
	if (Player.PosX > 560) Player.PosX = 560;
	if (Player.PosY < 1) Player.PosY = 1;
	if (Player.PosY > 520) Player.PosY = 520;
	
	//Pintat dels objectes
	// Fem el "gancho" al Canvas.
	var canvas = document.getElementById("myCanvas");
	// Agafem el contex2D, El nostre punt "llapis" que fem servir per pintar.
	var ctx = canvas.getContext("2d");
	
	// RENDERS
	ctx.clearRect(0,0,700,615);		// Primer netejar el canvas
	ctx.drawImage(img[0], 0, BGY2);
	ctx.drawImage(img[0], 0, BGY);
	if (pupaAU) {
		ctx.font = "30px Comic Sans MS";
		ctx.fillStyle = "red";
		ctx.fillText("¡AU!",Player.PosX, Player.PosY - 20);
		ctx.drawImage(img[7],Player.PosX,Player.PosY);
		setTimeout(function(){
			pupaAU = false;
		}, 400);
	}
	if (fps < 30){
		if (pupaAU == false) {
			if (shoot != 0) ctx.drawImage(img[3],Player.PosX, Player.PosY);
			else ctx.drawImage(img[1],Player.PosX, Player.PosY);
		}
		for (var i = Enemy.length - 1; i >= 0; i--) {
			if (i > 4) {
				if (Enemy[i].PosY > -Enemy[i].Height) {
					ctx.drawImage(img[13],Enemy[i].PosX,Enemy[i].PosY);
				}
			}
			else if (i > 2){
				if (Enemy[i].PosY > -Enemy[i].Height) {
					ctx.drawImage(img[11],Enemy[i].PosX,Enemy[i].PosY);
				}
			}
			else {
				if (Enemy[i].PosY > -Enemy[i].Height) {
					ctx.drawImage(img[5],Enemy[i].PosX,Enemy[i].PosY);
				}
			}
		}
		if (boss) {
			if (bossShoot) ctx.drawImage(img[17],Monstro.PosX,Monstro.PosY);
			else ctx.drawImage(img[15],Monstro.PosX,Monstro.PosY);
		}
	} 
	else {
		if (pupaAU == false) {
			if (shoot != 0) ctx.drawImage(img[4],Player.PosX, Player.PosY);
			else ctx.drawImage(img[2],Player.PosX, Player.PosY);
		}
		for (var i = Enemy.length - 1; i >= 0; i--) {
			if (i > 4) {
				if (Enemy[i].PosY > -Enemy[i].Height) {
					ctx.drawImage(img[14],Enemy[i].PosX,Enemy[i].PosY);
				}
			}
			else if (i > 2){
				if (Enemy[i].PosY > -Enemy[i].Height) {
					ctx.drawImage(img[12],Enemy[i].PosX,Enemy[i].PosY);
				}
			}
			else {
				if (Enemy[i].PosY > -Enemy[i].Height) {
					ctx.drawImage(img[6],Enemy[i].PosX,Enemy[i].PosY);
				}
			}
		}
		if (boss) {
			if (bossShoot) ctx.drawImage(img[17],Monstro.PosX,Monstro.PosY);
			else ctx.drawImage(img[16],Monstro.PosX,Monstro.PosY);
		}
	}
	if (SAttack.active) ctx.drawImage(img[19],SAttack.PosX,SAttack.PosY);
	for (var i = Balas.length - 1; i >= 0; i--) {
		if (Balas[i].active) {
			ctx.drawImage(img[8],Balas[i].PosX,Balas[i].PosY);
			Balas[i].PosY -= 6;
		}
		if (Balas[i].PosY < -Balas[i].Height){
			Balas[i].active = false;
		}
	} 
	for (var i = EBalas.length - 1; i >= 0; i--) {
		if (EBalas[i].active) {
			ctx.drawImage(img[9],EBalas[i].PosX,EBalas[i].PosY);
			EBalas[i].PosY += 6;
		}
		if (EBalas[i].PosY > 615){
			EBalas[i].active = false;
		}
	} 
	if (Player.Life == 3) {
		ctx.drawImage(img[10],10,10);
		ctx.drawImage(img[10],60,10);
		ctx.drawImage(img[10],110,10);
	}
	else if (Player.Life == 2) {
		ctx.drawImage(img[10],10,10);
		ctx.drawImage(img[10],60,10);
	}
	else if (Player.Life == 1) {
		ctx.drawImage(img[10],10,10);
	}
	else {
		sounds[13].play();
		setTimeout(function(){
			scene = 2;
		},500);
	}
	ctx.font = '35px DotGothic16';
	ctx.fillStyle = "white";
	ctx.fillText("Score: " + score, 10, 85);
	fps++;
	if (wait < 200) {
		wait++;
	}
	if (fps > 60) fps = 0;
}
