/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let temp = [
    [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ], [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ]

]

function init() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 80px sans-serif';
    let text = 'BLOCK BREAK';
    let textWidth = ctx.measureText(text).width;
    ctx.fillText(text, (canvas.width - textWidth) / 2, 300);

    ctx.fillRect(20, 20, 15, canvas.height);
    ctx.fillRect(canvas.width - 40, 20, 15, canvas.height);
    ctx.fillRect(20, 20, canvas.width - 45, 15);
    ctx.fillRect(80, 695, 120, 15);

    ctx.fillStyle = '#ddd';
    ctx.font = 'bold 40px sans-serif';
    text = 'PRESS SPACE!!';
    textWidth = ctx.measureText(text).width;
    ctx.fillText(text, (canvas.width - textWidth) / 2, 450);
}
init();

let PDx, PDy, PDw;
function start() {
    let x = 50, y = 80;
    for (let i = 0; i < temp[0].length; i++) {
        for (let j = 0; j < temp[0][i].length; j++) {
            blockAdd(x, y, temp[0][i][j]);
            x += 75;
        }
        x = 50, y += 40;
    }

    PDx = 80, PDy = 695, PDw = 120;

    ballAdd();
    main();
}



//===========================================
//                MAIN LOOP
//===========================================


function main() {
    let id = window.requestAnimationFrame(main);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#fff';
    ctx.fillRect(20, 20, 15, canvas.height);
    ctx.fillRect(canvas.width - 40, 20, 15, canvas.height);
    ctx.fillRect(20, 20, canvas.width - 45, 15);

    for (let i = 0; i < block_state.length; i++) {
        if (block_state[i].state == 1) {
            ctx.fillRect(block_state[i].x, block_state[i].y, block_state[i].w, block_state[i].h);
        }
    }

    //PADDLE
    if (PDx < 35) {
        PDx = 35;
    }
    if (PDx > canvas.width - 35 - PDw) {
        PDx = canvas.width - 35 - PDw;
    }
    ctx.fillRect(PDx, PDy, PDw, 15);


    for (let i = 0; i < ball.length; i++) {

        ball[i].x += ball[i].dx;
        ball[i].y += ball[i].dy;

        ctx.beginPath();
        ctx.arc(ball[i].x, ball[i].y, 12, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();

        for (let j = 0; j < block_state.length; j++) {
            if (block_state[j].state == 1) {
                res = collision(block_state[j].x, block_state[j].x + block_state[j].w, block_state[j].y, block_state[j].y + block_state[j].h, ball[i].x, ball[i].y, 12);
                if (res != false) {
                    block_state[j].state = 0;
                    if (res == 1) {
                        ball[i].dy *= -1;
                    } else {
                        ball[i].dx *= -1;
                    }
                    break;
                }
            } else {
                block_state.splice(j, 1);
            }
        }

        //当たり判定たち(ブロック以外)
        if (ball[i].y - 12 <= 35) {
            ball[i].dy *= -1;
        }
        if (ball[i].x + 12 >= canvas.width - 35 || ball[i].x - 12 <= 35) {
            ball[i].dx *= -1;
        }

        if (ball[i].y + 12 - PDy > 3 && ball[i].x + 12 >= PDx && ball[i].x - 12 <= PDx + PDw) {
            ball[i].dy = Math.abs(ball[i].dy) * -1;
            let half = PDw / 2;
            console.log(half);
            if (ball[i].x < PDx + half) {
                ball[i].dx = Math.abs(((half + 12) / 2) / (ball[i].x - (PDx - 12)) * ball[i].dy) * -1;
                console.log(ball[i].dx)
                if (ball[i].dx < ball[i].dy * 1.5) {
                    ball[i].dx = ball[i].dy * 1.5
                }
                console.log(ball[i].dx)
            } else {
                ball[i].dx = Math.abs((ball[i].x - (PDx + half)) / ((half + 12) / 2) * ball[i].dy);
                if (ball[i].dx > ball[i].dy * -1.5) {
                    ball[i].dx = ball[i].dy * -1.5
                }
            }
        }

        if (ball[i].y + 12 >= canvas.height) {
            ball.splice(i, 1);
        }
    }


    if (block_state.length == 0 || ball.length == 0) {
        window.cancelAnimationFrame(id);
        ball = [];
    }
}


function collision(L, R, T, B, x, y, radius) {
    if (L - radius > x || R + radius < x || T - radius > y || B + radius < y) {
        //矩形に円の半径分を足した範囲 
        return false;
    }
    if (L > x && T > y && !((L - x) * (L - x) + (T - y) * (T - y) < radius * radius)) {
        //左上の当たり判定 
        return false;
    }
    if (R < x && T > y && !((R - x) * (R - x) + (T - y) * (T - y) < radius * radius)) {
        //右上の当たり判定 
        return false;
    }
    if (L > x && B < y && !((L - x) * (L - x) + (B - y) * (B - y) < radius * radius)) {
        //左下の当たり判定 
        return false;
    }
    if (R < x && B < y && !((R - x) * (R - x) + (B - y) * (B - y) < radius * radius)) {
        //右下の当たり判定 
        return false;
    }

    if (x + 6 > L && x - 6 < R) {
        return 1;
    } else {
        return 2;
    }
}


document.addEventListener('keydown', keyDownHandler, false);

function keyDownHandler(e) {
    if (e.keyCode == 32) {
        start();
    }

    if (e.keyCode == 13) {
        ballAdd();
    }

    if (e.keyCode == 37 && PDx >= 35) {
        PDx -= 20;
        if (PDx < 35) {
            PDx = 35;
        }
    }
    if (e.keyCode == 39 && PDx <= canvas.width - 35 - PDw) {
        PDx += 20;
        if (PDx > canvas.width - 35) {
            PDx = canvas.width - 35;
        }
    }
}


//CLASSES

class Block {
    constructor(x, y, w, h, state) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.state = state;
    }
}

let block_state = [];
function blockAdd(fcx, fcy, fcstate) {
    let b_x = fcx;
    let b_y = fcy;
    let b_w = 65;
    let b_h = 30;
    let b_state = fcstate;

    let b = new Block(b_x, b_y, b_w, b_h, b_state);
    block_state.push(b);
}

class Ball {
    constructor(x, y, dx, dy) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
    }
}

let ball = [];
function ballAdd() {
    let ball_x = 60;
    let ball_y = 450;
    let ball_dx = 2;
    let ball_dy = 2;

    let b = new Ball(ball_x, ball_y, ball_dx, ball_dy);
    ball.push(b);
}