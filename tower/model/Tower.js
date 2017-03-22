/*
 *  TOWER
 */
function Tower(id, type, attackRange, angularSpeed, bulletType, reloadTime, cost, cannonLenght,turretAngle,armor,damage,energy)
{
    // ENTITIES SUPERCLASS (GAMEENTITY)
    this.superClass = GameEntity;
    this.superClass();
    this.id = id;
    this.type = type;
    this.selectable = true;
    this.cellPosition = new Vector2(0, 0);
    this.attackRange = attackRange;
    this.angularSpeed = angularSpeed;
    this.bulletType = bulletType;
    this.reloadTime = reloadTime;
    this.cost = cost;
    this.reloadTimer = 0;
    this.turretAngle = turretAngle;
    this.level = 1;
    this.jsonLevelsDefs = null;
    this.cannonLenght = cannonLenght;
	this.targeted = false;
	this.armor = armor;
    this.damage = damage;
    this.energy = energy;
	this.alive = true;
	this.onDamage = function(damage)
    {
        var realDamage = damage - this.armor;
        if (realDamage > 0)
            this.energy -= realDamage;
        if (this.energy <= 0)
            this.alive = false;
        return this.alive;
    };
	
    this.jsonInit = function(jsonData)
    {
        var jsonObject = jsonData;
        this.id = jsonObject.id;
        this.type = jsonObject.type;
        this.jsonLevelsDefs = jsonObject.levels;
        /* this.attackRange = jsonObject.attackRange;
        this.angularSpeed = jsonObject.angularSpeed;
        this.bulletType = jsonObject.bulletType;
        this.reloadTime = jsonObject.reloadTime; */
    };
    this.canLevelUp = function()
    {
        if (this.level < this.jsonLevelsDefs.length)
            return true;
        else
            return false;
    };
    this.levelUp = function()
    {
        if (this.canLevelUp())
        {            
            this.level++;
            this.applyLevelDefs();
        }
        return this.level;
    };
    this.applyLevelDefs = function()
    {
        var currentLevelIndex = this.level - 1;
        this.attackRange = this.jsonLevelsDefs[currentLevelIndex].attackRange;
        this.angularSpeed = this.jsonLevelsDefs[currentLevelIndex].angularSpeed;
        this.bulletType = this.jsonLevelsDefs[currentLevelIndex].bulletType;
        this.reloadTime = this.jsonLevelsDefs[currentLevelIndex].reloadTime;
        this.reloadTimer = 0;
    };
    this.getNextLevelCost = function()
    {
        var cost = -1;
        if (this.canLevelUp())
        {
            var nextLevelIndex = this.level;
            cost = this.jsonLevelsDefs[nextLevelIndex].cost;
        }
        return cost;
    };
    this.setCellPosition = function(cellPosition)
    {
        this.cellPosition = cellPosition;
        this.realPosition = getRealCoords(cellPosition.x, cellPosition.y);
    };
    /* ACTION METHOD 1 : AIM THE FIRST ENEMY IN RANGE */
    this.doAction = function(enemies)
    {
        var enemy = null;
        var enemyIndex = 0;
        // IF FOUND ENEMY IN ATTACK RANGE
        var enemyFound = false;
        var radAngle;
        var degAngle;
        var angleDiff;
        var inverseAngleDiff;
        var shot = null;
        // UPDATE RELOAD TIMER
        if (this.reloadTimer < this.reloadTime)
            this.reloadTimer++;
        while (enemyIndex < enemies.length && !enemyFound)
        {
            // RANGE CHECK
            enemy = enemies[enemyIndex];
            if (enemy.alive && distance(this.realPosition, enemy.realPosition) <= this.attackRange)
            {
                enemyFound = true;
                radAngle = yAxisAngle(this.realPosition, enemy.realPosition);
                degAngle = Math.round(radToDeg(radAngle));
                angleDiff = Math.abs(degAngle - this.turretAngle);
                //divDebug("AngleDiff: " + radAngle);
                // TRYING TO MAKE A MORE INTELLIGENT SENSE OF ROTATION
                // [-- START --]
                inverseAngleDiff = Math.abs(degAngle - (this.turretAngle + 360));
                if (angleDiff > 180)
                {
                    if (inverseAngleDiff < angleDiff)
                        this.turretAngle += 360;
                    else if (inverseAngleDiff > angleDiff)
                        this.turretAngle -= 360;
                }
                // [-- END --]
                if (this.turretAngle < degAngle)
                {
                    if (angleDiff >= this.angularSpeed)
                        this.turretAngle += this.angularSpeed;
                    else
                        // TO ADJUST ANGULAR MOVEMENT
                        this.turretAngle += angleDiff;
                }
                else if (this.turretAngle > degAngle)
                {
                    if (angleDiff >= this.angularSpeed)
                        this.turretAngle -= this.angularSpeed;
                    else
                        // TO ADJUST ANGULAR MOVEMENT
                        this.turretAngle -= angleDiff;
                }
                // TARGET IN CROSSHAIRS
                if (this.turretAngle === degAngle)
                {
                    // MARK ENEMY AS TARGETED
                    enemy.targeted = true;
                    if (this.reloadTimer >= this.reloadTime)
                    {
                        shot = new Shot(this, enemy, this.bulletType);
                        // RESET RELOAD TIMER
                        this.reloadTimer = 0;
                    }
                }
            }
            else
                enemyIndex++;
        }
        return shot;
    };
    /* ACTION METHOD 2 : AIM THE ENEMY CLOSEST TO THE BASE */
 /* ACTION METHOD 2 : AIM THE ENEMY CLOSEST TO THE BASE */
    this.doAction2 = function(enemies, baseRealPosition)
    {
        var selectedEnemy = this.aim(enemies, baseRealPosition);
        var shot = null;
        if (selectedEnemy !== null)
            shot = this.rotateOrFire(selectedEnemy);
        return shot;
    };
    // SELECT TARGET
    this.aim = function(enemies, baseRealPosition)
    {
        var enemy = null;
        var enemyIndex = 0;
        // IF FOUND ENEMY IN ATTACK RANGE
        var selectedEnemy = null;        
        var baseDistance = -1;
        var baseMinorDistance = -1;
        while (enemyIndex < enemies.length)
        {
            // RANGE CHECK
            enemy = enemies[enemyIndex];
            if (enemy.alive && distance(this.realPosition, enemy.realPosition) <= this.attackRange)
            {
                baseDistance = distance(enemy.realPosition, baseRealPosition);
                if (baseMinorDistance == -1 || baseDistance < baseMinorDistance)
                {
                    baseMinorDistance = baseDistance;
                    selectedEnemy = enemy;
                }
            }
            enemyIndex++;
        }
        return selectedEnemy;
    };
    // ROTATE / FIRE
    this.rotateOrFire = function(enemy)
    {
        // UPDATE RELOAD TIMER
        if (this.reloadTimer < this.reloadTime)
            this.reloadTimer++;
        var shot = null;
        var radAngle;
        var degAngle;
        var angleDiff;
        var inverseAngleDiff;
        radAngle = yAxisAngle(this.realPosition, enemy.realPosition);
        degAngle = Math.round(radToDeg(radAngle));
        angleDiff = Math.abs(degAngle - this.turretAngle);
        // [-- START --]
        inverseAngleDiff = Math.abs(degAngle - (this.turretAngle + 360));
        if (angleDiff > 180)
        {
            if (inverseAngleDiff < angleDiff)
                this.turretAngle += 360;
            else if (inverseAngleDiff > angleDiff)
                this.turretAngle -= 360;
        }
        // [-- END --]
        if (this.turretAngle < degAngle)
        {
            if (angleDiff >= this.angularSpeed)
                this.turretAngle += this.angularSpeed;
            else
                // TO ADJUST ANGULAR MOVEMENT
                this.turretAngle += angleDiff;
        }
        else if (this.turretAngle > degAngle)
        {
            if (angleDiff >= this.angularSpeed)
                this.turretAngle -= this.angularSpeed;
            else
                // TO ADJUST ANGULAR MOVEMENT
                this.turretAngle -= angleDiff;
        }
        // TARGET IN CROSSHAIRS
        if (this.turretAngle === degAngle)
        {
            // MARK ENEMY AS TARGETED
            enemy.targeted = true;
            if (this.reloadTimer === this.reloadTime)
            {
                shot = new Shot(this, enemy, this.bulletType);
                // RESET RELOAD TIMER
                this.reloadTimer = 0;
            }
        }
        return shot;
    };
	this.getType = function()
    {
		return this.type;
	};
}