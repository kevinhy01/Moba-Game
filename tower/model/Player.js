/*
Player Character - Basic movement currently
*/
var c = document.getElementById("stage");
var ctx = c.getContext("2d");
var playerChar = {armor: 10};
this.playerChar.img = new Image();//needs fix
this.playerChar.img.src = "img/CharBack.png";
this.playerChar.x = 64;
this.playerChar.y = 64;
ctx.drawImage(playerChar.img, playerChar.x, playerChar.y);

//WASD variables for movement, false initially as they aren't pressed
var keyD = false;
var keyA = false;
var keyS = false;
var keyW = false;
var uIval = setInterval(update, 33.34);
window.addEventListener('keydown', onKeyDown);
window.addEventListener('keyup', onKeyUp);


function onKeyDown(e) {
	switch (e.keyCode) {
		case 68: //d right
			console.log("right");
			if (keyD == false)
				keyD = true;
			break;
		case 65: //a left
			console.log("left");
			if (keyA == false)
				keyA = true;
			break;
		case 83: //s down
			console.log("down");
			playerChar.img.src = "img/CharFront.png";
			if (keyS == false)
				keyS = true;
			break;
		case 87: //w up
			console.log("up");
			playerChar.img.src = "img/CharBack.png";
			if (keyW == false)
				keyW = true;
			break;
		default:
			console.log("Undefined");
			break;
	}
}

function onKeyUp(e) {
	switch (e.keyCode) {
		case 68: //d right
			console.log("right");
			keyD = false;
			break;
		case 65: //a left
			console.log("left");
			keyA = false;
		case 83: //s down
			playerChar.img.src = "img/charFront.png";
			console.log("down");
			keyS = false;

			break;
		case 87: //w up
			console.log("up");
			playerChar.img.src = "img/CharBack.png";
			keyW = false;
			break;
		default:
			console.log("Undefined");
			break;
	}
}

function update() {
	movePlayer();
}
function movePlayer() {
	if (keyD == true) {
		ctx.clearRect(0, 0, 1200, 1000)
		playerChar.x += 10;
		ctx.drawImage(playerChar.img, playerChar.x, playerChar.y);
	}
	if (keyA == true) {
		ctx.clearRect(0, 0, 1200, 1000)
		playerChar.x -= 10;
		ctx.drawImage(playerChar.img, playerChar.x, playerChar.y);
	}
	if (keyS == true) {
		ctx.clearRect(0, 0, 1200, 1000)
		playerChar.y += 10;
		ctx.drawImage(playerChar.img, playerChar.x, playerChar.y);
	}
	if (keyW == true) {
		ctx.clearRect(0, 0, 1200, 1000)
		playerChar.y -= 10;
		ctx.drawImage(playerChar.img, playerChar.x, playerChar.y);
	}
}