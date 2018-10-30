
// requires util.js


// extending the prototype of many objects
( () => {
    let ok = [];


    const collect = [];

    (10).times( n => collect.push(n) );

    ok.push(collect.length === 10);
    ok.push(collect[0] === 0);
    ok.push(collect[9] === 9);

    report("util-times", ok);
}) ();
