// Helper func.
function AABBIntersect(ax, ay, aw, ah, bx, by, bw, bh) {
	return ax < bx+bw && bx < ax+aw && ay < by+bh && by < ay+ah;
};

String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;
};

// Bullet
function Bullet(x, y, vely, w, h, color) {
	this.x = x;
	this.y = y;
	this.vely = vely;
	this.width = w;
	this.height = h;
	this.color = color;
};

Bullet.prototype.update = function() {
	this.y += this.vely;
};

// Display
function Display(width, height) {
	this.canvas = document.getElementById("canvas");
	this.canvas.width = this.width = width;
	this.canvas.height = this.height = height;
	this.ctx = this.canvas.getContext("2d");
};

Display.prototype.clear = function() {
	this.ctx.clearRect(0, 0, this.width, this.height);
};

Display.prototype.drawSprite = function(sp, x, y) {
	this.ctx.drawImage(sp.img, sp.x, sp.y, sp.w, sp.h, x, y, sp.w, sp.h);
};

Display.prototype.drawBullet = function(bullet) {
	this.ctx.fillStyle = bullet.color;
	this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
};

// Sprite
function Sprite(img, x, y, w, h) {
	this.img = img;
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
};

// InputHandeler	http://keycode.info
function InputHandeler() {
	this.down = {};
	this.pressed = {};
	var _this = this;
	document.addEventListener("keydown", function(evt) {
		_this.down[evt.keyCode] = true;
		if ( ( evt.keycode || evt.which ) == 32) {
			evt.preventDefault();
		}
	});
	document.addEventListener("keyup", function(evt) {
		delete _this.down[evt.keyCode];
		delete _this.pressed[evt.keyCode];
	});
};

InputHandeler.prototype.isDown = function(code) {
	return this.down[code];
};

InputHandeler.prototype.isPressed = function(code) {
	if (this.pressed[code]) {
		return false;
	} else if (this.down[code]) {
		return this.pressed[code] = true;
	}
	return false;
};
