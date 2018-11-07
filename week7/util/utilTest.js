// requires test.js
// requires util.js


// extending the prototype of many objects
test('util-times', ok => {
    const collect = [];

    (10).times( n => collect.push(n) );

    ok.is(collect.length , 10);
    ok.is(collect[0]     , 0);
    ok.is(collect[9]     , 9);

});

test('util-dummy', ok => {
    const a = 1;
    ok.push(a === 1);
});

