"use strict";

// find a solution for suite, test, assert

const Assert = () => {
    const ok = [];
    const equals = (actual, expected) => {
        const result = (actual === expected);
        if (! result) {
           console.error(`not equal! actual was '${actual}' but expected '${expected}'`);
        }
        ok.push(result);
    };
    return {
        getOk: () => ok,
        equals: equals,
    }
}


/**
 * providing a scope and name for a test callback that fills the array
 * of boolean checks
 * @param {string} origin
 * @param {function([boolean]): *} callback
 */
const test = (origin, callback) => {
    const assert = Assert();      //    das ok anlegen
    callback(assert);       //    das ok befüllen
    report(origin, assert.getOk()); //    report mit name und ok aufrufen
};


/**
 * report :: String, [Bool] -> DOM ()
 * Report reports the list of boolean checks
 * @param {string}      origin: where the reported tests come from
 * @param { [boolean] } ok:     list of applied checks
 */
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