function Game(canvasManager)
{
    this.canvasManager = canvasManager;
    this.resourceManager = new ResourceManager();
    this.animationManager = new AnimationManager(this.resourceManager);
    this.state = "initializing";
    // FACTORIES
    this.towerFactory = new TowerFactory();
    this.enemyFactory = new EnemyFactory();
    this.bulletFactory = new BulletFactory();
    // COLLECTIONS OF ENTITIES
    this.enemies = new Array();
    this.towers = new Array();
	this.toptowers = new Array();
	this.bottomtowers = new Array();
    this.bullets = new Array();
    this.entities = new Array();
    // REPRESENT THE CURRENT LEVEL WHERE IS PLAYING
    this.currentLevel = null;
    this.money = 0;
    this.visualMoney = 0;
    this.score = 0;
    this.baseEnergy = 1000;
    this.baseRealPosition = new Vector2(0, 0);
    this.gameTimer = 0;
    this.interval = null;
    // DRAW MAP MODES AND BACKGROUND IMAGE BUFFER
    this.bgImageData = null;
    this.drawMapMode = "bitmap"; // (bitmap, redraw)
    this.mapRedrawRequired = false;
    // MOUSE SELECTOR AND OPTION BOXES
    this.selectorPosition = new Vector2(0, 0);
    this.mouseRealPosition = new Vector2(0, 0);
    this.optionBoxVisible = false;
    this.optionBoxType = "new";
    this.selectedCellPosition = new Vector2(0, 0);
    this.selectedEntity = null;
	
	this.addflag = 0;
    // INIT ALL
    this.init = function()
    {
		//alert("hahah");
        // LOAD IMAGE DATA
        this.resourceManager.init(this.canvasManager);
        while (!this.resourceManager.allImagesLoaded())
        {
            // LOADING...
        }
        // TEST LEVEL
        this.currentLevel = new Level("test", 1500);
        this.money = this.currentLevel.initialMoney;
        this.visualMoney = this.money;
        // PATH DE PRUEBA
        var path = new Path();
		path.addPoint(2, 7);
		path.addPoint(2, 1);
		
		
        
        this.currentLevel.addPath(path);
		
		var path2 = new Path();
		
		path2.addPoint(2, 1);
		path2.addPoint(2, 7);
        this.currentLevel.addPath(path2);
        // BASE REAL POSITION
        this.baseRealPosition.set(1600, 1000);
        // HORDE
		var horde2 = new Horde(20, 50, path2);//from top to down
        var horde = new Horde(20, 50, path);
		horde2.addEnemies("e_hero", 1);
		horde2.addEnemies("maluko", 3);
		horde2.addEnemies("maluko", 3);
		//horde.addEnemies("f_hero", 1);
		horde.addEnemies("f_malito", 1);
		horde.addEnemies("f_hero", 1);
		horde.addEnemies("f_malito", 3);
		horde.addEnemies("f_malito", 2);

		this.currentLevel.addHorde2(horde2);
        this.currentLevel.addHorde(horde);
        
        // INIT LEVEL
        this.currentLevel.init();
		this.addTower("chinoky", new Vector2(465, 100),2);
		this.addTower("chinoky_2", new Vector2(465, 1550),2);	
		this.addTower("chinoky_3", new Vector2(465, 400),3);
		this.addTower("chinoky_4", new Vector2(465, 1100),3);
		
		
		this.toptowers[0] = this.towers[0];
		this.toptowers[1] = this.towers[2];
		this.bottomtowers[0] = this.towers[3];
		this.bottomtowers[1] = this.towers[1];
        this.state = "playing";
    };
	this.addOnes = function()
	{
		var path = new Path();
		path.addPoint(2, 7);
		path.addPoint(2, 1);
		
		
        
        this.currentLevel.addPath(path);
		
		var path2 = new Path();
		
		path2.addPoint(2, 1);
		path2.addPoint(2, 7);
        this.currentLevel.addPath(path2);
        // BASE REAL POSITION
        // HORDE
		var horde2 = new Horde(20, 50, path2);//from top to down
        var horde = new Horde(20, 50, path);
		horde2.addEnemies("maluko", 1);
		horde2.addEnemies("maluko", 1);
		horde2.addEnemies("maluko", 1);
		horde2.addEnemies("maluko", 1);
		horde2.addEnemies("maluko", 1);
		horde2.addEnemies("maluko", 1);
		//horde.addEnemies("f_hero", 1);
		horde.addEnemies("f_malito", 1);
		horde.addEnemies("f_malito", 1);
		horde.addEnemies("f_malito", 2);
		horde.addEnemies("f_malito", 2);

		this.currentLevel.addHorde2(horde2);
        this.currentLevel.addHorde(horde);
        
        // INIT LEVEL
        this.currentLevel.init();
		this.state = "playing";
	}
    this.addTower = function(type, realPosition,towertype)
    {
        var cellPosition = getCellCoords(realPosition.x, realPosition.y);
        var towerAdded = false;
        {
            var tower = this.towerFactory.buildTower(type, cellPosition);
            if (tower.cost <= this.money)
            {
				//light 2 tower 3
                this.currentLevel.map.setLogicCell(cellPosition.x, cellPosition.y, towertype);
                this.towers.push(tower);
                this.money -= tower.cost;
                towerAdded = true;
            }
        }
        this.mapRedrawRequired = true;
        return towerAdded;
    };

    this.doActions = function()
    {
        this.gameTimer++;        
        var enemiesInAction = new Array();
		var enemiesInAction2 = new Array();
        var damage = 0;
        // HORDES / ENEMIES ACTION
        for (var hordeIndex = 0; hordeIndex < this.currentLevel.hordes.length; hordeIndex++)
        {
            damage += this.currentLevel.hordes[hordeIndex].doAction(this.gameTimer);
            enemiesInAction = enemiesInAction.concat(this.currentLevel.hordes[hordeIndex].enemiesInAction);
        }
		for (var hordeIndex = 0; hordeIndex < this.currentLevel.horde2s.length; hordeIndex++)
        {
            damage += this.currentLevel.horde2s[hordeIndex].doAction(this.gameTimer);
            enemiesInAction2 = enemiesInAction2.concat(this.currentLevel.horde2s[hordeIndex].enemiesInAction);//from top to down
        }

        // BASE DAMAGE
        this.baseEnergy -= damage;
        if (this.baseEnergy <= 0)
        {
            this.state = "gameover";
        }
		if(this.gameTimer >=1300 && this.gameTimer % 1300 ==0 )
		{
			this.addflag =1;

		}
		
        // TOWERS ACTION
        var shot = null;
        var bullet;
		var towertype = "chinoky";
        for (var towerIndex = 0; towerIndex < this.towers.length; towerIndex++)
        {

			towertype = this.towers[towerIndex].getType();
			if(towertype == "chinoky" ||towertype == "chinoky_3" )
			{
				//this.toptowers.push(this.towers[towerIndex]);
				//console.log(towerIndex);
				shot = this.towers[towerIndex].doAction2(enemiesInAction, this.baseRealPosition);
			}
			else
			{
				//this.bottomtowers.push(this.towers[towerIndex]);
				shot = this.towers[towerIndex].doAction2(enemiesInAction2, this.baseRealPosition);
			}
            
            if (shot !== null)
            {
                bullet = this.bulletFactory.buildBullet(shot);
                this.bullets.push(bullet);
                // TOWER FIRE
                this.animationManager.setCurrentScene(this.towers[towerIndex], "fire");
            }
			
        }
		console.log(this.bottomtowers[0].energy);
		//enemiesInAction2 Action
		var enemy1shot= null;
		for (var heroIndex = 0; heroIndex < enemiesInAction2.length; heroIndex++)//from top to down
        {
			//console.log("hahaha");
			enemy1shot = enemiesInAction2[heroIndex].doAction2(enemiesInAction,this.bottomtowers,this.baseRealPosition);
			if (enemy1shot !== null)
            {
				
                bullet = this.bulletFactory.buildBullet(enemy1shot);
                this.bullets.push(bullet);
                // TOWER FIRE
                //this.animationManager.setCurrentScene(this.towers[towerIndex], "fire");
            }
		}
		//enemiesInAction2 Action
		var enemy2shot= null;
		for (var heroIndex = 0; heroIndex < enemiesInAction.length; heroIndex++)
        {
			//console.log("hahaha");
			enemy2shot = enemiesInAction[heroIndex].doAction2(enemiesInAction2,this.toptowers,this.baseRealPosition);
			if (enemy2shot !== null)
            {
				
                bullet = this.bulletFactory.buildBullet(enemy2shot);
                this.bullets.push(bullet);
                // TOWER FIRE
                //this.animationManager.setCurrentScene(this.towers[towerIndex], "fire");
            }
		}
		
		
		
        // BULLET ACTIONS
        for (var bulletIndex = 0; bulletIndex < this.bullets.length; bulletIndex++)
        {
            bullet = this.bullets[bulletIndex];
            if (bullet.active)
            {
                bullet.doAction();
                if (!bullet.targetAlive)
                {
                    // ENEMY KILLED
                    this.money += bullet.enemyTarget.moneyReward;
                }
            }
        }
		
		

        // MONEY VISUAL INCREMENT/DECREMENT EFFECT
        if (this.visualMoney < this.money)
            this.visualMoney++;
        else if (this.visualMoney > this.money)
            this.visualMoney--;
    };

    this.drawMap = function()
    {
        if (this.bgImageData === null || this.drawMapMode === "redraw" || this.mapRedrawRequired)
        {
            // CLEAR CANVAS
            this.canvasManager.clear();
            // DRAW MAP CELLS
			
            for (var x = 0; x < this.currentLevel.map.width; x++)
            {
                for (var y = 0; y < this.currentLevel.map.height; y++)
                {
                    typeId = this.currentLevel.map.getLogicCell(x, y);
                    if (typeId === 0)
                        this.canvasManager.drawImage(this.resourceManager.getImage('grass'), x * 200, y * 200);
                    else if (typeId === 1)
                        this.canvasManager.drawImage(this.resourceManager.getImage('road'), x * 200, y * 200);
                    else if (typeId === 2)
                    {
                        this.canvasManager.drawImage(this.resourceManager.getImage('road'), x * 200, y * 200);
                        this.canvasManager.drawImage(this.resourceManager.getImage('towerBase'), x * 200, y * 200);
                    }
					else if (typeId === 3)
                    {
                        this.canvasManager.drawImage(this.resourceManager.getImage('road'), x * 200, y * 200);
                        this.canvasManager.drawImage(this.resourceManager.getImage('towerBase2'), x * 200, y * 200);
                    }
                }
            }
			this.canvasManager.drawImage(this.resourceManager.getImage('ui'), x-5.3, y-8 );
            this.mapRedrawRequired = false;
            this.bgImageData = this.canvasManager.getImageData();
			
        }
        else
            this.canvasManager.putImageData(this.bgImageData);
    };
    // DRAW ALL ENTITIES (ENEMIES / TOWERS / BULLETS)
    this.drawAll = function()
    {
        var animation;
        //var enemyAngle = 0;
        var currentEnemy = null;
        var currentTower = null;
        var currentBullet = null;
        var enemyEnergyBarColor = "";
        var crosshairPosition = new Vector2(0, 0);
        // DRAW ENEMIES
        for (var hordeIndex = 0; hordeIndex < this.currentLevel.hordes.length; hordeIndex++)
        {
            for (var enemyIndex = 0; enemyIndex < this.currentLevel.hordes[hordeIndex].enemiesInAction.length; enemyIndex++)
            {
                currentEnemy = this.currentLevel.hordes[hordeIndex].enemiesInAction[enemyIndex];
                if (currentEnemy.alive)
                {
                    // DRAW ENEMY
 
                    animation = this.animationManager.getAnimation(currentEnemy);
                    this.canvasManager.drawSprite(animation.imageSrc, currentEnemy.realPosition.x, currentEnemy.realPosition.y, currentEnemy.realAngle, 1, animation.frameRect);
  
                    if (currentEnemy.targeted)
                    {
                        crosshairPosition.x = currentEnemy.realPosition.x - (this.resourceManager.getImage('crosshair').width / 2);
                        crosshairPosition.y = currentEnemy.realPosition.y - (this.resourceManager.getImage('crosshair').height / 2);
                        // DRAW CROSSHAIR WHEN ENEMY IS TARGETED
                        this.canvasManager.drawImage(this.resourceManager.getImage('crosshair'), crosshairPosition.x, crosshairPosition.y);
                    }
                    // DRAW ENERGY BAR
                    if (currentEnemy.energy > 50)
                        enemyEnergyBarColor = "green";
                    else if (currentEnemy.energy > 25)
                        enemyEnergyBarColor = "yellow";
                    else
                        enemyEnergyBarColor = "red";
   
                    this.canvasManager.drawEnergyBar("h", currentEnemy.realPosition.x - 12.5, currentEnemy.realPosition.y - 15, currentEnemy.energy / 4, 2, "white", enemyEnergyBarColor);
                }
            }
        }
		var currentEnemy2 = null;
        var crosshairPosition2 = new Vector2(0, 0);
        // DRAW ENEMIES
        for (var hordeIndex = 0; hordeIndex < this.currentLevel.horde2s.length; hordeIndex++)
        {
            for (var enemyIndex = 0; enemyIndex < this.currentLevel.horde2s[hordeIndex].enemiesInAction.length; enemyIndex++)
            {
                currentEnemy2 = this.currentLevel.horde2s[hordeIndex].enemiesInAction[enemyIndex];
                if (currentEnemy2.alive)
                {
                    // DRAW ENEMY
   
                    animation = this.animationManager.getAnimation(currentEnemy2);
                    this.canvasManager.drawSprite(animation.imageSrc, currentEnemy2.realPosition.x, currentEnemy2.realPosition.y, currentEnemy2.realAngle, 1, animation.frameRect);
  
                    if (currentEnemy2.targeted)
                    {
                        crosshairPosition2.x = currentEnemy2.realPosition.x - (this.resourceManager.getImage('crosshair').width / 2);
                        crosshairPosition2.y = currentEnemy2.realPosition.y - (this.resourceManager.getImage('crosshair').height / 2);
                        // DRAW CROSSHAIR WHEN ENEMY IS TARGETED
                        this.canvasManager.drawImage(this.resourceManager.getImage('crosshair'), crosshairPosition2.x, crosshairPosition2.y);
                    }
                    // DRAW ENERGY BAR
                    if (currentEnemy2.energy > 50)
                        enemyEnergyBarColor = "green";
                    else if (currentEnemy2.energy > 25)
                        enemyEnergyBarColor = "yellow";
                    else
                        enemyEnergyBarColor = "red";
  
                    this.canvasManager.drawEnergyBar("h", currentEnemy2.realPosition.x - 12.5, currentEnemy2.realPosition.y - 15, currentEnemy2.energy / 4, 2, "white", enemyEnergyBarColor);
                }
            }
        }
        // TOWERS
        for (var towerIndex = 0; towerIndex < this.towers.length; towerIndex++)
        {
            currentTower = this.towers[towerIndex];
            animation = this.animationManager.getAnimation(currentTower);
  
            this.canvasManager.drawSprite(animation.imageSrc, currentTower.realPosition.x, currentTower.realPosition.y, degToRad(currentTower.turretAngle), 1, animation.frameRect);
            // DRAW ATTACK RANGE
            if (currentTower.selected)
                this.canvasManager.drawCircle(currentTower.realPosition.x, currentTower.realPosition.y, currentTower.attackRange, "red");
			// DRAW ENERGY BAR
			if (currentTower.energy > 298)
				enemyEnergyBarColor = "green";
			else if (currentTower.energy > 100)
				enemyEnergyBarColor = "yellow";
			else
				enemyEnergyBarColor = "red";

			this.canvasManager.drawEnergyBar("h", currentTower.realPosition.x - 12.5, currentTower.realPosition.y - 15, currentTower.energy / 4, 2, "white", enemyEnergyBarColor);
        }
        // BULLETS
        for (var bulletIndex = 0; bulletIndex < this.bullets.length; bulletIndex++)
        {
            currentBullet = this.bullets[bulletIndex];
            if (currentBullet.active)
            {    
                if (currentBullet.type === "smallDamage" )
				{
	
					 this.canvasManager.drawCircle(currentBullet.realPosition.x, currentBullet.realPosition.y, 2, "blue", "#CCCCCC");
				}
				else if(currentBullet.type === "waterDamage" ||currentBullet.type === "fireDamage")
				{
					animation = this.animationManager.getAnimation(currentBullet);
					this.canvasManager.drawSprite(animation.imageSrc, currentBullet.realPosition.x, currentBullet.realPosition.y, currentBullet.realAngle, 1, animation.frameRect);
				}
				else if(currentBullet.type === "mediumDamage" || currentBullet.type === "mediumDamage")
				{
					this.canvasManager.drawCircle(currentBullet.realPosition.x, currentBullet.realPosition.y, 2, "blue", "#CCCCCC");
				}   
                else if (currentBullet.type === "laser")
				{
					this.canvasManager.drawLine(currentBullet.realPosition.x, currentBullet.realPosition.y, currentBullet.enemyTarget.realPosition.x, currentBullet.enemyTarget.realPosition.y, "red");
				}
                    
            }
        }
        
    };
    // ANIMATE ALL ENTITIES
    this.animateAll = function()
    {
        this.animationManager.doAnimations();
    };
    // DESTROY INACTIVE ENEMIES, HORDES AND BULLETS
    this.deadBodiesCollect = function()
    {
        // ENEMIES AND HORDES
        var hordeIndex = 0;
        var enemyIndex;
        var horde = null;
        var enemy = null;
        var enemiesAlive;
        while (hordeIndex < this.currentLevel.hordes.length)
        {
            horde = this.currentLevel.hordes[hordeIndex];
            enemiesAlive = false;
            enemyIndex = 0;
            while (enemyIndex < horde.enemiesInAction.length)
            {
                enemy = horde.enemiesInAction[enemyIndex];
                if (enemy.alive)
                {
                    enemyIndex++;
                    enemiesAlive = true;
                }
                else
                    horde.enemiesInAction.splice(enemyIndex, 1);
            }
            if (enemiesAlive || horde.enemiesInActionCounter < horde.enemies.length)
                hordeIndex++;
            else
                this.currentLevel.hordes.splice(hordeIndex, 1);
        }
		var horde2Index2 = 0;
        var enemy2Index;
        var horde2 = null;
        var enemy2 = null;
        var enemiesAlive2;
        while (horde2Index2 < this.currentLevel.horde2s.length)
        {
            horde2 = this.currentLevel.horde2s[horde2Index2];
            enemiesAlive2 = false;
            enemy2Index = 0;
            while (enemy2Index < horde2.enemiesInAction.length)
            {
                enemy2 = horde2.enemiesInAction[enemy2Index];
                if (enemy2.alive)
                {
                    enemy2Index++;
                    enemiesAlive2 = true;
                }
                else
                    horde2.enemiesInAction.splice(enemy2Index, 1);
            }
            if (enemiesAlive2 || horde2.enemiesInActionCounter < horde2.enemies.length)
                horde2Index2++;
            else
                this.currentLevel.horde2s.splice(horde2Index2, 1);
        }
        // BULLETS
        var bulletIndex = 0;
        var bullet;
        while (bulletIndex < this.bullets.length)
        {
            bullet = this.bullets[bulletIndex];
            if (bullet.active)
                bulletIndex++;
            else
                this.bullets.splice(bulletIndex, 1);
        }
    };
    // SIMPLE GAME LOOP
    this.mainLoop = function ()
    {
        switch (this.state)
        {
            case "initializing":
                // LOAD ALL RESOURCES AND CREATE LEVEL 
                this.init();
                // HIDE STANDARD MOUSE POINTER
                this.canvasManager.hideMousePointer();
                // WAIT A SECOND (IMG COMPLETE BUG) AND START PLAYING MAIN LOOP
                setTimeout("juego.initializePlayingMainLoop()", 1000);
                break;
            case "playing":
                this.state = "working";
                this.doActions();
                //var ti = new Date().getTime();
                this.drawMap();
                this.drawAll();
                //var tf = new Date().getTime();
                //divDebug(tf - ti);
                this.animateAll();
                this.deadBodiesCollect();
                if (this.state !== "gameover")
                {
					this.state = "playing";
				}
				if(this.addflag ==1)
				{
					console.log("flag = 1");
					this.addOnes();
					this.addflag = 0;
				}
				//this.addOnes();
				
                break;
        }
    };
    // START GAME
    this.start = function()
    {
        divDebug("Initializing...");
        this.mainLoop();
    };
    this.initializePlayingMainLoop = function()
    {
        divDebug("Playing...");
        this.interval = setInterval("juego.mainLoop()", 30);
    };
    
}