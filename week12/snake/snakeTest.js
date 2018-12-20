
import {snake, direction, north, east, pair, pairEq, changeDirection, clockwise, countercw, nextBoard, food, setFood } from "./snake.js"

import { Suite } from "../test/test.js"

const snakeSuite = Suite("snake");

snakeSuite.add("move", assert => {

//  before start, snake is in start position
    const val = pairEq(snake[0]) (pair (10) (5) );
    assert.true( val );

//  after one step, snake has moved up
    nextBoard();
    assert.true(pairEq(snake[0]) (pair (10) (4) ));

//  before eating food, snake is of size 4
    assert.is(snake.length , 4);

//  after eating food, snake has grown in size
    setFood (10) (3);
    nextBoard();
    assert.is(snake.length , 5);

//  current direction is north
    assert.is(direction , north);

//  when I go clockwise, I end up east
    changeDirection(clockwise);
    assert.is(direction , east);

//  going counterclockwise, we end up north again
    changeDirection(countercw);
    assert.is(direction , north);

});

snakeSuite.run();