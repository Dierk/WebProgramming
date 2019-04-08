// requires util.js

// extending the prototype of many objects
test("util-times1", assert => {

    const collect = [];

    (10).times( n => collect.push(n) );

    assert.equals(collect.length ,  10);
    assert.equals(collect[0]     ,   0);
    assert.equals(collect[9]     ,   9);

    // if we only had an array-equals ... *sigh*

}) ;


( () => {
    let ok = [];

    const collect = (10).times( n => n+1 );

    ok.push(collect.length === 10);
    ok.push(collect[0] === 1);
    ok.push(collect[9] === 10);

    report("util-times2", ok);
}) ();
