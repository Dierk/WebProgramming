// string utilities

// appends blanks to the right until the string is of size extend
// padRight :: String, Int -> String
function padRight(str, extend) {
    return "" + str + fill(str, extend);
}

// appends blanks to the left until the string is of size extend
// padLeft :: String, Int -> String
function padLeft(str, extend) {
    return "" + fill(str, extend) + str;
}

function fill(str, extend) {
    const len = str.toString().length; // in case str is not a string
    if (len > extend) {
        return "";
    }
    return " ".repeat(extend - len);
}

// rock-solid data structures

const Tuple = n => {
    if (n < 1) throw new Error("Tuple must have first argument n > 0");

    return [
        TupleCtor (n) ([]), // ctor curries all values and then waits for the selector
        // every selector is a function that picks the value from the curried ctor at the same position
        ...Array.from( {length:n}, (it, idx) => values => values[idx] )
    ];
};

// private implementation details ---------------------

const TupleCtor = n => values => {
    if (n === 0 ) {                                             // we have curried all ctor args, now
        return Object.seal(selector => selector(values))        // return a function that waits for the selector
    }
    return value => {                                           // there are still values to be curried
        return TupleCtor (n - 1) ([...values, value])           // return the ctor for the remaining args
    }
};
  // a curried functions that eats so many arguments

// church encoding of the lambda calculus in JavaScript

// function id(x) { return x; }, \x.x
const id = x => x;

const flip = f => x => y => f(y)(x);

// -----

// Bluebird, composition
const cmp = f => g => x => f(g(x));
// const cmp = f => g      => S(konst(f))(g);
// const cmp = f => g => x => S(konst(f))(g)(x);
// const cmp = f => g => x => (konst(f)(x))(g(x));
// const cmp = f => g => x => (f)(g(x));
// const cmp = f => g => x => f(g(x)); // qed.

//const cmp2 = f => g => x => y => f(g(x)(y));
const cmp2 = cmp (cmp)(cmp);
const not = flip;
// const or  = M;

const beq = x => y => x(y)(not(y));
//const beq = x => y => S(x)(not)(y);
//const beq = x => S(x)(not);   // S(x)(K)

//const xor = cmp (cmp(not)) (beq)   ;
const xor =  cmp2 (not) (beq)   ;

// The test "framework", exports the Suite function plus a total of how many assertions have been tested

let total = 0;

function Assert() {
    const results = []; // [Bool], true if test passed, false otherwise
    return {
        results: results,
        true: (testResult) => {
            if (!testResult) { console.error("test failed"); }
            results.push(testResult);
        },
        is: (actual, expected) => {
            const testResult = actual === expected;
            if (!testResult) {
                console.error("test failure. Got '"+ actual +"', expected '" + expected +"'");
            }
            results.push(testResult);
        }
    }
}

const [Test, name, logic] = Tuple(2); // data type to capture test to-be-run

function test(name, callback) {
    const assert = Assert();
    callback(assert);
    report(name, assert.results);
}

function Suite(suiteName) {
    const tests = []; // [Test]
    const suite = {
        test: (testName, callback) => test(suiteName + "-"+ testName, callback),
        add:  (testName, callback) => tests.push(Test (testName) (callback)),
        run:  () => {
            const suiteAssert = Assert();
            tests.forEach( test => test(logic) (suiteAssert) );
            total += suiteAssert.results.length;
            if (suiteAssert.results.every( id )) { // whole suite was ok, report whole suite
                report("suite " + suiteName, suiteAssert.results);
            } else { // some test in suite failed, rerun tests for better error indication
                tests.forEach( test => suite.test( test(name), test(logic) ) );
            }
        }
    };
    return suite;
}

// test result report
// report :: String, [Bool] -> DOM ()
function report(origin, ok) {
    const extend = 20;
    if ( ok.every( elem => elem) ) {
        write(" "+ padLeft(ok.length, 3) +" tests in " + padRight(origin, extend) + " ok.");
        return;
    }
    let reportLine = "    Failing tests in " + padRight(origin, extend);
    bar(reportLine.length);
    write("|" + reportLine+ "|");
    for (let i = 0; i < ok.length; i++) {
        if( ! ok[i]) {
            write("|    Test #"+ padLeft(i, 3) +" failed                     |");
        }
    }
    bar(reportLine.length);
}

function write(message) {
    const out = document.getElementById('out');
    out.innerText += message + "\n";
}

function bar(extend) {
    write("+" + "-".repeat(extend) + "+");
}

const crazySuite = Suite("crazy");

crazySuite.add("equals", assert => {

    const a = "0";
    const b =  0;
    const c = [];

    assert.is( a == b, true);
    assert.is( b == c, true);
    assert.is( a == c, false); // is not transitive !!!
});

crazySuite.add("false", assert => {

    assert.true( ! false     );
    assert.true( ! null      );
    assert.true( ! undefined );
    assert.true( ! ""        );
    assert.true( ! 0         );
});

crazySuite.add("coercion", assert => {

    assert.true( "1"   == 1     );
    assert.true( +"2"  == 2     );
    assert.true( !"0"  == false );
    assert.true( !!"0" == true  );
    assert.is  ( Number("0"), 0 );
});

crazySuite.add("object", assert => {

    const coerce = x => x ? true : false ;

    assert.is( coerce("0")            , true );
    assert.is( coerce(+"0")           , false);
    assert.is( coerce(Number("0"))    , false);
    assert.is( coerce(new Number("0")), true);

});

crazySuite.add("refactor", assert => {

    const x = +"0"; // fill here

    const if_1 = x => (x == true) ? true : false ;
    const if_2 = x =>  x          ? true : false ; // safe refactoring ???

    assert.is( if_1(x), if_2(x) );  // is this true for every x ???

});


crazySuite.add("other", assert => {

    assert.is( "2" + 1,      "21");
    assert.is( "2" - 1,      1);
    assert.is( "2" - - 1,    3);
    assert.is( 1 + 2 + "3",  "33");

    assert.is( +true,        1);
    assert.is( +false,       0);
    assert.is( true + true,  2); // + is not monoidal
    assert.is( [] === [],    false);
    assert.is( [] == [],     false);
    assert.is( [] == ![],    true);
    assert.is( +[],          0);
    assert.is( 2 == [2],     true);
    assert.is( [] + {},      "[object Object]");
    assert.is( eval("{} + []"), 0); // ????

});

crazySuite.add("numbers", assert => {

    // assert.is(Number("-0") ,            );
    // assert.is(JSON.parse("-0") ,        );
    // assert.is(JSON.stringify(-0) ,      );
    // assert.is(String(-0) ,              );
    // assert.is(typeof null ,             );
    // assert.is(null instanceof Object ,  );
    // assert.is(typeof NaN ,              );
    //
    // assert.is(typeof (1/0) ,            );
    // assert.is(0.1 + 0.2 === 0.3 ,       );
    // assert.is(999999999999999999 ,      );
    // assert.is(Number.MAX_VALUE > 0 ,    );
    // assert.is(Number.MIN_VALUE < 0 ,    );
    //
    // assert.is(Math.min(1, 2, 3) < Math.max(1, 2, 3) ,  );
    // assert.is(Math.min() < Math.max(),  );

});

crazySuite.add("compare", assert => {

    // assert.is(1 < 2 < 3 ,            );
    // assert.is(3 > 2 > 1 ,            );

    // assert.is( {} == {} ,            );
    // assert.is( {} >  {} ,            );
    // assert.is( {} >= {} ,            );

});


crazySuite.run();

// importing all tests that make up the suite of tests that are build on the ES6 module system
