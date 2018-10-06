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

    ok.push( flip (konst) (1) (0)  === konst (0) (1) );
    ok.push( flip (KI)    (1) (0)  === KI    (0) (1) );

// true

    ok.push ( T (1) (0) === 1 );

// false

    ok.push( F (1) (0) === 0  );

// not

    ok.push( not(T)(1)(0) === 0);
    ok.push( not(F)(1)(0) === 1);

// and

    ok.push( and (T) (T) === T );
    ok.push( and (T) (F) === F );
    ok.push( and (F) (T) === F );
    ok.push( and (F) (F) === F );

// or

// beq

// pair, V

    ok.push(  fst ( pair (1) (0) ) === 1  );
    ok.push(  snd ( pair (1) (0) ) === 0  );

// pair equal

    ok.push( pEquals (pair(1)(0)) (pair(1)(0)) === T  );
    ok.push( pEquals (pair(1)(0)) (pair(0)(0)) === F );

    const op = x => y => x + y;
    ok.push( pEquals (pOp (op) (pair(0)(1)) (pair(2)(3))) (pair(2)(4) ) === T);

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