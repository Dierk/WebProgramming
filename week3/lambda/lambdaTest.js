// requires lambda.js

(() => {


    const ok = [];
// id
    ok.push(id(1) === 1);
    ok.push(id(id) === id);

// konst
    ok.push(konst(42)(0) === 42);
    ok.push(konst(42)(1) === 42);
    ok.push(konst(42)(null) === 42);

// kite
    ok.push(konst(id)(null)(42) === 42);
    ok.push(KI(null)(42) === 42);

// flip, C

// true

// false

// not

// and

// or

// beq

// pair, V

// pair equal

// either

// maybe

// test result report
    if (ok.every(elem => elem)) {
        document.writeln("All " + ok.length + " tests ok.");
    } else {
        document.writeln("Not all tests ok! Details:");
        for (let i = 0; i < ok.length; i++) {
            if (ok[i]) {
                document.writeln("Test " + i + " ok");
            } else {
                document.writeln("Test " + i + " failed");
            }
        }
    }

})();