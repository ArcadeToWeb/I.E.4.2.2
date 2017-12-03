var display, input, frames, spFrame, lives,
	score, swAudio, startTime, endTime, startTime2, spFrame1;
var alSprite, taSprite, ciSprite, deSprite, ufoSprite;
var aliens, dir, tank, bullets, cities, death, ufo;
var invaderKilled, explosion, shoot,
	fastinvader1, fastinvader2, fastinvader3,
	fastinvader4, gameOsong, ufoHighP, ufoLowP;
var lives;
var score;
var bonus;
var lvFrame;
var ufoToRight, ufoScore = [50, 100, 150];

// FIREBASE DATABASE
	// Initialize Firebase
var config = {
	apiKey: "AIzaSyBXQLLhS4oYwIVM9EWeMLV8Sxm9W-v21SA",
	authDomain: "test-7b1df.firebaseapp.com",
	databaseURL: "https://test-7b1df.firebaseio.com",
	projectId: "test-7b1df",
	storageBucket: "test-7b1df.appspot.com",
	messagingSenderId: "175307635982"
};
firebase.initializeApp(config);
var database = firebase.database();
var ref = database.ref("spaceInvaders/scores");
ref.on("value", gotData, errData);

function gotData(data) {
	// sort data
	var scores = data.val();
	var keys = Object.keys(scores);
	var sortedScores = [];
	for (var i = 0; i < keys.length; i++) {
		var k = keys[i];
		sortedScores.push(scores[k]);
	}
	sortedScores.sort(function compare(a, b) {
		if (a.score < b.score)
			return 1;
	  	if (a.score > b.score)
			return -1;
	  	return 0;
	})

	// get data
	while (document.getElementById("scores").firstChild) {
		document.getElementById("scores").removeChild(document.getElementById("scores").firstChild);
	}

	for (var i = 0; i < 5; i++) {
		var name = sortedScores[i].name;
		var score = sortedScores[i].score;
		var li = document.createElement("li");
		li.setAttribute("class", "lis");
		document.getElementById("scores").appendChild(li);
		li.innerHTML = "<span class=\"liScore\">" + score + "</span><span class=\"liName\">" + name + "</span>";
	}	
}

function errData(err) {
	console.log("error");
	console.log(err);
}

	// Data output
function submitData() {
	data = {
		name: document.getElementById("nameInput").value,
		score: score
	}
	var ref = database.ref("spaceInvaders/scores");
	ref.push(data);
	return startScreen();
}

// START SCREEN / CANVAS
var startS = document.getElementById("startS");
var video = document.getElementById("startScreen");
var gam = document.getElementById("canv");
var start = document.getElementById("start");
var ptsIm = document.getElementById("pts");
var spInv = document.getElementById("spInv");
var startText = document.getElementById("startText");

function startScreen() {
	startS.style.display = "block";
	video.play();
	start.focus();
	lives = 3;
	score = 0;
	bonus = true;
}

function pts() {
	start.onkeypress = "";
	start.onclick = "";
	ptsIm.style.cssText = "opacity: 1; height: auto;";
	startText.style.display = "none";
	spInv.style.display = "none";
	video.style.filter = "blur(2px)";
	setTimeout(main, 3000);
}

function main() {
	start.style.display = "none";
	startS.style.display = "none";
	video.pause();
	gam.style.display = "block";
	display = new Display(504, 600);
	input = new InputHandeler();
	lvFrame = 100;
	forceGameO = false;

	var srcInvaderKilled = document.createElement("source");
	var srcExplosion = document.createElement("source");
	var srcShoot = document.createElement("source");
	var srcFastinvader1 = document.createElement("source");
	var srcFastinvader2 = document.createElement("source");
	var srcFastinvader3 = document.createElement("source");
	var srcFastinvader4 = document.createElement("source");
	var srcGameOsong = document.createElement("source");
	var srcUfoHighP = document.createElement("source");
	var srcUfoLowP = document.createElement("source");

	srcInvaderKilled.type = "audio/mpeg";
	srcExplosion.type = "audio/mpeg";
	srcShoot.type = "audio/mpeg";
	srcFastinvader1.type = "audio/mpeg";
	srcFastinvader2.type = "audio/mpeg";
	srcFastinvader3.type = "audio/mpeg";
	srcFastinvader4.type = "audio/mpeg";
	srcGameOsong.type = "audio/mpeg";
	srcUfoHighP.type = "audio/mpeg";
	srcUfoLowP.type = "audio/mpeg";

	srcInvaderKilled.src = "../resources/audio/shoot.wav";
	srcExplosion.src = "../resources/audio/explosion.wav";
	srcShoot.src = "../resources/audio/invaderkilled.wav";
	srcFastinvader1.src = "../resources/audio/fastinvader1.wav";
	srcFastinvader2.src = "../resources/audio/fastinvader2.wav";
	srcFastinvader3.src = "../resources/audio/fastinvader3.wav";
	srcFastinvader4.src = "../resources/audio/fastinvader4.wav";
	srcGameOsong.src = "../resources/audio/gameOver.mp3";
	srcUfoHighP.src = "../resources/audio/ufo_highpitch.wav";
	srcUfoLowP.src = "../resources/audio/ufo_lowpitch.wav";

	invaderKilled = new Audio();
	explosion = new Audio();
	shoot = new Audio();
	fastinvader1 = new Audio();
	fastinvader2 = new Audio();
	fastinvader3 = new Audio();
	fastinvader4 = new Audio();
	gameOsong = new Audio();
	ufoHighP = new Audio();
	ufoLowP = new Audio();

	invaderKilled.appendChild(srcInvaderKilled);
	explosion.appendChild(srcExplosion);
	shoot.appendChild(srcShoot);
	fastinvader1.appendChild(srcFastinvader1);
	fastinvader2.appendChild(srcFastinvader2);
	fastinvader3.appendChild(srcFastinvader3);
	fastinvader4.appendChild(srcFastinvader4);
	gameOsong.appendChild(srcGameOsong);
	ufoHighP.appendChild(srcUfoHighP);
	ufoLowP.appendChild(srcUfoLowP);

	fastinvaders = [fastinvader1, fastinvader2, fastinvader3, fastinvader4];

	var img = new Image();
	img.addEventListener("load", function() {

		alSprite = [
			[new Sprite(this,  0, 0, 22, 16), new Sprite(this,  0, 16, 22, 16)],
			[new Sprite(this, 22, 0, 16, 16), new Sprite(this, 22, 16, 16, 16)],
			[new Sprite(this, 38, 0, 24, 16), new Sprite(this, 38, 16, 24, 16)]
		];
		ufoSprite = [new Sprite(this, 72, 32, 32, 14), new Sprite(this, 72, 46, 32, 14)];

		taSprite = new Sprite(this, 62, 0, 22, 16);
		ciSprite = new Sprite(this, 84, 8, 36, 24);
		deSprite = new Sprite(this, 0, 32, 26, 18);

		init();
		runOpening();
	});
	img.src = "../resources/img/invaders.png"
};

function init() {
	frames = 0;
	spFrame = 0;
	spFrame1 = 0;
	dir = 1;
	swAudio = 0;
	startTime = new Date();
	startTime2 = new Date();

	tank = {
		sprite: taSprite,
		x: (display.width - taSprite.w) / 2,
		y: display.height - (30 + taSprite.h),
		w: taSprite.w,
		h: taSprite.h
	};

	bullets = [];
	cities = {
		canvas: null,
		y: tank.y - (30 + ciSprite.h),
		h: ciSprite.h,

		init: function() {
			this.canvas = document.createElement("canvas");
			this.canvas.width = display.width;
			this.canvas.height = this.h;
			this.ctx = this.canvas.getContext("2d");

			for (var i = 0; i < 4; i++) {
				this.ctx.drawImage(ciSprite.img, ciSprite.x,
					ciSprite.y, ciSprite.w, ciSprite.h,
					68 + 111*i, 0, ciSprite.w, ciSprite.h);
			}
		},
		generateDamage: function(x, y) {
			x = Math.floor(x/2) * 2;
			y = Math.floor(y/2) * 2;

			this.ctx.clearRect(x-2, y-2, 4, 4);
			this.ctx.clearRect(x+2, y-4, 2, 4);
			this.ctx.clearRect(x+4, y, 2, 2);
			this.ctx.clearRect(x+2, y+2, 2, 2);
			this.ctx.clearRect(x-4, y+2, 2, 2);
			this.ctx.clearRect(x-6, y, 2, 2);
			this.ctx.clearRect(x-4, y-4, 2, 2);
			this.ctx.clearRect(x-2, y-6, 2, 2);
		},
		hits: function(x, y) {
			y -= this.y;
			var data = this.ctx.getImageData(x, y, 1, 1);
			if (data.data[3] !== 0) {
				this.generateDamage(x, y);
				return true;
			}
			return false;
		}
	};
	cities.init();

	aliens = [];
	var rows = [1, 0, 0, 2, 2];	// 1 pink alien row, 2 blue alien rows, 2 green alien rows.
	for (var i = 0, len = rows.length; i < len; i++) {
		for (var j = 0; j < 10; j++) {
			var a = rows[i];
			aliens.push({
				sprite: alSprite[a],
				x: 105 + j*30 + [0, 4, 0][a],
				y: -136 + i*30,
				w: alSprite[a][0].w,
				h: alSprite[a][0].h
			});
		}
	}

	ufo = null;

	death = {sprite: deSprite};
};

function runOpening() {
	var loopSetUp = function() {
		frames++;
		if (frames % 1 === 0) {
			for (var i = 0, len = aliens.length; i < len; i++) {
				aliens[i].y += 2;
			}
			ufoHighP.play();
		}
		render();
		if (aliens[0].y > 29) {
			for (var i = 0, len = aliens.length; i < len; i++) {
			aliens[i].x += 15;
			}
			fastinvaders[0].play();
			return run();
		}
		window.requestAnimationFrame(loopSetUp, display.canvas);
	};
	window.requestAnimationFrame(loopSetUp, display.canvas);
};

function run() {
	var loop = function() {
		update();
		render();
		if (aliens.length < 1) {
			return main();
		}
		if (lives < 0 || forceGameO) {
			lives = 0;
			return gameOver();
		}
		window.requestAnimationFrame(loop, display.canvas);
	};
	window.requestAnimationFrame(loop, display.canvas);
};

function update() {
	death.x = -20;
	death.y = -20;
	document.getElementById("lives").innerHTML = lives;
	document.getElementById("score").innerHTML = score;
	
	// KEYS
	if (input.isDown(37)) {
		tank.x -= 2.5;
	}

	if (input.isDown(39)) {
		tank.x += 2.5;
	}
	tank.x = Math.max(Math.min(tank.x, display.width - (30 + taSprite.w)), 30);

	endTime = new Date();

	if ((input.isPressed(32) || input.isDown(32)) && endTime - startTime > 450) {
		bullets.push(new Bullet(tank.x + 10, tank.y, -8, 2, 6, "#fff"));
		startTime = new Date();
		shoot.play();
	}

	// UFO
	var pos = Math.floor((Math.random() * 2) + 1);
	if (Math.floor((Math.random() * 100) + 1) == 8 && ufo === null && endTime - startTime2 > 20000) {
		startTime2 = new Date();
		if (pos > 1) {
			pos = 0;
			ufoToRight = true;
		} else {
			pos = display.width - 32;
			ufoToRight = false;
		}
		ufo = {
			sprite: ufoSprite[0],
			x: pos,
			y: 30,
			w: ufoSprite[0].w,
			h: ufoSprite[0].h
		};
	}

	if (ufo !== null) {
		ufoHighP.play();
		if (frames%7 == 0) {
			spFrame1 = (spFrame1 + 1) % 2;
			if (ufoToRight) {
				ufo.x += 12;
			} else if (ufoToRight == false) {
				ufo.x -= 12;
			} else {
				ufo = null;
			}
		}
		if (ufo.x + ufo.w > display.width || ufo.x < 0) {
			ufo = null;
		}
	}

	// ALIEN BULLETS
	if (Math.random() < 0.03 && aliens.length > 0) {
		var a = aliens[Math.round(Math.random() * (aliens.length - 1))];

		for (var i = 0, len = aliens.length; i < len; i++) {
			var b = aliens[i];

			if (AABBIntersect(a.x, a.y, a.w, 100, b.x, b.y, b.w, b.h)) {
				a = b;
			}
		}
		bullets.push(new Bullet(a.x + a.w*0.5, a.y + a.h + 20, 4, 2, 4, "#ff0000"));
	}

	// BULLETS COLLISIONS
	for (var i = 0, len = bullets.length; i < len; i++) {
		var b = bullets[i];
		b.update();

		if (b.y + b.height < 30 || b.y > tank.y + tank.h) {
			bullets.splice(i, 1);
			i--;
			len--;
			continue;
		}

		var h2 = b.height * 0.5;
		if (cities.y < b.y+h2 && b.y+h2 < cities.y + cities.h) {
			if (cities.hits(b.x, b.y+h2)) {
				bullets.splice(i, 1);
				i--;
				len--;
				continue;
			}
		}

		for (var j = 0, len2 = aliens.length; j < len2; j++) {
			var a = aliens[j];
			if (AABBIntersect(b.x, b.y, b.width, b.height, a.x, a.y, a.w, a.h)) {
				invaderKilled.play();
				switch (a.sprite) {
					case alSprite[0]: {
						score += 20;
						break;
					}
					case alSprite[1]: {
						score += 30;
						break;
					}
					case alSprite[2]: {
						score += 10;
						break;
					}
				}
				aliens.splice(j, 1);
				j--;
				len2--;
				bullets.splice(i, 1);
				i--;
				len--;

				switch (len2) {
					case 40: {
						lvFrame = 70;
						break;
					}
					case 30: {
						lvFrame = 50;
						break;
					}
					case 20: {
						lvFrame = 30;
						break;
					}
					case 10: {
						lvFrame = 20;
						break;
					}
					case 5: {
						lvFrame = 10;
						break;
					}
					case 1: {
						lvFrame = 5;
						break;
					}
				}
				death.x = a.x;
				death.y = a.y;
			}
			if (a.y > cities.y - a.h * 2) {
				forceGameO = true;
			}
		}

		if (AABBIntersect(b.x, b.y, b.width, b.height, tank.x, tank.y, tank.w, tank.h)) {
			bullets.splice(i, 1);
			i--;
			len--;
			explosion.play();
			lives--;
			continue;
		}

		if (ufo !== null) {
			if (AABBIntersect(b.x, b.y, b.width, b.height, ufo.x, ufo.y, ufo.w, ufo.h)) {
			bullets.splice(i, 1);
			i--;
			len--;
			death.x = ufo.x;
			death.y = ufo.y;
			ufo = null;
			ufoLowP.play();
			score += ufoScore[Math.floor((Math.random() * 2))];
			continue;
			}
		}
	}

	frames++;
	if (frames % lvFrame === 0) {
		spFrame = (spFrame + 1) % 2;
		var _max = 0, _min = display.width;
		for (var i = 0, len = aliens.length; i < len; i++) {
			var a = aliens[i];
			a.x += 30 * dir;
			_max = Math.max(_max, a.x + a.w);
			_min = Math.min(_min, a.x);
		}
		if (_max > display.width - 30 || _min < 30) {
			dir *= -1;
			for (var i = 0, len = aliens.length; i < len; i++) {
				aliens[i].x += 30 * dir;
				aliens[i].y += 30;
			}
		}

		if (swAudio > fastinvaders.length - 1) {
			swAudio = 0;
		}
		fastinvaders[swAudio].play();
		swAudio++;
	}

	if (score%1000 == 0 && score != 0 && bonus) {
		lives++;
		bonus = false;
	}
};

function gameOver() {
	window.setTimeout(function() {
		document.getElementById("nameInput").focus();
	}, 10);
	document.getElementById("canvas").style.filter = "blur(2px)";
	document.getElementById("lives").style.display = "none";
	gameOsong.play();
	console.log("GAME OVER");
	document.getElementById("gameOver").style.display = "block";
};

function render() {
	display.clear();
	for (var i = 0, len = aliens.length; i < len; i++) {
		var a = aliens[i];
		display.drawSprite(a.sprite[spFrame], a.x, a.y);
	}

	if (ufo !== null) {
		display.drawSprite(ufoSprite[spFrame1], ufo.x, ufo.y);
	}
	
	display.ctx.save();
	for (var i = 0, len = bullets.length; i < len; i++) {
		display.drawBullet(bullets[i]);
	}
	display.drawSprite(death.sprite, death.x, death.y);
	display.ctx.restore();

	display.ctx.drawImage(cities.canvas, 0, cities.y);

	display.drawSprite(tank.sprite, tank.x, tank.y);
	
	for (var i = 0; i < lives; i++) {
		display.drawSprite(tank.sprite, i * 30 + 60, display.height - taSprite.h);
	}
};

startScreen();
