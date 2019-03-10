// requires ../lambda/lambda.js


const north = Pair( 0)(-1);
const east  = Pair( 1)( 0);
const south = Pair( 0)( 1);
const west  = Pair(-1)( 0);

let direction = north;

const clockwise = [north, east, south, west, north];
const countercw = [north, west, south, east, north];

let snake = [
    Pair(10)(5),
    Pair(10)(6),
    Pair(10)(7),
    Pair(10)(8),
];
let food = Pair(15)(15);

// function snakeEquals(a, b) { return a.x === b.x && a.y === b.y }
const pairEq = a => b =>  undefined; // todo: your code here

// Pair + Pair = Pair        // Monoid
const pairPlus = a => b =>  undefined; // todo: your code here

// Function and Pair = Pair  // Functor
const pairMap = f => p =>  undefined; // todo: your code here


function changeDirection(orientation) {
    const idx = orientation.indexOf(direction);
    direction = orientation[idx + 1];
}

/**
 * when trying to get an element by id from the dom, the element might not be there
 * but in this case the application should not crash randomly
* @return Either ErrorMessage or HTMLElement
*/
function safeGetElementById(id) {
    let result = document.getElementById(id);
    return result === undefined; // todo: your code here
}

const log = s => console.log(s);

function start() {

    // todo: if safeGetElementById("canvas") yields an error message, log it. Otherwise startWithCanvas

}

const startWithCanvas = canvas => {

    const context = canvas.getContext("2d");

    const rightArrow = 39;
    const leftArrow  = 37;
    window.onkeydown = evt => {
        const orientation = (evt.keyCode === rightArrow) ? clockwise : countercw;
        changeDirection(orientation);
    };

    setInterval(() => {
        nextBoard();
        display(context);
    }, 1000 / 5);
};

const inBounds = max => x => {
    if (x < 0)   { return max - 1 }
    if (x > max) { return 0 }
    return x
};

function nextBoard() {
    const max = 20;
    const oldHead = snake[0];

    const newHead = undefined; // todo: your code here: old head plus direction
    const head    = undefined; // todo: your code here: new head put in bounds

    const pickRandom = () => Math.floor(Math.random() * max);
    if (true) {  // todo: have we found any food?
        food = Pair(pickRandom())(pickRandom());
    } else {
        snake.pop(); // no food found => no growth despite new head => remove last element
    }

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


