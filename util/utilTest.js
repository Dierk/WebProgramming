
// requires util.js

test("util-fake", assert => {
    const x = 1;
    assert.true(true);
    assert.is(x, 1);
});


// extending the prototype of many objects
test("util-times", assert => {

    const collect = [];

    (10).times( n => collect.push(n) );

    assert.is(collect.length, 10);
    assert.is(collect[0], 0);
    assert.is(collect[9], 9);

});
