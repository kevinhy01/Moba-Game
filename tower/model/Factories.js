// USE IT TO CREATE AND GET A NEW BULLET
function BulletFactory()
{
    var bulletOuid = 0;
    this.buildBullet = function(shot)
    {
        var target = shot.target;
        var bullet = null;
        switch (shot.bulletType)
        {
			case "smallDamage":
				bullet = new Bullet(bulletOuid++, shot.bulletType, 6, 15, 30);
				break;
			case "waterDamage":
				bullet = new Bullet(bulletOuid++, shot.bulletType, 6, 15, 10);
				break;
			case "fireDamage":
				bullet = new Bullet(bulletOuid++, shot.bulletType, 6, 10, 20);
				break;
			case "mediumDamage":
				bullet = new Bullet(bulletOuid++, shot.bulletType, 6, 15, 30);
				break;
			case "laser":
				bullet = new Bullet(bulletOuid++, shot.bulletType, -1, 50, 5);
				break;
        }
        if (bullet !== null)
            bullet.init(target.realPosition.copy(), shot.enemy, target.turretAngle, target.cannonLenght);
        return bullet;
    };
}
// USE IT TO CREATE AND GET A NEW ENEMY
function EnemyFactory()
{
    var enemyOuid = 0;
    this.getEnemy = function(type)
    {
        var enemy;
        switch (type)
        {
            case "malito":
                enemy = new Enemy(enemyOuid++, type, 3, .5, 5, 2, 100,100,60,"waterDamage");//water
                break;
            case "maluko":
                enemy = new Enemy(enemyOuid++, type, 3, .3, 5, 2, 100,70,100,"fireDamage");//fire
                break;
			case "e_hero":
                enemy = new Enemy(enemyOuid++, type, 7, 1.0, 2, 2, 100,260,70,"smallDamage");
                break;
			case "f_hero":
                enemy = new Enemy(enemyOuid++, type, 7, .6, 2, 2, 100,260,70,"smallDamage");
                break;
			case "f_malito":
                enemy = new Enemy(enemyOuid++, type, 3, .6, 5, 2, 100,100,60,"waterDamage");
                break;
            case "f_maluko":
                enemy = new Enemy(enemyOuid++, type, 3, .3, 5, 2, 100,70,100,"fireDamage");
                break;
        }
        return enemy;
    };
}

// USE IT TO CREATE AND GET A NEW TOWER
function TowerFactory()
{
    var towerOuid = 0;
    this.buildTower = function(type, cellPosition)
    {
        var tower = null;
        switch (type)
        {
            case "chinoky":
                tower = new Tower(towerOuid++, type, 200, 2, "laser", 20, 50, 25,180,0.1,1,300);
                /* IDEA OF JSON INIT */
                tower.jsonInit(
                    {
                        id: towerOuid++,
                        type: type,
                        cannonLenght: 25,
                        levels: 
                        [
                            // LEVEL 1
                            {attackRange: 70, angularSpeed: 2, bulletType: "laser", reloadTime: 20, cost: 50},
                            // LEVEL 2
                            {attackRange: 90, angularSpeed: 3, bulletType: "laser", reloadTime: 10, cost: 50}, 
                            // LEVEL 3
                            {attackRange: 110, angularSpeed: 5, bulletType: "laser", reloadTime: 5, cost: 50}
                        ]
                    }
                );            
                break;
            case "chinoky_2":
                tower = new Tower(towerOuid++, type, 200, 2, "laser", 20, 50, 25,0,0.1,1,300);
                break;
			case "chinoky_3":
                tower = new Tower(towerOuid++, type, 90, 2, "laser", 20, 50, 25,180,0.1,1,300);
                break;
			case "chinoky_4":
                tower = new Tower(towerOuid++, type, 90, 2, "laser", 20, 50, 25,0,0.1,1,300);
                break;
            case "tesla":
                tower = new Tower(towerOuid++, type, 80, 90, "laser", 60, 150, 0,0,0.1,1,300);
                break;
        }
        if (tower !== null && isset(cellPosition))
            tower.setCellPosition(cellPosition);
        return tower;
    };
}
