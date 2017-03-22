Player = function(game, x, y, p_num, group){
    
   /* game.state.add('MainState', MainState);
    game.state.add('SecondaryState', SecondaryState);
    game.state.add('Stun', Stun);
    game.state.add('Dead', Dead);*/

    Phaser.Sprite.call(this, game, x, y, (p_num == 1) ? 'player1' : 'player2');

    this.anchor.setTo(0.5, 0.5);
    game.physics.arcade.enable(this);
    
    this.body.setSize(75, 225, 0, 10); //reducing the player collision box
    this.body.collideWorldBounds = true;

    this.movementSPD = 300;
    this.hp = 100;    
    this.level = 1;
    this.EXP = 0;
    this.AttackPoints = 10;
    

    this.invulnerable = false;
    this.weapon = null;
    this.isWalking = true;
    this.score = 0;
    this.group = group;
    this.animations.add('right', [0,1,2,3,4,5,6], 8, true);
    this.animations.add('left', [13,12,11,10,9,8,7], 8, true);
    
    this.shotgunSfx = game.add.audio('shotgunSfx');
    this.pistolSfx = game.add.audio('bulletSfx');
    
    this.machineSfx = game.add.audio('machineGunSfx');
    this.sniperSfx = game.add.audio('sniperSfx');
    
    this.shootSfx = this.shotgunSfx;
    this.shootSfx.allowMultiple = false;

    // this.pEmitter = game.add.emitter(0,0,100);
    // this.pEmitter.makeParticles('bloodVfx');
    // this.pEmitter.gravity = -1200;
    // this.pEmitter.setYSpeed(-500, 500);
    // this.pEmitter.setXSpeed(-500, 500);
    // this.pEmitter.setScale(0.5,0,0.5,0,300);

    this.createKeys();
    this.PrimaryAttack();
    //at the very end
    game.add.existing(this);
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

//update is called automatically by Phaser
Player.prototype.update = function(){
    this.movePlayer();
};

Player.prototype.movePlayer = function(){
   var facingLeft;
    if (!this.alive || !this.isWalking)
        return;
    
    this.weapon.fireAngle = -(90 + 90 * -this.pad.axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_X));

    if (this.cursor.left.isDown || this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X)< -0.1){ //move left
            this.body.velocity.x = -300;
            this.animations.play('left');
            this.facingLeft = true;
            //this.AK47.angle = 180;
        }
    else if (this.cursor.right.isDown || this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X)>0.1){ //move right
            this.body.velocity.x = 300;
            this.animations.play('right');
            this.facingLeft = false;
            //this.AK47.angle = 0;
        }
    else if ((this.cursor.up.isDown || this.pad.justPressed(Phaser.Gamepad.XBOX360_A))){ //jump
            this.body.velocity.y = -300;
        }
     else if ((this.cursor.down.isDown || this.pad.justPressed(Phaser.Gamepad.XBOX360_A))){ //jump
            this.body.velocity.y = 300;
        }

    else {
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;
            this.animations.stop();
            if (this.facingLeft == true){
                this.frame = 12;
            }
            else{
                this.frame = 1;
                
            }
        }
    //if ((this.cursor.up.isDown || this.pad.justPressed(Phaser.Gamepad.XBOX360_A))){ //jump
    //        this.body.velocity.y = 300;
    //    }
    if(this.pad.isDown(Phaser.Gamepad.XBOX360_RIGHT_TRIGGER)|| this.pad.justPressed(Phaser.Gamepad.XBOX360_RIGHT_BUMPER)){
            this.weapon.fire();
            this.shootSfx.play(null, null, 0.1, false, false);
        }
    if (this.fireButton.isDown && this.cursor.left.isDown){
            this.weapon.fireAngle = -180;
            this.weapon.fire();
            this.shootSfx.play(null, null, 0.1, false, false);
        }
    else if (this.fireButton.isDown && this.cursor.right.isDown){
        this.weapon.fireAngle = 0;
        this.weapon.fire();
        this.shootSfx.play(null, null, 0.1, false, false);
    }
    else if (this.fireButton.isDown && this.cursor.up.isDown) { //firing straight up
        this.weapon.fireAngle = Phaser.ANGLE_UP;
        this.weapon.fire();
        this.shootSfx.play(null, null, 0.1, false, false);
    }
    else if (this.fireButton.isDown && this.cursor.down.isDown) { //firing straight up
        this.weapon.fireAngle = 90;
        this.weapon.fire();
        this.shootSfx.play(null, null, 0.1, false, false);

    }
    
};

Player.prototype.createKeys = function(){
    if (this.color == "red") {
            this.cursor = game.input.keyboard.createCursorKeys();
            this.fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            this.pad = game.input.gamepad.pad1;
        }
        else {
            var wasd =
                {
                    up: game.input.keyboard.addKey(Phaser.Keyboard.W),
                    down: game.input.keyboard.addKey(Phaser.Keyboard.S),
                    left: game.input.keyboard.addKey(Phaser.Keyboard.A),
                    right: game.input.keyboard.addKey(Phaser.Keyboard.D)
                };
            this.cursor = wasd;
            this.fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
            this.pad = game.input.gamepad.pad2;
        }
};

Player.prototype.PrimaryAttack = function() {
    this.weapon = game.add.weapon(30, 'bullet'); //
    this.weapon.enableBody = true;
    this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    //this.weapon.bulletGravity.y =-1000;
    this.weapon.bulletSpeed = 1200;
    this.weapon.fireRate = 2000;
    this.weapon.trackSprite(this);
    this.weapon.damage = 10;
    this.shootSfx = this.pistolSfx;
    var AK47 = this.addChild(game.make.sprite(-35, -95, 'AK47'));
    AK47.scale.setTo(0.05, 0.05);


};

Player.prototype.SecondaryAttack = function() {

};


