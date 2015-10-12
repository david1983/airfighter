GameCtrl.MainMenu = function (game) {

        this.music = null;
        this.playButton = null;

};

GameCtrl.MainMenu.prototype = {

        create: function () {
                this.game.global.volumeMusic = 0.5;
                this.game.global.volumeSFX = 1;

                //        We've already preloaded our assets, so let's kick right into the Main Menu itself.
                //        Here all we're doing is playing some music and adding a picture and button
                //        Naturally I expect you to do something significantly better :)

                this.music = this.add.audio('titleMusic');
                this.music.play();


                this.game.stage.backgroundColor = '#333555';

                var style = { font: "bold 40px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
                this.text = this.game.add.text(this.game.width/2,this.game.height/2-20,'Air Fighter',style);
                this.text.anchor.setTo(0.5,0.5)
                var style = { font: "bold 16px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
                this.text = this.game.add.text(this.game.width/2,this.game.height/2+20,'CHOOSE YOUR PLANE',style);
                this.text.anchor.setTo(0.5,0.5)

                this.scale = 3
                this.choices = this.game.add.group()
                this.sprite1 = this.game.add.sprite(this.game.width/4,this.game.height/4,'player',6)
                this.sprite1.anchor.setTo(0.5,0.5)
                this.sprite1.choice=6
                this.sprite1.scale.set(this.scale,this.scale)
                this.choices.add(this.sprite1)

                this.sprite2 = this.game.add.sprite( (this.game.width/4)*3 ,this.game.height/4,'player',7)
                this.sprite2.anchor.setTo(0.5,0.5)
                this.sprite2.choice=7
                this.sprite2.scale.set(this.scale,this.scale)
                this.choices.add(this.sprite2)

                this.sprite3 = this.game.add.sprite(this.game.width/4,(this.game.height/4)*3,'player',8)
                this.sprite3.anchor.setTo(0.5,0.5)
                this.sprite3.choice=8
                this.sprite3.scale.set(this.scale,this.scale)
                this.choices.add(this.sprite3)

                this.sprite4 = this.game.add.sprite((this.game.width/4)*3,(this.game.height/4)*3,'player',9)
                this.sprite4.anchor.setTo(0.5,0.5)
                this.sprite4.choice=9
                this.sprite4.scale.set(this.scale,this.scale)
                this.choices.add(this.sprite4)

                this.choices.forEach(function(i){
                        i.inputEnabled = true;
                        i.events.onInputDown.add(function(){
                                this.game.choice = i.choice;
                                this.startGame()
                        }, this);
                }.bind(this))

        },

        update: function () {

                //        Do some nice funky main menu effect here

        },

        startGame: function (pointer) {

                //        Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
                this.music.stop();

                //        And start the actual game
                this.game.state.start('Game');

        }

};