// requires test.js
// requires util.js


// extending the prototype of many objects
test('util-times', ok => {
    const collect = [];

    (10).times( n => collect.push(n) );

    ok.push(collect.length === 10);
    ok.push(collect[0] === 0);
    ok.push(collect[9] === 9);

});

test('util-dummy', ok => {
    const a = 1;
    ok.push(a === 1);
});

