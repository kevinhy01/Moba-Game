/*
 *   LEVEL
 */
function Level(name, initialMoney, techLevel)
{
    this.name = name;
    this.initialMoney = initialMoney;
    this.techLevel = techLevel;
    // CREATE TWO LAYERS MAP
    this.map = new LogicMap(7, 10, 2);
    this.paths = new Array();
    this.hordes = new Array();
	this.horde2s = new Array();
    this.addPath = function(path)
    {
        this.paths.push(path);
    };
    this.addHorde = function(horde)
    {
        this.hordes.push(horde);
    };
	this.addHorde2 = function(horde2)
    {
        this.horde2s.push(horde2);
    };
    this.init = function()
    {
        this.map.init();
        // TEMPORARY ALL PATH POINT ARRAY (TO FIX CORNERS)
        var allPathPoints = new Array();
        // DRAW LOGIC PATH
        for (var pathIndex = 0; pathIndex < this.paths.length; pathIndex++)
        {
            for (var pointIndex = 0; pointIndex < this.paths[pathIndex].points.length - 1; pointIndex++)
            {
                var point = this.paths[pathIndex].points[pointIndex];
                var nextPoint = this.paths[pathIndex].points[pointIndex + 1];
                var pathDirection; // 6 right, 4 left, 8 up, 2 down
                var distance;
                if (nextPoint.x > point.x)
                {
                    pathDirection = 6;
                    distance = nextPoint.x - point.x;
                }
                else if (nextPoint.x < point.x)
                {
                    pathDirection = 4;
                    distance = point.x - nextPoint.x;
                }
                else if (nextPoint.y > point.y)
                {
                    pathDirection = 2;
                    distance = nextPoint.y - point.y;
                }
                else if (nextPoint.y < point.y)
                {
                    pathDirection = 8;
                    distance = point.y - nextPoint.y;
                }
                var pathDrawer = new Vector2(point.x, point.y);
                for (var i = 0; i < distance; i++)
                {
                    if (pathDrawer.x >= 0 && pathDrawer.y >= 0)
                    {
                        this.map.setLogicCell(pathDrawer.x, pathDrawer.y, 1);
                        allPathPoints.push(pathDrawer.x, pathDrawer.y);
                    }
                    if (pathDirection === 6)
                        pathDrawer.x++;
                    else if (pathDirection === 4)
                        pathDrawer.x--;
                    else if (pathDirection === 8)
                        pathDrawer.y--;
                    else if (pathDirection === 2)
                        pathDrawer.y++;
                }
            }
        }
        // FIX CORNERS - ASSIGN A SPECIFIC TYPE FOR VISUALLY REPRESENTING THE CORNERS
        /*for (var pathPointIndex = 0; pathPointIndex < allPathPoints.length; pathPointIndex++)
        {
            // TODO : IMPLEMENT THIS !
            var pathPoint = allPathPoints[pathPointIndex];
        }*/
    };
}