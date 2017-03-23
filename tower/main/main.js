var relPath = "tower/";
var gameCanvas;

$include(relPath + "scripts/Animation.js");
$include(relPath + "scripts/Animation2.js");
$include(relPath + "scripts/Damage.js");
$include(relPath + "scripts/Enemy.js");
$include(relPath + "scripts/GameFactories.js");
$include(relPath + "scripts/Game.js");
$include(relPath + "scripts/GameEntity.js");
$include(relPath + "scripts/Action.js");
$include(relPath + "scripts/Level.js");
$include(relPath + "scripts/MapManager.js");
$include(relPath + "scripts/ResourceManager.js");
$include(relPath + "scripts/Shot.js");
$include(relPath + "scripts/Tower.js");

// RETURN CELL COORDINATES FROM REAL COORDINATES
function getCellCoords(realX, realY)
{
    var x = Math.floor(realX / 200);
    var y = Math.floor(realY / 200);
    return new Vector2(x, y);
}
// RETURN REAL COORDINATES FROM CELL COORDINATES
function getRealCoords(cellX, cellY)
{
    var x = (cellX * 200) + 100;
    var y = (cellY * 200) + 100;
    return new Vector2(x, y);
}
// DEBUG TO DEBUG DIV
function divDebug(str)
{
    document.getElementById("debugWindow").innerHTML = str;
}

function jsonEval(jsonData)
{
    return eval('(' + jsonData + ')');
}