/**
 * @module The mod module as an example for ES6 modules
 */

const pi = Math.PI;

// use module as a singleton

// make a single state that is only exposed as values, not references to objects

let a = null; // these variables are exported as read-only
let b = null;

const setA = v => a = v;
const setB = v => b = v;

// x = 2 // introduction of new globals is not allowed in modules
// bundlers accept it, though, and produce code without the restriction.

function Assert() {
    const results = [];
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

function test(name, callback) {
    const assert = Assert();
    callback(assert);
    report(name, assert.results);
}

function Suite(suiteName) {
    const tests = [];
    const suite = {
        test: (testName, callback) => test(suiteName + "-"+ testName, callback),
        add:  (testName, callback) => tests.push([testName, callback]),
        run:  () => {
            tests.forEach( ([testName, callback]) => suite.test(testName, callback) );
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

// padRight :: String, Int -> String
function padRight(str, extend) {
    return "" + str + fill(str, extend);
}

function padLeft(str, extend) {
    return "" + fill(str, extend) + str;
}

function fill(str, extend) {
    const len = str.toString().length; // in case str is not a string
    if (len > extend) {
        return str;
    }
    return " ".repeat(extend - len);
}

const modSuite = Suite('mod');

modSuite.add("const", assert => {

    assert.true( pi > 0 ) ;

});

modSuite.add("singleton", assert => {

    assert.is(a, null);
    assert.is(b, null);

    setA("Dierk"); // there is no object exposed and so no target to attack
    setB("König");

    assert.is(a, "Dierk");
    assert.is(b, "König");

    // console.log(x); // newly introduced global x should not be visible but when using bundlers, it is

    // this kind of test does not work with the bundler as it checks the erroneous assignment
    // try {
    //     a = "shall not work";
    //     assert.true(false);
    // } catch (e) {
    //     assert.true("exported variables are read-only.")
    // }

});

modSuite.run();

/**
 * @module Person (just an immutable product type)
 */

// ctor

const Person =
    firstname =>
    lastname  =>
    Object.seal( selector  => selector (firstname) (lastname) );


// getters

const firstname = firstname => _ => firstname;
const lastname  = _ => lastname  => lastname;
const setLastname  = person => ln => Person (person(lastname)) (ln);

// module "methods"

const toString = person => 'Person ' + person(firstname) + " " +  person(lastname);

const equals   = p1 => p2 =>
    p1(firstname) === p2(firstname) &&
    p1(lastname)  === p2(lastname);

const toObj = person => ({
   firstname: person(firstname),
   lastname:  person(lastname)
});

const toPerson = personObj => Person (personObj.firstname) (personObj.lastname);

// todo: the line below should be uncommented

const person = Suite("person");

person.test("use", assert => {

    const dierk = Person ("Dierk") ('König');

    assert.is(dierk(firstname), "Dierk");

    const gently = setLastname(dierk)("Gently");

    assert.is( gently(lastname), "Gently");

    assert.true(   equals (dierk) (dierk)  );
    assert.true( ! equals (dierk) (gently) );

    assert.true( equals (dierk) (toPerson(toObj(dierk))) );
    assert.is( toString(dierk), 'Person Dierk König');

});

// importing all tests that make up the suite of tests that are build on the ES6 module system
