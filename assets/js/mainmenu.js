var mainMenuState = {
    
    preload: function() { 
        game.load.spritesheet('startBtn', 'assets/images/start_btn.png', 193, 71);
        
        game.stage.backgroundColor = '#FFA07A';
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
    },
    
    
    create: function() {
        if (playState.winner) {
            this.endText = game.add.text(140, 110, "Player " + playState.winner + " wins!", { font: "30px Bluberry Regular", fill: "#ffffff" });
            
            this.endText.setShadow(-2, 2, 'rgba(0,0,0,1)', 0);
        }
        
        this.startBtn = game.add.button(game.world.centerX - 95, 150, 'startBtn', this.startGame, this, 2, 1, 0);
        
        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.startGame, this);
    },
    
    
    update: function() {
        
    },
    
    startGame: function() {
       game.state.start('play');
    }

};