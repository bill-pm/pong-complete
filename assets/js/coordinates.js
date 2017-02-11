var coordState = {
    
    preload: function() { 
        game.stage.backgroundColor = '#FFA07A';
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
    },
    
    
    create: function() {
        this.coordinatesText = game.add.text(190, 130, "0", { font: "40px Bluberry Regular", fill: "#ffffff" });
        this.coordinatesText.setShadow(-2, 2, 'rgba(0,0,0,1)', 0);
    },
    
    
    update: function() {
        this.coordinatesText.text = "x = " + game.input.mousePointer.x + "\n" + "y = " + game.input.mousePointer.y;
    }

};