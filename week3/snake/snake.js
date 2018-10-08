
const max = 20;

const north = pair ( 0) (-1) ;
const east  = pair ( 1) ( 0) ;
const south = pair ( 0) ( 1) ;
const west  = pair (-1) ( 0) ;

let direction = north;

const clockwise = [north, east, south, west, north];
const countercw = [north, west, south, east, north];

let snake = [
    pair (10) (5),
    pair (10) (6),
    pair (10) (7),
    pair (10) (8),
];
let food = pair (15) (15);

function changeDirection(orientation) {
    const idx = orientation.indexOf(direction);
    direction = orientation[idx + 1];
}

function start() {
    const canvas  = document.getElementById("canvas");
    const context = canvas.getContext("2d");

    const rightArrow = 39;
    const leftArrow  = 37;
    window.onkeydown = evt => {
        const orientation = (evt.keyCode === rightArrow) ? clockwise : countercw;
        changeDirection(orientation);
    };
    run(context);
}

function run(context) {
    setTimeout(() => {
        nextBoard();
        display(context);
        run(context);
    }, 1000 / 5);
}


const wrap = x =>
    iff (x < 0)
        (max - 1)
        (iff (x >= max)
             (0)
             (x));

function nextBoard() {
    const oldHead = snake[0];

    const wrappedPlus = x => y => wrap(x + y);
    const head = pOp (wrappedPlus) (oldHead) (direction);  // monoid

    const randomPos = () => Math.floor(Math.random() * max);

    pEquals(food)(head)
        ( () => food = pMap (randomPos) (food) )           // functor
        ( () => snake.pop() )
    ();

    snake.unshift(head); // put head at front of the list
}

function display(context) {
    // clear
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);
    // draw all elements
    context.fillStyle = "cyan";
    snake.forEach(element =>
        fillBox(context, element)
    );
    // draw head
    context.fillStyle = "green";
    fillBox(context, snake[0]);
    // draw food
    context.fillStyle = "red";
    fillBox(context, food);
}

function fillBox(context, element) {
    context.fillRect(fst(element) * 20 + 1, snd(element) * 20 + 1, 18, 18);
}


