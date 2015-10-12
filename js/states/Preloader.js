GameCtrl.Preloader = function (game) {

	this.background = null;
	this.preloadBar = null;

	this.ready = false;

};

GameCtrl.Preloader.prototype = {

	preload: function () {

		this.game.global = {}
		//	These are the assets we loaded in Boot.js
		//	A nice sparkly background and a loading progress bar		
		this.game.stage.backgroundColor = '#333555';
		this.preloadBar = this.add.sprite(this.game.width / 2 - 250, this.game.height / 2 - 70, 'preloaderBar');

		//	This sets the preloadBar sprite as a loader sprite.
		//	What that does is automatically crop the sprite from 0 to full-width
		//	as the files below are loaded in.
		this.load.setPreloadSprite(this.preloadBar);
		this.base_url = "http://geekmesh.com/applications/airfighter/"
		//	Here we load the rest of the assets our game needs.		
		this.load.image('background','assets/images/background.png');
		this.load.image('game_background', 'assets/images/game_background.png');
		this.load.image('playButton', 'assets/images/play_button.png');
		this.load.image('lifePU', 'assets/images/life.png');
		this.load.image('ammoPU', 'assets/images/ammoPU.png');
		//this.load.image('player','assets/images/ssheet.png');
		this.load.spritesheet('player', 'assets/images/ssheet.png', 35, 24,66 );
		this.load.spritesheet('bullet','assets/images/sprites.png',32,32,64);
		this.load.spritesheet('explosion','assets/images/explosion.png',93,100);

		//  This is how you load an atlas
		//this.load.atlas('playButton', 'assets/images/play_button.png', 'assets/images/play_button.json');

		this.load.audio('titleMusic', ['assets/audio/main_menu.mp3']);
		this.load.audio('gameMusic', ['assets/audio/ingame.mp3']);
		this.load.audio('fire', ['assets/audio/blast.mp3']);
		this.load.audio('whiz', ['assets/audio/whiz.mp3']);
		this.load.audio('explosion', ['assets/audio/explosion.mp3']);

		//  This is how you load fonts
		//this.load.bitmapFont('caslon', 'assets/fonts/caslon.png', 'assets/fonts/caslon.xml');

		//	+ lots of other required assets here

	},

	create: function () {

		//	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
		this.preloadBar.cropEnabled = false;

	},

	update: function () {

		//	You don't actually need to do this, but I find it gives a much smoother game experience.
		//	Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
		//	You can jump right into the menu if you want and still play the music, but you'll have a few
		//	seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
		//	it's best to wait for it to decode here first, then carry on.
		
		//	If you don't have any music in your game then put the game.state.start line into the create function and delete
		//	the update function completely.
		
		if (this.cache.isSoundDecoded('titleMusic') && this.ready == false)
		{
			this.ready = true;
			this.game.state.start('MainMenu');
		}

	}

};
