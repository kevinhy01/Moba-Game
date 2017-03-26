function ResourceManager()
{
    // IMAGES
    this.images = new Array();
    this.imagesIndexAssoc = new Array();
    this.imageLoadedCount = 0;
    this.allImagePreLoaded = false;
    // SOUNDS
    this.sounds = new Array();
    this.soundsIndexAssoc = new Array();
    this.soundLoadedCount = 0;
    this.allSoundsPreLoaded = false;
    // INIT (CREATE IMAGES DEFINITIONS / LOAD ALL IMAGES)
    this.init = function(canvasManager)
    {
        // IMAGES
        this.addImage("grass", relPath + "img/grass_5.png");
        this.addImage("road", relPath + "img/road_5.png");
        this.addImage("towerBase", relPath + "img/towerbase.png");
		this.addImage("towerBase2", relPath + "img/towerbase2.png");
        this.addImage("crosshair", relPath + "img/crosshair_2.png");
        this.addImage("mouseCrosshair", relPath + "img/mouseCrosshair_1.png");
        this.addImage("maluko", relPath + "img/bak/fire2.png");
        this.addImage("malito", relPath + "img/bak/ice2.png");
		this.addImage("alien_3", relPath + "img/alien_3.png");
		this.addImage("alien_2", relPath + "img/alien_2.png");
		this.addImage("ui", relPath + "img/ui-mockup.png");
		this.addImage("f_maluko", relPath + "img/bak/fire2-b.png");
        this.addImage("f_malito", relPath + "img/bak/ice2-b.png");
		
		
        //this.addImage("tower", relPath + "img/turret_3.png");
        this.addImage("tower", relPath + "img/turretAnimation.png");
        this.addImage("laserTower", relPath + "img/laserTurret_1.png");
        this.addImage("moneyBox", relPath + "img/moneyBox.png");
     
		
		this.addImage("smallDamage", relPath + "img/waterbullet.png");
		this.addImage("waterDamage", relPath + "img/waterbullet.png");
		this.addImage("fireDamage", relPath + "img/firebullet.png");
		this.addImage("img/ui-mockup.png");
        //this.addImage("optionBox", relPath + "img/optionBox.png");
        this.loadImages(canvasManager);

    };
    // [CREATE / ADD / ASSOCIATE] IMAGES DEFINITIONS
    this.addImage = function (id, imageSrc)
    {
        var imageDef = new Array();
        imageDef['id'] = id;
        imageDef['src'] = imageSrc;
        imageDef['image'] = null;
        this.imagesIndexAssoc[id] = this.images.push(imageDef) - 1;
    };
    // [CREATE / ADD / ASSOCIATE] SOUNDS DEFINITIONS
    this.addSound = function (id, soundSrc)
    {
        var soundDef = new Array();
        soundDef['id'] = id;
        soundDef['src'] = soundSrc;
        soundDef['sound'] = null;
        this.soundsIndexAssoc[id] = this.sounds.push(soundDef) - 1;
    };
    // LOAD ALL IMAGES
    this.loadImages = function(canvasManager)
    {
        var imageDef;
        for (var i = 0; i < this.images.length; i++)
        {
            imageDef = this.images[i];
            imageDef['image'] = canvasManager.loadImage(imageDef['src'], this.imageLoaded(this));
        }
    };

    this.imageLoaded = function(resourceManager)
    {        
        resourceManager.imageLoadedCount++;
        if (resourceManager.imageLoadedCount === resourceManager.images.length)
            resourceManager.allImagePreLoaded = true;
    };
    // CHECK COMPLETE IMAGE LOADING
    this.allImagesLoaded = function()
    {
        var complete = false;
        if (this.allImagePreLoaded)
        {
            //divDebug("preloaded...");
            var i = 0;
            complete = true;
            while (i < this.images.length && complete)
            {
                //var image = this.images[i]['image'];
                if (this.images[i]['image'] === false)
                //if (image.complete === false)
                    complete = false;
                // divDebug("Image " + this.images[i]['id'] + " : " + complete);
                i++;
            }
        }
        return complete;
    };
    // GET IMAGE BY ID
    this.getImage = function(id)
    {
        return this.images[this.imagesIndexAssoc[id]]['image'];
    };

}