"use strict";

// find a solution for suite, test, assert

const Assert = () => {
    const store = [];
    return {
        true:  boolExpr          => {
            store.push(boolExpr);
            if (!boolExpr) {
                console.error("test failed");
            }
        },
        is:   (actual, expected) => {
            store.push(actual === expected);
            if (actual !== expected) {
                console.error("test failed, expected " + expected + " actual " + actual)
            }
        },
        getStore: () => store,
    };
};

function test(name, f) {
    const assertion = Assert();
    f(assertion);
    report(name, assertion.getStore());
}

// test result report
// report :: String, [Bool] -> DOM ()
function report(origin, ok) {
    const extend = 20;
    if ( ok.every( elem => elem) ) {
        document.writeln(" "+ padLeft(ok.length, 3) +" tests in " + padRight(origin, extend) + " ok.");
        return;
    }
    let reportLine = "    Failing tests in " + padRight(origin, extend);
    bar(reportLine.length);
    document.writeln("|" + reportLine+ "|");
    for (let i = 0; i < ok.length; i++) {
        if( ! ok[i]) {
            document.writeln("|    Test #"+ padLeft(i, 3) +" failed                     |");
        }
    }
    bar(reportLine.length);
}

function bar(extend) {
    document.writeln("+" + "-".repeat(extend) + "+");
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