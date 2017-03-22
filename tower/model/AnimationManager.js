function AnimationManager(resourceManager)
{
    this.animationCounter = 0;
    this.animations = new Array();
    this.resourceManager = resourceManager;
    this.initAnimation = function(entity)
    {
        //alert("id:" + entity.id);
        var image;
        var animation;
        // TOWERS
        if (entity instanceof Tower)
        {
            switch (entity.type)
            {
                case "chinoky":
                    image = this.resourceManager.getImage('tower');
                    // animation = new Animation(image, image.width / 2, image.height, 2, 15);
                    animation = new Animation(image, image.width / 4, image.height, 2, 15);
                    animation.scenes = [
                        {name:"default", firstFrame: 0, lastFrame: 1, gotoAndPlay: ""},
                        {name:"fire", firstFrame: 2, lastFrame: 3, gotoAndPlay: "default"}
                    ];
                    break;
                case "chinoky_2":
                    image = this.resourceManager.getImage('tower');
                    // animation = new Animation(image, image.width / 2, image.height, 2, 15);
                    animation = new Animation(image, image.width / 4, image.height, 1, 15);
					animation.scenes = [
                        {name:"default", firstFrame: 0, lastFrame: 1, gotoAndPlay: ""},
                        {name:"fire", firstFrame: 2, lastFrame: 3, gotoAndPlay: "default"}
                    ];
                    break;
				case "chinoky_3":
                    image = this.resourceManager.getImage('tower');
                    // animation = new Animation(image, image.width / 2, image.height, 2, 15);
                    animation = new Animation(image, image.width / 4, image.height, 1, 15);
					animation.scenes = [
                        {name:"default", firstFrame: 0, lastFrame: 1, gotoAndPlay: ""},
                        {name:"fire", firstFrame: 2, lastFrame: 3, gotoAndPlay: "default"}
                    ];
                    break;
				case "chinoky_4":
                    image = this.resourceManager.getImage('tower');
                    // animation = new Animation(image, image.width / 2, image.height, 2, 15);
                    animation = new Animation(image, image.width / 4, image.height, 1, 15);
					animation.scenes = [
                        {name:"default", firstFrame: 0, lastFrame: 1, gotoAndPlay: ""},
                        {name:"fire", firstFrame: 2, lastFrame: 3, gotoAndPlay: "default"}
                    ];
                    break;
            }
        }
        // ENIMIES
        else if (entity instanceof Enemy)
        {
            switch (entity.type)
            {
                case "malito":                    
                    image = this.resourceManager.getImage('malito');
                    animation = new Animation(image, image.width / 4, image.height, 4, 15);
                    break;
                case "maluko":
                    image = this.resourceManager.getImage('maluko');
                    animation = new Animation(image, image.width / 4, image.height, 4, 15);
                    break;
				case "hero_malito":
                    image = this.resourceManager.getImage('alien_3');
                    animation = new Animation(image, image.width / 4, image.height, 4, 15);
                    break;
				case "hero_maluko":
                    image = this.resourceManager.getImage('alien_3');
                    animation = new Animation(image, image.width / 4, image.height, 4, 15);
                    break;
				case "e_hero":
                    image = this.resourceManager.getImage('alien_3');
                    animation = new Animation(image, image.width / 4, image.height, 4, 15);
                    break;
				case "f_hero":
                    image = this.resourceManager.getImage('alien_2');
                    animation = new Animation(image, image.width / 4, image.height, 4, 15);
                    break;
				case "f_malito":                    
                    image = this.resourceManager.getImage('f_malito');
                    animation = new Animation(image, image.width / 4, image.height, 4, 15);
                    break;
                case "f_maluko":
                    image = this.resourceManager.getImage('f_maluko');
                    animation = new Animation(image, image.width / 4, image.height, 4, 15);
                    break;
            }
        }
        // BULLETS
        else if (entity instanceof Bullet)
        {
			switch (entity.type)
            {
				case "smallDamage":
					image = this.resourceManager.getImage('smallDamage');
					// animation = new Animation(image, image.width / 2, image.height, 2, 15);
					animation = new Animation(image, image.width, image.height, 4, 15);
					break;
				case "waterDamage":
					image = this.resourceManager.getImage('waterDamage');
					// animation = new Animation(image, image.width / 2, image.height, 2, 15);
					animation = new Animation(image, image.width, image.height, 4, 15);
					break;
				case "fireDamage":
					image = this.resourceManager.getImage('fireDamage');
					// animation = new Animation(image, image.width / 2, image.height, 2, 15);
					animation = new Animation(image, image.width, image.height, 4, 15);
				break;
			}
            // TODO
        }
        // ADD ANIMATION
        this.animations.push(animation);
        entity.animationIndex = this.animationCounter++;
    };
    // GET ENTITY ANIMATION
    this.getAnimation = function(entity)
    {
        if (entity.animationIndex === -1)
            this.initAnimation(entity);
        return this.animations[entity.animationIndex];
    };
    this.getCurrentScene = function(entity)
    {
        return this.animations[entity.animationIndex].currentScene;
    };
    this.getImage = function(entity)
    {
        return this.animations[entity.animationIndex].imageSrc;
    };
    this.getFrameRect = function(entity)
    {
        return this.animations[entity.animationIndex].frameRect;
    };
    this.setCurrentScene = function(entity, sceneName)
    {
        this.animations[entity.animationIndex].setScene(sceneName);
    };
    this.doAnimations = function()
    {
        for (var itAnimation = 0; itAnimation < this.animations.length; itAnimation++)
        {
            this.animations[itAnimation].doAnimation();
        }
    };
}