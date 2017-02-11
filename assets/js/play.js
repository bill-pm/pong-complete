var initialBallVelocity = 350;
var ballVelocity = initialBallVelocity;
var paddleVelocity = 500;
var p1Score = 0;
var p2Score = 0;
var playTo = 5;

var playState = {
    winner: false,
    
    preload: function() { 
        game.stage.backgroundColor = '#F08080';
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        
        // Load ball and paddle graphics
        game.load.image('ball', 'assets/images/ball.png');
        game.load.image('paddle', 'assets/images/paddle.png');
    },
    
    
    create: function() {
        // Start Phaser's arcade physics
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        // Add the ball to the stage and enable physics on it
        this.ball = game.add.sprite(20, 20, 'ball');
        game.physics.arcade.enable(this.ball, Phaser.Physics.ARCADE);
        
        // Make the ball collide with the stage borders
        this.ball.checkWorldBounds = true;
        this.ball.body.collideWorldBounds = true;
        this.ball.body.bounce.set(1);
        this.ball.events.onOutOfBounds.add(this.score, this);
        
        // Turn collisions off for the left and right of the stage
        game.physics.arcade.checkCollision.left = false;
        game.physics.arcade.checkCollision.right = false;
        
        // Create paddles group
        this.paddles = game.add.group();
        this.paddles.enableBody = true;
        this.paddles.physicsBodyType = Phaser.Physics.ARCADE;
        
        // Add p1 paddle and enable physics on it
        this.p1 = game.add.sprite(10, 10, 'paddle');
        this.paddles.add(this.p1);
        
        // Add p2 paddle and enable physics on it
        this.p2 = game.add.sprite(480, 10, 'paddle');
        this.paddles.add(this.p2);
        
        //  Make both paddles conform to
        this.paddles.setAll('checkWorldBounds', true);
        this.paddles.setAll('body.collideWorldBounds', true);
        
        // Add input controllers
        this.p1up = game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.p1down = game.input.keyboard.addKey(Phaser.Keyboard.Z);
        this.p2up = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.p2down = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        
        // Add score textboxes
        this.p1Score = game.add.text(25, 10, "0", { font: "30px Bluberry Regular", fill: "#ffffff" });
        this.p1Score.setShadow(-2, 2, 'rgba(0,0,0,1)', 0);
        
        this.p2Score = game.add.text(455, 10, "0", { font: "30px Bluberry Regular", fill: "#ffffff" });
        this.p2Score.setShadow(-2, 2, 'rgba(0,0,0,1)', 0);
        
        // Make the game go faster with time
        this.timer = game.time.events.loop(1000, this.increaseBallVelocity, this);
        
        // Start the ball
        var startAngle = this.getRandomNumber('right');
        game.physics.arcade.velocityFromAngle(startAngle, ballVelocity, this.ball.body.velocity);
    },
    
    update: function() {
        // Move the paddles
        this.moveP1();
        this.moveP2();
        
        // Check for paddle/ball collisions
        game.physics.arcade.overlap(this.ball, this.paddles, this.block, null, this);
    },
    
    block: function (){
        var returnAngle;
        /*
            if the ball's x value is > 250 (which is half of the stage width)
            then it was blocked by the right paddle and must be sent left,
            otherwise it was blocked by left paddle and must be sent left
        */
        if (this.ball.x > 250) {
            returnAngle = this.getRandomNumber('left');
        } else {
            returnAngle = this.getRandomNumber('right');
        }
        
        // Send it flying!
        game.physics.arcade.velocityFromAngle(returnAngle, ballVelocity, this.ball.body.velocity);  
    },
    
    moveP1: function() {
        // move the paddle
        if (this.p1up.isDown) {
            // up
            this.p1.body.velocity.y = -(paddleVelocity);
        } else if (this.p1down.isDown) {
            // down
            this.p1.body.velocity.y = paddleVelocity;
        } else {
            // not at all
            this.p1.body.velocity.y = 0;
        }
    },
    
    moveP2: function() {
        // moves the paddle
        if (this.p2up.isDown) {
            // up
            this.p2.body.velocity.y = -paddleVelocity;
        } else if (this.p2down.isDown) {
            // down
            this.p2.body.velocity.y = paddleVelocity;
        } else {
            // not at all
            this.p2.body.velocity.y = 0;
        }
    },
    
    /**
     *  Generates random number
     */
    
    getRandomNumber: function(direction) {
        var rand;
        
        // For balls going left
        if (direction == 'left') {
            // +- 145-179
            rand = Math.floor(Math.random()*(179-140)+140);
            rand *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
        }
        
        // For balls going right
        if (direction == 'right') {
            // +- 30-45
            rand = Math.floor(Math.random()*(45-30)+30);
            rand *= Math.floor(Math.random()*2) == 1 ? 1: -1;
        }
        
        return rand;
    },
    
    
    score: function() {
        // Add the scores up
        if (this.ball.x < 0) {
            p2Score++;
            this.p2Score.text = p2Score;
        } else {
            p1Score++;
            this.p1Score.text = p1Score;
        }
        
        // reset the ball velocity
        ballVelocity = initialBallVelocity;
        
        // Check for a winner
        if (p1Score == playTo || p2Score == playTo) {
            // game over, somebody won
            this.winner = (p1Score > p2Score) ? "one" : "two"; // set a String
            
            // reset scores
            p1Score = p2Score = 0;
            
            // load main menu
            game.state.start('mainMenu');
            
        } else {
            // No winner yet
            // Set a new start angle
            var startAngle = (this.ball.x < 0) ? 140 : 45;
            
            // Start the ball on the appropriate side
            this.ball.x = (this.ball.x < 0) ? 480 : 0;
            this.ball.y = 0; // at the appropriate height
            
            // Get the ball going!
            game.physics.arcade.velocityFromAngle(startAngle, initialBallVelocity, this.ball.body.velocity);
        }
        
        
    },
    
    increaseBallVelocity: function() {
        ballVelocity += 25;
        paddleVelocity += 5;
    }
};