var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;
var backgroundImg
var score = 0;
var jumpSound, collidedSound;

var gameOver, restart;


function preload() {
    jumpSound = loadSound("jump.wav")
    collidedSound = loadSound("collided.wav")

    backgroundImg = loadImage("backgroundImg.png")


    trex_running = loadAnimation("trex.png");
    //trex_collided = loadAnimation("trex_collided.png");

    groundImage = loadImage("ground.png");

    cloudImage = loadImage("cloud.png");

    obstacle1 = loadImage("obstacle1.png");
    obstacle2 = loadImage("obstacle2.png");
    obstacle3 = loadImage("obstacle3.png");
    obstacle4 = loadImage("obstacle4.png");

    gameOverImg = loadImage("gameOver.png");
    restartImg = loadImage("restart.png");
}

function setup() {
    createCanvas(500, 500);



    trex = createSprite(200, 200 - 100, 100, 100);


    trex.addAnimation("running", trex_running);
    //trex.addAnimation("collided", trex_collided);
    trex.setCollider('circle', 0, 0, 350)
    trex.scale = 0.08;

    invisibleGround = createSprite(width / 2, height - 10, width, 125);
    invisibleGround.shapeColor = "#f4cbaa";

    ground = createSprite(width / 2, height, width, 2);
    ground.addImage("ground", groundImage);
    ground.x = width / 2
    ground.velocityX = -(6 + 3 * score / 100);

    gameOver = createSprite(width / 2, height / 2 - 50);
    gameOver.addImage(gameOverImg);

    restart = createSprite(width / 2, height / 2);
    restart.addImage(restartImg);

    gameOver.scale = 0.7;
    restart.scale = 0.6;

    gameOver.visible = false;
    restart.visible = false;


    // invisibleGround.visible =false

    cloudsGroup = new Group();
    obstaclesGroup = new Group();

    score = 0;
}

function draw() {
    //trex.debug = true;
    background(backgroundImg);
    textSize(20);
    fill("black")
    text("Score: " + score, 30, 50);


    if (gameState === PLAY) {
        
        score = score + Math.round(getFrameRate() / 60);
        ground.velocityX = -(6 + 3 * score / 100);

        if (keyDown("space")) {
            trex.velocityY = -5

        }
        

        trex.velocityY = trex.velocityY + 0.8

        if (ground.x < 0) {
            ground.x = ground.width / 2;
        }

        trex.collide(invisibleGround);
        spawnClouds();
        spawnObstacles();

        if (obstaclesGroup.isTouching(trex) || ground.isTouching(trex) || trex.y <10) {
            collidedSound.play()
            gameState = END;
        }
    }
    else if (gameState === END) {
        gameOver.visible = true;
        restart.visible = true;

        //set velcity of each game object to 0
        ground.velocityX = 0;
        trex.velocityY = 0;
        obstaclesGroup.setVelocityXEach(0);
        cloudsGroup.setVelocityXEach(0);

        //change the trex animation


        //set lifetime of the game objects so that they are never destroyed
        obstaclesGroup.setLifetimeEach(-1);
        cloudsGroup.setLifetimeEach(-1);

        if ( mousePressedOver(restart)) {
            reset();
          
        }
    }


    drawSprites();
}

function spawnClouds() {
    //write code here to spawn the clouds
    if (frameCount % 60 === 0) {
        var cloud = createSprite(width + 20, height - 300, 40, 10);
        cloud.y = Math.round(random(100, 220));
        cloud.addImage(cloudImage);
        cloud.scale = 0.5;
        cloud.velocityX = -3;

        //assign lifetime to the variable
        cloud.lifetime = 300;

        //adjust the depth
        cloud.depth = trex.depth;
        trex.depth = trex.depth + 1;

        //add each cloud to the group
        cloudsGroup.add(cloud);
    }

}

function spawnObstacles() {
    if (frameCount % 30 === 0) {
      
        var rand2 = Math.round(random(10,  300));
        var obstacle = createSprite(width+10, rand2, 40, 10);
        obstacle.setCollider('circle', 0, 0, 50)
        // obstacle.debug = false

        obstacle.velocityX = -(6 + 3 * score / 100);

        //generate random obstacles
        var rand = Math.round(random(1,  3));
        switch (rand) {
            case 1: obstacle.addImage(obstacle1);obstacle.scale = 0.05;
                break;
            case 2: obstacle.addImage(obstacle2);obstacle.scale = 0.05;
                break;
            case 3: obstacle.addImage(obstacle3);obstacle.scale = 0.05;
                break;
            default: break;
        }

        //assign scale and lifetime to the obstacle           
        obstacle.lifetime = 300;
        obstacle.depth = trex.depth;
        trex.depth += 1;
        obstacle.debug = false;
        //add each obstacle to the group
        obstaclesGroup.add(obstacle);
    }
}

function reset() {
    gameState = PLAY;
    gameOver.visible = false;
    restart.visible = false;

    obstaclesGroup.destroyEach();
    cloudsGroup.destroyEach();

    trex.changeAnimation("running", trex_running);
    trex.y = 10;
    score = 0;

}




