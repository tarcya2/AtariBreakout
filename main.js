let ball;
let paddle;
let bricks = [];
let rows = 4;
let cols =8;
let brickWidth = 60;
let brickHeight = 20;
let spacing = 5;
let score = 0;
let lives = 3;
let gameState = "serve";

function setup(){
    createCanvas(600, 600);
    ball = {
        x: width/2,
        y: height/2 +20,
        r: 10,
        vx: 0,
        vy: 0
    };

    paddle = {
        x: width/2,
        y: height -20,
        w: 100,
        h: 10
    };

    createBricks();
}

function draw(){
    background(0);

    fill(255);
    textSize(16);
    text("Score: " + score, 20, 20);

    text("Lives: " + lives, 20, 40);

    if(gameState === "serve"){
        textSize(18);
        text("Clique para lançar a bola", width/2 - 100, height/2);
        ball.x = width/2;
        ball.y = height - 36;
        ball.vx = 0;
        ball.vy = 0;
    }

    if(gameState === "play"){
        // Atualizar posição.
        ball.x += ball.vx;
        ball.y += ball.vy;

        // Colisão com paredes.
        if (ball.x - ball.r < 0 || ball.x + ball.r > width) ball.vx *= -1;
        if (ball.y - ball.r < 0 ) ball.vy *= -1;

        // Colisão com a raquete.
        if (ball.y + ball.r > paddle.y - paddle.h/2 && 
            ball.y + ball.r < paddle.y + paddle.h/2 &&
            ball.x > paddle.x - paddle.w/2 &&
            ball.x < paddle.x + paddle.w/2
        ){
            ball.vy *= -1;
            let diff = ball.x - paddle.x;
            ball.vx = diff * 0.1
        }

        // Colisão com os tijolos
        for (let i = bricks.length - 1; i >= 0; i-- ){
            let b = bricks[i];
            if (ball.x +  ball.r > b.x && ball.x - ball.r < b.x + b.w && ball.y + ball.r > b.y && ball.y - ball.r < b.y + b.h){
                ball.vy *= -1

                score += 5;
                bricks.splice(i, 1);
                break;
            }
        }

        // Se cair no fundo
        if (ball.y - ball.r > height) {
            lives--;
            if (lives > 0) {
                gameState = "serve";
            }   else {
                gameState = "over";
            }
        }
    }
    
    // Derrota
    if (gameState === "over"){
        textSize(24);
        text("Game Over!", width/2 - 70, height/2);
    }

    // Vitória
    if (bricks.length === 0 && gameState === "play") {
        textSize(24);
        text("Parabéns!! Você Venceu!", width/2 - 120, height/2);
        ball.vx = 0;
        ball.vy = 0;
        gameState = "end";
    }

     // Tijolos na tela
    for (let i = 0; i< bricks.length; i++){
        fill (bricks [i].color);
        rect(bricks[i].x, bricks[i].y, bricks[i].w, bricks[i].h);
    }

    ellipseMode(RADIUS);
    fill("white");
    ellipse(ball.x, ball.y, ball.r)

    rectMode(CENTER);
    fill("yellow");
    rect(paddle.x, paddle.y, paddle.w, paddle.h, 10);
    paddle.x = constrain(mouseX, paddle.w/2, width - paddle.w/2);

}

function mousePressed() {
    if(gameState === "serve"){
        ball.vx = random(-4, 4);
        ball.vy = -5;
        gameState = "play"
    }
    
}

// Cria os tijolos centralizados
function createBricks(){
    bricks = [];
    let totalWidth = cols * (brickWidth + spacing) - spacing;
    let startX = (width - totalWidth) - 15;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            bricks.push({
                x: startX + c * (brickWidth + spacing),
                y: 80 + r * brickHeight,
                w: brickWidth - spacing, 
                h: brickHeight - 5,
                color: [random(0,255), random(0,255), random(0,255)]
            });
        }
    }
}