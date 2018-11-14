// requires test.js
// requires util.js


// extending the prototype of many objects
test('util-times', assert => {
    const collect = [];

    (10).times( n => collect.push(n) );

    assert.is(collect.length , 10);
    assert.is(collect[0]     , 0);
    assert.is(collect[9]     , 9);

});

test('util-dummy', assert => {
    const a = 1;
    assert.true(a === 1);
});

