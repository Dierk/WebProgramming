//  before start, snake is in start position
    document.writeln(snakeEquals(snake[0], {x: 10, y: 5}));

//  after one step, snake has moved up
    nextBoard();
    document.writeln(snakeEquals(snake[0], {x: 10, y: 4}));

//  before eating food, snake is of size 4
    document.writeln(snake.length === 4);

//  after eating food, snake has grown in size
    food = {x: 10, y: 3};
    nextBoard();
    document.writeln(snake.length === 5);

//  current direction is north
    document.writeln(direction === north);

//  when I go clockwise, I end up east
    changeDirection(clockwise);
    document.writeln(direction === east);

//  going counterclockwise, we end up north again
    changeDirection(countercw);
    document.writeln(direction === north);