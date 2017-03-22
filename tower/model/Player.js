/*
Player Character - Basic movement currently
*/

var playerChar = {armor: 10};
playerChar.img = new Image();
playerChar.img.src = "/tower/img/CharBack.png";
playerChar.x = 64;
playerChar.y = 64;
//playerChar.drawImage (playerChar.img, playerChar.x, playerChar.y);
var keyD = false;
var keyA = false;
var keyS = false;
var keyW = false;
var uIval = setInterval(update, 33.34);

window.onload = function() {
    var c=document.getElementById("myCanvas");
    var ctx=c.getContext("2d");
    var img=document.getElementById("scream");
    ctx.drawImage(playerChar.img,10,10);
};

window.AddEventListener('keydown', onKeyDown);
window.AddEventListener('keyup', onKeyUp);


function onKeyDown(e){
    switch(e.keyCode){
    case 68: //d right
    console.log("right");
    if (keyD == false)
         keyD = true;
    case 65: //a left
    console.log("left");
    if (keyA == false)
    keyA = true;

    case 83: //s down
    console.log("down");
    if (keyS == false)
    keyS = true;
    playerChar.img.src = "tower/img/charFront.png";
    case 87: //w up
    console.log("up");
    if (keyW == false)
    keyW = true;
    }
}

function onKeyUp(e){
    switch(e.keyCode){
    case 68: //d right
    console.log("right");
         keyD = false;
    case 65: //a left
    console.log("left");
    keyA = false;

    case 83: //s down
    console.log("down");
    keyS = false;
    playerChar.img.src = "img/charFront.png";
    case 87: //w up
    console.log("up");
    keyW = false;
    }
}

function update(){
    movePlayer();
}
function movePlayer(){
    if (keyD == true){
        playerChar.x +=10;
    }
    if (keyA == true){
        playerChar.x -=10;
    }
    if (keyS == true){
        playerChar.y +=10;
    }
    if (keyW == true){
        playerChar.y -=10;
    }
}