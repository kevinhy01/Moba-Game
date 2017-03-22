/*
 *  ENEMY
 */
function Enemy(id, type, armor, speed, damage, scoreReward, moneyReward, energy, attackRange,bulletType)
{
    // ENTITIES SUPERCLASS (GAMEENTITY)
    this.superClass = GameEntity;
    this.superClass();
    this.id = id;
    this.type = type;
    this.armor = armor;
    this.speed = speed;
    this.damage = damage;
    this.scoreReward = scoreReward;
    this.moneyReward = moneyReward;
    this.relativePosition = new Vector2(0, 0);
    this.energy = energy;
    this.inAction = false;
    this.alive = true;
    this.pathIndexTarget = 1;
    // TO DRAW SPRITE IN DIRECTION (2 : DOWN , 4 : LEFT, 6 : RIGHT, 8 : UP, 5 : NO INITIALIZED)
    this.direction = 5;
    // TO DRAW / OR NOT CROSSHAIRS OVER THE SPRITE
    this.targeted = false;
	//hero setting
	this.reloadTimer = 0;
	this.reloadTime = 10;
    this.turretAngle = 0;
	this.cannonLenght = 25;
	this.attackRange = attackRange;//70
	this.bulletType = bulletType;
	
	this.eflag = 0;//e_hero meet f_hero eflag =1
	this.echange = 0;//e change distance
	this.epath = new Path();
	this.f_meeteflag0 = 0;//f_hero meet first f_hero eflag =1
	this.fpath0 = new Path();
	this.f_meeteflag1 = 0;
	//path.addPoint(3, 6);
	//path.addPoint(3, 1);
	
    this.setRelativePosition = function(relativePosition)
    {
        this.relativePosition = relativePosition;
        this.realPosition.add(this.relativePosition);
    };
    this.doAction = function(path)
    {
		if(this.eflag == 3 )
		{
			path = this.epath;
			this.speed = 0.8;
		}
		if(this.f_meeteflag0 == 2 )
		{
			path = this.fpath0;
		}
		
        var baseDamage = 0;
        // MOVE INTO DE PATH
        var cellTarget = path.points[this.pathIndexTarget];
        var realTarget = getRealCoords(cellTarget.x, cellTarget.y);
        realTarget.add(this.relativePosition);
        var scalarSpeed = this.speed;
        var v2Speed = new Vector2(0, 0);
        if (this.realPosition.x < realTarget.x)
        {
            // SCALAR SPEED ADJUST (WHEN DISTANCE IS LESS THAN SPEED INCREMENT)
            if (realTarget.x - this.realPosition.x < scalarSpeed)
                scalarSpeed = realTarget.x - this.realPosition.x;
            v2Speed = new Vector2(scalarSpeed, 0);
            // [ MOVE TO THE RIGHT ]
            this.direction = 6;
            this.realAngle = 0;
        }
        else if (this.realPosition.x > realTarget.x)
        {
            if (this.realPosition.x - realTarget.x < scalarSpeed)
                scalarSpeed = this.realPosition.x - realTarget.x;
            v2Speed = new Vector2(scalarSpeed * -1, 0);
            // [ MOVE TO THE LEFT ]
            this.direction = 4;
            this.realAngle = Math.PI;
        }
        else if (this.realPosition.y < realTarget.y)
        {
			/*if(this.eflag == 1)
			{
				if (this.realPosition.y - realTarget.y < scalarSpeed)
					scalarSpeed = this.realPosition.y - realTarget.y;
				v2Speed = new Vector2(0, scalarSpeed * -1);
				// [ MOVE UP ]
				console.log(path);
				this.direction = 8;
				this.realAngle = 1.5 * Math.PI;
				console.log("down");
				//this.eflag = 2;
			}*/
			{
				if (realTarget.y - this.realPosition.y < scalarSpeed)
					scalarSpeed = realTarget.y - this.realPosition.y;
				v2Speed = new Vector2(0, scalarSpeed);
				// [ MOVE DOWN ]
				this.direction = 2;
				this.realAngle = Math.PI / 2;
			}
            
        }
        else if (this.realPosition.y > realTarget.y)
        {
            if (this.realPosition.y - realTarget.y < scalarSpeed)
                scalarSpeed = this.realPosition.y - realTarget.y;
            v2Speed = new Vector2(0, scalarSpeed * -1);
            // [ MOVE UP ]
            this.direction = 8;
            this.realAngle = 1.5 * Math.PI;
        }
        // ADD V2 SPEED
        this.realPosition.add(v2Speed);
        // IF REACH TARGET (CELL AND REAL POSITION)
        var cellPosition = getCellCoords(this.realPosition.x, this.realPosition.y);
		if(this.eflag == 1)
		{
			this.echange = this.realPosition.y + this.attackRange*0.2;
			this.eflag = 2;
			//this.epath.addPoint(3, 6);
			//this.epath.addPoint(3, 1);
			//console.log(cellTarget);
		}
		if(this.eflag == 2)
		{
			if(this.realPosition.y>=this.echange && this.echange!=0)
			{
				this.eflag = 3;
				this.epath.addPoint(3, 8);
				this.epath.addPoint(3, 1);
				
				//console.log(cellTarget);
			}
			//this.echange = this.realPosition.y + this.attackRange*0.5;
			
		}
		if(this.f_meeteflag0 == 1)
		{
			this.speed = 0.8;
			//console.log("find");
			//console.log(this.realPosition.y);
			if(this.realPosition.y<=500)
			{
				this.f_meeteflag0 =2;
				this.fpath0.addPoint(3, 1);
				this.fpath0.addPoint(3, 8);
				
			}
		}
		if(this.f_meeteflag0 == 2)
		{
			this.speed = 0.8;
			if(this.realPosition.y>=700)
			{
				this.f_meeteflag0 =3;
				//console.log(this.realPosition.y);
			}
		}
        else if (cellPosition.equal(cellTarget) && this.realPosition.equal(realTarget))
        {
			
            if (this.pathIndexTarget < path.points.length - 1)
                this.pathIndexTarget++;
            else
            {
				
                this.inAction = false;
                this.alive = false;
                baseDamage = this.damage;
            }
        }
        return baseDamage;
    };
    this.onDamage = function(damage)
    {
        var realDamage = damage - this.armor;
        if (realDamage > 0)
            this.energy -= realDamage;
        if (this.energy <= 0)
            this.alive = false;
        return this.alive;
    };

	/* ACTION METHOD 2 : AIM THE ENEMY CLOSEST TO THE BASE */
    this.doAction2 = function(enemies, stowers,baseRealPosition)
    {
        var selectedEnemy = this.aim(enemies, stowers, baseRealPosition);
        var shot = null;
        if (selectedEnemy !== null)
            shot = this.rotateOrFire(selectedEnemy);
        return shot;
    };
    // SELECT TARGET
    this.aim = function(enemies,stowers, baseRealPosition)
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
		if( selectedEnemy != null)
		{
			if(this.type == "e_hero" && selectedEnemy.type == "f_hero" && this.eflag == 0)
			{
				this.eflag = 1;
				console.log(this.eflag);
			}
			if(this.type == "f_hero" && selectedEnemy.type == "e_hero" && this.f_meeteflag0 == 0) // f_hero meet first
			{
				this.f_meeteflag0 = 1;//meet e_hero
				//console.log(this.f_meeteflag0);
			}
			
			
		}
		var towerIndex = 0;
		while(towerIndex< stowers.length)
		{
			stower = stowers[towerIndex];
			if (distance(this.realPosition, stower.realPosition) <= this.attackRange)
            {
                baseDistance = distance(stower.realPosition, baseRealPosition);
                if (baseMinorDistance == -1 || baseDistance < baseMinorDistance)
                {
                    baseMinorDistance = baseDistance;
					selectedEnemy = stower;
                    console.log("find tower");
                }
            }
            towerIndex++;
			
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
		//console.log(radAngle);
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
	
	
}