GameCtrl.Game = function (game) {

    //        When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;                //        a reference to the currently running game
    this.add;                //        used to add sprites, text, groups, etc
    this.camera;        //        a reference to the game camera
    this.cache;                //        the game cache
    this.input;                //        the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
    this.load;                //        for preloading assets
    this.math;                //        lots of useful common math operations
    this.sound;                //        the sound manager - add a sound, play one, set-up markers, etc
    this.stage;                //        the game stage
    this.time;                //        the clock
    this.tweens;        //        the tween manager
    this.world;                //        the game world
    this.particles;        //        the particle manager
    this.physics;        //        the physics manager
    this.rnd;                //        the repeatable random number generator

    //        You can use any of these from any function within this State.
    //        But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.

};

GameCtrl.Game.prototype = {


    create: function() {

        this.firesound = this.add.audio('fire')
        this.explosionsound = this.add.audio('explosion')
        this.whiz = this.add.audio('whiz')
        this.music = this.add.audio('gameMusic');
        this.playMusic(this.music)

        this.music.play();
        var scalebg = window.innerHeight/this.game.cache.getImage('background').height ;
        this.bgtile = this.game.add.tileSprite(0, 0, this.game.width, this.game.cache.getImage('background').height, 'background');
        this.bgtile.scale.set(scalebg,scalebg)
        this.SHOT_DELAY = 200; // milliseconds (10 bullets/second)
        this.SHOT_TYPE = 1;
        this.BULLET_SPEED = 500
        this.BULLET_SPEEDS = [{x : this.BULLET_SPEED, y:0}]; // pixels/second
        this.NUMBER_OF_BULLETS = 20;
        this.maxEnemies = 10
        this.bulletPool = this.game.add.group();
        this.rectGroup = this.game.add.group();
        this.powerUpGroup = this.game.add.group();

        for(var i = 0; i < this.NUMBER_OF_BULLETS; i++) {
            var bullet = this.game.add.sprite(0, 0, 'bullet');
            bullet.animations.add('idle',[39]);
            bullet.animations.play('idle', 7, true);
            this.game.physics.enable(bullet, Phaser.Physics.ARCADE);
            this.bulletPool.add(bullet);
            bullet.kill()
        }
        //for(var i = 0; i < this.maxEnemies; i++) {
        //    var sprite = this.game.add.sprite(this.game.stage.width, this.randomNumber(0,this.game.stage.height), 'bullet');
        //    sprite.animations.add('idle',[this.randomNumber(2,5)]);
        //    sprite.animations.play('idle', 7, true);
        //    this.game.physics.enable(sprite, Phaser.Physics.ARCADE);
        //    this.rectGroup.add(sprite);
        //    sprite.kill();
        //}


        this.interval = 100;
        this.powerUpInterval = 300;
        //this.background1 = this.game.add.image(0, 0, 'game_background');
        //this.background2 = this.game.add.image(this.background1.width, 0, 'game_background');

        if(!this.game.choice)this.game.choice =7
        this.game.stage.backgroundColor = '#333555';
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.player = this.add.sprite(100,100,'player');
        this.player.life = 10;
        this.player.anchor.set(0.5,0.5)
        this.player.animations.add('idle',[this.game.choice]);
        this.player.animations.add('up',[this.game.choice-6]);
        this.player.animations.add('down',[this.game.choice+6]);
        this.player.animations.play('idle', 7, true);
        this.player.scale.set(2,2)
        this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.player.body.collideWorldBounds = true;


        //this.game.physics.enable(this.rectGroup, Phaser.Physics.ARCADE);
        this.multiplier=1;
        this.time = 0;
        this.brickTime=0;
        this.killCount=0;
        this.renderText();
        this.state=1;
        this.i=0;
        this.baseTime=100;
        this.levelTime=1;
        this.explosionGroup = this.game.add.group();
    },

    update: function () {
        this.bgtile.tilePosition.x -= 1;
        if(this.player.body.velocity.y>50){
            this.player.animations.play('down', 1, true);
        }else if(this.player.body.velocity.y<-50){
            this.player.animations.play('up', 7, true);
        }else{
            this.player.animations.play('idle', 7, true);
        }


        if (this.state == 1) {
            this.player.tint = 0xffffff
            this.time++
            if(this.collisionTime==this.time){
                this.playerAlreadyCollided=false
            }
            this.brickTime++
            this.renderText();
            if(this.time > this.levelTime && this.interval>4){
                this.interval-=2;
                this.levelTime = this.time + this.baseTime;
            }
            if(this.time % this.interval == 0 && this.rectGroup.children.length < this.maxEnemies){
                var enemiesNumber = Math.round(this.time/100)
                if(enemiesNumber>this.maxEnemies)
                    enemiesNumber = this.maxEnemies
                this.createRect(enemiesNumber);
            }
            if(this.time % this.powerUpInterval == 0){
                this.createPowerUp();
            }


            this.powerUpGroup.forEach(function (item) {
                if (item.x < 0 - item.width || item.x > this.game.width || item.y < 0 || item.y>this.game.height) {
                    item.destroy()
                    this.rectGroup.remove(item)
                }
            },this);
            this.rectGroup.forEach(function (item) {
                item.tint = 0xffffff

                if (item.x < 0 - item.width || item.x > this.game.width || item.y < 0 || item.y>this.game.height) {
                    item.destroy()
                    this.rectGroup.remove(item)
                }

            },this)
            if (this.game.input.activePointer.isDown) {
                this.fireBullet();
                this.game.physics.arcade.moveToPointer(this.player, 60, this.game.input.activePointer, 500);
            }
            this.game.physics.arcade.collide(this.rectGroup, this.player, this.playerCollision, null, this);
            this.game.physics.arcade.collide(this.powerUpGroup, this.player, this.playerPowerUp, null, this);
            this.game.physics.arcade.collide(this.rectGroup, this.bulletPool,this.collideBullet, null,this);
        }


        if (this.player.x < 0
            //|| this.player.y > this.game.height  || this.player.y<0
            || this.player.life<=0) {
            this.music.stop()
            this.state = 0;
            this.score = this.killCount /  (this.time / 100);


            if(!this.over){
                document.getElementById('high').style.display = 'none';
                document.getElementById('over').style.display = 'block';
                this.over=true;
            }
            document.getElementById('score').innerHTML = 'Kills: ' + this.killCount + '<br> Time: ' + this.time/100 + 's<br>Total Score: ' + this.score.toFixed(2);
            document.getElementById('gameOver').style.display = 'block';

            if(!this.setScore){
                this.setScore=true
                document.getElementById('highscore').innerHTML=''
                ref = new Firebase("https://airfighter.firebaseio.com/scores");
                var highscore =[];
                ref.orderByChild("score").limitToLast(8).on("child_added", function(snapshot) {
                    console.log(snapshot.val())
                    if(snapshot.val().name !=''){
                        var node = document.createElement("LI");                 // Create a <li> node
                        var textnode = document.createTextNode(snapshot.val().name + ' : ' + snapshot.val().score);
                        node.appendChild(textnode)
                        document.getElementById('highscore').appendChild(node)
                    }

                });


            }


            if (!this.alreadyHas) {


                document.getElementById('playAgain').addEventListener('click', function (e) {
                    document.getElementById('gameOver').style.display = 'none';
                    this.setScore=false
                    this.game.state.start('Game');

                }.bind(this));

                document.getElementById('quit').addEventListener('click', function (e) {
                    document.getElementById('gameOver').style.display = 'none';
                    this.setScore=false
                    this.game.state.start('MainMenu');

                }.bind(this));

                document.getElementById('playAgain2').addEventListener('click', function (e) {
                    document.getElementById('gameOver').style.display = 'none';
                    this.over=false;
                    this.setScore=false
                    this.game.state.start('Game');

                }.bind(this));

                document.getElementById('submitBtn').addEventListener('click', function (e) {
                    e.preventDefault();

                    var scoreRef = new Firebase("https://airfighter.firebaseio.com/scores");
                    var name = (document.getElementById('name').value=='')?'anonymous':document.getElementById('name').value
                    scoreRef.push({
                        name: name,
                        score: this.score.toFixed(2)
                    });



                    document.getElementById('high').style.display = 'block';
                    document.getElementById('over').style.display = 'none';
                    this.setScore=false
                    this.game.state.start('Game');

                }.bind(this));

                this.alreadyHas = true;
            }

        }
    },

    playSFX: function (sound){
        if(this.game.global.volumeSFX > 0){
            sound.play('',0,this.game.global.volumeSFX);
        }
    },

    playMusic: function(music){
        if(this.game.global.volumeMusic > 0){
            music.play('',1,this.game.global.volumeMusic,true);
        }
    },
        //this.moveBackground(this.background1);
        //this.moveBackground(this.background2);
        //        Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!

    renderText: function(){
        if(this.text) this.text.destroy();
        if(this.text2) this.text2.destroy();
        if(this.text3) this.text3.destroy();

        var style = { font: "bold 15px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
        this.text = this.game.add.text(10,10,'Time: ' + this.time / 100, style);
        this.text2 = this.game.add.text(this.game.width - 80,10,'Life: ' + this.player.life, style);
        this.text3 = this.game.add.text(this.game.width/2,10,'Kills: ' + this.killCount, style);
        this.text3.anchor.setTo(0.5,0)
    },
    playerPowerUp: function(p,e){

        if(e.powerUpType.type == 'lifePU'){
            this.player.life += e.powerUpType.value
        }else if(e.powerUpType.type == 'ammoPU'){
            this.SHOT_DELAY = this.SHOT_DELAY -  e.powerUpType.value
            if(this.SHOT_DELAY<=10){
                this.BULLET_SPEEDS.push({
                    x : (this.randomNumber(0,10)%2==0) ? this.BULLET_SPEED : -this.BULLET_SPEED,
                    y : (this.randomNumber(0,10)%2==0) ? this.randomNumber(100,500) : -this.randomNumber(100,1000)
                })
                this.SHOT_DELAY = 100
                this.SHOT_TYPE++
            }
        }
        e.kill()
        this.powerUpGroup.remove(e)
    },
    playerCollision: function(p,e){
        if(this.playerAlreadyCollided) return
        p.life--;
        this.collisionTime=this.time+200;
        e.life--;
        if(p.life<=0 || e.life<=0){
            this.getExplosion(p.x, p.y)
            if(p.life<=0){ p.kill(); }
            if(e.life<=0){
                this.killCount++
                e.kill();
                this.rectGroup.remove(e)
            }

        }else{
            e.tint=0xff0000
            p.tint=0xff0000
        }
    },
    createRect: function(n){
        var h = this.randomNumber(0,this.game.height)
        for(i=0;i<n;i++){
            var sprite = this.rectGroup.getFirstDead();
            if (sprite === null || sprite === undefined){
                var sprite = this.game.add.sprite(this.game.width, this.randomNumber(0,this.game.stage.height), 'bullet');
                sprite.animations.add('idle',[this.randomNumber(2,6)]);
                sprite.animations.play('idle', 7, true);
                this.game.physics.enable(sprite, Phaser.Physics.ARCADE);
                this.rectGroup.add(sprite);
            }
            sprite.body.x=this.game.width;
            sprite.revive();
            sprite.body.y=h;
            if(this.brickTime/500>3){
                 this.multiplier++
                this.brickTime=0
            }
            sprite.body.velocity.x= -(this.randomNumber(60,300))
            sprite.body.allowGravity = false
            sprite.body.immovable = true;
            sprite.life=this.randomNumber(1,this.SHOT_TYPE * this.multiplier);
            sprite.checkWorldBounds = true;
            sprite.outOfBoundsKill = true;
        }
    },
    createPowerUp: function(){
        var h = this.randomNumber(0,this.game.height)
        var sprite = this.powerUpGroup.getFirstDead();
        if (sprite === null || sprite === undefined){
            var type = (this.randomNumber(0,10)%2==0 || this.player.life<5) ? {value : 1, type : 'lifePU'} : {value : this.randomNumber(30,70), type:'ammoPU'};
            var sprite = this.game.add.sprite(this.game.width - 50, this.randomNumber(0,this.game.stage.height), type.type);
            sprite.powerUpType = {type : type.type , value: type.value}
            this.game.physics.enable(sprite, Phaser.Physics.ARCADE);
            this.powerUpGroup.add(sprite);
        }


        sprite.revive();
        sprite.body.x=this.game.width-1;
        sprite.body.y=h;
        sprite.body.velocity.x=-(this.randomNumber(50,300))
        sprite.body.allowGravity = false


        sprite.checkWorldBounds = true;
        sprite.outOfBoundsKill = true;

    },

    fireBullet:function(){
        if (this.lastBulletShotAt === undefined) this.lastBulletShotAt = 0;
        if (this.game.time.now - this.lastBulletShotAt < this.SHOT_DELAY) return;
        this.lastBulletShotAt = this.game.time.now;

        // Get a dead bullet from the pool
        var b = [];

        for(i=0;i<this.SHOT_TYPE;i++){
            var bullet2 = {};
            bullet2.xspeed = this.BULLET_SPEEDS[i].x
            bullet2.yspeed = this.BULLET_SPEEDS[i].y
            b.push(bullet2)
        }

        b.forEach(function(bu){
            var sprite = this.bulletPool.getFirstDead();
            if (sprite === null || sprite === undefined){
                var sprite = this.game.add.sprite(this.player.x, this.player.y, 'bullet');
                sprite.animations.add('idle',[39]);
                sprite.animations.play('idle', 7, true);
                this.game.physics.enable(sprite, Phaser.Physics.ARCADE);
                this.bulletPool.add(sprite);
            }
            sprite.checkWorldBounds = true;
            sprite.outOfBoundsKill = true;
            sprite.revive()
            sprite.x = this.player.x
            sprite.y = this.player.y
            sprite.revive(this.player.x,this.player.y)
            // Set the bullet position to the gun position.

            // Shoot it
            sprite.body.velocity.x = bu.xspeed;
            sprite.body.velocity.y = bu.yspeed;
        },this)


        this.playSFX(this.firesound)
    },
    quitGame: function (pointer) {

        //        Here you should destroy anything you no longer need.
        //        Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //        Then let's go back to the main menu.
        this.game.state.start('MainMenu');

    },
    randomNumber: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    getExplosion: function(x, y) {
        // Get the first dead explosion from the explosionGroup
        var explosion = this.explosionGroup.getFirstDead();

        // If there aren't any available, create a new one
        if (explosion === null) {
            explosion = this.game.add.sprite(0, 0, 'explosion');
            explosion.anchor.setTo(0.5, 0.5);

            // Add an animation for the explosion that kills the sprite when the
            // animation is complete
            var animation = explosion.animations.add('boom');
            animation.killOnComplete = true;

            // Add the explosion sprite to the group
            this.explosionGroup.add(explosion);
        }

        // Revive the explosion (set it's alive property to true)
        // You can also define a onRevived event handler in your explosion objects
        // to do stuff when they are revived.
        explosion.revive();

        // Move the explosion to the given coordinates
        explosion.x = x;
        explosion.y = y;

        // Set rotation of the explosion at random for a little variety
        explosion.angle = this.game.rnd.integerInRange(0, 360);

        // Play the animation
        explosion.animations.play('boom');
        this.playSFX(this.explosionsound)
        // Return the explosion itself in case we want to do anything else with it
        return explosion;
    },
    collideBullet:function(r,b){

        r.life--;
        if(r.life<=0){
            this.getExplosion(r.x, r.y)
            r.kill();
            this.rectGroup.remove(r)
            this.killCount++
        }else{
            this.playSFX(this.whiz)
            r.tint=0xff0000
        }
        b.kill();

    }
};
